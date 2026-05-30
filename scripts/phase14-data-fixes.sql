-- Phase 14 Data Fixes
-- Run on VPS: ssh root@149.28.166.75
-- docker exec -i appilico-db psql -U appilico_user -d appilico_market < scripts/phase14-data-fixes.sql

-- ============================================================
-- FIX: Maurice Meade → Hair (currently miscategorized as Skin Care)
-- ============================================================
UPDATE "ProviderServices"
SET "CategoryId" = (SELECT "Id" FROM "Categories" WHERE "Slug" = 'hair' AND "ParentCategoryId" IS NULL LIMIT 1)
WHERE "ProviderId" IN (
    SELECT "Id" FROM "Providers" WHERE "BusinessName" ILIKE '%Maurice Meade%'
)
AND "CategoryId" = (SELECT "Id" FROM "Categories" WHERE "Slug" = 'skin-care' AND "ParentCategoryId" IS NULL LIMIT 1);

-- ============================================================
-- FIX: Sora' Hair → Hair (currently miscategorized as Brows)
-- ============================================================
UPDATE "ProviderServices"
SET "CategoryId" = (SELECT "Id" FROM "Categories" WHERE "Slug" = 'hair' AND "ParentCategoryId" IS NULL LIMIT 1)
WHERE "ProviderId" IN (
    SELECT "Id" FROM "Providers" WHERE "BusinessName" ILIKE '%Sora%Hair%'
)
AND "CategoryId" = (SELECT "Id" FROM "Categories" WHERE "Slug" = 'brows' AND "ParentCategoryId" IS NULL LIMIT 1);

-- ============================================================
-- FIX: Sonya's → Lashes (currently miscategorized as Nails)
-- ============================================================
UPDATE "ProviderServices"
SET "CategoryId" = (SELECT "Id" FROM "Categories" WHERE "Slug" = 'lashes' AND "ParentCategoryId" IS NULL LIMIT 1)
WHERE "ProviderId" IN (
    SELECT "Id" FROM "Providers" WHERE "BusinessName" ILIKE '%Sonya%'
)
AND "CategoryId" = (SELECT "Id" FROM "Categories" WHERE "Slug" = 'nails' AND "ParentCategoryId" IS NULL LIMIT 1);

-- ============================================================
-- FIX: HER on Oxford — update description
-- ============================================================
UPDATE "Providers"
SET "Description" = 'HER on Oxford is Mount Hawthorn''s celebrated skin sanctuary, offering advanced facials, peels, hydradermabrasion, and bespoke skin treatments. With a focus on results-driven skincare using premium Australian and European products, HER on Oxford provides a luxurious, personalised experience for every client.'
WHERE "Slug" = 'her-on-oxford-mount-hawthorn'
AND ("Description" IS NULL OR "Description" ILIKE '%professional beauty services%');

-- ============================================================
-- FIX: Remove duplicate Seu Momento (keep the one with most reviews)
-- ============================================================
WITH duplicates AS (
    SELECT "Id", "BusinessName", "TotalReviews",
           ROW_NUMBER() OVER (PARTITION BY LOWER(REGEXP_REPLACE("BusinessName", '\s+', '', 'g')) ORDER BY "TotalReviews" DESC, "CreatedAt" ASC) as rn
    FROM "Providers"
    WHERE "BusinessName" ILIKE '%Seu Momento%'
    AND "City" ILIKE '%Subiaco%'
)
UPDATE "Providers"
SET "Status" = 3  -- Rejected/Hidden
WHERE "Id" IN (SELECT "Id" FROM duplicates WHERE rn > 1);

-- Verify fixes
SELECT "BusinessName", "Slug", "City", "Status" FROM "Providers" WHERE "BusinessName" ILIKE '%Seu Momento%' ORDER BY "Status";
SELECT p."BusinessName", c."Name" as "Category" FROM "Providers" p JOIN "ProviderServices" ps ON ps."ProviderId" = p."Id" JOIN "Categories" c ON c."Id" = ps."CategoryId" WHERE p."BusinessName" ILIKE '%Maurice Meade%' OR p."BusinessName" ILIKE '%Sora%Hair%' OR p."BusinessName" ILIKE '%Sonya%';
SELECT "BusinessName", LEFT("Description", 60) as "Desc" FROM "Providers" WHERE "Slug" = 'her-on-oxford-mount-hawthorn';
