
-- 1. Create course_modules table
CREATE TABLE public.course_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all modules" ON public.course_modules FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Teachers can manage their course modules" ON public.course_modules FOR ALL USING (
  EXISTS (SELECT 1 FROM courses WHERE courses.id = course_modules.course_id AND courses.teacher_id = (SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()))
);
CREATE POLICY "Users with course access can view modules" ON public.course_modules FOR SELECT USING (
  has_role(auth.uid(), 'admin'::app_role) OR user_has_course_access(auth.uid(), course_id)
);

-- 2. Add module_id and cloudinary fields to videos
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS module_id UUID REFERENCES public.course_modules(id) ON DELETE SET NULL;
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS cloudinary_public_id TEXT;
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS cloudinary_url TEXT;
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS description TEXT;

-- 3. Add last_position to video_progress
ALTER TABLE public.video_progress ADD COLUMN IF NOT EXISTS watched_seconds INTEGER DEFAULT 0;
ALTER TABLE public.video_progress ADD COLUMN IF NOT EXISTS last_position INTEGER DEFAULT 0;

-- 4. Create video_feedback table
CREATE TABLE public.video_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  sentiment TEXT NOT NULL DEFAULT 'positive' CHECK (sentiment IN ('positive', 'negative')),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.video_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can insert their own feedback" ON public.video_feedback FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Students can view their own feedback" ON public.video_feedback FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all feedback" ON public.video_feedback FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Block anonymous access to video_feedback" ON public.video_feedback FOR SELECT USING (false);

-- 5. Enable realtime for video_progress
ALTER PUBLICATION supabase_realtime ADD TABLE public.video_feedback;
