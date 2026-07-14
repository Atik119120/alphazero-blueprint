
DROP POLICY IF EXISTS "Teachers can view enrolled student profiles" ON public.profiles;

CREATE OR REPLACE FUNCTION public.is_student_of_current_teacher(_student_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.student_courses sc
    JOIN public.courses c ON c.id = sc.course_id
    JOIN public.profiles tp ON tp.id = c.teacher_id
    WHERE sc.user_id = _student_user_id
      AND tp.user_id = auth.uid()
  )
$$;

CREATE POLICY "Teachers can view enrolled student profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.is_student_of_current_teacher(user_id));
