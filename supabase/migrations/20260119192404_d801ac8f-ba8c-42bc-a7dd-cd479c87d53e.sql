-- Create a function to automatically create pass code for new students
CREATE OR REPLACE FUNCTION public.auto_create_pass_code_for_student()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
  new_pass_code_id UUID;
BEGIN
  -- Check if this is a student (check user_roles table)
  IF EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = NEW.user_id AND role = 'student'
  ) THEN
    -- Check if student already has a pass code
    IF NOT EXISTS (
      SELECT 1 FROM public.pass_codes 
      WHERE student_id = NEW.id AND is_active = true
    ) THEN
      -- Generate unique pass code
      LOOP
        new_code := upper(substring(md5(random()::text) from 1 for 8));
        SELECT EXISTS(SELECT 1 FROM public.pass_codes WHERE code = new_code) INTO code_exists;
        EXIT WHEN NOT code_exists;
      END LOOP;
      
      -- Create new pass code for this student
      INSERT INTO public.pass_codes (code, student_id, is_active, created_by)
      VALUES (new_code, NEW.id, true, NEW.user_id);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on profiles table
DROP TRIGGER IF EXISTS trigger_auto_create_pass_code ON public.profiles;
CREATE TRIGGER trigger_auto_create_pass_code
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_create_pass_code_for_student();

-- Also create a trigger for when user_roles is inserted (in case role is added after profile)
CREATE OR REPLACE FUNCTION public.auto_create_pass_code_on_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
  profile_record RECORD;
BEGIN
  -- Only for student role
  IF NEW.role = 'student' THEN
    -- Get the profile
    SELECT * INTO profile_record FROM public.profiles WHERE user_id = NEW.user_id;
    
    IF profile_record IS NOT NULL THEN
      -- Check if student already has a pass code
      IF NOT EXISTS (
        SELECT 1 FROM public.pass_codes 
        WHERE student_id = profile_record.id AND is_active = true
      ) THEN
        -- Generate unique pass code
        LOOP
          new_code := upper(substring(md5(random()::text) from 1 for 8));
          SELECT EXISTS(SELECT 1 FROM public.pass_codes WHERE code = new_code) INTO code_exists;
          EXIT WHEN NOT code_exists;
        END LOOP;
        
        -- Create new pass code for this student
        INSERT INTO public.pass_codes (code, student_id, is_active, created_by)
        VALUES (new_code, profile_record.id, true, NEW.user_id);
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_auto_create_pass_code_on_role ON public.user_roles;
CREATE TRIGGER trigger_auto_create_pass_code_on_role
  AFTER INSERT ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_create_pass_code_on_role();