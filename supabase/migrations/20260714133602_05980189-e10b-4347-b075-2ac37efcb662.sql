
-- Homepage sections CMS tables
CREATE TABLE public.homepage_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_scope text NOT NULL DEFAULT 'agency',
  page_key text NOT NULL DEFAULT 'home',
  section_key text NOT NULL,
  section_type text NOT NULL DEFAULT 'custom',
  title text,
  title_bn text,
  subtitle text,
  subtitle_bn text,
  description text,
  description_bn text,
  highlight text,
  highlight_bn text,
  image_url text,
  image_url_2 text,
  button_label text,
  button_url text,
  order_index int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (site_scope, page_key, section_key)
);

GRANT SELECT ON public.homepage_sections TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.homepage_sections TO authenticated;
GRANT ALL ON public.homepage_sections TO service_role;

ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active sections"
  ON public.homepage_sections FOR SELECT
  USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage sections"
  ON public.homepage_sections FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX ON public.homepage_sections (site_scope, page_key, section_key);

CREATE TRIGGER trg_homepage_sections_updated
  BEFORE UPDATE ON public.homepage_sections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Items for list-type sections (sister brands, what-we-do items)
CREATE TABLE public.homepage_section_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES public.homepage_sections(id) ON DELETE CASCADE,
  title text,
  title_bn text,
  subtitle text,
  subtitle_bn text,
  description text,
  description_bn text,
  image_url text,
  image_url_2 text,
  url text,
  order_index int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.homepage_section_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.homepage_section_items TO authenticated;
GRANT ALL ON public.homepage_section_items TO service_role;

ALTER TABLE public.homepage_section_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active items"
  ON public.homepage_section_items FOR SELECT
  USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage items"
  ON public.homepage_section_items FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX ON public.homepage_section_items (section_id, order_index);

CREATE TRIGGER trg_homepage_section_items_updated
  BEFORE UPDATE ON public.homepage_section_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.homepage_sections;
ALTER PUBLICATION supabase_realtime ADD TABLE public.homepage_section_items;

-- Seed default sections for agency + learn
INSERT INTO public.homepage_sections (site_scope, page_key, section_key, section_type, title, subtitle, order_index)
VALUES
  ('agency', 'home', 'hero', 'hero', 'Hero Section', NULL, 1),
  ('agency', 'home', 'sister_brands', 'brands', 'Our Sister Brands', NULL, 2),
  ('agency', 'home', 'what_we_do', 'what_we_do', 'What We Do', NULL, 3),
  ('agency', 'home', 'services_preview', 'services_preview', 'Our Services', NULL, 4),
  ('learn', 'home', 'hero', 'hero', 'Learn Hero', NULL, 1),
  ('learn', 'home', 'courses_preview', 'services_preview', 'Featured Courses', NULL, 2),
  ('learn', 'home', 'instructors', 'brands', 'Our Instructors', NULL, 3)
ON CONFLICT (site_scope, page_key, section_key) DO NOTHING;
