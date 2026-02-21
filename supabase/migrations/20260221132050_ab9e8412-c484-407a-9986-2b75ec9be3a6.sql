
-- Add show_on_homepage to works table
ALTER TABLE public.works ADD COLUMN IF NOT EXISTS show_on_homepage boolean DEFAULT false;

-- Add show_on_homepage to team_members table
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS show_on_homepage boolean DEFAULT false;

-- Add show_on_homepage to services table
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS show_on_homepage boolean DEFAULT false;

-- Add show_on_homepage to courses table
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS show_on_homepage boolean DEFAULT false;

-- Set existing featured works to show on homepage by default
UPDATE public.works SET show_on_homepage = true WHERE is_featured = true;

-- Set first 4 active team members to show on homepage
UPDATE public.team_members SET show_on_homepage = true WHERE is_active = true AND order_index <= 4;

-- Set first 6 active services to show on homepage
UPDATE public.services SET show_on_homepage = true WHERE is_active = true AND order_index <= 6;

-- Set first 4 published courses to show on homepage
UPDATE public.courses SET show_on_homepage = true WHERE is_published = true;
