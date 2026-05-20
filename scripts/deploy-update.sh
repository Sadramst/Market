#!/bin/bash
# Quick deploy/update script
set -euo pipefail

DEPLOY_DIR="/opt/appilico"
cd "$DEPLOY_DIR"

echo "=== Pulling latest changes ==="
git pull origin main

echo "=== Rebuilding and restarting ==="
docker compose -f docker-compose.production.yml build --no-cache api
docker compose -f docker-compose.production.yml up -d

echo "=== Running database migrations ==="
docker compose -f docker-compose.production.yml exec api dotnet ef database update --no-build || echo "Migrations applied via code on startup"

echo "=== Health check ==="
sleep 5
curl -sf http://localhost:5000/health && echo " ✓ API healthy" || echo " ✗ API not responding"

echo "=== Done ==="
