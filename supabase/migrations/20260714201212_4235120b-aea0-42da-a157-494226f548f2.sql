GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_rooms TO authenticated;
GRANT ALL ON public.chat_rooms TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_room_members TO authenticated;
GRANT ALL ON public.chat_room_members TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_messages TO authenticated;
GRANT ALL ON public.chat_messages TO service_role;