# APPILICO STABILIZATION PHASE 1 - DEPLOYMENT GUIDE

## Quick Start

Copy and run this on your VPS:

```bash
cd /home/appilico/appilico-market
bash scripts/deploy-stabilization-1.sh
```

## What Gets Fixed

### Backend (API)
- ✅ Featured endpoint now returns only providers with rating ≥4.7 AND ≥50 reviews
- ✅ Removed broken IsFeatured flag logic
- ✅ Proper sorting: rating DESC → reviewCount DESC
- ✅ Excludes non-beauty misclassified businesses

### Frontend (Beauty App)
- ✅ "New listing" badge only shows if created <30 days ago AND <10 reviews
- ✅ Correct badge hierarchy: Verified > Verified data > New listing
- ✅ Shows "No reviews yet" for providers with 0 reviews that don't qualify as new

### Database
- ✅ Hussein Hair Dresser: category fixed from "Skin Care" to "Hair"
- ✅ Bang on Brows: category fixed from "Skin Care" to "Brows"
- ✅ BI HAIR NAIL: category fixed from "Skin Care" to "Hair/Nails"
- ✅ Removed IsFeatured flag from low-rated providers

## Deployment Steps

1. **Backup Database** (automatic)
   - Creates backup at `/home/appilico/backups/appilico_beauty_YYYYMMDD_HHMMSS.sql.gz`

2. **Pull Latest Code**
   - Fetches and pulls from your current branch

3. **Run SQL Migrations**
   - Executes category reassignments
   - Updates provider data

4. **Build Backend**
   - Cleans previous builds
   - Runs `dotnet restore && dotnet build -c Release`
   - Publishes to deployment directory

5. **Deploy Backend**
   - Stops appilico-api service
   - Copies published files
   - Restarts service with health check

6. **Build Frontend**
   - Runs `npm install && npm run build`
   - Triggers Docker rebuild if configured

7. **Verification**
   - Checks API health endpoint
   - Reports deployment summary

## Manual Steps (If Script Fails)

### 1. Pull Code
```bash
cd /home/appilico/appilico-market
git fetch origin
git pull origin main
```

### 2. Apply Database Changes
```bash
psql -U appilico -d appilico_beauty -f scripts/stabilization-phase-1-fix-categories.sql
```

### 3. Build Backend
```bash
cd backend
dotnet clean -c Release
dotnet restore
dotnet build -c Release
dotnet publish src/Appilico.Market.Api/Appilico.Market.Api.csproj -c Release -o ./bin/Release/publish
```

### 4. Deploy Backend
```bash
sudo systemctl stop appilico-api
sudo cp -r backend/bin/Release/publish/* /home/appilico/appilico-api/
sudo chown -R appilico:appilico /home/appilico/appilico-api
sudo systemctl start appilico-api
```

### 5. Build & Deploy Frontend
```bash
cd frontend
npm install --legacy-peer-deps
npm run build
docker-compose -f docker-compose.yml build
docker-compose -f docker-compose.yml up -d
```

## Verification Queries

### Check Featured Providers Count
```bash
psql -U appilico -d appilico_beauty -c "
SELECT COUNT(*) as featured_eligible_count 
FROM providers 
WHERE status = 1 
  AND provider_type = 0 
  AND average_rating >= 4.7 
  AND total_reviews >= 50
  AND business_name NOT ILIKE '%chiropract%'
  AND business_name NOT ILIKE '%physio%'
  AND business_name NOT ILIKE '%osteopath%'
  AND business_name NOT ILIKE '%massage chair%';
"
```

Expected output: Should show providers like HER on Oxford, REJUVEWELL, Breathe Beauty, IVY REIGN, Bodyscape, Ember Bathhouse

### Check API Endpoint
```bash
curl -s http://localhost:5000/api/providers/featured | jq '.data | length'
```

Expected output: 6 (or your configured limit)

### Check Database Changes
```bash
psql -U appilico -d appilico_beauty -c "
SELECT business_name, average_rating, total_reviews, created_at
FROM providers
WHERE business_name ILIKE '%Hussein%' 
   OR business_name ILIKE '%Bang%'
   OR business_name ILIKE '%BI HAIR%'
ORDER BY business_name;
"
```

## Rollback (If Needed)

### Rollback Database
```bash
# Find your backup
ls -la /home/appilico/backups/

# Restore
pg_restore -U appilico -d appilico_beauty /home/appilico/backups/appilico_beauty_YYYYMMDD_HHMMSS.sql.gz
psql -U appilico -d appilico_beauty < /home/appilico/backups/appilico_beauty_YYYYMMDD_HHMMSS.sql
```

### Rollback Code
```bash
cd /home/appilico/appilico-market
git reset --hard <PREVIOUS_COMMIT_HASH>
```

### Restart Services
```bash
sudo systemctl restart appilico-api
docker-compose -f docker-compose.yml restart
```

## Monitoring After Deployment

Check logs for errors:
```bash
# API logs
sudo journalctl -u appilico-api -f

# Docker logs
docker-compose -f docker-compose.yml logs -f api

# Database logs (if enabled)
sudo tail -f /var/log/postgresql/postgresql.log
```

## Files Modified

- `backend/src/Appilico.Market.Api/Controllers/ProvidersController.cs`
  - Updated featured endpoint logic
  
- `frontend/apps/beauty/src/components/providers/ProviderCard.tsx`
  - Fixed new listing badge condition
  - Added createdAt support
  
- `scripts/stabilization-phase-1-fix-categories.sql`
  - Database migration for category fixes

## Support

If deployment fails:
1. Check logs: `sudo journalctl -u appilico-api -e`
2. Verify database: Run verification queries above
3. Rollback if necessary
4. Contact: Check deployment logs in `/var/log/` directory

---

**Deployment Date**: $(date)
**Environment**: VPS (149.28.166.75)
**Version**: Phase 1 Stabilization
