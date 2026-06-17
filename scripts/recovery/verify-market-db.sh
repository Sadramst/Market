#!/usr/bin/env bash
set -uo pipefail
PG=appilico-postgres-1
if pgrep -af 's456.sh' >/dev/null 2>&1; then echo "RESTORE_SCRIPT: STILL_RUNNING"; else echo "RESTORE_SCRIPT: DONE"; fi
echo "--- restore log tail ---"; tail -6 /tmp/market_restore.log 2>/dev/null || echo "(no log yet)"
echo "--- databases ---"; docker exec "$PG" psql -U postgres -lqt | cut -d'|' -f1 | sed '/^[[:space:]]*$/d'
echo "--- Providers ---"; docker exec "$PG" psql -U postgres -d appilico_market -tAc 'SELECT COUNT(*) FROM "Providers";' 2>&1 | head -2
echo "--- Suburbs ---"; docker exec "$PG" psql -U postgres -d appilico_market -tAc 'SELECT COUNT(*) FROM "Suburbs";' 2>&1 | head -2
echo "--- Categories ---"; docker exec "$PG" psql -U postgres -d appilico_market -tAc 'SELECT COUNT(*) FROM "Categories";' 2>&1 | head -2
echo "--- Admin/Moderator users ---"; docker exec "$PG" psql -U postgres -d appilico_market -tAc 'SELECT COUNT(*) FROM "AspNetUserRoles" ur JOIN "AspNetRoles" r ON r."Id"=ur."RoleId" WHERE r."Name" IN ('"'"'SuperAdmin'"'"','"'"'Moderator'"'"');' 2>&1 | head -2
echo "--- Admin emails ---"; docker exec "$PG" psql -U postgres -d appilico_market -tAc 'SELECT u."Email" FROM "AspNetUsers" u JOIN "AspNetUserRoles" ur ON ur."UserId"=u."Id" JOIN "AspNetRoles" r ON r."Id"=ur."RoleId" WHERE r."Name" IN ('"'"'SuperAdmin'"'"','"'"'Moderator'"'"');' 2>&1 | head -5
