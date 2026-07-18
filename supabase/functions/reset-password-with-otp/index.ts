import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function sha256(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { email, otp, newPassword } = await req.json();
    if (!email || !otp || !newPassword) {
      return new Response(JSON.stringify({ error: "email, otp, newPassword লাগবে" }), {
        status: 400, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    if (String(newPassword).length < 6) {
      return new Response(JSON.stringify({ error: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে" }), {
        status: 400, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const codeHash = await sha256(String(otp));
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // Verify OTP — match by hash within expiry (verified flag may already be true from verify-otp step)
    const { data: row } = await supabase
      .from("otp_codes")
      .select("*")
      .eq("email", normalizedEmail)
      .eq("code_hash", codeHash)
      .gte("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!row) {
      return new Response(JSON.stringify({ error: "কোডের মেয়াদ শেষ বা ভুল কোড" }), {
        status: 400, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Find user by email
    let userId: string | null = null;
    let page = 1;
    while (page <= 20) {
      const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
      if (error) break;
      const found = data.users.find((u) => (u.email || "").toLowerCase() === normalizedEmail);
      if (found) { userId = found.id; break; }
      if (data.users.length < 200) break;
      page++;
    }

    if (!userId) {
      return new Response(JSON.stringify({ error: "এই ইমেইলে কোনো একাউন্ট নেই" }), {
        status: 404, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { error: updErr } = await supabase.auth.admin.updateUserById(userId, {
      password: String(newPassword),
    });
    if (updErr) {
      return new Response(JSON.stringify({ error: updErr.message }), {
        status: 500, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    await supabase.from("otp_codes").update({ verified: true }).eq("id", row.id);

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err: any) {
    console.error("reset-password-with-otp error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
