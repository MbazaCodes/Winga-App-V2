-- ─── Payments table ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.payments (
  id             UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id     UUID    REFERENCES public.requests(id) ON DELETE CASCADE,
  customer_id    UUID    REFERENCES public.users(id),
  amount         INTEGER NOT NULL,
  provider       TEXT    NOT NULL CHECK (provider IN ('mpesa','airtel','tigo','halopesa')),
  status         TEXT    NOT NULL CHECK (status IN ('pending','success','failed','cancelled')),
  transaction_id TEXT,
  receipt        TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Customers see own payments
CREATE POLICY "customers_own_payments" ON public.payments
  FOR SELECT USING (customer_id = auth.uid());

-- Service role (admin) sees all
CREATE POLICY "service_role_all_payments" ON public.payments
  FOR ALL USING (auth.role() = 'service_role');

-- ─── Admins table ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.admins (
  id         UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID    REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  name       TEXT    NOT NULL,
  email      TEXT    NOT NULL UNIQUE,
  role       TEXT    NOT NULL DEFAULT 'support'
             CHECK (role IN ('super_admin','ops','finance','support')),
  is_active  BOOLEAN NOT NULL DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Only service role can manage admins
CREATE POLICY "service_role_admins" ON public.admins
  FOR ALL USING (auth.role() = 'service_role');

-- ─── Add payment_status to requests ───────────────────────────────────────
ALTER TABLE public.requests
  ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'unpaid'
    CHECK (payment_status IN ('unpaid','pending','paid','refunded'));

-- ─── is_banned on users ────────────────────────────────────────────────────
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS is_banned     BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_suspended  BOOLEAN DEFAULT false;

-- ─── Seed first super admin (David Mbazza) ────────────────────────────────
-- Run after creating the auth user manually in Supabase Dashboard:
-- INSERT INTO public.admins (user_id, name, email, role)
-- VALUES ('YOUR_AUTH_USER_ID', 'David Mbazza', 'david@winga.app', 'super_admin');
