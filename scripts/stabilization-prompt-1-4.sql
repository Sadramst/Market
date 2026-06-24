-- APPILICO MARKET - STABILIZATION PROMPTS 1 & 4
-- Schema-safe production data fixes for the EF/PostgreSQL model used by Appilico.Market.
--
-- What this script does:
-- 1. Re-classifies known beauty providers into the correct parent category.
-- 2. Removes obviously wrong service/category mappings for those providers.
-- 3. Rebuilds denormalized ProviderCount values for Categories and Suburbs.
--
-- What this script does NOT do:
-- - It does not seed categories, suburbs, or providers directly.
-- - Those are already handled by DatabaseSeeder / SeedITProviders / FixDataQuality
--   during normal application startup after deploy.
--
-- Safe to run multiple times.

BEGIN;

SET search_path TO public;

DO $$
DECLARE
  v_beauty_marketplace integer := 0;
  v_hair_id uuid;
  v_brows_id uuid;
  v_nails_id uuid;
BEGIN
  SELECT "Id" INTO v_hair_id
  FROM "Categories"
  WHERE "Slug" = 'hair' AND "MarketplaceType" = v_beauty_marketplace AND "ParentCategoryId" IS NULL
  LIMIT 1;

  SELECT "Id" INTO v_brows_id
  FROM "Categories"
  WHERE "Slug" = 'brows' AND "MarketplaceType" = v_beauty_marketplace AND "ParentCategoryId" IS NULL
  LIMIT 1;

  SELECT "Id" INTO v_nails_id
  FROM "Categories"
  WHERE "Slug" = 'nails' AND "MarketplaceType" = v_beauty_marketplace AND "ParentCategoryId" IS NULL
  LIMIT 1;

  IF v_hair_id IS NULL OR v_brows_id IS NULL OR v_nails_id IS NULL THEN
    RAISE NOTICE 'Skipping category remap because one or more parent categories are missing.';
    RETURN;
  END IF;

  -- Hussein Hair Dresser -> Hair
  UPDATE "ProviderServices" ps
  SET "CategoryId" = v_hair_id,
      "UpdatedAt" = NOW()
  FROM "Providers" p
  WHERE ps."ProviderId" = p."Id"
    AND p."Slug" = 'hussein-hair-dresser-bentley'
    AND p."ProviderType" = 0
    AND ps."CategoryId" IS DISTINCT FROM v_hair_id;

  -- Bang on Brows -> Brows
  UPDATE "ProviderServices" ps
  SET "CategoryId" = v_brows_id,
      "UpdatedAt" = NOW()
  FROM "Providers" p
  WHERE ps."ProviderId" = p."Id"
    AND p."Slug" = 'bang-on-brows-cockburn'
    AND p."ProviderType" = 0
    AND ps."CategoryId" IS DISTINCT FROM v_brows_id;

  -- BI Hair Nail & Beauty Salon -> Nails
  UPDATE "ProviderServices" ps
  SET "CategoryId" = v_nails_id,
      "UpdatedAt" = NOW()
  FROM "Providers" p
  WHERE ps."ProviderId" = p."Id"
    AND p."Slug" = 'bi-hair-nail-beauty-salon-morley'
    AND p."ProviderType" = 0
    AND ps."CategoryId" IS DISTINCT FROM v_nails_id;

  -- Minu Threading and Beauty -> Brows
  UPDATE "ProviderServices" ps
  SET "CategoryId" = v_brows_id,
      "UpdatedAt" = NOW()
  FROM "Providers" p
  WHERE ps."ProviderId" = p."Id"
    AND p."Slug" = 'minu-threading-and-beauty-madeley'
    AND p."ProviderType" = 0
    AND ps."CategoryId" IS DISTINCT FROM v_brows_id;

  -- Arch Beauty Bar -> Nails
  UPDATE "ProviderServices" ps
  SET "CategoryId" = v_nails_id,
      "UpdatedAt" = NOW()
  FROM "Providers" p
  WHERE ps."ProviderId" = p."Id"
    AND p."Slug" = 'arch-beauty-bar-beeliar'
    AND p."ProviderType" = 0
    AND ps."CategoryId" IS DISTINCT FROM v_nails_id;
END $$;

-- Recalculate category provider counts from approved beauty providers.
WITH category_counts AS (
  SELECT
    ps."CategoryId" AS category_id,
    COUNT(DISTINCT ps."ProviderId")::int AS provider_count
  FROM "ProviderServices" ps
  INNER JOIN "Providers" p ON p."Id" = ps."ProviderId"
  WHERE p."ProviderType" = 0
    AND p."Status" = 1
    AND ps."IsActive" = TRUE
    AND p."IsDeleted" = FALSE
    AND ps."IsDeleted" = FALSE
  GROUP BY ps."CategoryId"
)
UPDATE "Categories" c
SET "ProviderCount" = COALESCE(cc.provider_count, 0),
    "UpdatedAt" = NOW()
FROM category_counts cc
WHERE c."Id" = cc.category_id;

UPDATE "Categories"
SET "ProviderCount" = 0,
    "UpdatedAt" = NOW()
WHERE "MarketplaceType" IN (0, 1)
  AND "ParentCategoryId" IS NULL
  AND "Id" NOT IN (
    SELECT DISTINCT ps."CategoryId"
    FROM "ProviderServices" ps
    INNER JOIN "Providers" p ON p."Id" = ps."ProviderId"
    WHERE p."Status" = 1
      AND ps."IsActive" = TRUE
      AND p."IsDeleted" = FALSE
      AND ps."IsDeleted" = FALSE
  );

-- Recalculate suburb provider counts from approved providers by city/postcode.
WITH suburb_counts AS (
  SELECT
    s."Id" AS suburb_id,
    COUNT(DISTINCT p."Id")::int AS provider_count
  FROM "Suburbs" s
  LEFT JOIN "Providers" p
    ON p."ProviderType" = 0
   AND p."Status" = 1
   AND p."IsDeleted" = FALSE
   AND (
        LOWER(COALESCE(p."City", '')) = LOWER(s."Name")
        OR COALESCE(p."PostalCode", '') = COALESCE(s."PostCode", '')
   )
  GROUP BY s."Id"
)
UPDATE "Suburbs" s
SET "ProviderCount" = COALESCE(sc.provider_count, 0),
    "UpdatedAt" = NOW()
FROM suburb_counts sc
WHERE s."Id" = sc.suburb_id;

COMMIT;

-- Simple verification output
SELECT 'beauty_parent_categories' AS check_name, COUNT(*) AS value
FROM "Categories"
WHERE "MarketplaceType" = 0 AND "ParentCategoryId" IS NULL;

SELECT 'it_parent_categories' AS check_name, COUNT(*) AS value
FROM "Categories"
WHERE "MarketplaceType" = 1 AND "ParentCategoryId" IS NULL;

SELECT 'beauty_approved_providers' AS check_name, COUNT(*) AS value
FROM "Providers"
WHERE "ProviderType" = 0 AND "Status" = 1;

SELECT 'it_approved_providers' AS check_name, COUNT(*) AS value
FROM "Providers"
WHERE "ProviderType" = 1 AND "Status" = 1;
