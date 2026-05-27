-- ============================================================
-- Phase 12 — Production Data Fix Script
-- Run against production PostgreSQL on VPS (149.28.166.75)
-- Review each block before executing. Wrap in a transaction.
-- ============================================================

BEGIN;

-- ────────────────────────────────────────────────────────────
-- A4: Delete duplicate provider listings
-- ────────────────────────────────────────────────────────────

-- Soft-delete "Seu Momento" duplicate (keep the one with more reviews / older CreatedAt)
UPDATE "Providers"
SET "IsDeleted" = true, "UpdatedAt" = NOW()
WHERE "Slug" = 'seu-momento'
  AND "Id" != (
    SELECT "Id" FROM "Providers"
    WHERE "Slug" = 'seu-momento' AND "IsDeleted" = false
    ORDER BY "CreatedAt" ASC
    LIMIT 1
  );

-- Soft-delete "Glow Skin" duplicate
UPDATE "Providers"
SET "IsDeleted" = true, "UpdatedAt" = NOW()
WHERE "Slug" = 'glow-skin'
  AND "Id" != (
    SELECT "Id" FROM "Providers"
    WHERE "Slug" = 'glow-skin' AND "IsDeleted" = false
    ORDER BY "CreatedAt" ASC
    LIMIT 1
  );

-- ────────────────────────────────────────────────────────────
-- A4: Fix miscategorised providers
-- ────────────────────────────────────────────────────────────

-- Maurice Meade: should be "Hair" (currently "Skin Care")
UPDATE "Providers"
SET "CategoryId" = (SELECT "Id" FROM "Categories" WHERE "Slug" = 'hair' LIMIT 1),
    "UpdatedAt" = NOW()
WHERE "Slug" = 'maurice-meade' AND "IsDeleted" = false;

-- Sora Hair: should be "Hair" (currently "Brows")
UPDATE "Providers"
SET "CategoryId" = (SELECT "Id" FROM "Categories" WHERE "Slug" = 'hair' LIMIT 1),
    "UpdatedAt" = NOW()
WHERE "Slug" = 'sora-hair' AND "IsDeleted" = false;

-- Sonya's Beauty: should be "Lashes" (currently "Nails")
UPDATE "Providers"
SET "CategoryId" = (SELECT "Id" FROM "Categories" WHERE "Slug" = 'lashes' LIMIT 1),
    "UpdatedAt" = NOW()
WHERE "Slug" = 'sonyas-beauty' AND "IsDeleted" = false;

-- ────────────────────────────────────────────────────────────
-- A4: Fix placeholder descriptions
-- ────────────────────────────────────────────────────────────

UPDATE "Providers"
SET "Description" = 'HER on Oxford is a luxury nail and beauty salon located on Oxford Street, Leederville. Offering a curated selection of manicure, pedicure, waxing, and lash services in a chic, welcoming environment.',
    "UpdatedAt" = NOW()
WHERE "Slug" = 'her-on-oxford' AND "IsDeleted" = false
  AND (LENGTH("Description") < 30 OR "Description" ILIKE '%placeholder%' OR "Description" ILIKE '%lorem%');

UPDATE "Providers"
SET "Description" = 'IVY REIGN delivers premium beauty services across Perth including lash extensions, brow lamination, and skin treatments. Known for impeccable artistry and a relaxing studio atmosphere.',
    "UpdatedAt" = NOW()
WHERE "Slug" = 'ivy-reign' AND "IsDeleted" = false
  AND (LENGTH("Description") < 30 OR "Description" ILIKE '%placeholder%' OR "Description" ILIKE '%lorem%');

UPDATE "Providers"
SET "Description" = 'REJUVEWELL is a holistic wellness and skin clinic in Perth offering advanced facials, cosmetic injectables, and body treatments designed to rejuvenate mind and body.',
    "UpdatedAt" = NOW()
WHERE "Slug" = 'rejuvewell' AND "IsDeleted" = false
  AND (LENGTH("Description") < 30 OR "Description" ILIKE '%placeholder%' OR "Description" ILIKE '%lorem%');

UPDATE "Providers"
SET "Description" = 'Breathe Beauty Studio is a boutique beauty salon in Perth specialising in relaxation facials, massages, and organic skin treatments. A peaceful retreat for self-care and rejuvenation.',
    "UpdatedAt" = NOW()
WHERE "Slug" = 'breathe-beauty' AND "IsDeleted" = false
  AND (LENGTH("Description") < 30 OR "Description" ILIKE '%placeholder%' OR "Description" ILIKE '%lorem%');

-- ────────────────────────────────────────────────────────────
-- Verify changes
-- ────────────────────────────────────────────────────────────
SELECT "Slug", "BusinessName", "IsDeleted", "CategoryId", LEFT("Description", 60) AS "DescriptionPreview"
FROM "Providers"
WHERE "Slug" IN (
  'seu-momento', 'glow-skin', 'maurice-meade', 'sora-hair',
  'sonyas-beauty', 'her-on-oxford', 'ivy-reign', 'rejuvewell', 'breathe-beauty'
)
ORDER BY "Slug", "IsDeleted";

COMMIT;
