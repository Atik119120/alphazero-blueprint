-- Add price column to courses table
ALTER TABLE public.courses 
ADD COLUMN price DECIMAL(10,2) DEFAULT 0;

-- Add a comment for clarity
COMMENT ON COLUMN public.courses.price IS 'Course price in BDT';