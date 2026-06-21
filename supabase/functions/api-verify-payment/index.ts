import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

async function sha256(input: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const auth = req.headers.get('Authorization') || req.headers.get('authorization') || '';
    const apiKey = auth.replace(/^Bearer\s+/i, '').trim();
    if (!apiKey) return json({ error: 'Missing API key' }, 401);

    const url = new URL(req.url);
    let invoice_id = url.searchParams.get('invoice_id');
    if (!invoice_id && req.method === 'POST') {
      try { invoice_id = (await req.json()).invoice_id; } catch { /* ignore */ }
    }
    if (!invoice_id) return json({ error: 'invoice_id required' }, 400);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const keyHash = await sha256(apiKey);
    const { data: client } = await supabase.from('api_clients')
      .select('id').eq('api_key_hash', keyHash).eq('is_active', true).maybeSingle();
    if (!client) return json({ error: 'Invalid or inactive API key' }, 401);

    const { data: payment } = await supabase.from('api_payments')
      .select('*').eq('invoice_id', invoice_id).eq('client_id', client.id).maybeSingle();
    if (!payment) return json({ error: 'Payment not found' }, 404);

    return json({
      success: true,
      invoice_id: payment.invoice_id,
      external_reference: payment.external_reference,
      status: payment.status,
      amount: Number(payment.amount),
      currency: payment.currency,
      customer_name: payment.customer_name,
      customer_email: payment.customer_email,
      customer_phone: payment.customer_phone,
      transaction_id: payment.transaction_id,
      payment_method: payment.payment_method,
      sender_number: payment.sender_number,
      paid_at: payment.paid_at,
      metadata: payment.metadata,
    });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
