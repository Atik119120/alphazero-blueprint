
CREATE TABLE public.api_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_email TEXT,
  website_url TEXT,
  api_key_hash TEXT NOT NULL UNIQUE,
  api_key_prefix TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  webhook_url TEXT,
  webhook_secret TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.api_clients TO authenticated;
GRANT ALL ON public.api_clients TO service_role;
ALTER TABLE public.api_clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage api_clients" ON public.api_clients
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.api_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.api_clients(id) ON DELETE CASCADE,
  invoice_id TEXT NOT NULL UNIQUE,
  uddoktapay_invoice_id TEXT,
  external_reference TEXT,
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'BDT',
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  transaction_id TEXT,
  payment_method TEXT,
  sender_number TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  redirect_url TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.api_payments TO authenticated;
GRANT ALL ON public.api_payments TO service_role;
ALTER TABLE public.api_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view api_payments" ON public.api_payments
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_api_payments_client ON public.api_payments(client_id);
CREATE INDEX idx_api_payments_status ON public.api_payments(status);

CREATE TRIGGER update_api_clients_updated_at BEFORE UPDATE ON public.api_clients
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_api_payments_updated_at BEFORE UPDATE ON public.api_payments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
