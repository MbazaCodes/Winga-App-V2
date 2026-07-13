#!/bin/bash
set -e

echo "╔══════════════════════════════════════════════╗"
echo "║   WINGA APP PLATFORM — Local Setup Script   ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# Check prerequisites
echo "📦 Checking prerequisites..."
command -v node  >/dev/null || { echo "❌ Node.js required"; exit 1; }
command -v npm   >/dev/null || { echo "❌ npm required"; exit 1; }
echo "✅ Node $(node -v), npm $(npm -v)"

# Install Supabase CLI
echo ""
echo "📦 Installing Supabase CLI..."
npm install -g supabase 2>/dev/null || npx supabase --version
echo "✅ Supabase CLI ready"

# Install deps for all Next.js apps
echo ""
echo "📦 Installing dependencies..."
for dir in customer-pwa winga-pwa admin-web-app; do
  echo "  → $dir"
  cd $dir && npm install --silent && cd ..
done
echo "✅ All dependencies installed"

# Copy env files
echo ""
echo "🔧 Setting up environment files..."
for dir in customer-pwa winga-pwa admin-web-app; do
  if [ ! -f "$dir/.env.local" ]; then
    cp "$dir/.env.example" "$dir/.env.local"
    echo "  → Created $dir/.env.local (update with your Supabase keys)"
  else
    echo "  → $dir/.env.local already exists"
  fi
done

# Start Supabase local
echo ""
echo "🚀 Starting Supabase local stack..."
supabase start

echo ""
echo "🗃️  Running migrations..."
supabase db reset

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║              SETUP COMPLETE ✅               ║"
echo "╚══════════════════════════════════════════════╝"
echo ""
echo "📋 Quick start:"
echo "  Terminal 1: cd customer-pwa  && npm run dev  → http://localhost:3000"
echo "  Terminal 2: cd winga-pwa     && npm run dev  → http://localhost:3000"
echo "  Terminal 3: cd admin-web-app && npm run dev  → http://localhost:3001"
echo "  Supabase Studio:                             → http://localhost:54323"
echo ""
echo "🔑 Demo credentials:"
echo "  Customer phone: 786670928 → OTP: 123456"
echo "  Winga phone:    685006000 → OTP: 123456"
echo "  Admin:          support@winga.com / any password"
