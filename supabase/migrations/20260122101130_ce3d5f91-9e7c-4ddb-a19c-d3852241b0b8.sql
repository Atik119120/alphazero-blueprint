-- Add more social media columns to team_members table
ALTER TABLE public.team_members 
ADD COLUMN IF NOT EXISTS twitter_url text,
ADD COLUMN IF NOT EXISTS whatsapp_url text,
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS fiverr_url text,
ADD COLUMN IF NOT EXISTS upwork_url text,
ADD COLUMN IF NOT EXISTS portfolio_url text,
ADD COLUMN IF NOT EXISTS threads_url text;