#!/bin/bash
# Appilico Market — VPS Deployment Script
# Run on a fresh Ubuntu 22.04+ VPS

set -euo pipefail

echo "=== Appilico Market — VPS Setup ==="

# 1. System updates
echo "[1/7] Updating system..."
apt-get update && apt-get upgrade -y
apt-get install -y curl git ufw

# 2. Install Docker
echo "[2/7] Installing Docker..."
if ! command -v docker &> /dev/null; then
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker
  systemctl start docker
fi

# 3. Install Docker Compose
echo "[3/7] Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
  apt-get install -y docker-compose-plugin
fi

# 4. Firewall
echo "[4/7] Configuring firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# 5. Clone repo
echo "[5/7] Cloning repository..."
DEPLOY_DIR="/opt/appilico"
if [ ! -d "$DEPLOY_DIR" ]; then
  git clone https://github.com/Sadramst/Market.git "$DEPLOY_DIR"
else
  cd "$DEPLOY_DIR" && git pull origin main
fi
cd "$DEPLOY_DIR"

# 6. Environment file
echo "[6/7] Setting up environment..."
if [ ! -f .env ]; then
  cp .env.example .env
  # Generate JWT secret
  JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n')
  sed -i "s|CHANGE_ME_TO_A_SECURE_RANDOM_STRING_OF_AT_LEAST_64_CHARS|$JWT_SECRET|" .env
  echo ""
  echo "⚠️  IMPORTANT: Edit /opt/appilico/.env and set a secure DB_PASSWORD"
  echo ""
fi

# 7. SSL Certificate (initial)
echo "[7/7] Setting up SSL..."
mkdir -p certbot/conf certbot/www
# Initial cert request (requires DNS pointing to this server)
# docker compose -f docker-compose.production.yml run --rm certbot certonly --webroot -w /var/www/certbot -d api.appilico.com.au --agree-tos --email admin@appilico.com.au --non-interactive

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Next steps:"
echo "  1. Edit /opt/appilico/.env with your DB password"
echo "  2. Point DNS records to this server's IP"
echo "  3. Run: cd /opt/appilico && docker compose -f docker-compose.production.yml up -d"
echo "  4. Request SSL: docker compose -f docker-compose.production.yml run --rm certbot certonly --webroot -w /var/www/certbot -d api.appilico.com.au --agree-tos --email admin@appilico.com.au"
echo "  5. Restart nginx: docker compose -f docker-compose.production.yml restart nginx"
echo ""
