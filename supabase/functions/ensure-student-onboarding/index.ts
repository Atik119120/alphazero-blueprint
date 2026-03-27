import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
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

    // 2) If user is admin or teacher, skip student role setup
    const { data: existingRoles } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    const roles = (existingRoles || []).map((r: any) => r.role);

    if (roles.includes("admin")) {
      return new Response(
        JSON.stringify({ success: true, role: "admin", profile_id: profile.id }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (roles.includes("teacher")) {
      return new Response(
        JSON.stringify({ success: true, role: "teacher", profile_id: profile.id }),
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

    return new Response(
      JSON.stringify({
        success: true,
        role: "student",
        profile_id: profile.id,
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
