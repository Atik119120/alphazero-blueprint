
ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS intro_video_url text,
  ADD COLUMN IF NOT EXISTS why_learn jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS landing_enabled boolean NOT NULL DEFAULT true;

-- Backfill landing_slug for courses missing one
UPDATE public.courses
SET landing_slug = trim(both '-' from
    regexp_replace(
      lower(coalesce(nullif(title_en, ''), title, id::text)),
      '[^a-z0-9]+', '-', 'g'
    )
  ) || '-' || substr(id::text, 1, 6)
WHERE landing_slug IS NULL OR landing_slug = '';

CREATE UNIQUE INDEX IF NOT EXISTS courses_landing_slug_unique
  ON public.courses (landing_slug)
  WHERE landing_slug IS NOT NULL;
