#!/bin/bash
# =============================================================
# Appilico Market — Full Deploy/Update Script
# Run as root from /opt/appilico
# =============================================================
set -euo pipefail

DEPLOY_DIR="/opt/appilico"
FRONTEND_DIR="$DEPLOY_DIR/frontend"
NODE_VERSION="20"
COMPOSE_FILE="docker-compose.production.yml"
# Fixed project name so Compose always reconciles the SAME containers,
# regardless of the directory it's invoked from. Prevents "container name
# already in use" conflicts on redeploy.
PROJECT="appilico"
COMPOSE="docker compose -p $PROJECT -f $COMPOSE_FILE"

cd "$DEPLOY_DIR"

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║  Appilico Market — Deploy $(date '+%Y-%m-%d %H:%M')  ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# ── Step 1: Pull latest code ──────────────────────────────────
echo "[1/6] Pulling latest code from GitHub..."
git pull origin main
echo "  ✓ Code updated ($(git log -1 --pretty=format:'%h %s'))"

# ── Step 2: Ensure env vars ───────────────────────────────────
echo "[2/6] Checking environment configuration..."
if ! grep -q "DB_CONNECTION_STRING" .env 2>/dev/null; then
  DB_USER=$(grep '^DB_USER=' .env | cut -d= -f2-)
  DB_PASS=$(grep '^DB_PASSWORD=' .env | cut -d= -f2-)
  echo "DB_CONNECTION_STRING=Host=postgres;Port=5432;Database=appilico_market;Username=${DB_USER};Password=${DB_PASS}" >> .env
  echo "  Added DB_CONNECTION_STRING to .env"
fi
echo "  ✓ Environment OK"

# ── Step 3: Rebuild & restart API container ───────────────────
echo "[3/6] Rebuilding API container..."
$COMPOSE build --no-cache api

# Clear any orphaned containers left from a previous failed deploy that
# would otherwise cause "container name already in use" conflicts.
for c in appilico-api appilico-nginx; do
  if docker ps -a --format '{{.Names}}' | grep -qx "$c"; then
    # Only remove if it's NOT already managed by this compose project
    if ! docker inspect -f '{{ index .Config.Labels "com.docker.compose.project" }}' "$c" 2>/dev/null | grep -qx "$PROJECT"; then
      echo "  Removing orphaned container: $c"
      docker rm -f "$c" 2>/dev/null || true
    fi
  fi
done

echo "  Reconciling full stack (postgres data volume is preserved)..."
$COMPOSE up -d --remove-orphans
echo "  ✓ Containers reconciled"

# ── Step 4: Install Node if needed ───────────────────────────
echo "[4/6] Checking Node.js..."
if ! command -v node &>/dev/null || [[ $(node --version | cut -d. -f1 | tr -d 'v') -lt $NODE_VERSION ]]; then
  echo "  Installing Node.js $NODE_VERSION..."
  curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
  apt-get install -y nodejs
fi

# Install PM2 globally if not present
if ! command -v pm2 &>/dev/null; then
  echo "  Installing PM2..."
  npm install -g pm2
fi
echo "  ✓ Node $(node --version), PM2 $(pm2 --version 2>/dev/null || echo 'ready')"

# ── Step 5: Build & restart Next.js frontend apps ────────────
echo "[5/6] Building frontend apps..."

cd "$FRONTEND_DIR"
echo "  Installing frontend dependencies..."
npm install --no-audit --no-fund

# Build beauty app
echo "  Building beauty app..."
cd "$FRONTEND_DIR/apps/beauty"
npm run build 2>&1 | tail -5
echo "  ✓ Beauty app built"

# Build admin app
echo "  Building admin app..."
cd "$FRONTEND_DIR/apps/admin"
npm run build 2>&1 | tail -5
echo "  ✓ Admin app built"

# Build services app (if exists)
if [ -d "$FRONTEND_DIR/apps/services" ]; then
  echo "  Building services app..."
  cd "$FRONTEND_DIR/apps/services"
  npm run build 2>&1 | tail -5
  echo "  ✓ Services app built"
fi

# Start/restart with PM2
cd "$DEPLOY_DIR"
echo "  Starting apps with PM2..."

# Beauty app (port 3000)
pm2 delete beauty-app 2>/dev/null || true
pm2 start npm --name "beauty-app" -- run start \
  --cwd "$FRONTEND_DIR/apps/beauty" \
  -- -p 3000

# Admin app (port 3002)
pm2 delete admin-app 2>/dev/null || true
pm2 start npm --name "admin-app" -- run start \
  --cwd "$FRONTEND_DIR/apps/admin" \
  -- -p 3002

# Services app (port 3001) — if exists
if [ -d "$FRONTEND_DIR/apps/services" ]; then
  pm2 delete services-app 2>/dev/null || true
  pm2 start npm --name "services-app" -- run start \
    --cwd "$FRONTEND_DIR/apps/services" \
    -- -p 3001
fi

pm2 save
echo "  ✓ PM2 apps started"

# ── Step 6: Health checks ─────────────────────────────────────
echo "[6/6] Running health checks..."
sleep 8

# API health
API_STATUS=$(curl -sf http://localhost:5000/health && echo "OK" || echo "FAIL")
echo "  API health: $API_STATUS"

# Frontend ports
for PORT in 3000 3001 3002; do
  STATUS=$(curl -sf -o /dev/null -w "%{http_code}" http://localhost:$PORT/ 2>/dev/null || echo "000")
  echo "  Port $PORT: HTTP $STATUS"
done

echo ""
pm2 list
echo ""
$COMPOSE ps
echo ""
echo "╔══════════════════════════════╗"
echo "║  Deploy complete!  ✓         ║"
echo "╚══════════════════════════════╝"
echo ""
echo "  API logs:     $COMPOSE logs api -f"
echo "  PM2 logs:     pm2 logs"
echo "  PM2 monitor:  pm2 monit"
echo ""
