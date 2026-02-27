
-- Create lesson_comments table for Q&A system
CREATE TABLE public.lesson_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.lesson_comments(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_lesson_comments_video ON public.lesson_comments(video_id);
CREATE INDEX idx_lesson_comments_course ON public.lesson_comments(course_id);
CREATE INDEX idx_lesson_comments_user ON public.lesson_comments(user_id);
CREATE INDEX idx_lesson_comments_parent ON public.lesson_comments(parent_id);

-- Enable RLS
ALTER TABLE public.lesson_comments ENABLE ROW LEVEL SECURITY;

-- Students can view comments on their accessible courses
CREATE POLICY "Users can view comments on accessible courses"
  ON public.lesson_comments FOR SELECT
  USING (
    has_role(auth.uid(), 'admin'::app_role) 
    OR user_has_course_access(auth.uid(), course_id)
  );

-- Students can insert their own comments
CREATE POLICY "Users can insert their own comments"
  ON public.lesson_comments FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    AND user_has_course_access(auth.uid(), course_id)
  );

-- Admins can manage all comments
CREATE POLICY "Admins can manage all comments"
  ON public.lesson_comments FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Users can delete their own comments
CREATE POLICY "Users can delete their own comments"
  ON public.lesson_comments FOR DELETE
  USING (auth.uid() = user_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.lesson_comments;
