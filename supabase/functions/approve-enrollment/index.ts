import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ApproveRequest {
  enrollment_id: string;
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

    // Verify caller is admin
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

    // Verify admin role
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user: callerUser }, error: userError } = await userClient.auth.getUser();
    if (userError || !callerUser) {
      return new Response(
        JSON.stringify({ error: "Invalid user" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data: roleData, error: roleError } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", callerUser.id)
      .eq("role", "admin")
      .maybeSingle();

    if (roleError || !roleData) {
      return new Response(
        JSON.stringify({ error: "Only admins can approve enrollments" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const body: ApproveRequest = await req.json();
    const { enrollment_id } = body;

    if (!enrollment_id) {
      return new Response(
        JSON.stringify({ error: "Enrollment ID required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get enrollment request
    const { data: enrollment, error: enrollmentError } = await adminClient
      .from("enrollment_requests")
      .select("*")
      .eq("id", enrollment_id)
      .single();

    if (enrollmentError || !enrollment) {
      return new Response(
        JSON.stringify({ error: "Enrollment request not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (enrollment.status !== "pending") {
      return new Response(
        JSON.stringify({ error: "This request has already been processed" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Approving enrollment for:", enrollment.student_email);

    // Parse message to get password
    let password = "Student@123"; // Default password
    try {
      const messageData = JSON.parse(enrollment.message || "{}");
      if (messageData.password) {
        password = messageData.password;
      }
    } catch (e) {
      console.log("Could not parse message, using default password");
    }

    // Check if user already exists
    const { data: existingProfile } = await adminClient
      .from("profiles")
      .select("id, user_id")
      .eq("email", enrollment.student_email)
      .maybeSingle();

    let userId: string;
    let profileId: string;

    if (existingProfile) {
      userId = existingProfile.user_id;
      profileId = existingProfile.id;
      console.log("Existing user found:", userId);
    } else {
      // Create new user
      const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
        email: enrollment.student_email,
        password: password,
        email_confirm: true,
        user_metadata: {
          full_name: enrollment.student_name,
        },
      });

      if (authError) {
        console.error("Auth error:", authError);
        return new Response(
          JSON.stringify({ error: `অ্যাকাউন্ট তৈরি করতে সমস্যা: ${authError.message}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (!authData.user) {
        return new Response(
          JSON.stringify({ error: "অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      userId = authData.user.id;
      console.log("User created:", userId);

      // Create profile
      const { data: profileData, error: profileError } = await adminClient
        .from("profiles")
        .insert({
          user_id: userId,
          full_name: enrollment.student_name,
          email: enrollment.student_email,
        })
        .select("id")
        .single();

      if (profileError) {
        console.error("Profile error:", profileError);
        await adminClient.auth.admin.deleteUser(userId);
        return new Response(
          JSON.stringify({ error: "প্রোফাইল তৈরি করতে সমস্যা হয়েছে" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      profileId = profileData.id;
      console.log("Profile created:", profileId);

      // Assign student role
      await adminClient
        .from("user_roles")
        .insert({ user_id: userId, role: "student" });

      // Generate pass code
      const { data: generatedCode } = await adminClient.rpc('generate_pass_code');
      
      if (generatedCode) {
        await adminClient
          .from("pass_codes")
          .insert({
            code: generatedCode,
            student_id: profileId,
            is_active: true,
            created_by: callerUser.id,
          });
        console.log("Pass code created:", generatedCode);
      }
    }

    // Get or create pass code for the student
    const { data: passCode } = await adminClient
      .from("pass_codes")
      .select("id")
      .eq("student_id", profileId)
      .eq("is_active", true)
      .maybeSingle();

    if (passCode) {
      // Assign course to pass code
      const { error: assignError } = await adminClient
        .from("pass_code_courses")
        .insert({
          pass_code_id: passCode.id,
          course_id: enrollment.course_id,
        });

      if (assignError && !assignError.message.includes("duplicate")) {
        console.error("Course assign error:", assignError);
      } else {
        console.log("Course assigned to pass code");
      }
    }

    // Update enrollment request status and user_id
    await adminClient
      .from("enrollment_requests")
      .update({ 
        status: "approved",
        user_id: userId,
        message: enrollment.message ? 
          JSON.stringify({ ...JSON.parse(enrollment.message), password: "[HIDDEN]" }) : 
          enrollment.message
      })
      .eq("id", enrollment_id);

    console.log("Enrollment approved successfully");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Student account created and course assigned successfully!",
        user_id: userId,
        profile_id: profileId,
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
