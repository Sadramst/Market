#!/usr/bin/env bash
# Stages 4-6 — Separate ShopServer source, restore Market source from git, restore Market DB.
# Safe: ShopServer source is MOVED (not deleted); appilico_shop already holds shop data;
# full backups exist under backups/recovery-*. appilico_market is dropped+restored from the
# May-31 Market dump (its prior ShopServer contents are already dumped in the recovery backup).
set -euo pipefail

APP=/opt/appilico
PG=appilico-postgres-1
SHOP_SRC=/opt/shopserver           # new home for ShopServer source tree
MARKET_DUMP="$APP/backups/appilico_market-before-reinitialize-20260531064343.sql"

cd "$APP"

echo "######## STAGE 4: Relocate ShopServer source -> $SHOP_SRC ########"
mkdir -p "$SHOP_SRC"
# ShopServer files currently live (untracked) inside backend/. Move the whole contaminated
# backend/ aside, then we will restore the Market backend/ from git in Stage 5.
if [ -d "$SHOP_SRC/backend" ]; then
  echo "  $SHOP_SRC/backend already exists — leaving it; archiving current backend/ to timestamped dir"
  mv backend "$SHOP_SRC/backend-dup-$(date +%Y%m%d_%H%M%S)"
else
  mv backend "$SHOP_SRC/backend"
  echo "  Moved backend/ -> $SHOP_SRC/backend"
fi

echo "######## STAGE 5: Restore Market backend from git HEAD ########"
git checkout -- backend
git -c advice.detachedHead=false status backend --short | head -5 || true
if [ -f backend/src/Appilico.Market.Api/Program.cs ]; then
  echo "  OK: Market backend restored (Program.cs present)."
else
  echo "  !!! ABORT: Market backend not restored from git."
  exit 1
fi
# Sanity: ensure no ShopServer leftovers remain inside the restored backend/
if ls backend/src/AppilicoShopServer.* >/dev/null 2>&1; then
  echo "  !!! WARNING: ShopServer dirs still present in backend/src — investigate."
fi

echo "######## STAGE 6: Restore Market database (appilico_market) ########"
if [ ! -s "$MARKET_DUMP" ]; then echo "  !!! Market dump missing: $MARKET_DUMP"; exit 1; fi
echo "  Stopping current ShopServer api container so it releases DB connections..."
docker stop appilico-api-1 >/dev/null 2>&1 || true
echo "  Terminating connections to appilico_market..."
docker exec "$PG" psql -U postgres -d postgres -c \
  "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='appilico_market' AND pid<>pg_backend_pid();" >/dev/null 2>&1 || true
echo "  Dropping + recreating appilico_market (ShopServer copy already saved in appilico_shop + backups)..."
docker exec "$PG" psql -U postgres -d postgres -c "DROP DATABASE IF EXISTS appilico_market;"
docker exec "$PG" psql -U postgres -d postgres -c "CREATE DATABASE appilico_market OWNER postgres;"
echo "  Loading Market dump ($(basename "$MARKET_DUMP"))..."
docker exec -i "$PG" psql -v ON_ERROR_STOP=0 -U postgres -d appilico_market < "$MARKET_DUMP" > /tmp/market_restore.log 2>&1 || true
echo "  Restore log tail:"; tail -5 /tmp/market_restore.log

echo "######## VERIFY ########"
echo "-- Providers count --"
docker exec "$PG" psql -U postgres -d appilico_market -tAc 'SELECT COUNT(*) FROM "Providers";' 2>&1 | head -3
echo "-- Suburbs count --"
docker exec "$PG" psql -U postgres -d appilico_market -tAc 'SELECT COUNT(*) FROM "Suburbs";' 2>&1 | head -3
echo "-- Admin users (SuperAdmin/Moderator) --"
docker exec "$PG" psql -U postgres -d appilico_market -tAc \
  'SELECT COUNT(*) FROM "AspNetUserRoles" ur JOIN "AspNetRoles" r ON r."Id"=ur."RoleId" WHERE r."Name" IN ('"'"'SuperAdmin'"'"','"'"'Moderator'"'"');' 2>&1 | head -3
echo "-- databases --"
docker exec "$PG" psql -U postgres -lqt | cut -d'|' -f1 | sed '/^[[:space:]]*$/d'
echo "######## Stages 4-6 complete ########"
