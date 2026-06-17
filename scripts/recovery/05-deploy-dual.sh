#!/usr/bin/env bash
# Stages 7-9 — Deploy the dual-backend stack (market-api + shop-api), fix nginx, launch, verify.
# Assumes new config files already transferred:
#   /opt/appilico/docker-compose.dual.yml
#   /opt/appilico/nginx/conf.d/api.conf      (upstream -> market-api:5000)
#   /opt/appilico/nginx/conf.d/shop-api.conf (shop-api.appilico.com.au -> shop-api:8080)
set -uo pipefail

APP=/opt/appilico
cd "$APP"
COMPOSE="docker compose -p appilico -f docker-compose.dual.yml"
BK=$(ls -1dt "$APP"/backups/recovery-* 2>/dev/null | head -1)

echo "######## 7a. Quarantine the ShopServer override + duplicate nginx zones ########"
[ -f docker-compose.override.yml ] && mv -f docker-compose.override.yml "${BK:-/tmp}/docker-compose.override.yml.shop" && echo "  moved docker-compose.override.yml -> ${BK}"
# Duplicate limit_req_zone (also defined in nginx.conf) crashes nginx on restart
[ -f nginx/conf.d/00-rate-limit-zones.conf ] && rm -f nginx/conf.d/00-rate-limit-zones.conf && echo "  removed nginx/conf.d/00-rate-limit-zones.conf (duplicate)"

echo "######## 7b. Show config files in place ########"
ls -la docker-compose.dual.yml nginx/conf.d/
echo "--- api.conf upstream ---"; grep -A2 'upstream api_backend' nginx/conf.d/api.conf

echo "######## 8a. Prune build cache to free disk (keeps images) ########"
docker builder prune -af >/dev/null 2>&1 || true
echo "  disk after prune:"; df -h / | tail -1

echo "######## 8b. Build market-api image (this is the only build) ########"
$COMPOSE build market-api 2>&1 | tail -25
echo "  market-api build exit: ${PIPESTATUS[0]}"

echo "######## 9a. Remove old ad-hoc containers (volume preserved) ########"
docker rm -f appilico-api-1 appilico-postgres-1 appilico-nginx appilico-certbot >/dev/null 2>&1 || true
echo "  old containers removed"

echo "######## 9b. Launch dual stack ########"
$COMPOSE up -d
echo "  compose up exit: $?"

echo "######## 9c. Wait for postgres + apis to settle ########"
for i in $(seq 1 30); do
  ph=$(docker inspect -f '{{.State.Health.Status}}' appilico-db 2>/dev/null || echo none)
  [ "$ph" = "healthy" ] && break
  sleep 2
done
echo "  postgres health: $(docker inspect -f '{{.State.Health.Status}}' appilico-db 2>/dev/null)"
# Give the .NET apps time to start + run migrations/seed
sleep 20

echo "######## VERIFY ########"
echo "--- containers ---"
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
echo "--- market-api /health (internal) ---"
docker exec appilico-market-api sh -c 'wget -qO- http://localhost:5000/health 2>/dev/null || curl -s http://localhost:5000/health' 2>/dev/null | head -1 || echo "  (market-api health not ready yet)"
echo "--- shop-api /health (internal) ---"
docker exec appilico-shop-api sh -c 'curl -fsS http://localhost:8080/health 2>/dev/null || wget -qO- http://localhost:8080/health' 2>/dev/null | head -1 || echo "  (shop-api health not ready yet)"
echo "--- nginx config test ---"
docker exec appilico-nginx nginx -t 2>&1 | tail -3
echo "######## Stages 7-9 complete ########"
