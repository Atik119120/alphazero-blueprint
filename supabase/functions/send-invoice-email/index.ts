import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { to, subject, html, pdfBase64, filename } = await req.json();
    const r = await resend.emails.send({
      from: "AlphaZero Agency <noreply@alphazero.online>",
      reply_to: "support@alphazero.online",
      to: [to],
      subject,
      html,
      attachments: pdfBase64 ? [{ filename: filename || "invoice.pdf", content: pdfBase64 }] : undefined,
    });
    return new Response(JSON.stringify({ success: true, data: r }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
