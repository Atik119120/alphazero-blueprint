import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

async function hmacSign(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const invoice = url.searchParams.get('invoice');
    const upayInvoice = url.searchParams.get('invoice_id') || invoice;
    if (!invoice) return new Response('Missing invoice', { status: 400, headers: corsHeaders });

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: payment } = await supabase.from('api_payments')
      .select('*, api_clients(*)').eq('invoice_id', invoice).maybeSingle();
    if (!payment) return new Response('Payment not found', { status: 404, headers: corsHeaders });

    // Verify with UddoktaPay
    const { apiKey: upayKey, baseUrl } = await getUddoktaPayConfig(supabase);
    const verifyId = payment.uddoktapay_invoice_id || upayInvoice;
    let status = 'pending';
    let verifyData: any = {};

    if (upayKey && baseUrl && verifyId) {
      const vRes = await fetch(`${baseUrl}/api/verify-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'RT-UDDOKTAPAY-API-KEY': upayKey },
        body: JSON.stringify({ invoice_id: verifyId }),
      });
      verifyData = await vRes.json();
      if (verifyData.status === 'COMPLETED') status = 'paid';
      else if (verifyData.status === 'PENDING') status = 'pending';
      else status = 'failed';
    }

    const updates: any = {
      status,
      transaction_id: verifyData.transaction_id || null,
      payment_method: verifyData.payment_method || null,
      sender_number: verifyData.sender_number || null,
    };
    if (status === 'paid' && !payment.paid_at) updates.paid_at = new Date().toISOString();

    await supabase.from('api_payments').update(updates).eq('id', payment.id);

    // Fire webhook to client (best effort)
    const client = payment.api_clients;
    if (client?.webhook_url) {
      try {
        const payload = JSON.stringify({
          invoice_id: payment.invoice_id,
          external_reference: payment.external_reference,
          status, amount: Number(payment.amount), currency: payment.currency,
          customer_email: payment.customer_email,
          transaction_id: updates.transaction_id,
          paid_at: updates.paid_at || payment.paid_at,
        });
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (client.webhook_secret) {
          headers['X-Signature'] = await hmacSign(client.webhook_secret, payload);
        }
        await fetch(client.webhook_url, { method: 'POST', headers, body: payload });
      } catch (e) { console.error('webhook fail', e); }
    }

    // Redirect back to client site
    const redirect = new URL(payment.redirect_url);
    redirect.searchParams.set('invoice_id', payment.invoice_id);
    redirect.searchParams.set('status', status);
    return new Response(null, {
      status: 302,
      headers: { ...corsHeaders, Location: redirect.toString() },
    });
  } catch (e) {
    console.error('callback error', e);
    return new Response('Error: ' + (e as Error).message, { status: 500, headers: corsHeaders });
  }
});
