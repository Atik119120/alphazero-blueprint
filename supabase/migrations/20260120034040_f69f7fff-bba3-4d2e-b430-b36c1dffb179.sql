-- Fix 1: Add authorization check to get_user_pass_code function
-- Prevents users from querying other users' pass codes
CREATE OR REPLACE FUNCTION public.get_user_pass_code(_user_id uuid)
 RETURNS text
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Only allow users to query their own pass code, or admins
  IF _user_id != auth.uid() AND NOT has_role(auth.uid(), 'admin') THEN
    RETURN NULL;
  END IF;
  
  RETURN (
    SELECT pc.code
    FROM public.pass_codes pc
    JOIN public.profiles p ON p.id = pc.student_id
    WHERE p.user_id = _user_id
      AND pc.is_active = true
    LIMIT 1
  );
END;
$function$;

-- Fix 2: Add authorization check to user_has_course_access function
-- Prevents users from checking other users' course access
CREATE OR REPLACE FUNCTION public.user_has_course_access(_user_id uuid, _course_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Only allow users to check their own course access, or admins
  IF _user_id != auth.uid() AND NOT has_role(auth.uid(), 'admin') THEN
    RETURN false;
  END IF;
  
  RETURN EXISTS (
    SELECT 1
    FROM public.pass_code_courses pcc
    JOIN public.pass_codes pc ON pc.id = pcc.pass_code_id
    JOIN public.profiles p ON p.id = pc.student_id
    WHERE p.user_id = _user_id
      AND pcc.course_id = _course_id
      AND pc.is_active = true
      AND p.is_active = true
  );
END;
$function$;

-- Fix 3: Drop overly permissive pass_codes SELECT policy
DROP POLICY IF EXISTS "Authenticated users can read active pass codes" ON public.pass_codes;

-- Fix 4: Create restrictive policy - students can only see unclaimed codes (for validation) or their own
CREATE POLICY "Students can validate or view their own pass codes"
ON public.pass_codes
FOR SELECT
TO authenticated
USING (
  is_active = true
  AND (
    student_id IS NULL  -- Unclaimed codes for validation
    OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = pass_codes.student_id
      AND p.user_id = auth.uid()
    )  -- Or codes already assigned to this user
  )
);