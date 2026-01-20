import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OTPRequest {
  email: string;
  name: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-otp function called");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name }: OTPRequest = await req.json();
    console.log("Sending OTP to:", email);

    // Validate inputs
    if (!email || !name) {
      console.error("Missing email or name");
      return new Response(
        JSON.stringify({ error: "Email and name are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Generated OTP for", email);

    // Send email with OTP using Resend API directly
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5; margin: 0; padding: 20px;">
        <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%); padding: 30px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">AlphaZero Academy</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">ইমেইল ভেরিফিকেশন</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px 25px;">
            <p style="color: #374151; font-size: 16px; margin: 0 0 20px 0;">
              প্রিয় <strong>${name}</strong>,
            </p>
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 25px 0; line-height: 1.6;">
              AlphaZero Academy তে আপনাকে স্বাগতম! আপনার ইমেইল ভেরিফাই করতে নিচের ৬ সংখ্যার কোডটি ব্যবহার করুন:
            </p>
            
            <!-- OTP Box -->
            <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 2px dashed #6366f1; border-radius: 12px; padding: 25px; text-align: center; margin: 0 0 25px 0;">
              <p style="color: #6b7280; font-size: 12px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">আপনার ভেরিফিকেশন কোড</p>
              <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #6366f1; font-family: 'Courier New', monospace;">
                ${otp}
              </div>
            </div>
            
            <p style="color: #9ca3af; font-size: 13px; margin: 0 0 10px 0; text-align: center;">
              ⏰ এই কোডটি ২ মিনিটের মধ্যে মেয়াদ উত্তীর্ণ হবে
            </p>
            
            <div style="border-top: 1px solid #e5e7eb; margin: 25px 0; padding-top: 20px;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0; line-height: 1.6;">
                আপনি যদি এই অনুরোধ না করে থাকেন, তাহলে এই ইমেইলটি উপেক্ষা করুন।
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} AlphaZero Academy. সর্বস্বত্ব সংরক্ষিত।
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // IMPORTANT: Change this to your verified domain email, e.g., "AlphaZero Academy <noreply@yourdomain.com>"
        // Currently using resend.dev which only works for the account owner's email
        from: "AlphaZero Academy <onboarding@resend.dev>",
        to: [email],
        subject: "আপনার ইমেইল ভেরিফিকেশন কোড - AlphaZero Academy",
        html: emailHtml,
      }),
    });

    const emailResult = await emailResponse.json();
    
    if (!emailResponse.ok) {
      console.error("Resend API error:", emailResult);
      return new Response(
        JSON.stringify({ error: emailResult.message || "Failed to send email" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Email sent successfully:", emailResult);

    return new Response(
      JSON.stringify({ success: true, otp }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-otp function:", error);
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
