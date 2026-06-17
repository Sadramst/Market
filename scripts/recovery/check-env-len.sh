#!/usr/bin/env bash
set -uo pipefail
cd /opt/appilico
for k in JWT_SECRET_KEY JWT_SECRET DB_USER DB_PASSWORD; do
  v=$(grep -E "^${k}=" .env | head -1 | cut -d= -f2-)
  echo "$k length=${#v}"
done
