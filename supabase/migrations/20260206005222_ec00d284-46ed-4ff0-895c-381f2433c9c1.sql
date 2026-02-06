-- Add trainer info columns to courses table
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS trainer_name text,
ADD COLUMN IF NOT EXISTS trainer_image text,
ADD COLUMN IF NOT EXISTS trainer_designation text;

-- Create media_uploads bucket for image uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media-uploads', 
  'media-uploads', 
  true, 
  10485760, -- 10MB max
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[];

-- RLS policy for media-uploads bucket - anyone can view
CREATE POLICY "Public media files are accessible to everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'media-uploads');

-- Authenticated users can upload media
CREATE POLICY "Authenticated users can upload media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media-uploads');

-- Authenticated users can update their own media
CREATE POLICY "Users can update their own media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'media-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Authenticated users can delete their own media
CREATE POLICY "Users can delete their own media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);