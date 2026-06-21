import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

async function sha256(input: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

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
    const auth = req.headers.get('Authorization') || req.headers.get('authorization') || '';
    const apiKey = auth.replace(/^Bearer\s+/i, '').trim();
    if (!apiKey) return json({ error: 'Missing API key' }, 401);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const keyHash = await sha256(apiKey);
    const { data: client } = await supabase.from('api_clients')
      .select('*').eq('api_key_hash', keyHash).eq('is_active', true).maybeSingle();
    if (!client) return json({ error: 'Invalid or inactive API key' }, 401);

    const body = await req.json();
    const { amount, customer_name, customer_email, customer_phone, redirect_url, external_reference, metadata } = body;

    if (!amount || Number(amount) <= 0) return json({ error: 'amount required (>0)' }, 400);
    if (!customer_name || !customer_email) return json({ error: 'customer_name and customer_email required' }, 400);
    if (!redirect_url) return json({ error: 'redirect_url required' }, 400);

    const invoiceId = 'AZ-' + crypto.randomUUID().replace(/-/g, '').slice(0, 16).toUpperCase();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const projectRef = supabaseUrl.replace('https://', '').split('.')[0];
    const callbackUrl = `https://${projectRef}.functions.supabase.co/api-payment-callback?invoice=${invoiceId}`;

    const { apiKey: upayKey, baseUrl } = await getUddoktaPayConfig(supabase);
    if (!upayKey || !baseUrl) return json({ error: 'Payment gateway not configured' }, 500);

    const payload = {
      full_name: customer_name,
      email: customer_email,
      amount: Number(amount).toString(),
      metadata: {
        api_client_id: client.id,
        internal_invoice: invoiceId,
        external_reference: external_reference || '',
        ...(metadata || {}),
      },
      redirect_url: callbackUrl,
      return_type: 'GET',
      cancel_url: redirect_url,
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

    await supabase.from('api_payments').insert({
      client_id: client.id,
      invoice_id: invoiceId,
      uddoktapay_invoice_id: upayData.invoice_id,
      external_reference: external_reference || null,
      amount: Number(amount),
      currency: 'BDT',
      customer_name,
      customer_email,
      customer_phone: customer_phone || null,
      status: 'pending',
      metadata: metadata || {},
      redirect_url,
    });

    return json({
      success: true,
      invoice_id: invoiceId,
      payment_url: upayData.payment_url,
    });
  } catch (e) {
    console.error('create-payment error', e);
    return json({ error: (e as Error).message }, 500);
  }
});
