#!/usr/bin/env bash
# Read-only infrastructure inventory for dual-app design.
set -uo pipefail
APP=/opt/appilico

echo "############ HOST RESOURCES ############"
echo "--- free -h ---"; free -h
echo "--- df -h / ---"; df -h /
echo "--- swap ---"; swapon --show || echo "(no swap)"

echo; echo "############ DOCKER OVERVIEW ############"
echo "--- docker ps -a ---"
docker ps -a --format 'table {{.Names}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}'
echo "--- networks ---"; docker network ls

echo; echo "############ HOW THE STACK WAS LAUNCHED ############"
for c in appilico-api-1 appilico-postgres-1 appilico-nginx appilico-certbot; do
  echo "--- $c labels (compose project/files) ---"
  docker inspect "$c" --format '{{range $k,$v := .Config.Labels}}{{$k}}={{$v}}
{{end}}' 2>/dev/null | grep -i compose || echo "  (no compose labels / not found)"
  echo "--- $c networks ---"
  docker inspect "$c" --format '{{range $n,$v := .NetworkSettings.Networks}}{{$n}} {{end}}' 2>/dev/null
done

echo; echo "############ API CONTAINER RUNTIME ENV (DB/JWT only, masked) ############"
docker inspect appilico-api-1 --format '{{range .Config.Env}}{{println .}}{{end}}' 2>/dev/null \
  | grep -iE 'CONNECT|JWT|ASPNETCORE|DB_|POSTGRES' \
  | sed -E 's/(Password=)[^;\"]+/\1***/I; s/(Secret[^=]*=)[^ ]+/\1***/I; s/(Key=)[^ ;]+/\1***/I'

echo; echo "############ NGINX CONFIG ############"
echo "--- conf.d listing ---"; ls -la "$APP/nginx/conf.d/"
for f in "$APP"/nginx/conf.d/*.conf; do
  echo "===== $f ====="; cat "$f"
done
echo "--- nginx.conf (http block head) ---"; sed -n '1,60p' "$APP/nginx/nginx.conf"

echo; echo "############ SSL CERTS AVAILABLE ############"
ls -la "$APP/certbot/conf/live/" 2>/dev/null || echo "(no certbot/conf/live)"

echo; echo "############ GIT: is backend recoverable from HEAD? ############"
git -C "$APP" cat-file -e HEAD:backend/src/Appilico.Market.Api/Program.cs 2>/dev/null \
  && echo "Market backend Program.cs EXISTS in git HEAD (restorable via checkout)" \
  || echo "!!! Market backend NOT in git HEAD"
echo "=== inventory complete ==="
