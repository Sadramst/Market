#!/usr/bin/env bash
# Stage 1 — Full safety backup before dual-backend recovery.
# Purely additive: creates backups, deletes nothing.
set -uo pipefail

APP_DIR=/opt/appilico
TS=$(date +%Y%m%d_%H%M%S)
BK="$APP_DIR/backups/recovery-$TS"
PG=appilico-postgres-1

echo "=== Stage 1: Backup -> $BK ==="
mkdir -p "$BK"

# 1) Dump the CURRENT appilico_market DB (currently holds ShopServer schema/data)
echo "--- Dumping current appilico_market (ShopServer data) ---"
docker exec "$PG" pg_dump -U postgres -Fc appilico_market > "$BK/shopserver-db-$TS.dump"
docker exec "$PG" pg_dump -U postgres        appilico_market > "$BK/shopserver-db-$TS.sql"
DUMP_BYTES=$(stat -c%s "$BK/shopserver-db-$TS.dump" 2>/dev/null || echo 0)
echo "Custom-format dump bytes: $DUMP_BYTES"
if [ "$DUMP_BYTES" -lt 1000 ]; then
  echo "!!! ABORT: ShopServer DB dump looks empty (<1KB). Investigate before continuing."
  exit 1
fi

# 2) Archive the ShopServer source that currently lives in backend/ (untracked files)
echo "--- Archiving ShopServer source (backend/) ---"
tar czf "$BK/shopserver-backend-src-$TS.tar.gz" -C "$APP_DIR" backend
SRC_BYTES=$(stat -c%s "$BK/shopserver-backend-src-$TS.tar.gz" 2>/dev/null || echo 0)
echo "Source archive bytes: $SRC_BYTES"
if [ "$SRC_BYTES" -lt 1000 ]; then
  echo "!!! ABORT: source archive looks empty. Investigate before continuing."
  exit 1
fi

# 3) Copy all live config / env files (best-effort; these may or may not exist)
echo "--- Copying config + env files ---"
for f in .env .env.backup .env.bak .env.example \
         docker-compose.yml docker-compose.override.yml \
         docker-compose.production.yml docker-compose.production.yml.backup \
         backend/Dockerfile backend/docker-compose.yml \
         nginx/conf.d/api.conf nginx/conf.d/00-rate-limit-zones.conf; do
  if [ -f "$APP_DIR/$f" ]; then
    mkdir -p "$BK/config/$(dirname "$f")"
    cp -a "$APP_DIR/$f" "$BK/config/$f"
    echo "  saved $f"
  fi
done

# 4) Snapshot the live runtime state for the record
echo "--- Snapshotting runtime state ---"
{
  echo "### git log -1"; git -C "$APP_DIR" log --oneline -1
  echo; echo "### git status -sb"; git -C "$APP_DIR" status -sb
  echo; echo "### docker ps"; docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}'
  echo; echo "### docker images"; docker images
  echo; echo "### databases"; docker exec "$PG" psql -U postgres -lqt | cut -d'|' -f1
} > "$BK/state-$TS.txt" 2>&1

# 5) Also copy the pre-existing Market DB backups alongside, for one-stop recovery
echo "--- Linking existing Market DB backups for reference ---"
ls -1 "$APP_DIR"/backups/appilico_market*.sql 2>/dev/null | while read -r m; do
  cp -a "$m" "$BK/" && echo "  copied $(basename "$m")"
done

echo
echo "=== Backup contents ==="
ls -lAh "$BK"
echo
echo "=== Stage 1 complete. Backup dir: $BK ==="
