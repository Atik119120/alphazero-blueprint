INSERT INTO public.site_settings (setting_key, setting_value, setting_type)
VALUES 
  ('bkash_enabled', 'true', 'toggle'),
  ('nagad_enabled', 'true', 'toggle')
ON CONFLICT DO NOTHING;