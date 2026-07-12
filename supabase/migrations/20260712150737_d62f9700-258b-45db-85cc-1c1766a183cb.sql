
-- Restrict team_members.email from anonymous public access
REVOKE SELECT ON public.team_members FROM anon;
GRANT SELECT (id, name, role, bio, image_url, facebook_url, instagram_url, linkedin_url, is_active, order_index, created_at, updated_at, twitter_url, whatsapp_url, fiverr_url, upwork_url, portfolio_url, threads_url, show_on_homepage) ON public.team_members TO anon;
-- authenticated still has full access via prior grants; ensure email available for authenticated
GRANT SELECT ON public.team_members TO authenticated;

-- OTP codes table for server-side verification
CREATE TABLE IF NOT EXISTS public.otp_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  attempts INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_otp_codes_email_active ON public.otp_codes(email, verified, expires_at);

GRANT ALL ON public.otp_codes TO service_role;
ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;
-- No client policies: only service role (edge functions) may access
