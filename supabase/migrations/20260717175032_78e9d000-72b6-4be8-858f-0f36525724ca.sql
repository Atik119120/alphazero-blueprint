
-- 1. team_members scope
ALTER TABLE public.team_members
  ADD COLUMN IF NOT EXISTS site_scope text NOT NULL DEFAULT 'agency'
    CHECK (site_scope IN ('agency','learn','both'));

-- 2. instructor role enum
DO $$ BEGIN
  CREATE TYPE public.course_instructor_role AS ENUM ('owner','co_instructor');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 3. join table
CREATE TABLE IF NOT EXISTS public.course_instructors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  instructor_id uuid NOT NULL REFERENCES public.team_members(id) ON DELETE CASCADE,
  role public.course_instructor_role NOT NULL DEFAULT 'co_instructor',
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (course_id, instructor_id)
);

CREATE INDEX IF NOT EXISTS course_instructors_course_idx ON public.course_instructors(course_id);
CREATE INDEX IF NOT EXISTS course_instructors_instructor_idx ON public.course_instructors(instructor_id);

GRANT SELECT ON public.course_instructors TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.course_instructors TO authenticated;
GRANT ALL ON public.course_instructors TO service_role;

ALTER TABLE public.course_instructors ENABLE ROW LEVEL SECURITY;

-- Anyone can read (needed for public landing pages)
DROP POLICY IF EXISTS "Public can view course instructors" ON public.course_instructors;
CREATE POLICY "Public can view course instructors"
  ON public.course_instructors FOR SELECT
  USING (true);

-- Admins manage
DROP POLICY IF EXISTS "Admins manage course instructors" ON public.course_instructors;
CREATE POLICY "Admins manage course instructors"
  ON public.course_instructors FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
DROP TRIGGER IF EXISTS trg_course_instructors_updated ON public.course_instructors;
CREATE TRIGGER trg_course_instructors_updated
  BEFORE UPDATE ON public.course_instructors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. helper: is a user an instructor of a course (optionally owner-only)
CREATE OR REPLACE FUNCTION public.is_course_instructor(
  _user_id uuid,
  _course_id uuid,
  _owner_only boolean DEFAULT false
) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.course_instructors ci
    JOIN public.team_members tm ON tm.id = ci.instructor_id
    JOIN public.profiles p ON p.linked_team_member_id = tm.id
    WHERE ci.course_id = _course_id
      AND p.user_id = _user_id
      AND (NOT _owner_only OR ci.role = 'owner')
  )
  OR EXISTS (
    -- legacy: courses.teacher_id direct link (owner)
    SELECT 1 FROM public.courses c
    JOIN public.profiles p ON p.id = c.teacher_id
    WHERE c.id = _course_id
      AND p.user_id = _user_id
  );
$$;

-- 5. Extend RLS on course-related tables so co-instructors gain access.
-- courses table: add co-instructor UPDATE (owners only, but including new join)
DROP POLICY IF EXISTS "Instructors can update their courses" ON public.courses;
CREATE POLICY "Instructors can update their courses"
  ON public.courses FOR UPDATE
  USING (public.is_course_instructor(auth.uid(), id, false))
  WITH CHECK (public.is_course_instructor(auth.uid(), id, false));

-- videos: co-instructors can manage
DROP POLICY IF EXISTS "Instructors manage videos of their courses" ON public.videos;
CREATE POLICY "Instructors manage videos of their courses"
  ON public.videos FOR ALL
  USING (public.is_course_instructor(auth.uid(), course_id, false))
  WITH CHECK (public.is_course_instructor(auth.uid(), course_id, false));

-- course_modules: co-instructors can manage
DROP POLICY IF EXISTS "Instructors manage modules of their courses" ON public.course_modules;
CREATE POLICY "Instructors manage modules of their courses"
  ON public.course_modules FOR ALL
  USING (public.is_course_instructor(auth.uid(), course_id, false))
  WITH CHECK (public.is_course_instructor(auth.uid(), course_id, false));

-- live_classes
DROP POLICY IF EXISTS "Instructors manage live classes" ON public.live_classes;
CREATE POLICY "Instructors manage live classes"
  ON public.live_classes FOR ALL
  USING (public.is_course_instructor(auth.uid(), course_id, false))
  WITH CHECK (public.is_course_instructor(auth.uid(), course_id, false));

-- recorded_classes (via live_class_id -> course_id)
DROP POLICY IF EXISTS "Instructors manage recordings" ON public.recorded_classes;
CREATE POLICY "Instructors manage recordings"
  ON public.recorded_classes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.live_classes lc
      WHERE lc.id = recorded_classes.live_class_id
        AND public.is_course_instructor(auth.uid(), lc.course_id, false)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.live_classes lc
      WHERE lc.id = recorded_classes.live_class_id
        AND public.is_course_instructor(auth.uid(), lc.course_id, false)
    )
  );

-- 6. Backfill existing courses.teacher_id as owner in course_instructors
INSERT INTO public.course_instructors (course_id, instructor_id, role, order_index)
SELECT c.id, p.linked_team_member_id, 'owner', 0
FROM public.courses c
JOIN public.profiles p ON p.id = c.teacher_id
WHERE p.linked_team_member_id IS NOT NULL
ON CONFLICT (course_id, instructor_id) DO NOTHING;

-- 7. Backfill trainer_name (comma-separated) → co_instructors, matching team_members by token overlap
DO $$
DECLARE
  c record;
  raw_name text;
  clean_name text;
  found_id uuid;
BEGIN
  FOR c IN SELECT id, trainer_name FROM public.courses WHERE trainer_name IS NOT NULL AND trainer_name <> '' LOOP
    FOR raw_name IN
      SELECT trim(unnest(string_to_array(c.trainer_name, ',')))
    LOOP
      -- strip common prefixes
      clean_name := regexp_replace(raw_name, '^(md\.?|mr\.?|mrs\.?|ms\.?|dr\.?)\s+', '', 'i');
      IF clean_name = '' THEN CONTINUE; END IF;

      SELECT id INTO found_id
      FROM public.team_members
      WHERE lower(name) = lower(raw_name)
         OR lower(name) LIKE '%' || lower(clean_name) || '%'
         OR lower(clean_name) LIKE '%' || lower(name) || '%'
      ORDER BY
        CASE WHEN lower(name) = lower(raw_name) THEN 0
             WHEN lower(name) = lower(clean_name) THEN 1
             ELSE 2 END
      LIMIT 1;

      IF found_id IS NOT NULL THEN
        INSERT INTO public.course_instructors (course_id, instructor_id, role)
        VALUES (c.id, found_id, 'co_instructor')
        ON CONFLICT (course_id, instructor_id) DO NOTHING;
      END IF;
    END LOOP;
  END LOOP;
END $$;

-- 8. Mark team members currently linked to any teacher profile OR referenced by any course as 'learn' scope
UPDATE public.team_members tm
SET site_scope = 'both'
WHERE site_scope = 'agency'
  AND (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.linked_team_member_id = tm.id)
    OR EXISTS (SELECT 1 FROM public.course_instructors ci WHERE ci.instructor_id = tm.id)
  );
