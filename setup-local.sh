#!/bin/bash
# ============================================================
# Winga App V2 — Complete Local Development Setup
# ============================================================
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════╗"
echo "║     WINGA APP V2 — LOCAL DEVELOPMENT SETUP      ║"
echo "╚══════════════════════════════════════════════════╝"
echo -e "${NC}"

# ── Step 0: Check prerequisites ──
echo -e "${YELLOW}[0/5] Checking prerequisites...${NC}"

check_cmd() {
  if ! command -v "$1" &> /dev/null; then
    echo -e "${RED}  ✗ $1 is not installed. Please install it first.${NC}"
    MISSING=1
  else
    echo -e "${GREEN}  ✓ $1 found: $(command -v "$1")${NC}"
  fi
}

MISSING=0
check_cmd "node"
check_cmd "npm"
check_cmd "docker"
check_cmd "docker-compose" || check_cmd "docker"  # docker compose v2

if [ "$MISSING" = "1" ]; then
  echo -e "${RED}Please install missing prerequisites and try again.${NC}"
  exit 1
fi

# Check Docker is running
if ! docker info &> /dev/null; then
  echo -e "${RED}  ✗ Docker is not running. Please start Docker first.${NC}"
  exit 1
fi
echo -e "${GREEN}  ✓ Docker is running${NC}"

# ── Step 1: Check for Supabase CLI ──
echo ""
echo -e "${YELLOW}[1/5] Checking Supabase CLI...${NC}"

if command -v supabase &> /dev/null; then
  echo -e "${GREEN}  ✓ Supabase CLI found: $(supabase --version)${NC}"
  USE_SUPABASE_CLI=true
else
  echo -e "${YELLOW}  ⚠ Supabase CLI not found. Using Docker-based setup instead.${NC}"
  echo -e "${YELLOW}    To install Supabase CLI later: npm install -g supabase${NC}"
  USE_SUPABASE_CLI=false
fi

# ── Step 2: Start infrastructure ──
echo ""
echo -e "${YELLOW}[2/5] Starting infrastructure...${NC}"

if [ "$USE_SUPABASE_CLI" = true ]; then
  echo -e "${BLUE}  Using Supabase CLI (recommended)...${NC}"
  if ! supabase status &> /dev/null 2>&1; then
    supabase start
  else
    echo -e "${GREEN}  ✓ Supabase local is already running${NC}"
  fi
  echo -e "${GREEN}  ✓ Supabase Studio: http://localhost:54323${NC}"
  echo -e "${GREEN}  ✓ API URL:         http://localhost:54321${NC}"
  echo -e "${GREEN}  ✓ DB URL:          postgresql://postgres:postgres@127.0.0.1:54322/postgres${NC}"
else
  echo -e "${BLUE}  Using Docker Compose...${NC}"
  docker-compose up -d
  echo -e "${GREEN}  ✓ Waiting for database to be ready...${NC}"
  sleep 10
  echo -e "${GREEN}  ✓ pgAdmin:         http://localhost:5050 (admin@winga.com / admin)${NC}"
  echo -e "${GREEN}  ✓ DB URL:          postgresql://supabase_admin:your-super-secret-and-long-postgres-password@127.0.0.1:54322/postgres${NC}"
fi

# ── Step 3: Apply migrations ──
echo ""
echo -e "${YELLOW}[3/5] Applying database migrations...${NC}"

if [ "$USE_SUPABASE_CLI" = true ]; then
  # Supabase CLI handles migrations automatically on start
  echo -e "${GREEN}  ✓ Migrations applied via Supabase CLI${NC}"
else
  # Manual migration for Docker setup
  DB_HOST="127.0.0.1"
  DB_PORT="54322"
  DB_USER="supabase_admin"
  DB_PASS="your-super-secret-and-long-postgres-password"
  DB_NAME="postgres"

  # Wait for DB
  for i in $(seq 1 30); do
    if PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1" &> /dev/null; then
      echo -e "${GREEN}  ✓ Database is ready${NC}"
      break
    fi
    echo -e "  ⏳ Waiting for database... ($i/30)"
    sleep 2
  done

  # Apply migrations in order
  MIGRATIONS_DIR="$SCRIPT_DIR/supabase/migrations"
  for migration in $(ls "$MIGRATIONS_DIR"/*.sql | sort); do
    migration_name=$(basename "$migration")
    echo -e "  📋 Applying: $migration_name"
    PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$migration" 2>&1 | grep -v "^$" || true
  done

  # Apply seed
  echo -e "  📋 Applying: seed.sql"
  PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$SCRIPT_DIR/supabase/seed/seed.sql" 2>&1 | grep -v "^$" || true

  echo -e "${GREEN}  ✓ All migrations applied${NC}"
fi

# ── Step 4: Install dependencies ──
echo ""
echo -e "${YELLOW}[4/5] Installing app dependencies...${NC}"

for app in customer-pwa winga-pwa admin-web-app; do
  if [ -d "$SCRIPT_DIR/$app" ]; then
    echo -e "  📦 Installing $app..."
    cd "$SCRIPT_DIR/$app" && npm install --silent 2>&1 | tail -1
  fi
done

# ── Step 5: Create .env.local files if they don't exist ──
echo ""
echo -e "${YELLOW}[5/5] Verifying environment configuration...${NC}"

ENV_TEMPLATE='NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

for app in customer-pwa winga-pwa admin-web-app; do
  ENV_FILE="$SCRIPT_DIR/$app/.env.local"
  if [ ! -f "$ENV_FILE" ]; then
    echo -e "  📝 Creating .env.local for $app"
    echo "$ENV_TEMPLATE" > "$ENV_FILE"
  else
    echo -e "  ✓ $app/.env.local exists"
  fi
done

# ── Done! ──
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════╗"
echo -e "${GREEN}║           SETUP COMPLETE! 🎉                      ║"
echo -e "${GREEN}╚══════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  📱 Customer PWA:   ${BLUE}http://localhost:3000${NC}"
echo -e "  🛠️  Winga PWA:     ${BLUE}http://localhost:3002${NC}"
echo -e "  💻 Admin App:      ${BLUE}http://localhost:3001${NC}"
echo ""
echo -e "  🔧 Supabase Studio: ${BLUE}http://localhost:54323${NC}"
echo -e "  🗄️  DB:             ${BLUE}postgresql://postgres:postgres@127.0.0.1:54322/postgres${NC}"
echo ""
echo -e "  📋 Demo Credentials:"
echo -e "     Customer: Any phone → OTP: ${YELLOW}123456${NC}"
echo -e "     Winga:   +255685006000 → OTP: ${YELLOW}123456${NC}"
echo -e "     Admin:   support@winga.com → any password"
echo ""
echo -e "  🚀 Start apps with:"
echo -e "     ${BLUE}cd customer-pwa && npm run dev${NC}"
echo -e "     ${BLUE}cd winga-pwa && npm run dev -- -p 3002${NC}"
echo -e "     ${BLUE}cd admin-web-app && npm run dev${NC}"
echo ""