import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OTPRequest {
  email: string;
  name: string;
  purpose?: "password_reset" | "signup";
}

async function findAuthUserByEmail(supabase: ReturnType<typeof createClient>, email: string) {
  let page = 1;
  while (page <= 50) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const found = data.users.find((user) => (user.email || "").toLowerCase() === email);
    if (found) return found;
    if (data.users.length < 200) break;
    page++;
  }
  return null;
}

async function sha256(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, purpose }: OTPRequest = await req.json();

    if (!email || !name) {
      return new Response(
        JSON.stringify({ error: "Email and name are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    const normalizedEmail = email.trim().toLowerCase();

    if (purpose === "password_reset") {
      const authUser = await findAuthUserByEmail(supabase, normalizedEmail);
      if (!authUser) {
        return new Response(
          JSON.stringify({ success: false, error: "এই ইমেইলে কোনো একাউন্ট নেই" }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }

    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Per-email rate limit: max 3 OTPs per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("otp_codes")
      .select("*", { count: "exact", head: true })
      .eq("email", normalizedEmail)
      .gte("created_at", oneHourAgo);
    if ((count ?? 0) >= 3) {
      return new Response(
        JSON.stringify({ error: "অনেক বেশি অনুরোধ। ১ ঘণ্টা পর আবার চেষ্টা করুন।" }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Generate 6-digit OTP, store hash server-side
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = await sha256(otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Invalidate previous unverified codes for this email
    await supabase
      .from("otp_codes")
      .update({ verified: true })
      .eq("email", normalizedEmail)
      .eq("verified", false);

    const { error: insertErr } = await supabase.from("otp_codes").insert({
      email: normalizedEmail,
      code_hash: codeHash,
      expires_at: expiresAt,
    });
    if (insertErr) {
      console.error("OTP insert error:", insertErr);
      return new Response(
        JSON.stringify({ error: "OTP তৈরি করতে সমস্যা হয়েছে" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const emailHtml = `
      <!DOCTYPE html><html><head><meta charset="utf-8"></head>
      <body style="font-family: 'Segoe UI', sans-serif; background:#f4f4f5; margin:0; padding:20px;">
        <div style="max-width:500px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
          <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6,#a855f7);padding:30px 20px;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:24px;">AlphaZero Academy</h1>
            <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;font-size:14px;">ইমেইল ভেরিফিকেশন</p>
          </div>
          <div style="padding:30px 25px;">
            <p style="color:#374151;font-size:16px;margin:0 0 20px;">প্রিয় <strong>${name}</strong>,</p>
            <p style="color:#6b7280;font-size:14px;margin:0 0 25px;line-height:1.6;">আপনার ভেরিফিকেশন কোড:</p>
            <div style="background:linear-gradient(135deg,#f0f9ff,#e0f2fe);border:2px dashed #6366f1;border-radius:12px;padding:25px;text-align:center;margin:0 0 25px;">
              <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#6366f1;font-family:'Courier New',monospace;">${otp}</div>
            </div>
            <p style="color:#9ca3af;font-size:13px;text-align:center;">⏰ ১০ মিনিটের মধ্যে মেয়াদ উত্তীর্ণ হবে</p>
          </div>
          <div style="background:#f9fafb;padding:20px;text-align:center;border-top:1px solid #e5e7eb;">
            <p style="color:#6b7280;font-size:12px;margin:0;">© ${new Date().getFullYear()} AlphaZero Academy</p>
          </div>
        </div>
      </body></html>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "AlphaZero Academy <noreply@alphazero.online>",
        to: [email],
        subject: "আপনার ইমেইল ভেরিফিকেশন কোড - AlphaZero Academy",
        html: emailHtml,
      }),
    });

    const emailResult = await emailResponse.json();
    if (!emailResponse.ok) {
      console.error("Resend error:", emailResult);
      return new Response(
        JSON.stringify({ error: emailResult.message || "Failed to send email" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Do NOT return the OTP to the client
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("send-otp error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
