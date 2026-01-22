-- Step 2: Add teacher_id to courses table (link courses to teachers)
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS teacher_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS course_type text DEFAULT 'recorded' CHECK (course_type IN ('recorded', 'live', 'free')),
ADD COLUMN IF NOT EXISTS is_approved boolean DEFAULT false;

-- Step 3: Create revenue_records table for tracking all earnings
CREATE TABLE IF NOT EXISTS public.revenue_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  student_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  revenue_type text NOT NULL CHECK (revenue_type IN ('recorded_course', 'free_course', 'live_class', 'paid_work')),
  total_amount numeric NOT NULL DEFAULT 0,
  teacher_share numeric NOT NULL DEFAULT 0,
  agency_share numeric NOT NULL DEFAULT 0,
  teacher_percentage numeric NOT NULL DEFAULT 40,
  agency_percentage numeric NOT NULL DEFAULT 60,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
  paid_work_id uuid,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Step 4: Create paid_works table for agency projects
CREATE TABLE IF NOT EXISTS public.paid_works (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL CHECK (category IN ('design', 'development', 'video', 'other')),
  client_name text,
  total_amount numeric NOT NULL DEFAULT 0,
  assigned_to uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  assigned_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  status text DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed', 'cancelled')),
  deadline timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Step 5: Create support_tickets table
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number text UNIQUE NOT NULL,
  student_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  teacher_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  subject text NOT NULL,
  status text DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority text DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Step 6: Create ticket_messages table for conversation
CREATE TABLE IF NOT EXISTS public.ticket_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid REFERENCES public.support_tickets(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Step 7: Create withdrawal_requests table
CREATE TABLE IF NOT EXISTS public.withdrawal_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL,
  payment_method text NOT NULL CHECK (payment_method IN ('bkash', 'nagad', 'bank')),
  payment_details jsonb,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'paid')),
  admin_notes text,
  processed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Step 8: Add skills column to profiles for teachers
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS skills text[],
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS is_teacher boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS teacher_approved boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS linked_team_member_id uuid REFERENCES public.team_members(id) ON DELETE SET NULL;

-- Step 9: Generate ticket number function
CREATE OR REPLACE FUNCTION public.generate_ticket_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_number text;
  number_exists boolean;
BEGIN
  LOOP
    new_number := 'TKT-' || upper(substring(md5(random()::text) from 1 for 8));
    SELECT EXISTS(SELECT 1 FROM public.support_tickets WHERE ticket_number = new_number) INTO number_exists;
    EXIT WHEN NOT number_exists;
  END LOOP;
  RETURN new_number;
END;
$$;

-- Step 10: Auto-calculate revenue function
CREATE OR REPLACE FUNCTION public.calculate_revenue_split(
  _total_amount numeric,
  _revenue_type text
)
RETURNS TABLE(teacher_share numeric, agency_share numeric, teacher_pct numeric, agency_pct numeric)
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
  t_pct numeric;
  a_pct numeric;
BEGIN
  CASE _revenue_type
    WHEN 'recorded_course' THEN
      t_pct := 40; a_pct := 60;
    WHEN 'live_class' THEN
      t_pct := 70; a_pct := 30;
    WHEN 'paid_work' THEN
      t_pct := 80; a_pct := 20;
    WHEN 'free_course' THEN
      t_pct := 0; a_pct := 0;
    ELSE
      t_pct := 40; a_pct := 60;
  END CASE;
  
  teacher_share := round(_total_amount * t_pct / 100, 2);
  agency_share := round(_total_amount * a_pct / 100, 2);
  teacher_pct := t_pct;
  agency_pct := a_pct;
  
  RETURN NEXT;
END;
$$;

-- Step 11: Check if user is teacher function
CREATE OR REPLACE FUNCTION public.is_teacher(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'teacher'
  )
$$;

-- Step 12: Enable RLS on new tables
ALTER TABLE public.revenue_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paid_works ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- Step 13: RLS Policies for revenue_records
CREATE POLICY "Teachers can view their own revenue"
ON public.revenue_records FOR SELECT
USING (teacher_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage all revenue"
ON public.revenue_records FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Block anonymous access to revenue_records"
ON public.revenue_records FOR SELECT
USING (false);

-- Step 14: RLS Policies for paid_works
CREATE POLICY "Assigned members can view their work"
ON public.paid_works FOR SELECT
USING (assigned_to = (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Assigned members can update their work status"
ON public.paid_works FOR UPDATE
USING (assigned_to = (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage all paid works"
ON public.paid_works FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Block anonymous access to paid_works"
ON public.paid_works FOR SELECT
USING (false);

-- Step 15: RLS Policies for support_tickets
CREATE POLICY "Students can view their own tickets"
ON public.support_tickets FOR SELECT
USING (student_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Students can create tickets"
ON public.support_tickets FOR INSERT
WITH CHECK (student_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Teachers can view tickets for their courses"
ON public.support_tickets FOR SELECT
USING (teacher_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Teachers can update tickets for their courses"
ON public.support_tickets FOR UPDATE
USING (teacher_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage all tickets"
ON public.support_tickets FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Block anonymous access to support_tickets"
ON public.support_tickets FOR SELECT
USING (false);

-- Step 16: RLS Policies for ticket_messages
CREATE POLICY "Ticket participants can view messages"
ON public.ticket_messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.support_tickets st
    WHERE st.id = ticket_messages.ticket_id
    AND (
      st.student_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
      OR st.teacher_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
      OR has_role(auth.uid(), 'admin')
    )
  )
);

CREATE POLICY "Ticket participants can send messages"
ON public.ticket_messages FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.support_tickets st
    WHERE st.id = ticket_messages.ticket_id
    AND (
      st.student_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
      OR st.teacher_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
      OR has_role(auth.uid(), 'admin')
    )
  )
);

CREATE POLICY "Admins can manage all messages"
ON public.ticket_messages FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Block anonymous access to ticket_messages"
ON public.ticket_messages FOR SELECT
USING (false);

-- Step 17: RLS Policies for withdrawal_requests
CREATE POLICY "Teachers can view their own withdrawals"
ON public.withdrawal_requests FOR SELECT
USING (teacher_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Teachers can create withdrawal requests"
ON public.withdrawal_requests FOR INSERT
WITH CHECK (teacher_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage all withdrawals"
ON public.withdrawal_requests FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Block anonymous access to withdrawal_requests"
ON public.withdrawal_requests FOR SELECT
USING (false);

-- Step 18: Update courses RLS for teachers
CREATE POLICY "Teachers can view their own courses"
ON public.courses FOR SELECT
USING (teacher_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Teachers can update their own courses"
ON public.courses FOR UPDATE
USING (teacher_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Teachers can create courses"
ON public.courses FOR INSERT
WITH CHECK (
  is_teacher(auth.uid()) AND 
  teacher_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

-- Step 19: Triggers for updated_at
CREATE TRIGGER update_revenue_records_updated_at
BEFORE UPDATE ON public.revenue_records
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_paid_works_updated_at
BEFORE UPDATE ON public.paid_works
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at
BEFORE UPDATE ON public.support_tickets
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_withdrawal_requests_updated_at
BEFORE UPDATE ON public.withdrawal_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();