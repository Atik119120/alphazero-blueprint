
-- Email threads table for conversations
CREATE TABLE public.email_threads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subject TEXT NOT NULL,
  external_email TEXT NOT NULL,
  external_name TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'pending', 'closed')),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Email messages table
CREATE TABLE public.email_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id UUID NOT NULL REFERENCES public.email_threads(id) ON DELETE CASCADE,
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  from_email TEXT NOT NULL,
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_text TEXT,
  body_html TEXT,
  sender_identity TEXT DEFAULT 'noreply',
  is_read BOOLEAN DEFAULT false,
  resend_email_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Sender identities table
CREATE TABLE public.sender_identities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email_prefix TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default sender identities
INSERT INTO public.sender_identities (name, email_prefix, display_name, description) VALUES
  ('No Reply', 'noreply', 'AlphaZero Academy', 'Automated notifications - no reply expected'),
  ('Support', 'support', 'AlphaZero Support', 'Customer support inquiries'),
  ('Info', 'info', 'AlphaZero Academy', 'General information and announcements'),
  ('Admin', 'admin', 'AlphaZero Admin', 'Administrative communications');

-- Enable RLS
ALTER TABLE public.email_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sender_identities ENABLE ROW LEVEL SECURITY;

-- Policies for admins only
CREATE POLICY "Admins can manage email threads" ON public.email_threads
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can manage email messages" ON public.email_messages
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can view sender identities" ON public.sender_identities
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Indexes for performance
CREATE INDEX idx_email_threads_status ON public.email_threads(status);
CREATE INDEX idx_email_threads_last_message ON public.email_threads(last_message_at DESC);
CREATE INDEX idx_email_messages_thread ON public.email_messages(thread_id);
CREATE INDEX idx_email_messages_created ON public.email_messages(created_at DESC);

-- Trigger to update thread's last_message_at
CREATE OR REPLACE FUNCTION update_thread_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.email_threads 
  SET last_message_at = NEW.created_at, updated_at = now()
  WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_email_message_insert
  AFTER INSERT ON public.email_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_thread_last_message();
