import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface RefundRequest {
  transaction_id: string;
  payment_method: string;
  amount: string;
  product_name: string;
  reason: string;
}

async function getApiConfig() {
  let apiKey = Deno.env.get('UDDOKTAPAY_API_KEY');
  let baseUrl = Deno.env.get('UDDOKTAPAY_BASE_URL');

  if (!apiKey || !baseUrl) {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    const { data } = await supabaseAdmin
      .from('site_settings')
      .select('setting_key, setting_value')
      .in('setting_key', ['uddoktapay_api_key', 'uddoktapay_base_url']);

    for (const row of data || []) {
      if (!apiKey && row.setting_key === 'uddoktapay_api_key') apiKey = row.setting_value;
      if (!baseUrl && row.setting_key === 'uddoktapay_base_url') baseUrl = row.setting_value;
    }
  }

  if (baseUrl) baseUrl = baseUrl.replace(/\/api\/?$/, '');
  return { apiKey, baseUrl };
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { apiKey, baseUrl } = await getApiConfig();

    if (!apiKey || !baseUrl) {
      return new Response(
        JSON.stringify({ error: 'Payment gateway not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: RefundRequest = await req.json();
    const { transaction_id, payment_method, amount, product_name, reason } = body;

    if (!transaction_id || !payment_method || !amount || !product_name || !reason) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: transaction_id, payment_method, amount, product_name, reason' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processing refund for transaction:', transaction_id);

    const response = await fetch(`${baseUrl}/api/refund-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'RT-UDDOKTAPAY-API-KEY': apiKey,
      },
      body: JSON.stringify({ transaction_id, payment_method, amount, product_name, reason }),
    });

    const responseText = await response.text();
    console.log('Refund response status:', response.status);
    console.log('Refund response:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid response from payment gateway' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: data.message || 'Refund failed', details: data }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Refund error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
