-- Create notices table for teacher announcements
CREATE TABLE public.notices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  is_global boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create notice_reads table to track who has read notices
CREATE TABLE public.notice_reads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  notice_id uuid NOT NULL REFERENCES public.notices(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  read_at timestamptz DEFAULT now(),
  UNIQUE(notice_id, user_id)
);

-- Create chat_rooms table for group chats
CREATE TABLE public.chat_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
  name text NOT NULL,
  room_type text NOT NULL DEFAULT 'group' CHECK (room_type IN ('group', 'direct')),
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create chat_room_members table
CREATE TABLE public.chat_room_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(room_id, user_id)
);

-- Create chat_messages table
CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create disposable_email_domains table
CREATE TABLE public.disposable_email_domains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Insert common disposable email domains
INSERT INTO public.disposable_email_domains (domain) VALUES
('tempmail.com'),
('temp-mail.org'),
('guerrillamail.com'),
('10minutemail.com'),
('mailinator.com'),
('throwaway.email'),
('fakeinbox.com'),
('yopmail.com'),
('trashmail.com'),
('getairmail.com'),
('mohmal.com'),
('tempail.com'),
('emailondeck.com'),
('getnada.com'),
('discard.email'),
('maildrop.cc'),
('mintemail.com'),
('tempinbox.com'),
('sharklasers.com'),
('spam4.me');

-- Enable RLS on all new tables
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notice_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_room_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disposable_email_domains ENABLE ROW LEVEL SECURITY;

-- Notices RLS policies
CREATE POLICY "Teachers can create notices for their courses"
ON public.notices FOR INSERT
WITH CHECK (
  teacher_id = (SELECT id FROM profiles WHERE user_id = auth.uid())
  AND (course_id IS NULL OR EXISTS (
    SELECT 1 FROM courses WHERE id = course_id AND teacher_id = (SELECT id FROM profiles WHERE user_id = auth.uid())
  ))
);

CREATE POLICY "Teachers can update their notices"
ON public.notices FOR UPDATE
USING (teacher_id = (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Teachers can delete their notices"
ON public.notices FOR DELETE
USING (teacher_id = (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage all notices"
ON public.notices FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can view notices for their courses"
ON public.notices FOR SELECT
USING (
  has_role(auth.uid(), 'admin') OR
  teacher_id = (SELECT id FROM profiles WHERE user_id = auth.uid()) OR
  (course_id IS NULL AND is_global = true) OR
  EXISTS (
    SELECT 1 FROM pass_code_courses pcc
    JOIN pass_codes pc ON pc.id = pcc.pass_code_id
    JOIN profiles p ON p.id = pc.student_id
    WHERE pcc.course_id = notices.course_id AND p.user_id = auth.uid()
  )
);

-- Notice reads RLS
CREATE POLICY "Users can mark notices as read"
ON public.notice_reads FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own reads"
ON public.notice_reads FOR SELECT
USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'));

-- Chat rooms RLS
CREATE POLICY "Admins can manage all chat rooms"
ON public.chat_rooms FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can create chat rooms for their courses"
ON public.chat_rooms FOR INSERT
WITH CHECK (
  created_by = (SELECT id FROM profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Members can view their chat rooms"
ON public.chat_rooms FOR SELECT
USING (
  has_role(auth.uid(), 'admin') OR
  created_by = (SELECT id FROM profiles WHERE user_id = auth.uid()) OR
  EXISTS (
    SELECT 1 FROM chat_room_members WHERE room_id = chat_rooms.id AND user_id = auth.uid()
  )
);

-- Chat room members RLS
CREATE POLICY "Admins can manage all members"
ON public.chat_room_members FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Room creators can add members"
ON public.chat_room_members FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM chat_rooms WHERE id = room_id AND created_by = (SELECT id FROM profiles WHERE user_id = auth.uid())
  ) OR
  user_id = auth.uid()
);

CREATE POLICY "Members can view room members"
ON public.chat_room_members FOR SELECT
USING (
  has_role(auth.uid(), 'admin') OR
  EXISTS (
    SELECT 1 FROM chat_room_members crm WHERE crm.room_id = chat_room_members.room_id AND crm.user_id = auth.uid()
  )
);

-- Chat messages RLS
CREATE POLICY "Admins can manage all messages"
ON public.chat_messages FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Room members can send messages"
ON public.chat_messages FOR INSERT
WITH CHECK (
  sender_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM chat_room_members WHERE room_id = chat_messages.room_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Room members can view messages"
ON public.chat_messages FOR SELECT
USING (
  has_role(auth.uid(), 'admin') OR
  EXISTS (
    SELECT 1 FROM chat_room_members WHERE room_id = chat_messages.room_id AND user_id = auth.uid()
  )
);

-- Disposable email domains - anyone can read for validation
CREATE POLICY "Anyone can check disposable domains"
ON public.disposable_email_domains FOR SELECT
USING (true);

CREATE POLICY "Admins can manage disposable domains"
ON public.disposable_email_domains FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Enable realtime for chat messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notices;