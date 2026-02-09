import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface InboundEmail {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
  created_at: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("📧 Inbound email webhook received");

    const payload = await req.json();
    console.log("Payload received:", JSON.stringify(payload, null, 2));

    // Resend inbound email format
    const inboundEmail: InboundEmail = {
      from: payload.from || payload.headers?.from || "",
      to: payload.to || payload.headers?.to || "",
      subject: payload.subject || payload.headers?.subject || "(No Subject)",
      text: payload.text || payload.body?.text || "",
      html: payload.html || payload.body?.html || "",
      created_at: payload.created_at || new Date().toISOString(),
    };

    console.log("Parsed email:", {
      from: inboundEmail.from,
      to: inboundEmail.to,
      subject: inboundEmail.subject,
    });

    // Extract sender name and email
    const fromMatch = inboundEmail.from.match(/^(?:(.+?)\s*<)?([^<>]+)>?$/);
    const senderName = fromMatch?.[1]?.trim() || null;
    const senderEmail = fromMatch?.[2]?.trim() || inboundEmail.from;

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Check if thread exists for this email address
    const { data: existingThread } = await supabaseAdmin
      .from("email_threads")
      .select("id")
      .eq("external_email", senderEmail)
      .eq("status", "open")
      .order("last_message_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    let threadId: string;

    if (existingThread) {
      // Add to existing thread
      threadId = existingThread.id;
      console.log("Adding to existing thread:", threadId);

      // Update thread status to open if was closed
      await supabaseAdmin
        .from("email_threads")
        .update({ status: "open", updated_at: new Date().toISOString() })
        .eq("id", threadId);
    } else {
      // Create new thread
      console.log("Creating new thread for:", senderEmail);
      const { data: newThread, error: threadError } = await supabaseAdmin
        .from("email_threads")
        .insert({
          subject: inboundEmail.subject,
          external_email: senderEmail,
          external_name: senderName,
          status: "open",
        })
        .select("id")
        .single();

      if (threadError) {
        console.error("Error creating thread:", threadError);
        throw threadError;
      }
      threadId = newThread.id;
    }

    // Insert the message
    const { error: messageError } = await supabaseAdmin
      .from("email_messages")
      .insert({
        thread_id: threadId,
        direction: "inbound",
        from_email: senderEmail,
        to_email: inboundEmail.to,
        subject: inboundEmail.subject,
        body_text: inboundEmail.text || null,
        body_html: inboundEmail.html || null,
        is_read: false,
      });

    if (messageError) {
      console.error("Error inserting message:", messageError);
      throw messageError;
    }

    console.log("✅ Email stored successfully in thread:", threadId);

    return new Response(
      JSON.stringify({ success: true, thread_id: threadId }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("❌ Error processing inbound email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
