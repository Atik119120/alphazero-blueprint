import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

async function getUddoktaPayConfig(supabase: any) {
  let apiKey = Deno.env.get('UDDOKTAPAY_API_KEY');
  let baseUrl = Deno.env.get('UDDOKTAPAY_BASE_URL');
  if (!apiKey || !baseUrl) {
    const { data } = await supabase.from('site_settings').select('setting_key, setting_value')
      .in('setting_key', ['uddoktapay_api_key', 'uddoktapay_base_url']);
    for (const r of data || []) {
      if (!apiKey && r.setting_key === 'uddoktapay_api_key') apiKey = r.setting_value;
      if (!baseUrl && r.setting_key === 'uddoktapay_base_url') baseUrl = r.setting_value;
    }
  }
  if (baseUrl) baseUrl = baseUrl.replace(/\/api\/?$/, '');
  return { apiKey, baseUrl };
}

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  try {
    const body = await req.json().catch(() => ({}));
    const invoiceId = body.invoice_id;
    if (!invoiceId) return json({ error: 'invoice_id required' }, 400);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: payment } = await supabase.from('api_payments')
      .select('*').eq('invoice_id', invoiceId).maybeSingle();
    if (!payment) return json({ error: 'Payment not found' }, 404);
    if (payment.status === 'paid') return json({ error: 'Already paid' }, 400);

    const { data: client } = await supabase.from('api_clients')
      .select('id, name, is_active').eq('id', payment.client_id).maybeSingle();
    if (!client?.is_active) return json({ error: 'Client inactive' }, 403);

    const { apiKey: upayKey, baseUrl } = await getUddoktaPayConfig(supabase);
    if (!upayKey || !baseUrl) return json({ error: 'Payment gateway not configured' }, 500);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const projectRef = supabaseUrl.replace('https://', '').split('.')[0];
    const callbackUrl = `https://${projectRef}.functions.supabase.co/api-payment-callback?invoice=${payment.invoice_id}`;

    const payload = {
      full_name: payment.customer_name,
      email: payment.customer_email,
      amount: Number(payment.amount).toString(),
      metadata: {
        api_client_id: client.id,
        internal_invoice: payment.invoice_id,
        external_reference: payment.external_reference || '',
        ...(payment.metadata || {}),
      },
      redirect_url: callbackUrl,
      return_type: 'GET',
      cancel_url: payment.redirect_url,
    };

    const upayRes = await fetch(`${baseUrl}/api/checkout-v2`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'RT-UDDOKTAPAY-API-KEY': upayKey },
      body: JSON.stringify(payload),
    });
    const upayData = await upayRes.json();
    if (!upayRes.ok || !upayData.payment_url) {
      return json({ error: upayData.message || 'Gateway error', detail: upayData }, 502);
    }

    await supabase.from('api_payments')
      .update({ uddoktapay_invoice_id: upayData.invoice_id })
      .eq('id', payment.id);

    return json({ success: true, payment_url: upayData.payment_url });
  } catch (e) {
    console.error('checkout-start error', e);
    return json({ error: (e as Error).message }, 500);
  }
});
