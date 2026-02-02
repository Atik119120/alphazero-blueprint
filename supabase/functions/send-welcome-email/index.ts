import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  name: string;
  passCode?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-welcome-email function called");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, passCode }: WelcomeEmailRequest = await req.json();
    console.log("Sending welcome email to:", email);

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

    // Beautiful welcome email template
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">🎉 AlphaZero Academy তে স্বাগতম!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 12px 0 0 0; font-size: 16px;">আপনার শিক্ষার নতুন যাত্রা শুরু হলো</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <p style="color: #374151; font-size: 18px; margin: 0 0 20px 0;">
              প্রিয় <strong style="color: #6366f1;">${name}</strong>,
            </p>
            
            <p style="color: #6b7280; font-size: 16px; margin: 0 0 25px 0; line-height: 1.8;">
              AlphaZero Academy তে আপনাকে স্বাগতম! আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে। এখন আপনি আমাদের সকল কোর্স ও শিক্ষামূলক সামগ্রীতে অ্যাক্সেস পাবেন।
            </p>

            ${passCode ? `
            <!-- Pass Code Box -->
            <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 2px dashed #6366f1; border-radius: 12px; padding: 25px; text-align: center; margin: 0 0 25px 0;">
              <p style="color: #6b7280; font-size: 12px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">আপনার Pass Code</p>
              <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #6366f1; font-family: 'Courier New', monospace;">
                ${passCode}
              </div>
              <p style="color: #9ca3af; font-size: 12px; margin: 10px 0 0 0;">
                এই কোড দিয়ে আপনার কোর্সে অ্যাক্সেস করুন
              </p>
            </div>
            ` : ''}
            
            <!-- Features -->
            <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px; margin: 0 0 25px 0;">
              <h3 style="color: #374151; font-size: 16px; margin: 0 0 15px 0;">🚀 আপনি যা পাবেন:</h3>
              <ul style="color: #6b7280; font-size: 14px; margin: 0; padding-left: 20px; line-height: 2;">
                <li>উচ্চ মানের ভিডিও টিউটোরিয়াল</li>
                <li>অভিজ্ঞ মেন্টরদের সাপোর্ট</li>
                <li>প্র্যাক্টিস প্রজেক্ট ও অ্যাসাইনমেন্ট</li>
                <li>কোর্স সম্পন্ন করলে সার্টিফিকেট</li>
                <li>২৪/৭ অ্যাক্সেস</li>
              </ul>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://alphazero00.lovable.app/student/login" 
                 style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);">
                এখনই শুরু করুন →
              </a>
            </div>
            
            <div style="border-top: 1px solid #e5e7eb; margin: 25px 0; padding-top: 20px;">
              <p style="color: #9ca3af; font-size: 14px; margin: 0; line-height: 1.6;">
                কোনো সমস্যা হলে আমাদের সাথে যোগাযোগ করুন। আমরা সবসময় আপনাকে সাহায্য করতে প্রস্তুত।
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f9fafb; padding: 25px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
              শুভকামনা রইলো! 💜
            </p>
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
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
        from: "AlphaZero Academy <noreply@alphazero.online>",
        to: [email],
        subject: "🎉 AlphaZero Academy তে স্বাগতম! আপনার অ্যাকাউন্ট প্রস্তুত",
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

    console.log("Welcome email sent successfully:", emailResult);

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
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
