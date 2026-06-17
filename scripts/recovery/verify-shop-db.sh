#!/usr/bin/env bash
set -uo pipefail
PG=appilico-postgres-1
echo "=== databases ==="
docker exec "$PG" psql -U postgres -lqt | cut -d'|' -f1 | sed '/^[[:space:]]*$/d'
echo "=== appilico_shop public table count ==="
docker exec "$PG" psql -U postgres -d appilico_shop -tAc "SELECT count(*) FROM information_schema.tables WHERE table_schema='public'"
echo "=== appilico_shop Products/Orders ==="
docker exec "$PG" psql -U postgres -d appilico_shop -c 'SELECT (SELECT count(*) FROM "Products") AS products, (SELECT count(*) FROM "Orders") AS orders;' 2>&1 | head -8
