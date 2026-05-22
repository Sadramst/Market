#!/bin/bash
# Quick deploy/update script
set -euo pipefail

DEPLOY_DIR="/opt/appilico"
cd "$DEPLOY_DIR"

echo "=== Pulling latest changes ==="
git pull origin main

echo "=== Ensuring DB_CONNECTION_STRING is set in .env ==="
if ! grep -q "DB_CONNECTION_STRING" .env 2>/dev/null; then
  DB_USER=$(grep DB_USER .env | cut -d= -f2)
  DB_PASS=$(grep DB_PASSWORD .env | cut -d= -f2)
  echo "DB_CONNECTION_STRING=Host=postgres;Port=5432;Database=appilico_market;Username=${DB_USER};Password=${DB_PASS}" >> .env
  echo "  Added DB_CONNECTION_STRING to .env"
fi

echo "=== Rebuilding and restarting ==="
docker compose -f docker-compose.production.yml build --no-cache api
docker compose -f docker-compose.production.yml down
docker compose -f docker-compose.production.yml up -d

echo "=== Waiting for services to start ==="
sleep 10

echo "=== Health check ==="
curl -sf http://localhost:5000/health && echo " ✓ API healthy" || echo " ✗ API not responding"

echo "=== Checking API logs ==="
docker compose -f docker-compose.production.yml logs api --tail 20

echo "=== Done ==="
