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

    console.log("Processing enrollment request for:", email);

    // Check if course exists
    const { data: courseData, error: courseError } = await adminClient
      .from("courses")
      .select("id, title, price")
      .eq("id", course_id)
      .maybeSingle();

    if (courseError || !courseData) {
      console.error("Course not found:", course_id);
      return new Response(
        JSON.stringify({ error: "কোর্স পাওয়া যায়নি" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if there's already a pending request with same email for same course
    const { data: existingRequest } = await adminClient
      .from("enrollment_requests")
      .select("id")
      .eq("student_email", email.trim().toLowerCase())
      .eq("course_id", course_id)
      .eq("status", "pending")
      .maybeSingle();

    if (existingRequest) {
      return new Response(
        JSON.stringify({ error: "আপনার এই কোর্সের জন্য আগেই রিকোয়েস্ট আছে। অনুগ্রহ করে অপেক্ষা করুন।" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create enrollment request WITHOUT creating student account
    // Student account will be created when admin approves
    const { data: enrollmentData, error: enrollmentError } = await adminClient
      .from("enrollment_requests")
      .insert({
        user_id: "00000000-0000-0000-0000-000000000000", // Placeholder - will be updated on approval
        course_id: course_id,
        student_name: full_name.trim(),
        student_email: email.trim().toLowerCase(),
        phone_number: phone_number.trim(),
        payment_method: payment_method,
        transaction_id: transaction_id.trim(),
        message: JSON.stringify({
          payment_type: payment_type,
          password: password, // Store encrypted password for account creation on approval
        }),
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

    // Send Telegram notification if configured
    const telegramBotToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const telegramChatId = Deno.env.get("TELEGRAM_CHAT_ID");

    if (telegramBotToken) {
      try {
        const botId = telegramBotToken.split(":")[0];
        const configuredChatId = telegramChatId?.trim();

        // Common mistake: TELEGRAM_CHAT_ID is set to the bot's own id (same as token prefix)
        const isConfiguredChatIdInvalid = !configuredChatId || configuredChatId === botId;

        let resolvedChatId: string | null = isConfiguredChatIdInvalid ? null : configuredChatId;

        if (!resolvedChatId) {
          console.log(
            "TELEGRAM_CHAT_ID missing/invalid (looks like bot id). Trying auto-detect via getUpdates..."
          );

          const updatesRes = await fetch(
            `https://api.telegram.org/bot${telegramBotToken}/getUpdates`,
            { method: "GET" }
          );
          const updatesJson = await updatesRes.json().catch(() => null);

          if (!updatesJson?.ok) {
            console.error(
              "Telegram getUpdates failed:",
              updatesRes.status,
              JSON.stringify(updatesJson)
            );
          } else {
            const result = Array.isArray(updatesJson.result) ? updatesJson.result : [];
            // Pick the latest private chat that has interacted with the bot.
            for (let i = result.length - 1; i >= 0; i--) {
              const upd = result[i];
              const chat = upd?.message?.chat || upd?.my_chat_member?.chat || upd?.chat_member?.chat;
              if (chat?.id && chat?.type === "private") {
                resolvedChatId = String(chat.id);
                break;
              }
            }
          }
        }

        if (!resolvedChatId) {
          console.error(
            "Telegram chat id not found. Please open the bot in Telegram and press /start once."
          );
        } else {
          console.log("Sending Telegram notification to chat_id:", resolvedChatId);

          const message = `🎓 নতুন এনরোলমেন্ট রিকোয়েস্ট!\n\n👤 নাম: ${full_name.trim()}\n📧 ইমেইল: ${email
            .trim()
            .toLowerCase()}\n📱 মোবাইল: ${phone_number.trim()}\n📚 কোর্স: ${courseData.title}\n💰 মূল্য: ৳${courseData.price || 0}\n💳 পেমেন্ট: ${payment_method}\n🔢 Transaction ID: ${transaction_id.trim()}\n📋 পেমেন্ট টাইপ: ${payment_type}\n\n✅ Admin Panel-এ গিয়ে approve করুন।`;

          const telegramResponse = await fetch(
            `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id: resolvedChatId,
                text: message,
              }),
            }
          );

          const telegramResult = await telegramResponse.json().catch(() => null);
          console.log(
            "Telegram API response:",
            telegramResponse.status,
            JSON.stringify(telegramResult)
          );

          if (!telegramResult?.ok) {
            console.error("Telegram error:", telegramResult?.description || "unknown");
          } else {
            console.log("Telegram notification sent successfully");
          }
        }
      } catch (telegramError) {
        console.error("Telegram notification failed:", telegramError);
        // Don't fail the request if notification fails
      }
    } else {
      console.log("Telegram not configured. Token:", !!telegramBotToken);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "আপনার এনরোলমেন্ট রিকোয়েস্ট সফলভাবে জমা হয়েছে! Payment verify করে আমরা শীঘ্রই আপনার অ্যাকাউন্ট তৈরি করব।",
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
