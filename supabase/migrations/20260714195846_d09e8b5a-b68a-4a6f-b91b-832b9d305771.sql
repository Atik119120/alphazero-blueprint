
CREATE POLICY "Students can create direct chat rooms"
ON public.chat_rooms
FOR INSERT
TO authenticated
WITH CHECK (
  room_type = 'direct'
  AND created_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);
