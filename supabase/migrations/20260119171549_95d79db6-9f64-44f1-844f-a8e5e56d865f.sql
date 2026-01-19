-- Fix search_path for generate_pass_code function
CREATE OR REPLACE FUNCTION public.generate_pass_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    new_code := upper(substring(md5(random()::text) from 1 for 8));
    SELECT EXISTS(SELECT 1 FROM public.pass_codes WHERE code = new_code) INTO code_exists;
    EXIT WHEN NOT code_exists;
  END LOOP;
  RETURN new_code;
END;
$$;

-- Fix search_path for generate_certificate_id function
CREATE OR REPLACE FUNCTION public.generate_certificate_id()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id TEXT;
  id_exists BOOLEAN;
BEGIN
  LOOP
    new_id := 'CERT-' || upper(substring(md5(random()::text) from 1 for 12));
    SELECT EXISTS(SELECT 1 FROM public.certificates WHERE certificate_id = new_id) INTO id_exists;
    EXIT WHEN NOT id_exists;
  END LOOP;
  RETURN new_id;
END;
$$;