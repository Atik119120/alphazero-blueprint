-- Create enrollment requests table
CREATE TABLE public.enrollment_requests (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    student_email TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, course_id)
);

-- Enable RLS
ALTER TABLE public.enrollment_requests ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own requests"
ON public.enrollment_requests
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own requests"
ON public.enrollment_requests
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all requests"
ON public.enrollment_requests
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_enrollment_requests_updated_at
BEFORE UPDATE ON public.enrollment_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();