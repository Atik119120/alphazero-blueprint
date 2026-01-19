-- Create video_materials table for PDFs, notes, and documents
CREATE TABLE public.video_materials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  material_type TEXT NOT NULL DEFAULT 'pdf', -- 'pdf', 'doc', 'note'
  material_url TEXT, -- URL for PDF/doc files
  note_content TEXT, -- For text notes
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.video_materials ENABLE ROW LEVEL SECURITY;

-- Admins can manage all materials
CREATE POLICY "Admins can manage all materials" 
ON public.video_materials 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Users can view materials for courses they have access to
CREATE POLICY "Users can view materials of accessible videos" 
ON public.video_materials 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.videos v
    WHERE v.id = video_materials.video_id
    AND (has_role(auth.uid(), 'admin'::app_role) OR user_has_course_access(auth.uid(), v.course_id))
  )
);

-- Create trigger for updating updated_at
CREATE TRIGGER update_video_materials_updated_at
BEFORE UPDATE ON public.video_materials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();