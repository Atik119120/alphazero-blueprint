
-- Gallery videos table for admin to upload and manage videos independently
CREATE TABLE IF NOT EXISTS public.gallery_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  video_type TEXT NOT NULL DEFAULT 'cloudinary',
  cloudinary_public_id TEXT,
  cloudinary_url TEXT,
  thumbnail_url TEXT,
  duration_seconds INTEGER DEFAULT 0,
  file_size_bytes BIGINT DEFAULT 0,
  uploaded_by UUID REFERENCES auth.users,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.gallery_videos ENABLE ROW LEVEL SECURITY;

-- Only admins can manage gallery
CREATE POLICY "Admins can do everything on gallery_videos"
  ON public.gallery_videos FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Teachers can view gallery
CREATE POLICY "Teachers can view gallery_videos"
  ON public.gallery_videos FOR SELECT
  USING (public.has_role(auth.uid(), 'teacher'));
