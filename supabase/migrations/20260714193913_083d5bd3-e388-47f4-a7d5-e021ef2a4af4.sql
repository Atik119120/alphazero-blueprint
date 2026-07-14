
-- Update notices SELECT policy to use direct enrollment (student_courses)
DROP POLICY IF EXISTS "Students can view notices for their courses" ON public.notices;

CREATE POLICY "Students can view notices for their courses"
ON public.notices
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin')
  OR teacher_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  OR (course_id IS NULL AND is_global = true)
  OR EXISTS (
    SELECT 1 FROM public.student_courses sc
    WHERE sc.course_id = notices.course_id
      AND sc.user_id = auth.uid()
      AND sc.is_active = true
  )
);

-- Ensure teachers can INSERT notices only for their own courses (or global by admin)
DROP POLICY IF EXISTS "Teachers can create notices for their courses" ON public.notices;

CREATE POLICY "Teachers can create notices for their courses"
ON public.notices
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'admin')
  OR (
    teacher_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    AND (
      course_id IS NULL
      OR EXISTS (
        SELECT 1 FROM public.courses c
        WHERE c.id = notices.course_id
          AND c.teacher_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
      )
    )
  )
);
