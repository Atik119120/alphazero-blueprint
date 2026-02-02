import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DeleteStudentRequest {
  student_ids: string[]; // Array of profile IDs to delete
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
        JSON.stringify({ error: "Only admins can delete students" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const body: DeleteStudentRequest = await req.json();
    const { student_ids } = body;

    // Validate input
    if (!student_ids || !Array.isArray(student_ids) || student_ids.length === 0) {
      return new Response(
        JSON.stringify({ error: "student_ids array is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Deleting students:", student_ids);

    let deletedCount = 0;
    const errors: string[] = [];

    for (const profileId of student_ids) {
      try {
        // Get the profile to find user_id
        const { data: profile, error: profileError } = await adminClient
          .from("profiles")
          .select("user_id, full_name, email")
          .eq("id", profileId)
          .single();

        if (profileError || !profile) {
          errors.push(`Profile ${profileId} not found`);
          continue;
        }

        const userId = profile.user_id;
        console.log(`Deleting student: ${profile.full_name} (${profile.email})`);

        // Delete related data in order (respecting foreign keys)
        
        // 1. Delete video_progress
        await adminClient.from("video_progress").delete().eq("user_id", userId);
        
        // 2. Delete course_completions
        await adminClient.from("course_completions").delete().eq("user_id", userId);
        
        // 3. Delete certificates
        await adminClient.from("certificates").delete().eq("user_id", userId);
        
        // 4. Delete enrollment_requests
        await adminClient.from("enrollment_requests").delete().eq("user_id", userId);
        
        // 5. Delete notice_reads
        await adminClient.from("notice_reads").delete().eq("user_id", userId);
        
        // 6. Delete pass_code_courses for this student's pass codes
        const { data: passCodes } = await adminClient
          .from("pass_codes")
          .select("id")
          .eq("student_id", profileId);
        
        if (passCodes && passCodes.length > 0) {
          const passCodeIds = passCodes.map(pc => pc.id);
          await adminClient.from("pass_code_courses").delete().in("pass_code_id", passCodeIds);
        }
        
        // 7. Delete pass_codes
        await adminClient.from("pass_codes").delete().eq("student_id", profileId);
        
        // 8. Delete chat_room_members
        await adminClient.from("chat_room_members").delete().eq("user_id", userId);
        
        // 9. Delete chat_messages (by sender_id)
        await adminClient.from("chat_messages").delete().eq("sender_id", userId);
        
        // 10. Delete ticket_messages
        const { data: tickets } = await adminClient
          .from("support_tickets")
          .select("id")
          .eq("student_id", profileId);
        
        if (tickets && tickets.length > 0) {
          const ticketIds = tickets.map(t => t.id);
          await adminClient.from("ticket_messages").delete().in("ticket_id", ticketIds);
        }
        
        // 11. Delete support_tickets
        await adminClient.from("support_tickets").delete().eq("student_id", profileId);
        
        // 12. Delete user_roles
        await adminClient.from("user_roles").delete().eq("user_id", userId);
        
        // 13. Delete profile
        const { error: deleteProfileError } = await adminClient
          .from("profiles")
          .delete()
          .eq("id", profileId);
        
        if (deleteProfileError) {
          errors.push(`Failed to delete profile for ${profile.email}: ${deleteProfileError.message}`);
          continue;
        }
        
        // 14. Delete auth user
        const { error: deleteUserError } = await adminClient.auth.admin.deleteUser(userId);
        
        if (deleteUserError) {
          console.error(`Failed to delete auth user for ${profile.email}:`, deleteUserError);
          // Profile is already deleted, so we count it as partially successful
        }
        
        deletedCount++;
        console.log(`Successfully deleted: ${profile.email}`);
        
      } catch (error) {
        console.error(`Error deleting student ${profileId}:`, error);
        errors.push(`Error deleting ${profileId}: ${(error as Error).message}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        deleted_count: deletedCount,
        total_requested: student_ids.length,
        errors: errors.length > 0 ? errors : undefined,
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
