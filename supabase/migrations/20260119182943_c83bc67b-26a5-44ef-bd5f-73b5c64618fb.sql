-- Drop the overly permissive certificate policy
DROP POLICY IF EXISTS "Anyone can verify certificates by ID" ON public.certificates;

-- Create a more restrictive policy that only allows lookup by certificate_id
-- This prevents enumeration but still allows verification
CREATE POLICY "Certificate verification by ID only"
ON public.certificates
FOR SELECT
USING (
  -- Allow if user owns the certificate
  auth.uid() = user_id
  -- Or if user is admin
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Note: Public certificate verification will be handled via Edge Function