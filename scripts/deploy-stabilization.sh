#!/bin/bash

set -euo pipefail

REPO_DIR="/opt/appilico"
DB_NAME="appilico_market"
BACKUP_DIR="$REPO_DIR/backups"
SQL_FILE="$REPO_DIR/scripts/stabilization-prompt-1-4.sql"
BASE_DEPLOY_SCRIPT="$REPO_DIR/scripts/deploy-update.sh"
DB_CONTAINER="appilico-db"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

require_cmd() {
    if ! command -v "$1" >/dev/null 2>&1; then
        echo "Missing required command: $1" >&2
        exit 1
    fi
}

log "Appilico stabilization deploy starting"

require_cmd git
require_cmd docker
require_cmd curl

if [ ! -d "$REPO_DIR" ]; then
    echo "Repo directory not found: $REPO_DIR" >&2
    exit 1
fi

if [ ! -f "$BASE_DEPLOY_SCRIPT" ]; then
    echo "Base deploy script not found: $BASE_DEPLOY_SCRIPT" >&2
    exit 1
fi

cd "$REPO_DIR"

if [ -f ".env" ]; then
    set -a
    # shellcheck disable=SC1091
    source .env
    set +a
else
    echo "Missing $REPO_DIR/.env" >&2
    exit 1
fi

DB_USER="${DB_USER:-}"
DB_PASSWORD="${DB_PASSWORD:-}"

if [ -z "$DB_USER" ] || [ -z "$DB_PASSWORD" ]; then
    echo "DB_USER or DB_PASSWORD is missing from .env" >&2
    exit 1
fi

if [ ! -f "$SQL_FILE" ]; then
    echo "SQL file not found: $SQL_FILE" >&2
    exit 1
fi

mkdir -p "$BACKUP_DIR"
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_stabilization_${TIMESTAMP}.sql.gz"

log "Fetching latest code"
git fetch origin
git pull origin main

log "Checking database container"
if ! docker ps --format '{{.Names}}' | grep -qx "$DB_CONTAINER"; then
    echo "Database container is not running: $DB_CONTAINER" >&2
    exit 1
fi

log "Creating database backup: $BACKUP_FILE"
docker exec "$DB_CONTAINER" sh -lc "PGPASSWORD='$DB_PASSWORD' pg_dump -U '$DB_USER' '$DB_NAME'" | gzip > "$BACKUP_FILE"

log "Applying stabilization SQL"
docker exec -i "$DB_CONTAINER" sh -lc "PGPASSWORD='$DB_PASSWORD' psql -v ON_ERROR_STOP=1 -U '$DB_USER' -d '$DB_NAME'" < "$SQL_FILE"

log "Running main deploy script"
bash "$BASE_DEPLOY_SCRIPT"

log "Verifying API health"
if curl -fsS http://localhost:5000/health >/dev/null 2>&1; then
    log "API health check passed"
else
    echo "API health check failed after deploy" >&2
    exit 1
fi

echo
echo "Deploy complete"
echo "Backup: $BACKUP_FILE"
echo "SQL applied: $SQL_FILE"
echo "Next: verify https://api.appilico.com.au/health and live marketplace pages"
