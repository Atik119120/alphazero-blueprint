import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerifyRequest {
  invoice_id: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const UDDOKTAPAY_API_KEY = Deno.env.get('UDDOKTAPAY_API_KEY');
    const UDDOKTAPAY_BASE_URL = Deno.env.get('UDDOKTAPAY_BASE_URL');

    if (!UDDOKTAPAY_API_KEY || !UDDOKTAPAY_BASE_URL) {
      console.error('UddoktaPay credentials not configured');
      return new Response(
        JSON.stringify({ error: 'Payment gateway not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: VerifyRequest = await req.json();
    const { invoice_id } = body;

    if (!invoice_id) {
      return new Response(
        JSON.stringify({ error: 'invoice_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Verifying payment for invoice:', invoice_id);

    // Verify payment with UddoktaPay
    const response = await fetch(`${UDDOKTAPAY_BASE_URL}/api/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'RT-UDDOKTAPAY-API-KEY': UDDOKTAPAY_API_KEY,
      },
      body: JSON.stringify({ invoice_id }),
    });

    const responseText = await response.text();
    console.log('Verify response status:', response.status);
    console.log('Verify response:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      console.error('Failed to parse verify response:', responseText);
      return new Response(
        JSON.stringify({ error: 'Invalid response from payment gateway' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: data.message || 'Verification failed' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return verification result
    return new Response(
      JSON.stringify({
        success: true,
        status: data.status,
        transaction_id: data.transaction_id,
        invoice_id: data.invoice_id,
        amount: data.amount,
        fee: data.fee,
        charged_amount: data.charged_amount,
        payment_method: data.payment_method,
        sender_number: data.sender_number,
        metadata: data.metadata,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Verify error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
