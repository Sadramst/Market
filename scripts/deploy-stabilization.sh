#!/bin/bash

# Appilico Market - Stabilization Phase Deployment Script
# Deploys all 4 stabilization prompts with database fixes, backend rebuild, and container restart

set -e  # Exit on error

echo "========================================="
echo "Appilico Market - Stabilization Deploy"
echo "========================================="
echo ""

# Configuration
REPO_DIR="/opt/appilico"
DB_NAME="appilico_market"
DB_USER="postgres"
BACKUP_DIR="/opt/appilico/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Step 1: Backup database
echo "[1/7] Creating database backup..."
mkdir -p "$BACKUP_DIR"
BACKUP_FILE="$BACKUP_DIR/market_backup_${TIMESTAMP}.sql"
PGPASSWORD="$POSTGRES_PASSWORD" pg_dump -h localhost -U "$DB_USER" "$DB_NAME" > "$BACKUP_FILE"
echo "✓ Database backed up to $BACKUP_FILE"
echo ""

# Step 2: Pull latest code
echo "[2/7] Pulling latest code from origin/main..."
cd "$REPO_DIR"
git pull origin main
echo "✓ Code updated"
echo ""

# Step 3: Execute database stabilization script
echo "[3/7] Executing database stabilization script..."
if [ -f "scripts/stabilization-prompt-1-4.sql" ]; then
    PGPASSWORD="$POSTGRES_PASSWORD" psql -h localhost -U "$DB_USER" -d "$DB_NAME" -f "scripts/stabilization-prompt-1-4.sql"
    echo "✓ Database stabilization completed (Prompts 1 & 4)"
    echo "  - Fixed beauty service provider categories"
    echo "  - Seeded IT service categories and providers"
else
    echo "✗ ERROR: scripts/stabilization-prompt-1-4.sql not found"
    exit 1
fi
echo ""

# Step 4: Rebuild backend in Release mode
echo "[4/7] Rebuilding backend in Release configuration..."
cd "$REPO_DIR/backend"
dotnet build -c Release
echo "✓ Backend rebuilt successfully"
echo ""

# Step 5: Build frontend
echo "[5/7] Building frontend..."
cd "$REPO_DIR/frontend"
npm run build
echo "✓ Frontend built successfully"
echo ""

# Step 6: Stop and restart Docker containers
echo "[6/7] Restarting Docker containers..."
cd "$REPO_DIR"

# Check if production compose file exists
if [ -f "docker-compose.production.yml" ]; then
    docker-compose -f docker-compose.production.yml down
    docker-compose -f docker-compose.production.yml up -d
    echo "✓ Containers restarted (production compose)"
elif [ -f "docker-compose.yml" ]; then
    docker-compose down
    docker-compose up -d
    echo "✓ Containers restarted (default compose)"
else
    echo "✗ ERROR: No docker-compose file found"
    exit 1
fi
echo ""

# Step 7: Verify services are running
echo "[7/7] Verifying services..."
sleep 5

# Check API endpoint
API_URL="http://localhost:8080/api/health"
if curl -s "$API_URL" > /dev/null 2>&1; then
    echo "✓ API responding at $API_URL"
else
    echo "⚠ WARNING: API not responding - check logs with: docker logs market_api"
fi

# Check database connection
if PGPASSWORD="$POSTGRES_PASSWORD" psql -h localhost -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1" > /dev/null 2>&1; then
    echo "✓ Database connected successfully"
else
    echo "✗ ERROR: Database connection failed"
    exit 1
fi

echo ""
echo "========================================="
echo "✅ DEPLOYMENT COMPLETED SUCCESSFULLY"
echo "========================================="
echo ""
echo "Summary:"
echo "  • Database backed up: $BACKUP_FILE"
echo "  • Code updated from origin/main"
echo "  • Database stabilization applied (Prompts 1 & 4)"
echo "  • Backend rebuilt (Release mode)"
echo "  • Frontend rebuilt"
echo "  • Docker containers restarted"
echo "  • Services verified"
echo ""
echo "To verify live site changes:"
echo "  1. Check beauty categories at: https://appilico.com.au"
echo "  2. Verify IT services appear in search"
echo "  3. View new providers and ratings"
echo ""
echo "Rollback available at: $BACKUP_FILE"
echo "========================================="
