import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const SITE_URL = (Deno.env.get('PUBLIC_SITE_URL') || 'https://alphazero.online').replace(/\/$/, '');

async function sha256(input: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
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

    // Defer gateway session creation — store as pending intent.
    await supabase.from('api_payments').insert({
      client_id: client.id,
      invoice_id: invoiceId,
      uddoktapay_invoice_id: null,
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

    const checkoutUrl = `${SITE_URL}/pay/${invoiceId}`;

    return json({
      success: true,
      invoice_id: invoiceId,
      payment_url: checkoutUrl,
      checkout_url: checkoutUrl,
    });
  } catch (e) {
    console.error('create-payment error', e);
    return json({ error: (e as Error).message }, 500);
  }
});
