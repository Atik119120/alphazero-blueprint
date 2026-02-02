import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateStudentRequest {
  full_name: string;
  email: string;
  password: string;
  pass_code?: string;
  phone_number?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Only allow POST requests
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get authorization header to verify caller is admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Create client with user's token to verify they are admin
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Get current user
    const { data: { user: callerUser }, error: userError } = await userClient.auth.getUser();
    if (userError || !callerUser) {
      return new Response(
        JSON.stringify({ error: "Invalid user" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if caller is admin using service role
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data: roleData, error: roleError } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", callerUser.id)
      .eq("role", "admin")
      .maybeSingle();

    if (roleError || !roleData) {
      return new Response(
        JSON.stringify({ error: "Only admins can create students" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const body: CreateStudentRequest = await req.json();
    const { full_name, email, password, pass_code, phone_number } = body;

    // Validate input
    if (!full_name || typeof full_name !== "string" || full_name.trim().length < 2) {
      return new Response(
        JSON.stringify({ error: "Invalid name (minimum 2 characters)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return new Response(
        JSON.stringify({ error: "Invalid email" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return new Response(
        JSON.stringify({ error: "Password must be at least 6 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Creating student:", email);

    // Create user using admin API (doesn't affect caller's session)
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email: email.trim().toLowerCase(),
      password: password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: full_name.trim(),
      },
    });

    if (authError) {
      console.error("Auth error:", authError);
      if (authError.message.includes("already been registered")) {
        return new Response(
          JSON.stringify({ error: "এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট আছে" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({ error: authError.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!authData.user) {
      return new Response(
        JSON.stringify({ error: "Failed to create user" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const newUserId = authData.user.id;
    console.log("User created:", newUserId);

    // Create profile
    const { data: profileData, error: profileError } = await adminClient
      .from("profiles")
      .insert({
        user_id: newUserId,
        full_name: full_name.trim(),
        email: email.trim().toLowerCase(),
        phone_number: phone_number?.trim() || null,
      })
      .select("id")
      .single();

    if (profileError) {
      console.error("Profile error:", profileError);
      // Try to clean up the auth user
      await adminClient.auth.admin.deleteUser(newUserId);
      return new Response(
        JSON.stringify({ error: "Failed to create profile" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Profile created:", profileData.id);

    // Assign student role
    const { error: roleInsertError } = await adminClient
      .from("user_roles")
      .insert({
        user_id: newUserId,
        role: "student",
      });

    if (roleInsertError) {
      console.error("Role error:", roleInsertError);
    }

    // Link pass code if provided, otherwise create new one
    let passCodeLinked = false;
    let newPassCode = "";
    
    if (pass_code && pass_code.trim()) {
      // Try to link existing pass code
      const { data: passCodeData, error: pcError } = await adminClient
        .from("pass_codes")
        .select("id, student_id")
        .eq("code", pass_code.trim().toUpperCase())
        .eq("is_active", true)
        .maybeSingle();

      if (!pcError && passCodeData && !passCodeData.student_id) {
        const { error: linkError } = await adminClient
          .from("pass_codes")
          .update({ student_id: profileData.id })
          .eq("id", passCodeData.id);

        if (!linkError) {
          passCodeLinked = true;
          newPassCode = pass_code.trim().toUpperCase();
          console.log("Pass code linked:", pass_code);
        }
      }
    }
    
    // If no pass code was linked, create a new one for the student
    if (!passCodeLinked) {
      // Generate unique pass code
      const { data: generatedCode, error: genError } = await adminClient.rpc('generate_pass_code');
      
      if (!genError && generatedCode) {
        const { error: createPcError } = await adminClient
          .from("pass_codes")
          .insert({
            code: generatedCode,
            student_id: profileData.id,
            is_active: true,
            created_by: callerUser.id,
          });

        if (!createPcError) {
          newPassCode = generatedCode;
          console.log("Pass code created:", generatedCode);
        } else {
          console.error("Create pass code error:", createPcError);
        }
      } else {
        console.error("Generate pass code error:", genError);
      }
    }

    // Send welcome email (non-blocking)
    try {
      const welcomeEmailUrl = `${supabaseUrl}/functions/v1/send-welcome-email`;
      fetch(welcomeEmailUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          name: full_name.trim(),
          passCode: newPassCode,
        }),
      }).catch(err => console.error("Welcome email error:", err));
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Don't fail the request if email fails
    }

    return new Response(
      JSON.stringify({
        success: true,
        user_id: newUserId,
        profile_id: profileData.id,
        pass_code: newPassCode,
        pass_code_linked: passCodeLinked,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
