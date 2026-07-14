# ════════════════════════════════════════════════════════
# WINGA APP — Complete Deploy Script
# Run this in PowerShell as Administrator
# ════════════════════════════════════════════════════════

$ErrorActionPreference = "Stop"
$PLATFORM = "C:\Users\DELL\Pictures\Winga\WINGA APP PLATFORM"

Write-Host "╔══════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   WINGA APP — Full Deploy Pipeline       ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════╝" -ForegroundColor Cyan

Set-Location $PLATFORM

# ── STEP 1: Install CLIs ──────────────────────────────
Write-Host "`n[1/6] Installing CLIs..." -ForegroundColor Yellow
npm install -g supabase
npm install -g vercel
Write-Host "✅ CLIs installed" -ForegroundColor Green

# ── STEP 2: Pull latest code ──────────────────────────
Write-Host "`n[2/6] Pulling latest code..." -ForegroundColor Yellow
git pull origin main
Write-Host "✅ Code up to date" -ForegroundColor Green

# ── STEP 3: Supabase — link + push migration ──────────
Write-Host "`n[3/6] Pushing Supabase migration..." -ForegroundColor Yellow
Write-Host "You need your Supabase Personal Access Token." -ForegroundColor Cyan
Write-Host "Get it from: https://supabase.com/dashboard/account/tokens" -ForegroundColor Cyan
Write-Host ""

# Link project
supabase login  # opens browser — paste your sbp_... token
supabase link --project-ref kevdbsyiqelksxvmuped

# Push migration (resets DB and applies fresh schema)
Write-Host "Pushing migration 000 (DROP + fresh schema)..." -ForegroundColor Yellow
supabase db push --db-url "postgresql://postgres.kevdbsyiqelksxvmuped:[YOUR_DB_PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"

Write-Host "✅ Database migrated" -ForegroundColor Green

# ── STEP 4: Deploy Edge Functions ─────────────────────
Write-Host "`n[4/6] Deploying Edge Functions..." -ForegroundColor Yellow
supabase functions deploy send-notification --project-ref kevdbsyiqelksxvmuped
supabase functions deploy create-request    --project-ref kevdbsyiqelksxvmuped
supabase functions deploy accept-request    --project-ref kevdbsyiqelksxvmuped
supabase functions deploy process-payment   --project-ref kevdbsyiqelksxvmuped
Write-Host "✅ Edge Functions deployed" -ForegroundColor Green

# ── STEP 5: Install dependencies ──────────────────────
Write-Host "`n[5/6] Installing app dependencies..." -ForegroundColor Yellow
foreach ($app in @("customer-pwa", "winga-pwa", "admin-web-app")) {
    Write-Host "  → $app"
    Set-Location "$PLATFORM\$app"
    npm install --silent
    Set-Location $PLATFORM
}
Write-Host "✅ Dependencies installed" -ForegroundColor Green

# ── STEP 6: Deploy to Vercel ──────────────────────────
Write-Host "`n[6/6] Deploying to Vercel..." -ForegroundColor Yellow
vercel login  # opens browser

# Customer PWA
Write-Host "`n  Deploying customer-pwa..." -ForegroundColor Cyan
Set-Location "$PLATFORM\customer-pwa"
vercel --prod --yes `
  --env NEXT_PUBLIC_SUPABASE_URL=https://kevdbsyiqelksxvmuped.supabase.co `
  --env NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtldmRic3lpcWVsa3N4dm11cGVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3MzUyMjIsImV4cCI6MjA5OTMxMTIyMn0.pNmc5HGE9huxmh4-eqveLETkxnxJ_j5rigeS8t35o2A

# Winga PWA
Write-Host "`n  Deploying winga-pwa..." -ForegroundColor Cyan
Set-Location "$PLATFORM\winga-pwa"
vercel --prod --yes `
  --env NEXT_PUBLIC_SUPABASE_URL=https://kevdbsyiqelksxvmuped.supabase.co `
  --env NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtldmRic3lpcWVsa3N4dm11cGVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3MzUyMjIsImV4cCI6MjA5OTMxMTIyMn0.pNmc5HGE9huxmh4-eqveLETkxnxJ_j5rigeS8t35o2A

# Admin Web App
Write-Host "`n  Deploying admin-web-app..." -ForegroundColor Cyan
Set-Location "$PLATFORM\admin-web-app"
vercel --prod --yes `
  --env NEXT_PUBLIC_SUPABASE_URL=https://kevdbsyiqelksxvmuped.supabase.co `
  --env NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtldmRic3lpcWVsa3N4dm11cGVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3MzUyMjIsImV4cCI6MjA5OTMxMTIyMn0.pNmc5HGE9huxmh4-eqveLETkxnxJ_j5rigeS8t35o2A `
  --env SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtldmRic3lpcWVsa3N4dm11cGVkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzczNTIyMiwiZXhwIjoyMDk5MzExMjIyfQ.bSdyODBofdcoJ3vRtF7kODMCL1fY6Tx-cj5tITYzeDI

Set-Location $PLATFORM

Write-Host "`n╔══════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║         DEPLOYMENT COMPLETE ✅           ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════╝" -ForegroundColor Green
