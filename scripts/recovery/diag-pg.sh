#!/usr/bin/env bash
set -uo pipefail
PG=appilico-postgres-1
echo "--- active sessions ---"
docker exec "$PG" psql -U postgres -d postgres -c "SELECT pid, datname, state, wait_event_type AS wevt, left(query,50) AS q FROM pg_stat_activity ORDER BY pid;"
echo "--- prepared transactions (orphan locks) ---"
docker exec "$PG" psql -U postgres -d postgres -c "SELECT * FROM pg_prepared_xacts;"
echo "--- ungranted locks ---"
docker exec "$PG" psql -U postgres -d postgres -c "SELECT pid, granted, locktype, mode FROM pg_locks WHERE NOT granted;"
