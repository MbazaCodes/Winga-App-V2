-- Winga App Seed Data
INSERT INTO public.verification_tiers (name, monthly_fee, description, badge_color, sort_order, features) VALUES
  ('Starter',  5000,  'Basic verified listing', '#CD7F32', 1, '["Verified badge","Listed on platform","Basic profile","Customer requests"]'::jsonb),
  ('Mid',      15000, 'Priority listing', '#C0C0C0', 2, '["Mid badge","Priority search listing","Enhanced profile","Analytics","Priority support"]'::jsonb),
  ('Verified', 30000, 'Top-tier featured Winga', '#F9A825', 3, '["Verified gold badge","Top placement","Featured","Full analytics","Dedicated support","Marketing boost"]'::jsonb)
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.tier_requirements (tier, min_rated_trips, min_score) VALUES
  ('Starter', 0, 0.00), ('Mid', 10, 0.60), ('Verified', 30, 0.80)
ON CONFLICT (tier) DO UPDATE SET min_rated_trips = EXCLUDED.min_rated_trips, min_score = EXCLUDED.min_score;

INSERT INTO public.locations (country, region, city, area, lat, lng, sort_order) VALUES
  ('Tanzania','Dar es Salaam','Dar es Salaam','Kariakoo',   -6.8161, 39.2894, 1),
  ('Tanzania','Dar es Salaam','Dar es Salaam','Mwenge',      -6.7780, 39.2630, 2),
  ('Tanzania','Dar es Salaam','Dar es Salaam','Mnazi Mmoja', -6.8193, 39.2884, 3),
  ('Tanzania','Dar es Salaam','Dar es Salaam','Ilala',       -6.8235, 39.2695, 4),
  ('Tanzania','Dar es Salaam','Dar es Salaam','Kinondoni',   -6.7834, 39.2707, 5),
  ('Tanzania','Dar es Salaam','Dar es Salaam','Temeke',      -6.8726, 39.2990, 6),
  ('Tanzania','Dar es Salaam','Dar es Salaam','Mbagala',     -6.9000, 39.3167, 7),
  ('Tanzania','Dar es Salaam','Dar es Salaam','Tabata',      -6.8416, 39.2534, 8),
  ('Tanzania','Arusha','Arusha','Arusha CBD',                -3.3869, 36.6830, 10),
  ('Tanzania','Arusha','Arusha','Sakina Market',             -3.3650, 36.6680, 11),
  ('Tanzania','Arusha','Arusha','Kaloleni',                  -3.4000, 36.6700, 12),
  ('Tanzania','Kilimanjaro','Moshi','Moshi Market',           -3.3531, 37.3403, 20),
  ('Tanzania','Kilimanjaro','Moshi','Moshi CBD',              -3.3500, 37.3400, 21),
  ('Tanzania','Mwanza','Mwanza','Mwanza Market',              -2.5164, 32.9175, 30),
  ('Tanzania','Mwanza','Mwanza','Kirumba',                    -2.5100, 32.9000, 31),
  ('Tanzania','Dodoma','Dodoma','Dodoma Market',              -6.1731, 35.7395, 40),
  ('Tanzania','Tanga','Tanga','Tanga Market',                 -5.0688, 39.0988, 50),
  ('Tanzania','Morogoro','Morogoro','Morogoro Market',        -6.8160, 37.6620, 60),
  ('Tanzania','Zanzibar','Zanzibar City','Darajani Market',   -6.1622, 39.1894, 70),
  ('Tanzania','Zanzibar','Zanzibar City','Stone Town',        -6.1630, 39.1900, 71)
ON CONFLICT DO NOTHING;
