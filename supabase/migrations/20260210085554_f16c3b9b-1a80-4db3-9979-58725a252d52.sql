
-- Add payment settings to site_settings
INSERT INTO public.site_settings (setting_key, setting_value, setting_type) 
VALUES 
  ('bkash_number', '01776965533', 'text'),
  ('nagad_number', '01776965533', 'text')
ON CONFLICT DO NOTHING;

-- Create custom links table for team members
CREATE TABLE public.team_member_custom_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_member_id UUID NOT NULL REFERENCES public.team_members(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  icon_url TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.team_member_custom_links ENABLE ROW LEVEL SECURITY;

-- Public read for custom links (displayed on team page)
CREATE POLICY "Custom links are publicly readable"
  ON public.team_member_custom_links FOR SELECT
  USING (true);

-- Admin-only write
CREATE POLICY "Admins can manage custom links"
  ON public.team_member_custom_links FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));
