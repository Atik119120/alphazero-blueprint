
CREATE OR REPLACE FUNCTION public.is_teacher_of_current_student(_teacher_user_id uuid)
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
    WHERE sc.user_id = auth.uid()
      AND sc.is_active = true
      AND tp.user_id = _teacher_user_id
  )
$$;

CREATE POLICY "Students can view their course teachers profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.is_teacher_of_current_student(user_id));
