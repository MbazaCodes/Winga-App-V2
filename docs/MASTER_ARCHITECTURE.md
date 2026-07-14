# Winga Master Architecture

Winga is ONE platform with multiple clients: Web (Next.js PWA), Mobile
(Flutter), and Admin (Next.js), all backed by Supabase.

## Core Rules

1.  Business logic never lives in UI.
2.  Implement features in order: Database → API → Edge Function → Web →
    Mobile → Tests → Documentation.
3.  Web and Mobile must expose the same capabilities.
4.  Shared backend, shared design system, separate rendering
    technologies.

## Monorepo

-   apps/admin
-   apps/web
-   apps/mobile
-   packages/\*
-   supabase/\*
