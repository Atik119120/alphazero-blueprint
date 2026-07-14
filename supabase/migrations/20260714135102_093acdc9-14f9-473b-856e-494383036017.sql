ALTER TABLE public.footer_content DROP COLUMN IF EXISTS content_bn;
ALTER TABLE public.page_content DROP COLUMN IF EXISTS content_bn;
ALTER TABLE public.homepage_sections
  DROP COLUMN IF EXISTS title_bn,
  DROP COLUMN IF EXISTS subtitle_bn,
  DROP COLUMN IF EXISTS description_bn,
  DROP COLUMN IF EXISTS highlight_bn;
ALTER TABLE public.homepage_section_items
  DROP COLUMN IF EXISTS title_bn,
  DROP COLUMN IF EXISTS subtitle_bn,
  DROP COLUMN IF EXISTS description_bn;