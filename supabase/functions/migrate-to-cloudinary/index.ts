import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

async function sha1Hex(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest('SHA-1', buf);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const cloudName = Deno.env.get('CLOUDINARY_CLOUD_NAME')!;
    const apiKey = Deno.env.get('CLOUDINARY_API_KEY')!;
    const apiSecret = Deno.env.get('CLOUDINARY_API_SECRET')!;

    const { url, public_id, folder = 'alphazero-assets' } = await req.json();
    if (!url || !public_id) {
      return new Response(JSON.stringify({ error: 'url and public_id required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const timestamp = Math.floor(Date.now() / 1000).toString();
    // params to sign (alphabetical, excluding file/api_key/signature)
    const toSign = `folder=${folder}&overwrite=true&public_id=${public_id}&timestamp=${timestamp}`;
    const signature = await sha1Hex(toSign + apiSecret);

    const form = new FormData();
    form.append('file', url);
    form.append('public_id', public_id);
    form.append('folder', folder);
    form.append('overwrite', 'true');
    form.append('timestamp', timestamp);
    form.append('api_key', apiKey);
    form.append('signature', signature);

    const resp = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: 'POST',
      body: form,
    });
    const data = await resp.json();
    if (!resp.ok) {
      return new Response(JSON.stringify({ error: 'cloudinary_error', details: data }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ secure_url: data.secure_url, public_id: data.public_id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
