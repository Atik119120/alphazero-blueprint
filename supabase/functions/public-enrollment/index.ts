import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EnrollmentRequest {
  full_name: string;
  email: string;
  password: string;
  phone_number: string;
  course_id: string;
  payment_method: string;
  transaction_id: string;
  payment_type: string;
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

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Create admin client with service role
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const body: EnrollmentRequest = await req.json();
    const { full_name, email, password, phone_number, course_id, payment_method, transaction_id, payment_type } = body;

    // Validate input
    if (!full_name || typeof full_name !== "string" || full_name.trim().length < 2) {
      return new Response(
        JSON.stringify({ error: "নাম কমপক্ষে ২ অক্ষরের হতে হবে" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return new Response(
        JSON.stringify({ error: "সঠিক ইমেইল দিন" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return new Response(
        JSON.stringify({ error: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!phone_number || typeof phone_number !== "string" || phone_number.trim().length < 10) {
      return new Response(
        JSON.stringify({ error: "সঠিক মোবাইল নম্বর দিন" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!course_id) {
      return new Response(
        JSON.stringify({ error: "কোর্স সিলেক্ট করুন" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!payment_method || !transaction_id) {
      return new Response(
        JSON.stringify({ error: "পেমেন্ট তথ্য দিন" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Processing enrollment for:", email);

    // Check if course exists
    const { data: courseData, error: courseError } = await adminClient
      .from("courses")
      .select("id, title")
      .eq("id", course_id)
      .maybeSingle();

    if (courseError || !courseData) {
      console.error("Course not found:", course_id);
      return new Response(
        JSON.stringify({ error: "কোর্স পাওয়া যায়নি" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await adminClient
      .from("profiles")
      .select("id, user_id")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();

    let userId: string;
    let profileId: string;

    if (existingUser) {
      // User already exists - just create enrollment request
      userId = existingUser.user_id;
      profileId = existingUser.id;
      console.log("Existing user found:", userId);
    } else {
      // Create new user
      const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
        email: email.trim().toLowerCase(),
        password: password,
        email_confirm: true,
        user_metadata: {
          full_name: full_name.trim(),
        },
      });

      if (authError) {
        console.error("Auth error:", authError);
        if (authError.message.includes("already been registered")) {
          return new Response(
            JSON.stringify({ error: "এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট আছে। লগইন করুন।" }),
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
          JSON.stringify({ error: "অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      userId = authData.user.id;
      console.log("User created:", userId);

      // Create profile with phone number
      const { data: profileData, error: profileError } = await adminClient
        .from("profiles")
        .insert({
          user_id: userId,
          full_name: full_name.trim(),
          email: email.trim().toLowerCase(),
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
      const { error: roleError } = await adminClient
        .from("user_roles")
        .insert({
          user_id: userId,
          role: "student",
        });

      if (roleError) {
        console.error("Role error:", roleError);
      }

      // Generate pass code for student
      const { data: generatedCode, error: genError } = await adminClient.rpc('generate_pass_code');
      
      if (!genError && generatedCode) {
        const { error: pcError } = await adminClient
          .from("pass_codes")
          .insert({
            code: generatedCode,
            student_id: profileId,
            is_active: true,
            created_by: userId,
          });

        if (pcError) {
          console.error("Pass code error:", pcError);
        } else {
          console.log("Pass code created:", generatedCode);
        }
      }
    }

    // Create enrollment request
    const { data: enrollmentData, error: enrollmentError } = await adminClient
      .from("enrollment_requests")
      .insert({
        user_id: userId,
        course_id: course_id,
        student_name: full_name.trim(),
        student_email: email.trim().toLowerCase(),
        phone_number: phone_number.trim(),
        payment_method: payment_method,
        transaction_id: transaction_id.trim(),
        message: `Payment Type: ${payment_type}`,
        status: "pending",
      })
      .select("id")
      .single();

    if (enrollmentError) {
      console.error("Enrollment error:", enrollmentError);
      return new Response(
        JSON.stringify({ error: "এনরোলমেন্ট রিকোয়েস্ট তৈরি করতে সমস্যা হয়েছে" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Enrollment request created:", enrollmentData.id);

    return new Response(
      JSON.stringify({
        success: true,
        message: "আপনার এনরোলমেন্ট রিকোয়েস্ট সফলভাবে জমা হয়েছে! আমরা শীঘ্রই যোগাযোগ করব।",
        user_id: userId,
        profile_id: profileId,
        enrollment_id: enrollmentData.id,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "কিছু সমস্যা হয়েছে, আবার চেষ্টা করুন" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
