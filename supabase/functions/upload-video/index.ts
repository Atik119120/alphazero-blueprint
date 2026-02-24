import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const userId = claimsData.claims.sub;

    // Check admin role
    const { data: roleData } = await supabase.from('user_roles').select('role').eq('user_id', userId).maybeSingle();
    if (!roleData || roleData.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Admin access required' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Get Cloudinary credentials
    const cloudName = Deno.env.get('CLOUDINARY_CLOUD_NAME');
    const apiKey = Deno.env.get('CLOUDINARY_API_KEY');
    const apiSecret = Deno.env.get('CLOUDINARY_API_SECRET');

    if (!cloudName || !apiKey || !apiSecret) {
      return new Response(JSON.stringify({ error: 'Cloudinary not configured' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Parse multipart form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const courseId = formData.get('course_id') as string;
    const moduleId = formData.get('module_id') as string | null;
    const orderIndex = formData.get('order_index') as string;
    const topicId = formData.get('topic_id') as string | null;

    if (!file || !title || !courseId) {
      return new Response(JSON.stringify({ error: 'Missing required fields: file, title, course_id' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Validate file
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return new Response(JSON.stringify({ error: 'File too large. Max 100MB.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      return new Response(JSON.stringify({ error: 'Invalid file type. Allowed: MP4, WebM, MOV' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Generate signature for Cloudinary upload
    const timestamp = Math.round(Date.now() / 1000);
    const folder = `courses/${courseId}`;
    const params: Record<string, string> = {
      folder,
      resource_type: 'video',
      timestamp: String(timestamp),
    };

    // Create signature
    const sortedParams = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&');
    const signatureString = sortedParams + apiSecret;
    const encoder = new TextEncoder();
    const data = encoder.encode(signatureString);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Upload to Cloudinary
    const cloudinaryForm = new FormData();
    cloudinaryForm.append('file', file);
    cloudinaryForm.append('api_key', apiKey);
    cloudinaryForm.append('timestamp', String(timestamp));
    cloudinaryForm.append('signature', signature);
    cloudinaryForm.append('folder', folder);
    cloudinaryForm.append('resource_type', 'video');

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
      { method: 'POST', body: cloudinaryForm }
    );

    if (!cloudinaryResponse.ok) {
      const errBody = await cloudinaryResponse.text();
      console.error('Cloudinary upload failed:', errBody);
      return new Response(JSON.stringify({ error: 'Cloudinary upload failed', details: errBody }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const cloudinaryData = await cloudinaryResponse.json();

    // Save to videos table using service role
    const adminSupabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: videoData, error: insertError } = await adminSupabase
      .from('videos')
      .insert({
        course_id: courseId,
        title,
        video_url: cloudinaryData.secure_url,
        video_type: 'cloudinary',
        duration_seconds: Math.round(cloudinaryData.duration || 0),
        order_index: parseInt(orderIndex || '0'),
        cloudinary_public_id: cloudinaryData.public_id,
        cloudinary_url: cloudinaryData.secure_url,
        thumbnail_url: cloudinaryData.secure_url.replace(/\.[^.]+$/, '.jpg'),
        module_id: moduleId || null,
        topic_id: topicId || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error('DB insert error:', insertError);
      return new Response(JSON.stringify({ error: 'Failed to save video metadata', details: insertError.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({
      success: true,
      video: videoData,
      cloudinary: {
        public_id: cloudinaryData.public_id,
        secure_url: cloudinaryData.secure_url,
        duration: cloudinaryData.duration,
        format: cloudinaryData.format,
        bytes: cloudinaryData.bytes,
      }
    }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('Upload error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error', details: String(error) }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
