import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CheckoutRequest {
  full_name: string;
  email: string;
  amount: number;
  metadata: Record<string, string>;
  redirect_url: string;
  cancel_url: string;
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

  // Strip trailing /api to prevent duplication
  if (baseUrl) baseUrl = baseUrl.replace(/\/api\/?$/, '');
  return { apiKey, baseUrl };
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { apiKey, baseUrl } = await getApiConfig();

    if (!apiKey) {
      console.error('UDDOKTAPAY_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Payment gateway not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!baseUrl) {
      console.error('UDDOKTAPAY_BASE_URL not configured');
      return new Response(
        JSON.stringify({ error: 'Payment gateway URL not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: CheckoutRequest = await req.json();
    console.log('Checkout request:', JSON.stringify(body, null, 2));

    const { full_name, email, amount, metadata, redirect_url, cancel_url } = body;

    if (!full_name || !email || !amount || !redirect_url) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: full_name, email, amount, redirect_url' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const checkoutPayload = {
      full_name,
      email,
      amount: amount.toString(),
      metadata: typeof metadata === 'string' ? JSON.parse(metadata) : (metadata || {}),
      redirect_url,
      return_type: "GET",
      cancel_url: cancel_url || redirect_url,
    };

    console.log('Sending to UddoktaPay:', JSON.stringify(checkoutPayload, null, 2));
    console.log('API URL:', `${baseUrl}/api/checkout-v2`);

    const response = await fetch(`${baseUrl}/api/checkout-v2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'RT-UDDOKTAPAY-API-KEY': apiKey,
      },
      body: JSON.stringify(checkoutPayload),
    });

    const responseText = await response.text();
    console.log('UddoktaPay response status:', response.status);
    console.log('UddoktaPay response:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      console.error('Failed to parse UddoktaPay response:', responseText);
      return new Response(
        JSON.stringify({ error: 'Invalid response from payment gateway' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!response.ok) {
      console.error('UddoktaPay error:', data);
      return new Response(
        JSON.stringify({ error: data.message || 'Payment gateway error' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        payment_url: data.payment_url,
        invoice_id: data.invoice_id,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Checkout error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
