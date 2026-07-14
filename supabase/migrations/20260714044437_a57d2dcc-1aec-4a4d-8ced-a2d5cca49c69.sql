ALTER TABLE public.footer_content DROP CONSTRAINT IF EXISTS footer_content_content_key_key;
ALTER TABLE public.footer_content ADD CONSTRAINT footer_content_scope_key_uniq UNIQUE (site_scope, content_key);

ALTER TABLE public.page_content DROP CONSTRAINT IF EXISTS page_content_page_name_content_key_key;
ALTER TABLE public.page_content ADD CONSTRAINT page_content_scope_page_key_uniq UNIQUE (site_scope, page_name, content_key);

ALTER TABLE public.site_settings DROP CONSTRAINT IF EXISTS site_settings_setting_key_key;
ALTER TABLE public.site_settings ADD CONSTRAINT site_settings_scope_key_uniq UNIQUE (site_scope, setting_key);