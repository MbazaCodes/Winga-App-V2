-- ============================================================
-- Migration 012: Critical Fixes
-- 1. Fix admin_audit_log.admin_id NOT NULL (auto_promote_winga inserts NULL)
-- 2. Add user_credentials RLS policy
-- 3. Add missing indexes
-- 4. Add missing triggers for updated_at
-- 5. Add cron job scheduling functions
-- 6. Fix expire_subscriptions to also handle badge/verification status
-- ============================================================

-- ── 1. Fix admin_audit_log: make admin_id nullable (system actions have no admin) ──
ALTER TABLE public.admin_audit_log ALTER COLUMN admin_id DROP NOT NULL;

-- ── 2. Fix user_credentials RLS: allow authenticated users to read/write their own ──
DROP POLICY IF EXISTS "credentials_own" ON public.user_credentials;
CREATE POLICY "credentials_own" ON public.user_credentials
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admin full access
DROP POLICY IF EXISTS "credentials_admin" ON public.user_credentials;
CREATE POLICY "credentials_admin" ON public.user_credentials
  FOR ALL USING (public.is_admin());

GRANT SELECT, INSERT, UPDATE ON public.user_credentials TO authenticated;

-- ── 3. Add missing indexes ──────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_requests_created_at ON public.requests (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_winga_locations_recorded_at ON public.winga_locations (recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_disputes_raised_by ON public.disputes (raised_by);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON public.messages (is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications (user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_requests_status ON public.requests (status);
CREATE INDEX IF NOT EXISTS idx_requests_winga_id ON public.requests (winga_id) WHERE winga_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_wingas_verification_status ON public.wingas (verification_status);
CREATE INDEX IF NOT EXISTS idx_wingas_badge ON public.wingas (badge);

-- ── 4. Add missing updated_at triggers ──────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_preferred_wingas') THEN
    CREATE TRIGGER set_updated_at_preferred_wingas
      BEFORE UPDATE ON public.preferred_wingas
      FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_shopping_lists') THEN
    CREATE TRIGGER set_updated_at_shopping_lists
      BEFORE UPDATE ON public.shopping_lists
      FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_winga_availability') THEN
    CREATE TRIGGER set_updated_at_winga_availability
      BEFORE UPDATE ON public.winga_availability
      FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- ── 5. Add cron job helper: run all scheduled maintenance ───────────────────────
CREATE OR REPLACE FUNCTION public.run_all_cron_jobs()
RETURNS TABLE(job TEXT, result TEXT) AS $$
DECLARE
  v_expired    INT;
  v_downgraded INT;
  v_refreshed  INT;
BEGIN
  -- Expire subscriptions
  PERFORM public.expire_subscriptions();
  GET DIAGNOSTICS v_expired = ROW_COUNT;

  -- Auto-downgrade badges (7-day grace period)
  PERFORM public.auto_downgrade_badges();
  GET DIAGNOSTICS v_downgraded = ROW_COUNT;

  -- Refresh top-rated wingas
  PERFORM public.refresh_top_rated();
  GET DIAGNOSTICS v_refreshed = ROW_COUNT;

  -- Return results
  job := 'expire_subscriptions'; result := v_expired::TEXT; RETURN NEXT;
  job := 'auto_downgrade_badges'; result := v_downgraded::TEXT; RETURN NEXT;
  job := 'refresh_top_rated'; result := v_refreshed::TEXT; RETURN NEXT;
  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.run_all_cron_jobs() TO service_role;

-- ── 6. Fix auto_promote_winga: also check for 'rejected' status ──────────────────
DROP FUNCTION IF EXISTS public.auto_promote_winga(UUID);
CREATE OR REPLACE FUNCTION public.auto_promote_winga(p_winga_id UUID)
RETURNS VOID AS $$
DECLARE
  v_tier        TEXT;
  v_score       NUMERIC;
  v_eligible    BOOLEAN;
  v_old_badge   TEXT;
BEGIN
  -- Skip suspended or rejected wingas
  SELECT status, badge INTO v_old_badge, v_tier
  FROM public.wingas WHERE id = p_winga_id;

  IF NOT FOUND OR v_old_badge IN ('suspended', 'rejected') THEN
    RETURN;
  END IF;

  -- Check tier eligibility
  SELECT tier, eligible INTO v_tier, v_eligible
  FROM public.check_tier_eligibility(p_winga_id, NULL);

  IF v_eligible AND v_tier IS NOT NULL AND v_tier != COALESCE(
    (SELECT name FROM public.verification_tiers WHERE id = (SELECT tier_id FROM public.wingas WHERE id = p_winga_id)),
    'Starter'
  ) THEN
    UPDATE public.wingas
    SET
      tier_id = (SELECT id FROM public.verification_tiers WHERE name = v_tier),
      badge = CASE v_tier
        WHEN 'Mid' THEN 'verified'
        WHEN 'Verified' THEN 'verified'
        ELSE 'starter'
      END,
      badge_assigned_at = NOW(),
      badge_assigned_by = NULL  -- system promotion
    WHERE id = p_winga_id;

    -- Audit log (admin_id is now nullable for system actions)
    INSERT INTO public.admin_audit_log (admin_id, action, target_type, target_id, details)
    VALUES (NULL, 'auto_promote', 'winga', p_winga_id,
      jsonb_build_object('new_badge', v_tier, 'old_badge', v_old_badge, 'reason', 'points_threshold'));
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── 7. GPS ping cleanup function (call periodically to prevent unbounded growth) ──
CREATE OR REPLACE FUNCTION public.cleanup_old_gps_pings(days_to_keep INT DEFAULT 7)
RETURNS INT AS $$
DECLARE
  v_deleted INT;
BEGIN
  DELETE FROM public.winga_locations
  WHERE recorded_at < NOW() - (days_to_keep || ' days')::INTERVAL;
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.cleanup_old_gps_pings(INT) TO service_role;

-- ── 8. Add reviews constraint: prevent duplicate reviews per request ─────────────
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uniq_review_per_request') THEN
    ALTER TABLE public.reviews
      ADD CONSTRAINT uniq_review_per_request UNIQUE (request_id);
  END IF;
END $$;