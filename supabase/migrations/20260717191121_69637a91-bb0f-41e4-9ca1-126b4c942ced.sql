CREATE OR REPLACE FUNCTION public.can_current_user_add_chat_member(_room_id uuid, _member_user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
          -- Current user is a teacher (owner OR co-instructor) adding one of their students
          EXISTS (
            SELECT 1
            FROM public.student_courses sc
            WHERE sc.user_id = _member_user_id
              AND sc.is_active = true
              AND public.is_course_instructor(auth.uid(), sc.course_id, false)
              AND (cr.course_id IS NULL OR cr.course_id = sc.course_id)
          )
          -- Current user is a student adding a teacher (owner OR co-instructor) of one of their courses
          OR EXISTS (
            SELECT 1
            FROM public.student_courses sc
            WHERE sc.user_id = auth.uid()
              AND sc.is_active = true
              AND public.is_course_instructor(_member_user_id, sc.course_id, false)
              AND (cr.course_id IS NULL OR cr.course_id = sc.course_id)
          )
        )
    )
$function$;