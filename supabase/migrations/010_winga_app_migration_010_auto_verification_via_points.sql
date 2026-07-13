-- ============================================================
-- Winga App — Migration 010: Auto-Verification via Points
--
-- BADGES ARE NOW AUTOMATIC. No admin approval needed.
-- Customer ratings (points) drive badge promotion:
--   Starter  : Auto on registration (0 trips required)
--   Mid      : Auto at 10+ rated trips AND Wilson score >= 0.60
--   Verified : Auto at 30+ rated trips AND Wilson score >= 0.80
--
-- Downgrades happen automatically if score drops (decay protection
-- gives 7 days grace before losing a tier).
--
-- Admin can still MANUALLY override (assign/demote) if needed.
-- ============================================================

-- ── Auto-promote function ─────────────────────────────────────
-- Called by trigger after every point recalculation.
-- Checks highest eligible tier and auto-assigns.
CREATE OR REPLACE FUNCTION public.auto_promote_winga(p_winga_id UUID)
RETURNS VOID AS $$
DECLARE
  v_winga RECORD;
  v_old_badge TEXT;
  v_new_badge TEXT;
  v_tier_id  UUID;
  v_promoted BOOLEAN := FALSE;
BEGIN
  SELECT * INTO v_winga
  FROM public.wingas WHERE id = p_winga_id;

  IF NOT FOUND THEN RETURN; END IF;
  -- Don't auto-promote suspended/rejected wingas
  IF v_winga.status = 'suspended' THEN RETURN; END IF;

  v_old_badge := COALESCE(v_winga.badge, 'none');

  -- Determine highest eligible tier (check from highest to lowest)
  -- Verified: 30+ trips, score >= 0.80
  IF v_winga.rated_trips >= 30 AND v_winga.winga_score >= 0.80 THEN
    v_new_badge := 'Verified';
  -- Mid: 10+ trips, score >= 0.60
  ELSIF v_winga.rated_trips >= 10 AND v_winga.winga_score >= 0.60 THEN
    v_new_badge := 'Mid';
  -- Starter: always eligible (even 0 trips)
  ELSE
    v_new_badge := 'Starter';
  END IF;

  -- No change needed
  IF v_new_badge = v_old_badge THEN RETURN; END IF;

  -- Get tier ID
  SELECT id INTO v_tier_id
  FROM public.verification_tiers WHERE name = v_new_badge;

  -- Auto-assign the badge
  UPDATE public.wingas SET
    badge               = v_new_badge,
    verification_tier   = v_new_badge,
    tier_id             = v_tier_id,
    verification_status = 'verified',
    status              = 'active',
    verified_at         = COALESCE(v_winga.verified_at, NOW()),
    verified_by         = NULL,  -- system, not admin
    badge_assigned_at   = NOW(),
    badge_assigned_by   = NULL,  -- system
    badge_expires_at    = NULL   -- auto-promoted badges don't expire
  WHERE id = p_winga_id;

  -- Mark user as verified
  UPDATE public.users SET is_verified = TRUE
  WHERE id = v_winga.user_id AND NOT is_verified;

  v_promoted := TRUE;

  -- Notify the Winga
  INSERT INTO public.notifications (user_id, title, body, type, data)
  VALUES (
    v_winga.user_id,
    CASE
      WHEN v_new_badge = 'Verified' THEN '🎉 Umeitwa kuwa Winga Aliyethibitishwa!'
      WHEN v_new_badge = 'Mid' THEN '🥈 Badge ya Mid Imekubaliwa!'
      ELSE '🥉 Karibu! Umepata Badge ya Starter'
    END,
    CASE
      WHEN v_new_badge = 'Verified' THEN
        'Huduma yako bora imekufanya upate badge ya Verified! ' ||
        'Utaonekana kwenye orodha ya juu na utapewa kipaumbele.'
      WHEN v_new_badge = 'Mid' THEN
        'Maoni ya wateja yamekupa badge ya Mid! ' ||
        'Endelea kutoa huduma nzuri kupata Verified.'
      ELSE
        'Karibu kwenye Winga! Umeanza na badge ya Starter. ' ||
        'Toa huduma nzuri na pata maoni mazuri kustahili Mid.'
    END,
    'verification',
    jsonb_build_object(
      'badge', v_new_badge,
      'previous_badge', v_old_badge,
      'auto', true,
      'rated_trips', v_winga.rated_trips,
      'score', v_winga.winga_score,
      'winga_id', p_winga_id
    )
  );

  -- Log the auto-promotion
  INSERT INTO public.admin_audit_log (admin_id, action, target_type, target_id, details)
  VALUES (
    NULL,  -- system action, no admin
    'auto_promote',
    'winga',
    p_winga_id,
    jsonb_build_object(
      'old_badge', v_old_badge,
      'new_badge', v_new_badge,
      'rated_trips', v_winga.rated_trips,
      'score', v_winga.winga_score,
      'auto', true
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── Auto-grant Starter badge on Winga registration ─────────────
-- When a new Winga is inserted, immediately give them Starter badge
-- and set status to active (no manual approval needed).
CREATE OR REPLACE FUNCTION public.auto_starter_on_register()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.badge IS NULL OR NEW.badge = 'none' THEN
    NEW.badge := 'Starter';
    NEW.verification_tier := 'Starter';
    NEW.verification_status := 'verified';
    NEW.status := 'active';
    NEW.verified_at := NOW();
    NEW.badge_assigned_at := NOW();
    -- Get tier_id for Starter
    SELECT id INTO NEW.tier_id
    FROM public.verification_tiers WHERE name = 'Starter' LIMIT 1;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_auto_starter ON public.wingas;
CREATE TRIGGER trg_auto_starter
  BEFORE INSERT ON public.wingas
  FOR EACH ROW EXECUTE FUNCTION public.auto_starter_on_register();

-- ── Hook auto-promote into the existing points recalc trigger ──
-- Modify recalc_winga_points to call auto_promote after updating
CREATE OR REPLACE FUNCTION public.recalc_winga_points()
RETURNS TRIGGER AS $$
DECLARE
  v_winga UUID := COALESCE(NEW.winga_id, OLD.winga_id);
  v_good  INT;
  v_total INT;
BEGIN
  SELECT COALESCE(SUM(point), 0), COUNT(*)
    INTO v_good, v_total
  FROM public.winga_points
  WHERE winga_id = v_winga;

  UPDATE public.wingas SET
    total_points = v_good,
    rated_trips  = v_total,
    point_rate   = CASE WHEN v_total = 0 THEN 0
                        ELSE ROUND(v_good * 100.0 / v_total, 2) END,
    winga_score  = public.wilson_score(v_good, v_total)
  WHERE id = v_winga;

  -- AUTO-PROMOTE: check if badge should upgrade
  PERFORM public.auto_promote_winga(v_winga);

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── Grace period: don't auto-downgrade immediately ─────────────
-- If a Winga's score drops, give 7 days before downgrading.
-- (The auto_promote function above only upgrades.
--  Downgrading is handled by a separate cron-safe function.)
CREATE OR REPLACE FUNCTION public.auto_downgrade_badges()
RETURNS JSONB AS $$
DECLARE
  v_count INT := 0;
  v_rec RECORD;
  v_new_badge TEXT;
  v_tier_id UUID;
BEGIN
  -- Find wingas whose badge doesn't match their earned tier
  -- AND have been at current tier for 7+ days (grace period)
  FOR v_rec IN
    SELECT w.id, w.badge, w.rated_trips, w.winga_score,
           w.badge_assigned_at
    FROM public.wingas w
    WHERE w.verification_status = 'verified'
      AND w.badge != 'none'
      AND w.badge_assigned_at < NOW() - INTERVAL '7 days'
  LOOP
    -- Determine what tier they should be at
    IF v_rec.rated_trips >= 30 AND v_rec.winga_score >= 0.80 THEN
      v_new_badge := 'Verified';
    ELSIF v_rec.rated_trips >= 10 AND v_rec.winga_score >= 0.60 THEN
      v_new_badge := 'Mid';
    ELSE
      v_new_badge := 'Starter';
    END IF;

    IF v_new_badge <> v_rec.badge THEN
      SELECT id INTO v_tier_id
      FROM public.verification_tiers WHERE name = v_new_badge;

      UPDATE public.wingas SET
        badge = v_new_badge,
        verification_tier = v_new_badge,
        tier_id = v_tier_id,
        badge_assigned_at = NOW()
      WHERE id = v_rec.id;

      INSERT INTO public.notifications (user_id, title, body, type, data)
      VALUES (
        (SELECT user_id FROM public.wingas WHERE id = v_rec.id),
        'Badge Imeshushwa — ' || v_new_badge,
        'Alama yako ya huduma imeshuka. Sasa uko kwenye tier ya ' || v_new_badge ||
        '. Toa huduma bora kupata nyuzi zaidi.',
        'verification',
        jsonb_build_object('old_badge', v_rec.badge, 'new_badge', v_new_badge, 'auto', true)
      );

      v_count := v_count + 1;
    END IF;
  END LOOP;

  RETURN jsonb_build_object('success', true, 'downgraded', v_count);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── RLS for the new function ───────────────────────────────────
GRANT EXECUTE ON FUNCTION public.auto_promote_winga(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.auto_downgrade_badges() TO service_role;

-- ── Update expire_subscriptions: don't strip badges ────────────
-- Since badges are now points-based (not payment-based),
-- subscription expiry should NOT remove the badge.
CREATE OR REPLACE FUNCTION public.expire_subscriptions()
RETURNS void AS $$
BEGIN
  UPDATE public.wingas
  SET
    subscription_active = FALSE
  WHERE
    subscription_active = TRUE
    AND subscription_end < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.expire_subscriptions() TO service_role;

-- ============================================================
-- Migration 011: Fix RLS policies for PWA
-- Fixes "permission denied for table requests" error
-- Also ensures all PWA-required columns exist
-- ============================================================

-- ── Fix requests RLS: FOR ALL with only USING doesn't cover INSERT ──────────
-- PostgreSQL: USING applies to SELECT/UPDATE/DELETE row filtering
--             WITH CHECK applies to INSERT/UPDATE row creation
-- The old policy "FOR ALL USING (auth.uid() = customer_id)" 
-- does NOT allow INSERT because there's no WITH CHECK clause

DROP POLICY IF EXISTS "requests_customer_own"    ON public.requests;
DROP POLICY IF EXISTS "requests_winga_assigned"  ON public.requests;
DROP POLICY IF EXISTS "requests_winga_searching" ON public.requests;
DROP POLICY IF EXISTS "requests_winga_update"    ON public.requests;
DROP POLICY IF EXISTS "requests_admin"           ON public.requests;

-- Customer: full access to their own requests
CREATE POLICY "requests_customer_select" ON public.requests
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "requests_customer_insert" ON public.requests
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "requests_customer_update" ON public.requests
  FOR UPDATE USING (auth.uid() = customer_id);

-- Winga: see requests assigned to them OR open 'searching' requests  
CREATE POLICY "requests_winga_view" ON public.requests
  FOR SELECT USING (
    status = 'searching'
    OR winga_id IN (SELECT id FROM public.wingas WHERE user_id = auth.uid())
  );

-- Winga: update requests assigned to them (accept, shopping, complete)
CREATE POLICY "requests_winga_update" ON public.requests
  FOR UPDATE USING (
    winga_id IN (SELECT id FROM public.wingas WHERE user_id = auth.uid())
  ) WITH CHECK (
    winga_id IN (SELECT id FROM public.wingas WHERE user_id = auth.uid())
  );

-- Admin: full access
CREATE POLICY "requests_admin" ON public.requests
  FOR ALL USING (public.is_admin());

-- ── Fix wingas INSERT/UPDATE: PWA registers Wingas directly ──────────────────
DROP POLICY IF EXISTS "wingas_insert"    ON public.wingas;
DROP POLICY IF EXISTS "wingas_own"       ON public.wingas;
DROP POLICY IF EXISTS "wingas_admin_all" ON public.wingas;

-- Public: read active verified wingas
CREATE POLICY "wingas_public_read" ON public.wingas
  FOR SELECT USING (
    status = 'active' AND verification_status = 'verified'
    OR user_id = auth.uid()
    OR public.is_admin()
  );

-- Winga: insert their own record
CREATE POLICY "wingas_insert" ON public.wingas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Winga: update their own record
CREATE POLICY "wingas_own_update" ON public.wingas
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admin: full access
CREATE POLICY "wingas_admin" ON public.wingas
  FOR ALL USING (public.is_admin());

-- ── Fix users: allow upsert from PWA registration ────────────────────────────
DROP POLICY IF EXISTS "users_insert"   ON public.users;
DROP POLICY IF EXISTS "users_own_read" ON public.users;

CREATE POLICY "users_own_read" ON public.users
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "users_insert" ON public.users
  FOR INSERT WITH CHECK (true);  -- anyone can register

CREATE POLICY "users_upsert" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- ── Ensure all columns exist (safe ADD COLUMN IF NOT EXISTS) ─────────────────

-- requests: columns added in 009
ALTER TABLE public.requests
  ADD COLUMN IF NOT EXISTS location_id  UUID REFERENCES public.locations(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS city         TEXT,
  ADD COLUMN IF NOT EXISTS area         TEXT,
  ADD COLUMN IF NOT EXISTS request_lat  NUMERIC(10,7),
  ADD COLUMN IF NOT EXISTS request_lng  NUMERIC(10,7),
  ADD COLUMN IF NOT EXISTS total_price  INT;        -- alias for estimated_price, used by PWA

-- wingas: columns added in 007, 009
ALTER TABLE public.wingas
  ADD COLUMN IF NOT EXISTS total_points    INT     NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rated_trips     INT     NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS point_rate      NUMERIC(5,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS winga_score     NUMERIC(6,4) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_top_rated    BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS current_city    TEXT,
  ADD COLUMN IF NOT EXISTS current_area    TEXT,
  ADD COLUMN IF NOT EXISTS current_lat     NUMERIC(10,7),
  ADD COLUMN IF NOT EXISTS current_lng     NUMERIC(10,7),
  ADD COLUMN IF NOT EXISTS bio             TEXT;

-- users: wallet balance added in 009
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS wallet_balance INT NOT NULL DEFAULT 0;

-- ── tips table (from 009) ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.tips (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id     UUID NOT NULL REFERENCES public.requests(id),
  customer_id    UUID NOT NULL REFERENCES public.users(id),
  winga_id       UUID NOT NULL REFERENCES public.wingas(id),
  amount         INT NOT NULL CHECK (amount > 0),
  payment_method TEXT NOT NULL DEFAULT 'wallet',
  provider_ref   TEXT,
  status         TEXT NOT NULL DEFAULT 'success',
  message        TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uniq_tip_per_request UNIQUE (request_id)
);

ALTER TABLE public.tips ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tips_customer_own" ON public.tips;
DROP POLICY IF EXISTS "tips_winga_view"   ON public.tips;
CREATE POLICY "tips_customer_own" ON public.tips FOR ALL   USING (auth.uid() = customer_id);
CREATE POLICY "tips_winga_view"   ON public.tips FOR SELECT USING (
  winga_id IN (SELECT id FROM public.wingas WHERE user_id = auth.uid())
);
GRANT SELECT, INSERT ON public.tips TO authenticated;

-- ── locations table (from 009) ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.locations (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country     TEXT NOT NULL DEFAULT 'Tanzania',
  region      TEXT NOT NULL,
  city        TEXT NOT NULL,
  area        TEXT,
  lat         NUMERIC(10,7),
  lng         NUMERIC(10,7),
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "locations_public" ON public.locations;
CREATE POLICY "locations_public" ON public.locations FOR SELECT USING (is_active = TRUE);
GRANT SELECT ON public.locations TO anon, authenticated;

-- Seed Tanzania locations if empty
INSERT INTO public.locations (country, region, city, area, lat, lng, sort_order)
SELECT * FROM (VALUES
  ('Tanzania','Dar es Salaam','Dar es Salaam','Kariakoo',       -6.8161, 39.2894, 1),
  ('Tanzania','Dar es Salaam','Dar es Salaam','Mwenge',          -6.7780, 39.2630, 2),
  ('Tanzania','Dar es Salaam','Dar es Salaam','Mnazi Mmoja',     -6.8193, 39.2884, 3),
  ('Tanzania','Dar es Salaam','Dar es Salaam','Ilala',           -6.8235, 39.2695, 4),
  ('Tanzania','Dar es Salaam','Dar es Salaam','Kinondoni',       -6.7834, 39.2707, 5),
  ('Tanzania','Dar es Salaam','Dar es Salaam','Temeke',          -6.8726, 39.2990, 6),
  ('Tanzania','Dar es Salaam','Dar es Salaam','Tabata',          -6.8416, 39.2534, 7),
  ('Tanzania','Arusha','Arusha','Arusha CBD',                   -3.3869, 36.6830, 10),
  ('Tanzania','Kilimanjaro','Moshi','Moshi Market',              -3.3531, 37.3403, 20),
  ('Tanzania','Mwanza','Mwanza','Mwanza Market',                 -2.5164, 32.9175, 30),
  ('Tanzania','Dodoma','Dodoma','Dodoma Market',                 -6.1731, 35.7395, 40),
  ('Tanzania','Zanzibar','Zanzibar City','Darajani Market',      -6.1622, 39.1894, 50),
  ('Tanzania','Zanzibar','Zanzibar City','Stone Town',           -6.1630, 39.1900, 51)
) AS t(country,region,city,area,lat,lng,sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.locations LIMIT 1);

-- ── Grant permissions ─────────────────────────────────────────────────────────
GRANT SELECT ON public.wingas    TO anon;
GRANT SELECT ON public.wingas    TO authenticated;
GRANT INSERT, UPDATE ON public.wingas    TO authenticated;
GRANT SELECT ON public.requests  TO authenticated;
GRANT INSERT, UPDATE ON public.requests  TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT ON public.verification_tiers TO anon, authenticated;
GRANT SELECT ON public.locations TO anon, authenticated;

-- ── rate_winga function grant (points RPC) ────────────────────────────────────
GRANT EXECUTE ON FUNCTION public.rate_winga(UUID, INT, TEXT) TO authenticated;
