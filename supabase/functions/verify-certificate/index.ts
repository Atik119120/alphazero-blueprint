import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyCertificateRequest {
  certificate_id: string;
}

interface PublicCertificateData {
  certificate_id: string;
  course_name: string;
  issued_at: string;
  is_valid: boolean;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Only allow POST requests
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: VerifyCertificateRequest = await req.json();
    const { certificate_id } = body;

    // Validate input
    if (!certificate_id || typeof certificate_id !== "string") {
      console.log("Invalid request: missing certificate_id");
      return new Response(
        JSON.stringify({ error: "Certificate ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Sanitize certificate_id - only allow alphanumeric and hyphen
    const sanitizedId = certificate_id.trim().toUpperCase();
    if (!/^[A-Z0-9-]+$/.test(sanitizedId) || sanitizedId.length < 10 || sanitizedId.length > 50) {
      console.log("Invalid certificate_id format:", sanitizedId);
      return new Response(
        JSON.stringify({ error: "Invalid certificate ID format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with service role (bypasses RLS)
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Verifying certificate:", sanitizedId);

    // Query only the specific certificate by ID
    const { data: certificate, error } = await supabase
      .from("certificates")
      .select("certificate_id, course_name, issued_at")
      .eq("certificate_id", sanitizedId)
      .maybeSingle();

    if (error) {
      console.error("Database error:", error);
      return new Response(
        JSON.stringify({ error: "Verification failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!certificate) {
      console.log("Certificate not found:", sanitizedId);
      return new Response(
        JSON.stringify({ 
          is_valid: false,
          error: "Certificate not found" 
        }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Return ONLY public verification data - NO student_name or user_id
    const publicData: PublicCertificateData = {
      certificate_id: certificate.certificate_id,
      course_name: certificate.course_name,
      issued_at: certificate.issued_at,
      is_valid: true,
    };

    console.log("Certificate verified successfully:", sanitizedId);

    return new Response(
      JSON.stringify(publicData),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
