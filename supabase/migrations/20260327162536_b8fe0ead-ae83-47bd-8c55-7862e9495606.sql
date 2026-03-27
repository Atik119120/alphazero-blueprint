
-- Create student_courses table for direct course assignment (replacing pass_codes system)
CREATE TABLE public.student_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  assigned_by UUID,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(user_id, course_id)
);

-- Enable RLS
ALTER TABLE public.student_courses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage all student courses"
  ON public.student_courses FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can view their own courses"
  ON public.student_courses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Teachers can view students in their courses"
  ON public.student_courses FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.courses c
    WHERE c.id = student_courses.course_id
    AND c.teacher_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  ));

CREATE POLICY "Block anonymous access"
  ON public.student_courses FOR SELECT
  TO anon
  USING (false);

-- Update user_has_course_access function to use student_courses instead of pass_codes
CREATE OR REPLACE FUNCTION public.user_has_course_access(_user_id uuid, _course_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only allow users to check their own course access, or admins
  IF _user_id != auth.uid() AND NOT has_role(auth.uid(), 'admin') THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.student_courses sc
    WHERE sc.user_id = _user_id
      AND sc.course_id = _course_id
      AND sc.is_active = true
  );
END;
$$;

-- Migrate existing data from pass_codes system to student_courses
INSERT INTO public.student_courses (user_id, course_id, assigned_at, is_active)
SELECT DISTINCT p.user_id, pcc.course_id, pcc.assigned_at, true
FROM public.pass_code_courses pcc
JOIN public.pass_codes pc ON pc.id = pcc.pass_code_id
JOIN public.profiles p ON p.id = pc.student_id
WHERE pc.is_active = true
  AND pc.student_id IS NOT NULL
ON CONFLICT (user_id, course_id) DO NOTHING;

-- Enable realtime for student_courses
ALTER PUBLICATION supabase_realtime ADD TABLE public.student_courses;
