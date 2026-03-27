import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // User-scoped client (to validate token and get user identity)
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !user) {
      console.error("Invalid user:", userError);
      return new Response(JSON.stringify({ error: "Invalid user" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Admin client (service role) to ensure rows exist reliably
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Ensuring onboarding for user:", user.id, user.email);

    // 1) Ensure profile exists
    let { data: profile, error: profileReadError } = await adminClient
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profileReadError) {
      console.error("Profile read error:", profileReadError);
      return new Response(JSON.stringify({ error: "Failed to read profile" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!profile) {
      const fullName =
        (user.user_metadata && (user.user_metadata as any).full_name) ||
        (user.user_metadata && (user.user_metadata as any).name) ||
        "Student";

      const { data: createdProfile, error: profileInsertError } = await adminClient
        .from("profiles")
        .insert({
          user_id: user.id,
          full_name: String(fullName),
          email: user.email ?? "",
        })
        .select("*")
        .single();

      if (profileInsertError) {
        console.error("Profile insert error:", profileInsertError);
        return new Response(JSON.stringify({ error: "Failed to create profile" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      profile = createdProfile;
      console.log("Profile created:", profile.id);
    }

    // 2) If user is admin, do NOT force student role/pass code
    const { data: adminRole } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (adminRole) {
      return new Response(
        JSON.stringify({
          success: true,
          role: "admin",
          profile_id: profile.id,
          pass_code: null,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3) Ensure student role exists
    const { data: studentRole } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "student")
      .maybeSingle();

    if (!studentRole) {
      const { error: roleInsertError } = await adminClient
        .from("user_roles")
        .insert({ user_id: user.id, role: "student" });

      if (roleInsertError) {
        console.error("Role insert error:", roleInsertError);
      } else {
        console.log("Student role ensured");
      }
    }

    // 4) Ensure active pass code exists
    const { data: existingPassCode, error: passCodeReadError } = await adminClient
      .from("pass_codes")
      .select("code, created_at")
      .eq("student_id", profile.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .maybeSingle();

    if (passCodeReadError) {
      console.error("Pass code read error:", passCodeReadError);
    }

    let ensuredPassCode: string | null = existingPassCode?.code ?? null;

    if (!ensuredPassCode) {
      const { data: generatedCode, error: genError } = await adminClient.rpc("generate_pass_code");

      if (genError || !generatedCode) {
        console.error("Generate pass code error:", genError);
      } else {
        const { error: pcInsertError } = await adminClient.from("pass_codes").insert({
          code: generatedCode,
          student_id: profile.id,
          is_active: true,
          created_by: user.id,
        });

        if (pcInsertError) {
          console.error("Pass code insert error:", pcInsertError);
        } else {
          ensuredPassCode = generatedCode;
          console.log("Pass code ensured:", ensuredPassCode);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        role: "student",
        profile_id: profile.id,
        pass_code: ensuredPassCode,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
