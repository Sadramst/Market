# Appilico Market — Deployment Guide

## Architecture Overview

```
                    ┌─────────────────────────────────────┐
                    │         Vercel (Frontend)            │
                    │  beauty.appilico.com.au  (Next.js)   │
                    │  service.appilico.com.au (Next.js)   │
                    │  admin.appilico.com.au   (Next.js)   │
                    └──────────────┬──────────────────────┘
                                   │ HTTPS
                    ┌──────────────▼──────────────────────┐
                    │      Vultr VPS (Docker)              │
                    │  ┌─────────────────────────────┐    │
                    │  │  Nginx (SSL + Reverse Proxy) │    │
                    │  │  :80 → :443                  │    │
                    │  └──────────┬──────────────────┘    │
                    │             │                        │
                    │  ┌──────────▼──────────────────┐    │
                    │  │  .NET 8 API (:5000)          │    │
                    │  │  api.appilico.com.au         │    │
                    │  └──────────┬──────────────────┘    │
                    │             │                        │
                    │  ┌──────────▼──────────────────┐    │
                    │  │  PostgreSQL 16 (:5432)       │    │
                    │  │  Internal only               │    │
                    │  └─────────────────────────────┘    │
                    └─────────────────────────────────────┘
```

## Prerequisites

- **VPS**: Ubuntu 22.04+, 2GB+ RAM, 20GB+ disk (Vultr recommended)
- **Domain**: `appilico.com.au` with DNS access
- **Vercel**: Free account for frontend hosting
- **GitHub**: Repository at https://github.com/Sadramst/Market

## DNS Configuration

Create these DNS records pointing to your VPS IP:

| Type | Name | Value |
|------|------|-------|
| A | api.appilico.com.au | `<VPS_IP>` |

Create these CNAME records for Vercel:

| Type | Name | Value |
|------|------|-------|
| CNAME | beauty.appilico.com.au | `cname.vercel-dns.com` |
| CNAME | service.appilico.com.au | `cname.vercel-dns.com` |
| CNAME | admin.appilico.com.au | `cname.vercel-dns.com` |

## Backend Deployment (VPS)

### 1. Initial Server Setup

```bash
# SSH into your VPS
ssh root@<VPS_IP>

# Run the setup script
curl -fsSL https://raw.githubusercontent.com/Sadramst/Market/main/scripts/deploy-vps.sh | bash
```

Or manually:

```bash
# Install Docker
curl -fsSL https://get.docker.com | sh

# Clone repository
git clone https://github.com/Sadramst/Market.git /opt/appilico
cd /opt/appilico

# Configure environment
cp .env.example .env
nano .env  # Set secure passwords
```

### 2. Environment Variables

Edit `/opt/appilico/.env`:

```env
DB_USER=appilico_user
DB_PASSWORD=<YOUR_SECURE_PASSWORD>
JWT_SECRET_KEY=<GENERATED_64_CHAR_SECRET>
```

### 3. Start Services

```bash
cd /opt/appilico
docker compose -f docker-compose.production.yml up -d
```

### 4. SSL Certificate

```bash
# First, ensure DNS is pointing to the VPS
# Then request certificate:
docker compose -f docker-compose.production.yml run --rm certbot \
  certonly --webroot -w /var/www/certbot \
  -d api.appilico.com.au \
  --agree-tos --email admin@appilico.com.au --non-interactive

# Restart nginx to use the certificate
docker compose -f docker-compose.production.yml restart nginx
```

### 5. Verify

```bash
curl https://api.appilico.com.au/health
# Expected: {"status":"healthy","timestamp":"..."}
```

## Frontend Deployment (Vercel)

### 1. Import Projects

In the Vercel dashboard, import the GitHub repository three times — once for each app.

### 2. Configure Each Project

