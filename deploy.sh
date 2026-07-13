#!/bin/bash
set -e

echo "╔══════════════════════════════════════════╗"
echo "║    WINGA APP — Production Deploy         ║"
echo "╚══════════════════════════════════════════╝"

echo ""
echo "Step 1: Push DB migrations to Supabase Cloud"
npx supabase db push

echo ""
echo "Step 2: Deploy Edge Functions"
npx supabase functions deploy send-otp
npx supabase functions deploy verify-otp
npx supabase functions deploy create-request
npx supabase functions deploy accept-request
npx supabase functions deploy process-payment
npx supabase functions deploy send-notification

echo ""
echo "Step 3: Deploy to Vercel"
echo "  Customer PWA:"
cd customer-pwa && npx vercel --prod && cd ..

echo "  Winga PWA:"
cd winga-pwa && npx vercel --prod && cd ..

echo "  Admin Web App:"
cd admin-web-app && npx vercel --prod && cd ..

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║        DEPLOYMENT COMPLETE ✅            ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "🌐 Customer PWA:  https://winga-app-5wtq.vercel.app"
echo "🛠️  Winga PWA:    https://winga-dashboard.vercel.app"
echo "💻 Admin Panel:   https://winga-app.vercel.app"
