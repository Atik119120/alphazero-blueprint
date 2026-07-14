CREATE OR REPLACE FUNCTION public.can_current_teacher_add_chat_member(_room_id uuid, _member_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.chat_rooms cr
    JOIN public.profiles teacher_profile
      ON teacher_profile.id = cr.created_by
     AND teacher_profile.user_id = auth.uid()
    WHERE cr.id = _room_id
      AND (
        _member_user_id = auth.uid()
        OR EXISTS (
          SELECT 1
          FROM public.student_courses sc
          JOIN public.courses c ON c.id = sc.course_id
          WHERE sc.user_id = _member_user_id
            AND sc.is_active = true
            AND c.teacher_id = teacher_profile.id
            AND (cr.course_id IS NULL OR cr.course_id = c.id)
        )
      )
  )
$$;

DROP POLICY IF EXISTS "Room creators can add members" ON public.chat_room_members;

CREATE POLICY "Room creators can add allowed members"
ON public.chat_room_members
FOR INSERT
TO authenticated
WITH CHECK (
  public.can_current_teacher_add_chat_member(room_id, user_id)
  OR user_id = auth.uid()
  OR public.has_role(auth.uid(), 'admin')
);