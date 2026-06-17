#!/usr/bin/env bash
set -uo pipefail
cd /opt/appilico
for f in docker-compose.dual.yml nginx/conf.d/api.conf nginx/conf.d/shop-api.conf; do
  echo "$f: $(wc -c < "$f") bytes | head: $(head -1 "$f")"
done
echo "--- dual compose services ---"
grep -E '^  [a-z-]+:' docker-compose.dual.yml
echo "--- api upstream ---"
grep -A1 'upstream api_backend' nginx/conf.d/api.conf
echo "--- shop upstream ---"
grep -A1 'upstream shop_backend' nginx/conf.d/shop-api.conf
echo "--- conf.d listing ---"
ls -la nginx/conf.d/
