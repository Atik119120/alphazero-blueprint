-- Fix pass_codes RLS: Remove the overly permissive policy that exposes unclaimed codes
-- Drop the current policy that allows viewing unclaimed codes
DROP POLICY IF EXISTS "Students can validate or view their own pass codes" ON public.pass_codes;

-- Create a more restrictive policy: students can ONLY view codes already assigned to them
-- Unclaimed codes (student_id IS NULL) should NOT be visible to students
-- They can only claim codes via UPDATE policy (which is already properly restricted)
CREATE POLICY "Students can view only their assigned pass codes"
ON public.pass_codes
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = pass_codes.student_id 
    AND p.user_id = auth.uid()
  )
);