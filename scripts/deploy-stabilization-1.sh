#!/bin/bash

################################################################################
# APPILICO STABILIZATION PHASES 1-4 - SERVER DEPLOYMENT
# Usage: bash deploy-stabilization-1.sh
# Purpose: Deploy backend/frontend stabilization phases; admin Vercel redeploy is separate
################################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'  # No Color

# Configuration
REPO_PATH="/home/appilico/appilico-market"
BACKEND_PATH="${REPO_PATH}/backend"
FRONTEND_PATH="${REPO_PATH}/frontend"
DB_HOST="localhost"
DB_NAME="appilico_beauty"
DB_USER="appilico"
BACKUP_DIR="/home/appilico/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}APPILICO STABILIZATION 1-4${NC}"
echo -e "${BLUE}================================${NC}\n"

# Function to log messages
log_info() {
  echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
  echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if service is running
check_service() {
  local service=$1
  if systemctl is-active --quiet $service; then
    log_info "$service is running"
    return 0
  else
    log_warn "$service is not running"
    return 1
  fi
}

# Pre-flight checks
log_info "Running pre-flight checks..."

if [ ! -d "$REPO_PATH" ]; then
  log_error "Repository not found at $REPO_PATH"
  exit 1
fi

if ! command -v git &> /dev/null; then
  log_error "Git not found"
  exit 1
fi

if ! command -v psql &> /dev/null; then
  log_error "PostgreSQL client not found"
  exit 1
fi

log_info "Pre-flight checks passed\n"

# Step 1: Backup database
log_info "Step 1/6: Backing up database..."
mkdir -p "$BACKUP_DIR"
BACKUP_FILE="${BACKUP_DIR}/appilico_beauty_${TIMESTAMP}.sql.gz"
pg_dump -U $DB_USER -h $DB_HOST $DB_NAME | gzip > "$BACKUP_FILE"
if [ -f "$BACKUP_FILE" ]; then
  log_info "Database backed up to $BACKUP_FILE ($(du -h $BACKUP_FILE | cut -f1))\n"
else
  log_error "Database backup failed"
  exit 1
fi

# Step 2: Pull latest code
log_info "Step 2/6: Pulling latest code from repository..."
cd "$REPO_PATH"
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
log_info "Current branch: $CURRENT_BRANCH"

# Save current commit for potential rollback
PREVIOUS_COMMIT=$(git rev-parse HEAD)
log_info "Previous commit: $PREVIOUS_COMMIT"

git fetch origin
git pull origin $CURRENT_BRANCH

CURRENT_COMMIT=$(git rev-parse HEAD)
log_info "Current commit: $CURRENT_COMMIT\n"

# Step 3: Run database migrations (SQL fixes for Phase 1)
log_info "Step 3/6: Running database migrations (Phase 1 category fixes)..."
if [ -f "${REPO_PATH}/scripts/stabilization-phase-1-fix-categories.sql" ]; then
  log_info "Executing Phase 1 SQL script..."
  psql -U $DB_USER -h $DB_HOST -d $DB_NAME -f "${REPO_PATH}/scripts/stabilization-phase-1-fix-categories.sql"
  log_info "Phase 1 database migrations completed\n"
else
  log_warn "SQL script not found at ${REPO_PATH}/scripts/stabilization-phase-1-fix-categories.sql"
  log_warn "Skipping Phase 1 database migrations\n"
fi

# Step 4: Build and deploy backend
log_info "Step 4/6: Building backend (Phases 1-2)..."
cd "$BACKEND_PATH"

# Check if solution file exists
if [ ! -f "Appilico.Market.sln" ]; then
  log_error "Solution file not found at $BACKEND_PATH/Appilico.Market.sln"
  exit 1
fi

log_info "Cleaning build artifacts..."
dotnet clean -c Release 2>/dev/null || true
rm -rf bin obj src/*/bin src/*/obj 2>/dev/null || true

log_info "Restoring dependencies..."
dotnet restore

log_info "Building solution..."
dotnet build -c Release --no-restore

log_info "Publishing API..."
dotnet publish src/Appilico.Market.Api/Appilico.Market.Api.csproj -c Release -o ./bin/Release/publish

# Check if published files exist
if [ ! -d "./bin/Release/publish" ]; then
  log_error "Backend build failed - published directory not found"
  exit 1
fi

log_info "Backend build completed\n"

# Step 5: Deploy backend artifacts
log_info "Step 5/6: Deploying backend artifacts..."

# Stop the API service
if check_service "appilico-api"; then
  log_info "Stopping appilico-api service..."
  sudo systemctl stop appilico-api
  sleep 2
fi

# Copy published files
API_DEPLOY_PATH="/home/appilico/appilico-api"
if [ -d "$API_DEPLOY_PATH" ]; then
  log_info "Backing up current API deployment..."
  sudo mv "$API_DEPLOY_PATH" "${API_DEPLOY_PATH}.backup.${TIMESTAMP}"
fi

sudo mkdir -p "$API_DEPLOY_PATH"
sudo cp -r ./bin/Release/publish/* "$API_DEPLOY_PATH/"
sudo chown -R appilico:appilico "$API_DEPLOY_PATH"

log_info "Backend deployed to $API_DEPLOY_PATH"

# Restart the API service
log_info "Starting appilico-api service..."
sudo systemctl start appilico-api
sleep 3

if check_service "appilico-api"; then
  log_info "appilico-api service started successfully\n"
else
  log_error "Failed to start appilico-api service"
  log_warn "Rolling back to previous deployment..."
  if [ -d "${API_DEPLOY_PATH}.backup.${TIMESTAMP}" ]; then
    sudo rm -rf "$API_DEPLOY_PATH"
    sudo mv "${API_DEPLOY_PATH}.backup.${TIMESTAMP}" "$API_DEPLOY_PATH"
    sudo systemctl start appilico-api
  fi
  exit 1
fi

# Step 6: Build and deploy frontend
log_info "Step 6/6: Building and deploying frontend (Phases 1-4)..."
cd "$FRONTEND_PATH"

if [ ! -f "package.json" ]; then
  log_error "Frontend package.json not found at $FRONTEND_PATH"
  exit 1
fi

log_info "Installing dependencies..."
npm install --legacy-peer-deps 2>&1 | tail -5

log_info "Building frontend..."
npm run build

log_info "Deploying frontend..."

# Frontend is typically deployed via Docker or to static hosting
# This example assumes Docker deployment
if command -v docker &> /dev/null; then
  log_info "Building Docker images..."
  cd "$REPO_PATH"
  docker-compose -f docker-compose.yml build
  
  log_info "Restarting services..."
  docker-compose -f docker-compose.yml up -d
  
  sleep 5
  log_info "Services restarted\n"
fi

# Post-deployment verification
log_info "Post-deployment verification..."

# Check API health
log_info "Checking API health..."
API_HEALTH_URL="http://localhost:5000/api/providers/stats"
if curl -s "$API_HEALTH_URL" > /dev/null 2>&1; then
  log_info "API is responding\n"
else
  log_warn "Could not verify API health\n"
fi

# Summary
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}DEPLOYMENT COMPLETED${NC}"
echo -e "${GREEN}================================${NC}\n"

log_info "Deployment Summary:"
echo "  Phases:          1-4 Stabilization (featured, new listing, suburb filter, category tabs)"
echo "  Previous Commit: $PREVIOUS_COMMIT"
echo "  Current Commit:  $CURRENT_COMMIT"
echo "  Database Backup: $BACKUP_FILE"
echo "  API Deployment:  $API_DEPLOY_PATH"
echo "  Timestamp:       $TIMESTAMP\n"

log_info "Deployed Fixes:"
echo "  PHASE 1: Featured section (rating >= 4.7, reviews >= 50)"
echo "  PHASE 1: New listing badge (< 30 days AND < 10 reviews)"
echo "  PHASE 1: Category misassignments (Hussein, Bang, BI HAIR)"
echo "  PHASE 2: Suburb filter with autocomplete dropdown"
echo "  PHASE 2: Category tabs that preserve suburb param"
echo "  PHASE 2: Dynamic page rendering (no static cache)"
echo "  PHASE 3: Admin Vercel env var + auth route hardening (redeploy admin app separately)"
echo "  PHASE 4: Service marketplace seeding + error boundaries\n"

log_info "Verification Tests:"
echo "  1. Visit: https://beauty.appilico.com.au/search"
echo "  2. Click suburb filter, select Subiaco"
echo "  3. Click Nails category tab - suburb should be preserved"
echo "  4. Featured section should show only 4.7+ rated providers"
echo "  5. New listing badge only on <30 day old + <10 review providers\n"

log_info "Phase 4 server seeding command:"
echo "  cd /home/appilico/appilico-market/backend"
echo "  dotnet run --project src/Appilico.Market.Api -- seed:services\n"

log_info "Phase 4 service-site notes:"
echo "  - Service search/category pages now force dynamic rendering"
echo "  - API calls include platform=services"
echo "  - Deploy the frontend/app service site through its normal Vercel pipeline after merge\n"

log_info "To rollback if issues occur:"
echo "  psql -U $DB_USER -h $DB_HOST -d $DB_NAME < $BACKUP_FILE"
echo "  systemctl restart appilico-api\n"

echo -e "${GREEN}Deployment finished at $(date)${NC}\n"

