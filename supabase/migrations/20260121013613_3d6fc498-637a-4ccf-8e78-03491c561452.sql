-- Fix 1: Add authorization check to make_admin function
CREATE OR REPLACE FUNCTION public.make_admin(_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- CRITICAL: Check if caller is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can promote users to admin role';
  END IF;
  
  -- Get user_id from profiles
  SELECT user_id INTO target_user_id
  FROM public.profiles
  WHERE email = _email;
  
  IF target_user_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check if already admin
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = target_user_id AND role = 'admin') THEN
    RETURN true;
  END IF;
  
  -- Update role to admin (or insert if not exists)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Remove student role if exists
  DELETE FROM public.user_roles WHERE user_id = target_user_id AND role = 'student';
  
  RETURN true;
END;
$$;

-- Fix 2: Clear any existing plaintext passwords from enrollment_requests
UPDATE public.enrollment_requests 
SET message = CASE 
  WHEN message IS NOT NULL AND message LIKE '%password%' THEN 
    regexp_replace(message, '"password"\s*:\s*"[^"]*"', '"password":"[REDACTED]"', 'g')
  ELSE message
END
WHERE message IS NOT NULL AND message LIKE '%password%';