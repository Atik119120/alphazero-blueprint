import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

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

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const UDDOKTAPAY_API_KEY = Deno.env.get('UDDOKTAPAY_API_KEY');
    const UDDOKTAPAY_BASE_URL = Deno.env.get('UDDOKTAPAY_BASE_URL');

    if (!UDDOKTAPAY_API_KEY) {
      console.error('UDDOKTAPAY_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Payment gateway not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!UDDOKTAPAY_BASE_URL) {
      console.error('UDDOKTAPAY_BASE_URL not configured');
      return new Response(
        JSON.stringify({ error: 'Payment gateway URL not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: CheckoutRequest = await req.json();
    console.log('Checkout request:', JSON.stringify(body, null, 2));

    const { full_name, email, amount, metadata, redirect_url, cancel_url } = body;

    // Validate required fields
    if (!full_name || !email || !amount || !redirect_url) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: full_name, email, amount, redirect_url' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create UddoktaPay checkout
    const checkoutPayload = {
      full_name,
      email,
      amount: amount.toString(),
      metadata: metadata || {},
      redirect_url,
      cancel_url: cancel_url || redirect_url,
    };

    console.log('Sending to UddoktaPay:', JSON.stringify(checkoutPayload, null, 2));
    console.log('API URL:', `${UDDOKTAPAY_BASE_URL}/api/checkout-v2`);

    const response = await fetch(`${UDDOKTAPAY_BASE_URL}/api/checkout-v2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'RT-UDDOKTAPAY-API-KEY': UDDOKTAPAY_API_KEY,
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

    // Return the payment URL
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
