-- ─── Winga Real-time Location Table ──────────────────────────────────────────
-- Stores live GPS coordinates broadcast by Wingas during active trips
-- Supabase Realtime is enabled → customers receive position updates instantly

CREATE TABLE IF NOT EXISTS public.winga_locations (
  id          UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID         REFERENCES public.users(id)    ON DELETE CASCADE UNIQUE,
  lat         DECIMAL(10,7) NOT NULL,
  lng         DECIMAL(10,7) NOT NULL,
  heading     DECIMAL(5,2),     -- degrees 0-360
  speed       DECIMAL(8,2),     -- km/h
  accuracy    DECIMAL(8,2),     -- meters
  request_id  UUID         REFERENCES public.requests(id) ON DELETE SET NULL,
  updated_at  TIMESTAMPTZ  DEFAULT NOW()
);

-- Index for fast bounding-box queries (find Wingas within area)
CREATE INDEX IF NOT EXISTS winga_locations_lat_lng
  ON public.winga_locations (lat, lng);

CREATE INDEX IF NOT EXISTS winga_locations_updated
  ON public.winga_locations (updated_at DESC);

-- RLS
ALTER TABLE public.winga_locations ENABLE ROW LEVEL SECURITY;

-- Winga can update their own location
CREATE POLICY "winga_update_own_location"
  ON public.winga_locations FOR ALL
  USING (user_id = auth.uid());

-- Anyone authenticated can read locations (for map display)
CREATE POLICY "authenticated_read_locations"
  ON public.winga_locations FOR SELECT
  TO authenticated USING (true);

-- ─── Enable Realtime on winga_locations ───────────────────────────────────────
-- Run in Supabase Dashboard → Database → Replication → enable winga_locations
-- Or via CLI:
ALTER PUBLICATION supabase_realtime ADD TABLE public.winga_locations;

-- ─── Auto-cleanup: remove stale locations after 10 minutes ───────────────────
CREATE OR REPLACE FUNCTION public.cleanup_stale_locations()
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  DELETE FROM public.winga_locations
  WHERE updated_at < NOW() - INTERVAL '10 minutes'
    AND request_id IS NULL;
END;
$$;

-- Schedule cleanup every 5 minutes (via pg_cron if available)
-- SELECT cron.schedule('cleanup-locations', '*/5 * * * *', 'SELECT public.cleanup_stale_locations()');
