ALTER TABLE public.page_content ADD COLUMN IF NOT EXISTS site_scope text NOT NULL DEFAULT 'agency';
ALTER TABLE public.footer_content ADD COLUMN IF NOT EXISTS site_scope text NOT NULL DEFAULT 'agency';
ALTER TABLE public.footer_links ADD COLUMN IF NOT EXISTS site_scope text NOT NULL DEFAULT 'agency';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS site_scope text NOT NULL DEFAULT 'agency';

CREATE INDEX IF NOT EXISTS idx_page_content_scope_name ON public.page_content(site_scope, page_name);
CREATE INDEX IF NOT EXISTS idx_footer_content_scope ON public.footer_content(site_scope);
CREATE INDEX IF NOT EXISTS idx_footer_links_scope ON public.footer_links(site_scope);
CREATE INDEX IF NOT EXISTS idx_site_settings_scope ON public.site_settings(site_scope);