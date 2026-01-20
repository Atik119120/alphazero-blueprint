-- Drop the unique constraint on user_id, course_id if exists
ALTER TABLE public.enrollment_requests DROP CONSTRAINT IF EXISTS enrollment_requests_user_id_course_id_key;

-- Add a new unique constraint on student_email and course_id instead
-- This makes more sense since we check by email for pending requests
ALTER TABLE public.enrollment_requests ADD CONSTRAINT enrollment_requests_email_course_status_key UNIQUE (student_email, course_id, status);