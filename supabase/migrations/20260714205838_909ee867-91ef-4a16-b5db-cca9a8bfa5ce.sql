GRANT SELECT ON public.team_members TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT ALL ON public.team_members TO service_role;
GRANT SELECT ON public.team_member_custom_links TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.team_member_custom_links TO authenticated;
GRANT ALL ON public.team_member_custom_links TO service_role;