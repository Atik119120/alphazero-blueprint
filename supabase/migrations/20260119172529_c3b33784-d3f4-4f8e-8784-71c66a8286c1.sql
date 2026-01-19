-- Create a function for admins to promote users (callable via RPC)
CREATE OR REPLACE FUNCTION public.make_admin(_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id UUID;
BEGIN
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