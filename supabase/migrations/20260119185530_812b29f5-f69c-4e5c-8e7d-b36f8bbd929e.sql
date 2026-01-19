-- Allow students to claim/link an active pass code to their own profile
-- This is required for /passcode page to work.
CREATE POLICY "Students can claim active pass codes"
ON public.pass_codes
FOR UPDATE
TO authenticated
USING (
  is_active = true
  AND (
    student_id IS NULL
    OR EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = pass_codes.student_id
        AND p.user_id = auth.uid()
    )
  )
)
WITH CHECK (
  is_active = true
  AND EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = pass_codes.student_id
      AND p.user_id = auth.uid()
  )
);
