# WINGA APP V2 — Tanzania's Trusted Shopping Guide Platform

Connects **customers** with **Wingas** (verified shopping guides) for errands, shopping, and delivery across Tanzania.

## Platform Structure

```
WINGA APP V2/
├── 📱 customer-pwa/          Customer PWA (Next.js 16 + React 19)
├── 🛠️  winga-pwa/            Winga (Guide) PWA (Next.js 16 + React 19)
├── 💻 admin-web-app/         Admin Dashboard (Next.js 16 + React 19)
├── 📲 mobile-app/            Mobile App (Flutter — Planned)
├── 🗄️  supabase/             Database, Migrations, Edge Functions
│   ├── config.toml           Supabase local config
│   ├── migrations/           12 SQL migrations (schema, RLS, triggers, fixes)
│   ├── functions/            4 Edge Functions (auth-secured)
│   └── seed/                 Seed data
├── docker-compose.yml        Full local stack (Postgres + Studio + pgAdmin)
└── setup-local.sh            One-command local setup
```

## Quick Start (Local Development)

### Option A: Using Setup Script (Recommended)
```bash
git clone https://github.com/MbazaCodes/Winga-App-V2.git
cd Winga-App-V2
chmod +x setup-local.sh
./setup-local.sh
```

### Option B: Manual Setup
```bash
# 1. Start Supabase Local
npx supabase start
# Or: docker-compose up -d

# 2. Install dependencies
cd customer-pwa && npm install && cd ..
cd winga-pwa && npm install && cd ..
cd admin-web-app && npm install && cd ..

# 3. Start apps (each in its own terminal)
cd customer-pwa && npm run dev        # http://localhost:3000
cd winga-pwa && npm run dev -- -p 3002  # http://localhost:3002
cd admin-web-app && npm run dev        # http://localhost:3001
```

### Local URLs
| Service | URL |
|---------|-----|
| Customer PWA | http://localhost:3000 |
| Winga PWA | http://localhost:3002 |
| Admin Dashboard | http://localhost:3001 |
| Supabase API | http://localhost:54321 |
| Supabase Studio | http://localhost:54323 |
| pgAdmin | http://localhost:5050 |

### Demo Credentials
| Platform | Login | OTP |
|----------|-------|-----|
| Customer | Any Tanzania phone | `123456` |
| Winga | +255685006000 | `123456` |
| Admin | support@winga.com + any password | — |

## Deploying to Supabase Cloud (Production)

1. Create a project at [supabase.com](https://supabase.com)
2. Push migrations: `npx supabase db push`
3. Copy `.env.production.example` to `.env.production` in each app
4. Fill in your Supabase URL and anon key
5. Deploy: `npx vercel` (or your preferred host)

### Environment Variables

| Variable | Local | Production |
|----------|-------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `http://127.0.0.1:54321` | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (local dev key) | (project anon key) |

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) + React 19 |
| Styling | Tailwind CSS 3 |
| State | Zustand |
| Forms | Zod validation |
| Icons | Lucide React |
| Backend | Supabase (PostgreSQL + Auth + Storage + Edge Functions) |
| Database | 16 tables, 40+ RLS policies, 20+ functions, 8 triggers |
| Mobile | Flutter (planned) |

## Database Schema

16 tables covering: users, wingas (shopping guides), requests, transactions, reviews, notifications, messages, disputes, tips, referrals, shopping lists, GPS tracking, and more.

Key features:
- **Row Level Security** on all tables
- **Points & reputation system** with auto-tier promotion
- **Wilson score** for reliable ratings
- **Real-time messaging** and GPS tracking
- **Referral program** with wallet rewards

## Security

- All edge functions verify JWT tokens before processing
- RLS policies enforce data isolation (customers/wingas/admins)
- Service role key used only server-side in edge functions
- Auth checks prevent cross-account operations

## Founder
David Mbazza | +255 786 670 928 | mbazzacodes@gmail.com