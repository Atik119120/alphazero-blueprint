import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const url = new URL(req.url);
    const invoiceId = url.searchParams.get('invoice_id');
    if (!invoiceId) return json({ error: 'invoice_id required' }, 400);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: payment } = await supabase.from('api_payments')
      .select('invoice_id, amount, currency, customer_name, customer_email, status, redirect_url, external_reference, metadata, client_id, paid_at')
      .eq('invoice_id', invoiceId).maybeSingle();
    if (!payment) return json({ error: 'Payment not found' }, 404);

    const { data: client } = await supabase.from('api_clients')
      .select('name, website_url, logo_url, brand_color, checkout_title, checkout_description')
      .eq('id', payment.client_id).maybeSingle();

    return json({
      success: true,
      payment: {
        invoice_id: payment.invoice_id,
        amount: Number(payment.amount),
        currency: payment.currency,
        customer_name: payment.customer_name,
        customer_email: payment.customer_email,
        status: payment.status,
        redirect_url: payment.redirect_url,
        external_reference: payment.external_reference,
        paid_at: payment.paid_at,
      },
      client: client || null,
    });
  } catch (e) {
    console.error('checkout-info error', e);
    return json({ error: (e as Error).message }, 500);
  }
});
