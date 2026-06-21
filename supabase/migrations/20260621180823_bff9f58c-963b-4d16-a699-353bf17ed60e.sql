ALTER TABLE public.api_clients 
  ADD COLUMN IF NOT EXISTS logo_url TEXT,
  ADD COLUMN IF NOT EXISTS brand_color TEXT,
  ADD COLUMN IF NOT EXISTS checkout_title TEXT,
  ADD COLUMN IF NOT EXISTS checkout_description TEXT;