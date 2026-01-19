-- Allow authenticated users to read active pass codes (for validation)
CREATE POLICY "Authenticated users can read active pass codes"
ON public.pass_codes
FOR SELECT
TO authenticated
USING (is_active = true);