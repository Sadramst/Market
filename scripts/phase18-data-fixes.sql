-- ============================================================
-- Phase 18 — Production Data Fix Script
-- Run against production PostgreSQL on VPS.
--   docker exec -i appilico-db psql -U $DB_USER -d appilico_market < scripts/phase18-data-fixes.sql
-- Review each block before executing. Everything is wrapped in a
-- single transaction and ends with verification SELECTs.
-- Uses BusinessName ILIKE matching (robust to unknown slugs).
-- ============================================================

BEGIN;

-- ────────────────────────────────────────────────────────────
-- 1. Fix miscategorised providers (homepage "Top-Rated" + category pages)
--    Categories link via ProviderServices.CategoryId, not Providers.
-- ────────────────────────────────────────────────────────────

-- Hussein Hair Dresser → Hair (was showing as "Skin")
UPDATE "ProviderServices"
SET "CategoryId" = (SELECT "Id" FROM "Categories" WHERE "Slug" = 'hair' LIMIT 1)
WHERE "ProviderId" IN (SELECT "Id" FROM "Providers" WHERE "BusinessName" ILIKE '%hussein hair%' AND "IsDeleted" = false);

-- Bang on Brows → Brows (was showing as "Skin")
UPDATE "ProviderServices"
SET "CategoryId" = (SELECT "Id" FROM "Categories" WHERE "Slug" = 'brows' LIMIT 1)
WHERE "ProviderId" IN (SELECT "Id" FROM "Providers" WHERE "BusinessName" ILIKE '%bang on brows%' AND "IsDeleted" = false);

-- Arch Beauty Bar → Nails (was showing as "Skin" on some listings)
UPDATE "ProviderServices"
SET "CategoryId" = (SELECT "Id" FROM "Categories" WHERE "Slug" = 'nails' LIMIT 1)
WHERE "ProviderId" IN (SELECT "Id" FROM "Providers" WHERE "BusinessName" ILIKE '%arch beauty bar%' AND "IsDeleted" = false);

-- Hair salons wrongly listed under Nails → Hair
UPDATE "ProviderServices"
SET "CategoryId" = (SELECT "Id" FROM "Categories" WHERE "Slug" = 'hair' LIMIT 1)
WHERE "ProviderId" IN (
  SELECT "Id" FROM "Providers"
  WHERE "IsDeleted" = false
    AND (
      "BusinessName" ILIKE '%wild rose hair%'
      OR "BusinessName" ILIKE '%hair art%'
      OR "BusinessName" ILIKE '%sass & maine hair%'
      OR "BusinessName" ILIKE '%sass and maine hair%'
    )
);

-- "Lash and Brow Essence" wrongly listed under Nails → Lashes
UPDATE "ProviderServices"
SET "CategoryId" = (SELECT "Id" FROM "Categories" WHERE "Slug" = 'lashes' LIMIT 1)
WHERE "ProviderId" IN (SELECT "Id" FROM "Providers" WHERE "BusinessName" ILIKE '%lash and brow essence%' AND "IsDeleted" = false);

-- ────────────────────────────────────────────────────────────
-- 2. Remove duplicate "Seu Momento" listing (keep oldest active)
-- ────────────────────────────────────────────────────────────
UPDATE "Providers"
SET "IsDeleted" = true, "UpdatedAt" = NOW()
WHERE "BusinessName" ILIKE '%seu momento%'
  AND "IsDeleted" = false
  AND "Id" != (
    SELECT "Id" FROM "Providers"
    WHERE "BusinessName" ILIKE '%seu momento%' AND "IsDeleted" = false
    ORDER BY "CreatedAt" ASC
    LIMIT 1
  );

-- ────────────────────────────────────────────────────────────
-- 3. Remove non-beauty businesses (chiropractor / physio / osteopath /
--    massage-chair retailer). Backend already filters these out by name,
--    but soft-deleting also removes them from sitemaps and direct links.
--    (Reversible: just set IsDeleted = false to restore.)
-- ────────────────────────────────────────────────────────────
UPDATE "Providers"
SET "IsDeleted" = true, "UpdatedAt" = NOW()
WHERE "IsDeleted" = false
  AND "ProviderType" = 0  -- Beauty marketplace only
  AND (
    "BusinessName" ILIKE '%chiropract%'
    OR "BusinessName" ILIKE '%physio%'
    OR "BusinessName" ILIKE '%osteopath%'
    OR "BusinessName" ILIKE '%massage chair%'
    OR "BusinessName" ILIKE '%irelax%'
  );

-- ────────────────────────────────────────────────────────────
-- 4. Verification
-- ────────────────────────────────────────────────────────────
SELECT p."BusinessName", c."Name" AS "Category", p."AverageRating", p."TotalReviews", p."City", p."IsDeleted"
FROM "Providers" p
LEFT JOIN "ProviderServices" ps ON ps."ProviderId" = p."Id"
LEFT JOIN "Categories" c ON c."Id" = ps."CategoryId"
WHERE p."BusinessName" ILIKE ANY (ARRAY[
  '%hussein hair%', '%bang on brows%', '%arch beauty bar%',
  '%wild rose hair%', '%hair art%', '%sass%maine hair%',
  '%lash and brow essence%', '%seu momento%',
  '%chiropract%', '%physio%', '%osteopath%', '%massage chair%', '%irelax%'
])
ORDER BY p."BusinessName", p."IsDeleted";

-- If the verification looks correct, COMMIT. Otherwise ROLLBACK.
COMMIT;
