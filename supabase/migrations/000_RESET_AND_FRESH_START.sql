-- ════════════════════════════════════════════════════════════════════════════
-- WINGA APP — COMPLETE RESET + FRESH MIGRATION
-- Run this ONCE in Supabase Dashboard → SQL Editor
-- Project: kevdbsyiqelksxvmuped
-- ════════════════════════════════════════════════════════════════════════════

-- ─── STEP 1: DROP EVERYTHING ─────────────────────────────────────────────────
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
GRANT ALL ON SCHEMA public TO anon;
GRANT ALL ON SCHEMA public TO authenticated;
GRANT ALL ON SCHEMA public TO service_role;

-- Required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- for fast text search


-- ═══════════════════════════════════════════════════════════════════════════
-- STEP 2: CORE TABLES
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── USERS ───────────────────────────────────────────────────────────────────
CREATE TABLE public.users (
  id                UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone             TEXT        NOT NULL UNIQUE,
  name              TEXT,
  user_type         TEXT        NOT NULL DEFAULT 'customer'
                                CHECK (user_type IN ('customer','winga','admin')),
  profile_image_url TEXT,
  winga_id          TEXT        UNIQUE,            -- e.g. WNGA10001 (Wingas only)
  is_banned         BOOLEAN     NOT NULL DEFAULT false,
  is_suspended      BOOLEAN     NOT NULL DEFAULT false,
  referral_code     TEXT        UNIQUE DEFAULT upper(substr(gen_random_uuid()::text, 1, 8)),
  referred_by       UUID        REFERENCES public.users(id),
  wallet_balance    INTEGER     NOT NULL DEFAULT 0, -- TZS cents
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── WINGAS ──────────────────────────────────────────────────────────────────
CREATE TABLE public.wingas (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID        NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  national_id         TEXT,                        -- NIDA (encrypted at app layer)
  tin_number          TEXT,                        -- TRA TIN (optional)
  city                TEXT        NOT NULL DEFAULT 'Dar es Salaam',
  area                TEXT        NOT NULL DEFAULT '',
  bio                 TEXT,
  specialties         TEXT[]      NOT NULL DEFAULT '{}',
  badge               TEXT        NOT NULL DEFAULT 'starter'
                                  CHECK (badge IN ('starter','mid','verified')),
  rating              DECIMAL(3,2) NOT NULL DEFAULT 0.00,
  total_trips         INTEGER     NOT NULL DEFAULT 0,
  is_online           BOOLEAN     NOT NULL DEFAULT false,
  profile_complete    BOOLEAN     NOT NULL DEFAULT false,
  completion_pct      INTEGER     NOT NULL DEFAULT 0, -- 0-100
  social_instagram    TEXT,
  social_facebook     TEXT,
  social_tiktok       TEXT,
  social_twitter      TEXT,
  social_whatsapp     TEXT,
  points              INTEGER     NOT NULL DEFAULT 0, -- reputation points
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── REQUESTS ────────────────────────────────────────────────────────────────
CREATE TABLE public.requests (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id      UUID        NOT NULL REFERENCES public.users(id),
  winga_id         UUID        REFERENCES public.wingas(id),
  category         TEXT        NOT NULL,
  service_type     TEXT        NOT NULL DEFAULT 'hourly'
                               CHECK (service_type IN ('hourly','half_day','full_day')),
  delivery_method  TEXT        NOT NULL DEFAULT 'with_customer'
                               CHECK (delivery_method IN ('with_customer','delivery','pickup')),
  meeting_point    TEXT        NOT NULL DEFAULT '',
  shopping_area    TEXT        NOT NULL DEFAULT '',
  notes            TEXT,
  status           TEXT        NOT NULL DEFAULT 'searching'
                               CHECK (status IN ('searching','accepted','shopping','completed','cancelled')),
  estimated_price  INTEGER     NOT NULL DEFAULT 5000,  -- TZS
  final_price      INTEGER,
  payment_status   TEXT        NOT NULL DEFAULT 'unpaid'
                               CHECK (payment_status IN ('unpaid','pending','paid','refunded')),
  tip_amount       INTEGER     NOT NULL DEFAULT 0,
  cancelled_by     TEXT        CHECK (cancelled_by IN ('customer','winga','admin')),
  cancel_reason    TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  accepted_at      TIMESTAMPTZ,
  completed_at     TIMESTAMPTZ
);

-- ─── MESSAGES ────────────────────────────────────────────────────────────────
CREATE TABLE public.messages (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id  UUID        NOT NULL REFERENCES public.requests(id) ON DELETE CASCADE,
  sender_id   UUID        NOT NULL REFERENCES public.users(id),
  content     TEXT        NOT NULL,
  read        BOOLEAN     NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── WINGA LOCATIONS (real-time GPS) ─────────────────────────────────────────
CREATE TABLE public.winga_locations (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID         NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  lat         DECIMAL(10,7) NOT NULL,
  lng         DECIMAL(10,7) NOT NULL,
  heading     DECIMAL(5,2),
  speed       DECIMAL(8,2),
  accuracy    DECIMAL(8,2),
  request_id  UUID         REFERENCES public.requests(id) ON DELETE SET NULL,
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─── REVIEWS ─────────────────────────────────────────────────────────────────
CREATE TABLE public.reviews (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id  UUID        NOT NULL UNIQUE REFERENCES public.requests(id) ON DELETE CASCADE,
  customer_id UUID        NOT NULL REFERENCES public.users(id),
  winga_id    UUID        NOT NULL REFERENCES public.wingas(id),
  rating      INTEGER     NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── PAYMENTS ────────────────────────────────────────────────────────────────
CREATE TABLE public.payments (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id     UUID        NOT NULL REFERENCES public.requests(id) ON DELETE CASCADE,
  customer_id    UUID        NOT NULL REFERENCES public.users(id),
  amount         INTEGER     NOT NULL,  -- TZS
  provider       TEXT        NOT NULL CHECK (provider IN ('mpesa','airtel','tigo','halopesa','cash')),
  status         TEXT        NOT NULL DEFAULT 'pending'
                             CHECK (status IN ('pending','success','failed','cancelled')),
  transaction_id TEXT,
  receipt        TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
CREATE TABLE public.notifications (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type       TEXT        NOT NULL,
  title      TEXT        NOT NULL,
  body       TEXT        NOT NULL,
  data       JSONB       DEFAULT '{}',
  read       BOOLEAN     NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── ADMINS ──────────────────────────────────────────────────────────────────
CREATE TABLE public.admins (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  name       TEXT        NOT NULL,
  email      TEXT        NOT NULL UNIQUE,
  role       TEXT        NOT NULL DEFAULT 'support'
             CHECK (role IN ('super_admin','ops','finance','support')),
  is_active  BOOLEAN     NOT NULL DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── REFERRALS ────────────────────────────────────────────────────────────────
CREATE TABLE public.referrals (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID        NOT NULL REFERENCES public.users(id),
  referred_id UUID        NOT NULL REFERENCES public.users(id),
  bonus_paid  BOOLEAN     NOT NULL DEFAULT false,
  bonus_amount INTEGER    NOT NULL DEFAULT 2000,  -- TZS
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── SHOPPING LISTS (Winga can share with customer) ──────────────────────────
CREATE TABLE public.shopping_lists (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id  UUID        NOT NULL UNIQUE REFERENCES public.requests(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.shopping_items (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  shopping_list_id UUID        NOT NULL REFERENCES public.shopping_lists(id) ON DELETE CASCADE,
  name             TEXT        NOT NULL,
  quantity         TEXT        NOT NULL DEFAULT '1',
  unit             TEXT,
  price            INTEGER,
  found            BOOLEAN     NOT NULL DEFAULT false,
  photo_url        TEXT,
  notes            TEXT,
  sort_order       INTEGER     NOT NULL DEFAULT 0
);


-- ═══════════════════════════════════════════════════════════════════════════
-- STEP 3: INDEXES
-- ═══════════════════════════════════════════════════════════════════════════

CREATE INDEX idx_requests_customer    ON public.requests(customer_id);
CREATE INDEX idx_requests_winga       ON public.requests(winga_id);
CREATE INDEX idx_requests_status      ON public.requests(status);
CREATE INDEX idx_requests_created     ON public.requests(created_at DESC);
CREATE INDEX idx_messages_request     ON public.messages(request_id);
CREATE INDEX idx_messages_sender      ON public.messages(sender_id);
CREATE INDEX idx_messages_created     ON public.messages(created_at);
CREATE INDEX idx_notifications_user   ON public.notifications(user_id, read, created_at DESC);
CREATE INDEX idx_reviews_winga        ON public.reviews(winga_id);
CREATE INDEX idx_winga_locations_pos  ON public.winga_locations(lat, lng);
CREATE INDEX idx_winga_locations_upd  ON public.winga_locations(updated_at DESC);
CREATE INDEX idx_wingas_badge         ON public.wingas(badge);
CREATE INDEX idx_wingas_online        ON public.wingas(is_online) WHERE is_online = true;
CREATE INDEX idx_users_phone          ON public.users(phone);
CREATE INDEX idx_users_type           ON public.users(user_type);


-- ═══════════════════════════════════════════════════════════════════════════
-- STEP 4: FUNCTIONS + TRIGGERS
-- ═══════════════════════════════════════════════════════════════════════════

-- Auto updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_users_updated    BEFORE UPDATE ON public.users    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_wingas_updated   BEFORE UPDATE ON public.wingas   FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_requests_updated BEFORE UPDATE ON public.requests FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Generate Winga ID (WNGA + 5 digits)
CREATE OR REPLACE FUNCTION public.generate_winga_id()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  new_id TEXT;
  counter INTEGER := 1;
BEGIN
  IF NEW.user_id IS NOT NULL THEN
    LOOP
      new_id := 'WNGA' || LPAD(counter::TEXT, 5, '0');
      EXIT WHEN NOT EXISTS (SELECT 1 FROM public.users WHERE winga_id = new_id);
      counter := counter + 1;
    END LOOP;
    UPDATE public.users SET winga_id = new_id WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_generate_winga_id
  AFTER INSERT ON public.wingas
  FOR EACH ROW EXECUTE FUNCTION public.generate_winga_id();

-- Auto-create user profile on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.users (id, phone, name, user_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.phone, NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'name', NULL),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'customer')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_new_auth_user
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Recalculate Winga rating after review
CREATE OR REPLACE FUNCTION public.update_winga_rating()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.wingas SET
    rating      = (SELECT ROUND(AVG(rating)::NUMERIC, 2) FROM public.reviews WHERE winga_id = NEW.winga_id),
    total_trips = (SELECT COUNT(*) FROM public.reviews WHERE winga_id = NEW.winga_id)
  WHERE id = NEW.winga_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_update_rating
  AFTER INSERT OR UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_winga_rating();

-- Update request timestamps
CREATE OR REPLACE FUNCTION public.set_request_timestamps()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.status = 'accepted'  AND OLD.status = 'searching'  THEN NEW.accepted_at  = NOW(); END IF;
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN NEW.completed_at = NOW(); END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_request_timestamps
  BEFORE UPDATE ON public.requests
  FOR EACH ROW EXECUTE FUNCTION public.set_request_timestamps();

-- Winga profile completion %
CREATE OR REPLACE FUNCTION public.calc_winga_completion()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE pct INTEGER := 0;
BEGIN
  IF NEW.bio           IS NOT NULL AND length(NEW.bio) > 10  THEN pct := pct + 15; END IF;
  IF array_length(NEW.specialties, 1) > 0                    THEN pct := pct + 20; END IF;
  IF NEW.area          IS NOT NULL AND NEW.area != ''         THEN pct := pct + 15; END IF;
  IF NEW.national_id   IS NOT NULL                            THEN pct := pct + 20; END IF;
  IF NEW.social_whatsapp IS NOT NULL                          THEN pct := pct + 10; END IF;
  IF NEW.tin_number    IS NOT NULL                            THEN pct := pct + 10; END IF;
  pct := pct + 10; -- base for being registered
  NEW.completion_pct    := LEAST(pct, 100);
  NEW.profile_complete  := pct >= 75;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_winga_completion
  BEFORE INSERT OR UPDATE ON public.wingas
  FOR EACH ROW EXECUTE FUNCTION public.calc_winga_completion();

-- Auto-badge upgrade based on trips + rating
CREATE OR REPLACE FUNCTION public.auto_upgrade_badge()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.total_trips >= 30 AND NEW.rating >= 0.80 THEN
    NEW.badge := 'verified';
  ELSIF NEW.total_trips >= 10 AND NEW.rating >= 0.60 THEN
    NEW.badge := 'mid';
  ELSE
    NEW.badge := 'starter';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_auto_badge
  BEFORE UPDATE ON public.wingas
  FOR EACH ROW EXECUTE FUNCTION public.auto_upgrade_badge();

-- Send notification helper
CREATE OR REPLACE FUNCTION public.create_notification(
  p_user_id UUID, p_type TEXT, p_title TEXT, p_body TEXT, p_data JSONB DEFAULT '{}'
)
RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO public.notifications(user_id, type, title, body, data)
  VALUES (p_user_id, p_type, p_title, p_body, p_data);
END;
$$;

-- Notify customer when Winga accepts
CREATE OR REPLACE FUNCTION public.notify_on_accept()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.status = 'accepted' AND OLD.status = 'searching' THEN
    PERFORM public.create_notification(
      NEW.customer_id, 'request_accepted',
      'Winga Amekubali! 🎉',
      'Winga wako anakuja — fuatilia kwenye ramani',
      jsonb_build_object('request_id', NEW.id)
    );
  END IF;
  IF NEW.status = 'completed' THEN
    PERFORM public.create_notification(
      NEW.customer_id, 'request_completed',
      'Safari Imekamilika! ✅',
      'Pima huduma ya Winga wako',
      jsonb_build_object('request_id', NEW.id)
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notify_accept
  AFTER UPDATE ON public.requests
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_accept();


-- ═══════════════════════════════════════════════════════════════════════════
-- STEP 5: ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE public.users           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wingas          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.winga_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_lists  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_items  ENABLE ROW LEVEL SECURITY;

-- USERS
CREATE POLICY "users_read_own"    ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own"  ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "users_read_wingas" ON public.users FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.wingas w WHERE w.user_id = public.users.id)
);
CREATE POLICY "service_role_users" ON public.users FOR ALL USING (auth.role() = 'service_role');

-- WINGAS
CREATE POLICY "wingas_read_all"   ON public.wingas FOR SELECT USING (true);
CREATE POLICY "wingas_update_own" ON public.wingas FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "wingas_insert_own" ON public.wingas FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "service_role_wingas" ON public.wingas FOR ALL USING (auth.role() = 'service_role');

-- REQUESTS
CREATE POLICY "requests_customer_own" ON public.requests FOR ALL
  USING (customer_id = auth.uid());
CREATE POLICY "requests_winga_own" ON public.requests FOR ALL
  USING (winga_id IN (SELECT id FROM public.wingas WHERE user_id = auth.uid()));
CREATE POLICY "requests_searching_visible" ON public.requests FOR SELECT
  USING (status = 'searching');
CREATE POLICY "service_role_requests" ON public.requests FOR ALL
  USING (auth.role() = 'service_role');

-- MESSAGES
CREATE POLICY "messages_participants" ON public.messages FOR ALL
  USING (
    sender_id = auth.uid() OR
    request_id IN (
      SELECT id FROM public.requests
      WHERE customer_id = auth.uid()
         OR winga_id IN (SELECT id FROM public.wingas WHERE user_id = auth.uid())
    )
  );
CREATE POLICY "service_role_messages" ON public.messages FOR ALL
  USING (auth.role() = 'service_role');

-- REVIEWS
CREATE POLICY "reviews_read_all"     ON public.reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert_customer" ON public.reviews FOR INSERT
  WITH CHECK (customer_id = auth.uid());
CREATE POLICY "service_role_reviews" ON public.reviews FOR ALL
  USING (auth.role() = 'service_role');

-- PAYMENTS
CREATE POLICY "payments_own"          ON public.payments FOR ALL
  USING (customer_id = auth.uid());
CREATE POLICY "service_role_payments" ON public.payments FOR ALL
  USING (auth.role() = 'service_role');

-- NOTIFICATIONS
CREATE POLICY "notifications_own"     ON public.notifications FOR ALL
  USING (user_id = auth.uid());
CREATE POLICY "service_role_notifications" ON public.notifications FOR ALL
  USING (auth.role() = 'service_role');

-- WINGA LOCATIONS
CREATE POLICY "locations_winga_write" ON public.winga_locations FOR ALL
  USING (user_id = auth.uid());
CREATE POLICY "locations_read_all"    ON public.winga_locations FOR SELECT
  TO authenticated USING (true);
CREATE POLICY "service_role_locations" ON public.winga_locations FOR ALL
  USING (auth.role() = 'service_role');

-- ADMINS
CREATE POLICY "admins_service_role"   ON public.admins FOR ALL
  USING (auth.role() = 'service_role');

-- SHOPPING
CREATE POLICY "shopping_lists_participants" ON public.shopping_lists FOR ALL
  USING (request_id IN (
    SELECT id FROM public.requests
    WHERE customer_id = auth.uid()
       OR winga_id IN (SELECT id FROM public.wingas WHERE user_id = auth.uid())
  ));
CREATE POLICY "shopping_items_participants" ON public.shopping_items FOR ALL
  USING (shopping_list_id IN (
    SELECT sl.id FROM public.shopping_lists sl
    JOIN public.requests r ON r.id = sl.request_id
    WHERE r.customer_id = auth.uid()
       OR r.winga_id IN (SELECT id FROM public.wingas WHERE user_id = auth.uid())
  ));


-- ═══════════════════════════════════════════════════════════════════════════
-- STEP 6: REALTIME
-- ═══════════════════════════════════════════════════════════════════════════

ALTER PUBLICATION supabase_realtime ADD TABLE public.winga_locations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;


-- ═══════════════════════════════════════════════════════════════════════════
-- STEP 7: STORAGE BUCKETS
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('avatars',        'avatars',        true,  5242880,  ARRAY['image/jpeg','image/png','image/webp']),
  ('winga-docs',     'winga-docs',     false, 10485760, ARRAY['image/jpeg','image/png','application/pdf']),
  ('shopping-photos','shopping-photos',true,  5242880,  ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies
-- Drop storage policies idempotently
DROP POLICY IF EXISTS "avatars_public_read"  ON storage.objects;
DROP POLICY IF EXISTS "avatars_auth_upload"  ON storage.objects;
DROP POLICY IF EXISTS "avatars_read"         ON storage.objects;
DROP POLICY IF EXISTS "avatars_upload"       ON storage.objects;
DROP POLICY IF EXISTS "winga_docs_own"       ON storage.objects;
DROP POLICY IF EXISTS "shopping_photos_auth" ON storage.objects;
DROP POLICY IF EXISTS "shopping_upload"      ON storage.objects;

CREATE POLICY "avatars_public_read"   ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "avatars_auth_upload"   ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
CREATE POLICY "winga_docs_own"        ON storage.objects FOR ALL   USING (bucket_id = 'winga-docs' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "shopping_photos_auth"  ON storage.objects FOR ALL   USING (bucket_id = 'shopping-photos' AND auth.role() = 'authenticated');


-- ═══════════════════════════════════════════════════════════════════════════
-- STEP 8: SEED DATA
-- ═══════════════════════════════════════════════════════════════════════════

-- Admin record (run after creating auth user for david@winga.app in Dashboard)
-- INSERT INTO public.admins (user_id, name, email, role)
-- VALUES ('<david_auth_user_id>', 'David Mbazza', 'david@winga.app', 'super_admin');


-- ════════════════════════════════════════════════════════════════════════════
-- DONE ✅
-- Tables: users, wingas, requests, messages, winga_locations, reviews,
--         payments, notifications, admins, referrals, shopping_lists,
--         shopping_items
-- Triggers: auto updated_at, winga_id gen, new user profile, rating recalc,
--           request timestamps, completion%, auto badge, notifications
-- RLS: all tables protected
-- Realtime: winga_locations, messages, requests, notifications
-- Storage: avatars (public), winga-docs (private), shopping-photos (auth)
-- ════════════════════════════════════════════════════════════════════════════
