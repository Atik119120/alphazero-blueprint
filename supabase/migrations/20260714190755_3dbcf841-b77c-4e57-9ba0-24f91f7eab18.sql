
CREATE POLICY "Teachers can view enrolled student profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.student_courses sc
    JOIN public.courses c ON c.id = sc.course_id
    JOIN public.profiles tp ON tp.id = c.teacher_id
    WHERE sc.user_id = profiles.user_id
      AND tp.user_id = auth.uid()
  )
);
