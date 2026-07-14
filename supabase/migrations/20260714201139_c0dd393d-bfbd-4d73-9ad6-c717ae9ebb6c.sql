CREATE OR REPLACE FUNCTION public.is_chat_room_member(_room_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.chat_room_members crm
    WHERE crm.room_id = _room_id
      AND crm.user_id = _user_id
  )
$$;

CREATE OR REPLACE FUNCTION public.can_current_user_add_chat_member(_room_id uuid, _member_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    _member_user_id = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
    OR EXISTS (
      SELECT 1
      FROM public.chat_rooms cr
      JOIN public.profiles creator_profile ON creator_profile.id = cr.created_by
      WHERE cr.id = _room_id
        AND creator_profile.user_id = auth.uid()
        AND (
          EXISTS (
            SELECT 1
            FROM public.student_courses sc
            JOIN public.courses c ON c.id = sc.course_id
            JOIN public.profiles teacher_profile ON teacher_profile.id = c.teacher_id
            WHERE sc.user_id = _member_user_id
              AND sc.is_active = true
              AND teacher_profile.user_id = auth.uid()
              AND (cr.course_id IS NULL OR cr.course_id = c.id)
          )
          OR EXISTS (
            SELECT 1
            FROM public.student_courses sc
            JOIN public.courses c ON c.id = sc.course_id
            JOIN public.profiles teacher_profile ON teacher_profile.id = c.teacher_id
            WHERE sc.user_id = auth.uid()
              AND sc.is_active = true
              AND teacher_profile.user_id = _member_user_id
              AND (cr.course_id IS NULL OR cr.course_id = c.id)
          )
        )
    )
$$;

REVOKE ALL ON FUNCTION public.is_chat_room_member(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_chat_room_member(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_chat_room_member(uuid, uuid) TO service_role;

REVOKE ALL ON FUNCTION public.can_current_user_add_chat_member(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.can_current_user_add_chat_member(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_current_user_add_chat_member(uuid, uuid) TO service_role;

DROP POLICY IF EXISTS "Members can view room members" ON public.chat_room_members;
DROP POLICY IF EXISTS "Room creators can add allowed members" ON public.chat_room_members;
DROP POLICY IF EXISTS "Room members can view messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Room members can send messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Members can view their chat rooms" ON public.chat_rooms;

CREATE POLICY "Members can view room members"
ON public.chat_room_members
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin')
  OR public.is_chat_room_member(room_id, auth.uid())
);

CREATE POLICY "Room creators can add allowed members"
ON public.chat_room_members
FOR INSERT
TO authenticated
WITH CHECK (
  public.can_current_user_add_chat_member(room_id, user_id)
);

CREATE POLICY "Room members can view messages"
ON public.chat_messages
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin')
  OR public.is_chat_room_member(room_id, auth.uid())
);

CREATE POLICY "Room members can send messages"
ON public.chat_messages
FOR INSERT
TO authenticated
WITH CHECK (
  sender_id = auth.uid()
  AND public.is_chat_room_member(room_id, auth.uid())
);

CREATE POLICY "Members can view their chat rooms"
ON public.chat_rooms
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin')
  OR created_by = (SELECT p.id FROM public.profiles p WHERE p.user_id = auth.uid())
  OR public.is_chat_room_member(id, auth.uid())
);