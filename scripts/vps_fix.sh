#!/bin/bash
# =============================================================
# Appilico VPS Full Fix Script
# Fixes: DB auth, nginx aliases, verifies both APIs
# Safe to re-run; all edits are idempotent.
# =============================================================
set -euo pipefail
LOG=/tmp/appilico_fix_$(date +%s).log
exec > >(tee -a "$LOG") 2>&1

echo "=== START FIX $(date) ==="
cd /opt/appilico

# ─── Step 1: Reset postgres password via peer auth (no password needed locally)
echo "--- Resetting postgres user password to 'postgres123' via peer auth ---"
docker exec appilico-db psql -U postgres -c "ALTER USER postgres PASSWORD 'postgres123';"

# ─── Step 2: Create appilico_user if missing, grant access
echo "--- Ensuring appilico_market DB grants ---"
docker exec appilico-db psql -U postgres -c "
  DO \$\$
  BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'appilico_user') THEN
      CREATE USER appilico_user WITH PASSWORD 'AppilicoMarket2024secure';
    END IF;
    GRANT ALL PRIVILEGES ON DATABASE appilico_market TO appilico_user;
    GRANT ALL PRIVILEGES ON DATABASE appilico_shop TO appilico_user;
  END
  \$\$;
  GRANT ALL PRIVILEGES ON DATABASE appilico_market TO postgres;
  GRANT ALL PRIVILEGES ON DATABASE appilico_shop TO postgres;
" || true

# ─── Step 3: Update compose file – use the newly set 'postgres123' password
echo "--- Updating docker-compose.dual.yml connection strings ---"
cp docker-compose.dual.yml docker-compose.dual.yml.bak.$(date +%s) 2>/dev/null || true

# Fix postgres service environment
sed -i 's/POSTGRES_PASSWORD: postgres$/POSTGRES_PASSWORD: postgres123/' docker-compose.dual.yml
sed -i 's/POSTGRES_USER: postgres$/POSTGRES_USER: postgres/' docker-compose.dual.yml

# Fix API connection strings (handles both hardcoded and env-var variants)
sed -i 's/Password=postgres;/Password=postgres123;/g' docker-compose.dual.yml
sed -i 's/Password=postgres"/Password=postgres123"/g' docker-compose.dual.yml
sed -i 's/Password=\${POSTGRES_PASSWORD}/Password=postgres123/g' docker-compose.dual.yml

echo "--- Verify connection string lines ---"
grep -n "POSTGRES_PASSWORD\|ConnectionStrings__DefaultConnection" docker-compose.dual.yml

# ─── Step 4: Add api.appilico.com alias to nginx so store frontend works
echo "--- Patching nginx server_name ---"
if ! grep -q "api.appilico.com " nginx/conf.d/api.conf 2>/dev/null; then
  sed -i 's/server_name api\.appilico\.com\.au;/server_name api.appilico.com.au api.appilico.com;/' nginx/conf.d/api.conf
fi
echo "Nginx server_name lines:"
grep "server_name" nginx/conf.d/api.conf || true

# ─── Step 5: Restart only API + nginx (no postgres restart = no data risk)
echo "--- Restarting market-api, shop-api, nginx ---"
docker compose -f docker-compose.dual.yml up -d --force-recreate --no-deps market-api shop-api nginx

# ─── Step 6: Wait for apps to start
echo "--- Waiting 18s for apps to warm up ---"
sleep 18

# ─── Step 7: Verify
echo "--- Container status ---"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo "--- Market API /api/providers/search ---"
curl -s -o /dev/null -w "HTTP %{http_code}\n" "http://127.0.0.1:5000/api/providers/search?pageSize=1"

echo "--- Shop API /api/products ---"
curl -s -o /dev/null -w "HTTP %{http_code}\n" "http://127.0.0.1:8080/api/products?page=1&pageSize=1"

echo "--- Market /api/auth/login (should 400 bad-request, not 500) ---"
curl -s -o /dev/null -w "HTTP %{http_code}\n" -X POST http://127.0.0.1:5000/api/auth/login

echo "--- Public HTTPS ---"
curl -s -o /dev/null -w "api.appilico.com.au: HTTP %{http_code}\n" "https://api.appilico.com.au/"
curl -s -o /dev/null -w "api.appilico.com:    HTTP %{http_code}\n" "https://api.appilico.com/"

echo "=== FIX COMPLETE $(date) ==="
echo "Log: $LOG"
