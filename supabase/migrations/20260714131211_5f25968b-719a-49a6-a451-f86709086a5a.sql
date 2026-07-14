
-- LIVE CLASSES
CREATE TABLE public.live_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_date DATE NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  youtube_url TEXT NOT NULL,
  youtube_video_id TEXT,
  google_meet_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  recording_url TEXT,
  recording_video_id TEXT,
  recording_available BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.live_classes TO authenticated;
GRANT ALL ON public.live_classes TO service_role;

ALTER TABLE public.live_classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enrolled students can view published live classes"
ON public.live_classes FOR SELECT TO authenticated
USING (
  is_published = true
  AND public.user_has_course_access(auth.uid(), course_id)
);

CREATE POLICY "Teachers can view their own live classes"
ON public.live_classes FOR SELECT TO authenticated
USING (teacher_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can create live classes"
ON public.live_classes FOR INSERT TO authenticated
WITH CHECK (
  teacher_id = auth.uid()
  AND (public.is_teacher(auth.uid()) OR public.has_role(auth.uid(), 'admin'))
);

CREATE POLICY "Teachers can update their own live classes"
ON public.live_classes FOR UPDATE TO authenticated
USING (teacher_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (teacher_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can delete their own live classes"
ON public.live_classes FOR DELETE TO authenticated
USING (teacher_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_live_classes_course ON public.live_classes(course_id);
CREATE INDEX idx_live_classes_teacher ON public.live_classes(teacher_id);
CREATE INDEX idx_live_classes_start ON public.live_classes(start_time);

CREATE TRIGGER trg_live_classes_updated
BEFORE UPDATE ON public.live_classes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ATTENDANCE
CREATE TABLE public.live_class_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  live_class_id UUID NOT NULL REFERENCES public.live_classes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  join_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'joined',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (live_class_id, user_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.live_class_attendance TO authenticated;
GRANT ALL ON public.live_class_attendance TO service_role;

ALTER TABLE public.live_class_attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students insert their own attendance"
ON public.live_class_attendance FOR INSERT TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND public.user_has_course_access(auth.uid(), course_id)
);

CREATE POLICY "Students view their own attendance"
ON public.live_class_attendance FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Teachers view attendance of their live classes"
ON public.live_class_attendance FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.live_classes lc
    WHERE lc.id = live_class_id
      AND (lc.teacher_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  )
);

CREATE INDEX idx_attendance_class ON public.live_class_attendance(live_class_id);
CREATE INDEX idx_attendance_user ON public.live_class_attendance(user_id);

-- RECORDED CLASSES
CREATE TABLE public.recorded_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  live_class_id UUID REFERENCES public.live_classes(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  youtube_video_id TEXT NOT NULL,
  video_url TEXT NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.recorded_classes TO authenticated;
GRANT ALL ON public.recorded_classes TO service_role;

ALTER TABLE public.recorded_classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enrolled students view recorded classes"
ON public.recorded_classes FOR SELECT TO authenticated
USING (public.user_has_course_access(auth.uid(), course_id));

CREATE POLICY "Teachers manage recorded classes of their courses"
ON public.recorded_classes FOR ALL TO authenticated
USING (
  public.has_role(auth.uid(), 'admin')
  OR EXISTS (
    SELECT 1 FROM public.live_classes lc
    WHERE lc.id = recorded_classes.live_class_id AND lc.teacher_id = auth.uid()
  )
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin')
  OR EXISTS (
    SELECT 1 FROM public.live_classes lc
    WHERE lc.id = recorded_classes.live_class_id AND lc.teacher_id = auth.uid()
  )
);

CREATE INDEX idx_recorded_course ON public.recorded_classes(course_id);

CREATE TRIGGER trg_recorded_classes_updated
BEFORE UPDATE ON public.recorded_classes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_classes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.recorded_classes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_class_attendance;
