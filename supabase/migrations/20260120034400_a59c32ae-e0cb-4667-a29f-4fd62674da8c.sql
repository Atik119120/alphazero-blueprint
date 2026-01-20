-- Defense-in-depth: Add explicit anonymous blocking policies to all sensitive tables
-- These policies ensure unauthenticated users cannot access data even if other policies are misconfigured

-- 1. Certificates table - block anonymous access
CREATE POLICY "Block anonymous access to certificates"
ON public.certificates
FOR SELECT
TO anon
USING (false);

-- 2. Course completions table - block anonymous access  
CREATE POLICY "Block anonymous access to course_completions"
ON public.course_completions
FOR SELECT
TO anon
USING (false);

-- 3. Video progress table - block anonymous access
CREATE POLICY "Block anonymous access to video_progress"
ON public.video_progress
FOR SELECT
TO anon
USING (false);

-- 4. User roles table - block anonymous access
CREATE POLICY "Block anonymous access to user_roles"
ON public.user_roles
FOR SELECT
TO anon
USING (false);

-- 5. Videos table - block anonymous access
CREATE POLICY "Block anonymous access to videos"
ON public.videos
FOR SELECT
TO anon
USING (false);

-- 6. Video materials table - block anonymous access
CREATE POLICY "Block anonymous access to video_materials"
ON public.video_materials
FOR SELECT
TO anon
USING (false);

-- 7. Pass code courses table - block anonymous access
CREATE POLICY "Block anonymous access to pass_code_courses"
ON public.pass_code_courses
FOR SELECT
TO anon
USING (false);

-- 8. Profiles table - block anonymous access (defense-in-depth)
CREATE POLICY "Block anonymous access to profiles"
ON public.profiles
FOR SELECT
TO anon
USING (false);

-- 9. Enrollment requests table - block anonymous access
CREATE POLICY "Block anonymous access to enrollment_requests"
ON public.enrollment_requests
FOR SELECT
TO anon
USING (false);

-- 10. Pass codes table - block anonymous access
CREATE POLICY "Block anonymous access to pass_codes"
ON public.pass_codes
FOR SELECT
TO anon
USING (false);

-- Fix misleading certificate policy name by dropping and recreating with clearer name
DROP POLICY IF EXISTS "Certificate verification by ID only" ON public.certificates;
CREATE POLICY "Owners and admins can view certificates"
ON public.certificates
FOR SELECT
USING ((auth.uid() = user_id) OR has_role(auth.uid(), 'admin'::app_role));