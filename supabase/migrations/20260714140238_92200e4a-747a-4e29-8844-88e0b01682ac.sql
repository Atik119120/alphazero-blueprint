INSERT INTO public.homepage_sections (section_key, site_scope, page_key, title, subtitle, is_active)
VALUES ('trusted_brands', 'agency', 'home', 'Trusted by 47+ Global Brands', '// TRUSTED', true)
ON CONFLICT DO NOTHING;