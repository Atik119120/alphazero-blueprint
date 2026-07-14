
CREATE OR REPLACE FUNCTION public.is_progress_visible_to_teacher(_student_user_id uuid, _video_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.videos v
    JOIN public.courses c ON c.id = v.course_id
    JOIN public.profiles tp ON tp.id = c.teacher_id
    JOIN public.student_courses sc ON sc.course_id = c.id AND sc.user_id = _student_user_id
    WHERE v.id = _video_id
      AND tp.user_id = auth.uid()
      AND sc.is_active = true
  )
$$;

CREATE POLICY "Teachers can view enrolled students progress"
ON public.video_progress
FOR SELECT
TO authenticated
USING (public.is_progress_visible_to_teacher(user_id, video_id));
