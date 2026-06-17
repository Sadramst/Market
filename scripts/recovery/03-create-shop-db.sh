#!/usr/bin/env bash
# Stage 3 — Create appilico_shop DB and load current ShopServer data into it.
# Additive: creates a NEW database; does not touch appilico_market or the running app.
set -uo pipefail

PG=appilico-postgres-1
APP_DIR=/opt/appilico

# Find the most recent recovery backup dir + the shop dump inside it
BK=$(ls -1dt "$APP_DIR"/backups/recovery-* 2>/dev/null | head -1)
if [ -z "${BK:-}" ]; then echo "!!! No recovery backup dir found. Run Stage 1 first."; exit 1; fi
DUMP=$(ls -1 "$BK"/shopserver-db-*.dump 2>/dev/null | head -1)
if [ -z "${DUMP:-}" ] || [ ! -s "$DUMP" ]; then echo "!!! Shop dump not found in $BK"; exit 1; fi
echo "Using shop dump: $DUMP"

# 1) Create the appilico_shop database if it does not already exist
echo "--- Creating database appilico_shop (if absent) ---"
EXISTS=$(docker exec "$PG" psql -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname='appilico_shop'")
if [ "$EXISTS" = "1" ]; then
  echo "appilico_shop already exists — leaving as-is (will not overwrite)."
else
  docker exec "$PG" psql -U postgres -c "CREATE DATABASE appilico_shop OWNER postgres;"
  echo "Created appilico_shop."
fi

# 2) Restore the shop data into appilico_shop (only if it's currently empty)
TABLES=$(docker exec "$PG" psql -U postgres -d appilico_shop -tAc "SELECT count(*) FROM information_schema.tables WHERE table_schema='public'")
echo "appilico_shop currently has $TABLES public tables."
if [ "${TABLES:-0}" -gt 0 ]; then
  echo "appilico_shop is not empty — skipping restore to avoid clobbering."
else
  echo "--- Restoring shop dump into appilico_shop ---"
  docker exec -i "$PG" pg_restore -U postgres -d appilico_shop --no-owner --role=postgres < "$DUMP"
  echo "Restore exit: $?"
fi

# 3) Verify
echo "=== appilico_shop tables (count) ==="
docker exec "$PG" psql -U postgres -d appilico_shop -tAc "SELECT count(*) FROM information_schema.tables WHERE table_schema='public'"
echo "=== sample: Products / Orders row counts (if present) ==="
docker exec "$PG" psql -U postgres -d appilico_shop -c "SELECT (SELECT count(*) FROM \"Products\") AS products, (SELECT count(*) FROM \"Orders\") AS orders;" 2>/dev/null || echo "(Products/Orders not present — fresh shop schema)"
echo "=== databases now ==="
docker exec "$PG" psql -U postgres -lqt | cut -d'|' -f1 | sed '/^\s*$/d'
echo "=== Stage 3 complete ==="
