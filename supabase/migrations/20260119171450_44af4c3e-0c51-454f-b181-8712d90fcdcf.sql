-- Create app role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'student');

-- Create user roles table (security best practice - roles in separate table)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'student',
    UNIQUE (user_id, role)
);

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    pass_code TEXT UNIQUE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create courses table
CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create videos table (ordered within courses)
CREATE TABLE public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    video_url TEXT NOT NULL,
    video_type TEXT DEFAULT 'youtube', -- youtube, vimeo
    duration_seconds INTEGER DEFAULT 0,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create pass codes table (for managing student access)
CREATE TABLE public.pass_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create pass code course assignments (many-to-many)
CREATE TABLE public.pass_code_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pass_code_id UUID REFERENCES public.pass_codes(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (pass_code_id, course_id)
);

-- Create video progress table
CREATE TABLE public.video_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE NOT NULL,
    progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
    is_completed BOOLEAN DEFAULT false,
    last_watched_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, video_id)
);

-- Create course completions table
CREATE TABLE public.course_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    certificate_id TEXT UNIQUE NOT NULL,
    UNIQUE (user_id, course_id)
);

-- Create certificates table
CREATE TABLE public.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certificate_id TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    student_name TEXT NOT NULL,
    course_name TEXT NOT NULL,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pass_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pass_code_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to get user's pass code
CREATE OR REPLACE FUNCTION public.get_user_pass_code(_user_id UUID)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT pc.code
  FROM public.pass_codes pc
  JOIN public.profiles p ON p.id = pc.student_id
  WHERE p.user_id = _user_id
    AND pc.is_active = true
  LIMIT 1
$$;

-- Function to check if user has access to a course
CREATE OR REPLACE FUNCTION public.user_has_course_access(_user_id UUID, _course_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.pass_code_courses pcc
    JOIN public.pass_codes pc ON pc.id = pcc.pass_code_id
    JOIN public.profiles p ON p.id = pc.student_id
    WHERE p.user_id = _user_id
      AND pcc.course_id = _course_id
      AND pc.is_active = true
      AND p.is_active = true
  )
$$;

-- User roles policies
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all profiles"
ON public.profiles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Courses policies
CREATE POLICY "Anyone can view published courses"
ON public.courses FOR SELECT
USING (is_published = true);

CREATE POLICY "Admins can manage all courses"
ON public.courses FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Videos policies
CREATE POLICY "Users can view videos of accessible courses"
ON public.videos FOR SELECT
USING (
  public.has_role(auth.uid(), 'admin') OR
  public.user_has_course_access(auth.uid(), course_id)
);

CREATE POLICY "Admins can manage all videos"
ON public.videos FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Pass codes policies
CREATE POLICY "Students can view their own pass code"
ON public.pass_codes FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = student_id AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all pass codes"
ON public.pass_codes FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Pass code courses policies
CREATE POLICY "Students can view their assigned courses"
ON public.pass_code_courses FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.pass_codes pc
    JOIN public.profiles p ON p.id = pc.student_id
    WHERE pc.id = pass_code_id AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage course assignments"
ON public.pass_code_courses FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Video progress policies
CREATE POLICY "Users can view their own progress"
ON public.video_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
ON public.video_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can modify their own progress"
ON public.video_progress FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all progress"
ON public.video_progress FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Course completions policies
CREATE POLICY "Users can view their own completions"
ON public.course_completions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own completions"
ON public.course_completions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all completions"
ON public.course_completions FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Certificates policies
CREATE POLICY "Users can view their own certificates"
ON public.certificates FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can verify certificates by ID"
ON public.certificates FOR SELECT
USING (true);

CREATE POLICY "Users can create their own certificates"
ON public.certificates FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage certificates"
ON public.certificates FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Updated at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
BEFORE UPDATE ON public.courses
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_videos_updated_at
BEFORE UPDATE ON public.videos
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pass_codes_updated_at
BEFORE UPDATE ON public.pass_codes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate unique pass code
CREATE OR REPLACE FUNCTION public.generate_pass_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    new_code := upper(substring(md5(random()::text) from 1 for 8));
    SELECT EXISTS(SELECT 1 FROM public.pass_codes WHERE code = new_code) INTO code_exists;
    EXIT WHEN NOT code_exists;
  END LOOP;
  RETURN new_code;
END;
$$;

-- Function to generate unique certificate ID
CREATE OR REPLACE FUNCTION public.generate_certificate_id()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  new_id TEXT;
  id_exists BOOLEAN;
BEGIN
  LOOP
    new_id := 'CERT-' || upper(substring(md5(random()::text) from 1 for 12));
    SELECT EXISTS(SELECT 1 FROM public.certificates WHERE certificate_id = new_id) INTO id_exists;
    EXIT WHEN NOT id_exists;
  END LOOP;
  RETURN new_id;
END;
$$;

-- Create indexes for better performance
CREATE INDEX idx_videos_course_order ON public.videos(course_id, order_index);
CREATE INDEX idx_video_progress_user ON public.video_progress(user_id);
CREATE INDEX idx_pass_codes_code ON public.pass_codes(code);
CREATE INDEX idx_certificates_certificate_id ON public.certificates(certificate_id);