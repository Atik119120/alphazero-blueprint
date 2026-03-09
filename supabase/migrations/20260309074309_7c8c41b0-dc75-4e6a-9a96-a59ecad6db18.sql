
-- Create coupons table
CREATE TABLE public.coupons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL DEFAULT 'percentage', -- 'percentage' or 'fixed'
  discount_value NUMERIC NOT NULL DEFAULT 0,
  max_uses INTEGER DEFAULT NULL,
  used_count INTEGER NOT NULL DEFAULT 0,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE DEFAULT NULL, -- NULL means all courses
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Admin can manage all coupons
CREATE POLICY "Admins can manage all coupons"
  ON public.coupons FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Authenticated users can view active coupons (for validation)
CREATE POLICY "Authenticated users can view active coupons"
  ON public.coupons FOR SELECT
  TO authenticated
  USING (is_active = true);
