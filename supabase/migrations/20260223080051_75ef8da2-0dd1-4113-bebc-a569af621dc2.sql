-- Create course_topics table for organizing videos by topic
CREATE TABLE public.course_topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.course_topics ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Admins can manage all topics" ON public.course_topics FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Teachers can manage their course topics" ON public.course_topics FOR ALL USING (
  EXISTS (SELECT 1 FROM courses WHERE courses.id = course_topics.course_id AND courses.teacher_id = (SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()))
);
CREATE POLICY "Users with course access can view topics" ON public.course_topics FOR SELECT USING (
  has_role(auth.uid(), 'admin'::app_role) OR user_has_course_access(auth.uid(), course_id)
);

-- Add topic_id to videos table
ALTER TABLE public.videos ADD COLUMN topic_id UUID REFERENCES public.course_topics(id) ON DELETE SET NULL;