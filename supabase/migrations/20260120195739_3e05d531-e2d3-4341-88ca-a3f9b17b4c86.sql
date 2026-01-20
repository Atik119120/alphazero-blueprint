-- Enable realtime for works, team_members, and services tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.works;
ALTER PUBLICATION supabase_realtime ADD TABLE public.team_members;
ALTER PUBLICATION supabase_realtime ADD TABLE public.services;