CREATE POLICY "Teachers can manage videos of their courses"
ON public.videos
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.courses c
    JOIN public.profiles p ON p.id = c.teacher_id
    WHERE c.id = videos.course_id AND p.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.courses c
    JOIN public.profiles p ON p.id = c.teacher_id
    WHERE c.id = videos.course_id AND p.user_id = auth.uid()
  )
);