**Beauty App** (`beauty.appilico.com.au`):
- Root Directory: `frontend/apps/beauty`
- Framework: Next.js
- Build Command: `cd ../.. && npx turbo run build --filter=@appilico/beauty`
- Install Command: `cd ../.. && npm install`
- Environment Variables:
  - `NEXT_PUBLIC_API_URL` = `https://api.appilico.com.au/api`
  - `NEXT_PUBLIC_SITE_URL` = `https://beauty.appilico.com.au`
  - `NEXT_PUBLIC_SITE_NAME` = `Appilico Beauty`
  - `NEXT_PUBLIC_MARKETPLACE_TYPE` = `beauty`

**Services App** (`service.appilico.com.au`):
- Root Directory: `frontend/apps/services`
- Same build/install commands (change filter to `@appilico/services`)
- Environment Variables:
  - `NEXT_PUBLIC_API_URL` = `https://api.appilico.com.au/api`
  - `NEXT_PUBLIC_SITE_URL` = `https://service.appilico.com.au`
  - `NEXT_PUBLIC_SITE_NAME` = `Appilico Services`
  - `NEXT_PUBLIC_MARKETPLACE_TYPE` = `services`

**Admin App** (`admin.appilico.com.au`):
- Root Directory: `frontend/apps/admin`
- Same build/install commands (change filter to `@appilico/admin`)
- Environment Variables:
  - `NEXT_PUBLIC_API_URL` = `https://api.appilico.com.au/api`
  - `NEXT_PUBLIC_SITE_URL` = `https://admin.appilico.com.au`
  - `NEXT_PUBLIC_SITE_NAME` = `Appilico Admin`

### 3. Domain Assignment

In each Vercel project settings → Domains, add the corresponding subdomain.

## Updates & Maintenance

### Deploy Backend Update

```bash
cd /opt/appilico
./scripts/deploy-update.sh
```

### View Logs

```bash
# API logs
docker compose -f docker-compose.production.yml logs -f api

# Nginx logs
docker compose -f docker-compose.production.yml logs -f nginx

# Database logs
docker compose -f docker-compose.production.yml logs -f postgres
```

### Database Backup

```bash
docker compose -f docker-compose.production.yml exec postgres \
  pg_dump -U appilico_user appilico_market > backup_$(date +%Y%m%d).sql
```

### SSL Renewal

Certbot auto-renews via the container. To force:

```bash
docker compose -f docker-compose.production.yml run --rm certbot renew
docker compose -f docker-compose.production.yml restart nginx
```

## Monitoring

- **Health Check**: `GET /health` returns `{"status":"healthy"}`
- **API Logs**: `/var/log/appilico/` inside the container (mounted as volume)
- **PostgreSQL**: Connection pool max 100, slow query logging (>1s)

## Security Checklist

- [x] HTTPS enforced (Nginx redirects HTTP → HTTPS)
- [x] PostgreSQL not exposed to internet (127.0.0.1 binding)
- [x] API rate limiting (60 req/min general, 5 req/min auth)
- [x] CORS restricted to known domains
- [x] JWT with secure secret key
- [x] Non-root Docker container user
- [x] Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- [x] UFW firewall (only 22, 80, 443 open)
- [x] Swagger disabled in production
- [ ] Set up automated backups
- [ ] Set up monitoring/alerting (UptimeRobot, etc.)
- [ ] Configure log rotation

## Seeded Data

The API auto-seeds on first run:
- **Admin user**: admin@appilico.com / Admin@123! (change immediately)
- **Moderator**: moderator@appilico.com / Mod@12345!
- **9 beauty categories** with ~40 subcategories
- **12 IT categories**
- **~85 Perth/WA suburbs**
- **7 app settings**

## Troubleshooting

| Issue | Solution |
|-------|----------|
| API not starting | Check logs: `docker compose logs api` |
| Database connection error | Verify `.env` credentials match |
| SSL cert error | Ensure DNS is pointing to VPS first |
| CORS error | Check `appsettings.Production.json` origins |
| 502 Bad Gateway | API container may be restarting — check health |
