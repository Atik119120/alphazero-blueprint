REVOKE ALL ON FUNCTION public.can_current_teacher_add_chat_member(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.can_current_teacher_add_chat_member(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_current_teacher_add_chat_member(uuid, uuid) TO service_role;