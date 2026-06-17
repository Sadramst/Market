-- APPILICO STABILIZATION PHASE 1
-- Fix category misassignments for beauty providers
-- Execution: Run on VPS PostgreSQL as appilico user
-- Database: appilico_beauty

-- Start transaction
BEGIN;

-- Fix Hussein Hair Dresser: should be Hair (not Skin Care)
-- Find the correct category IDs first
WITH category_map AS (
  SELECT 
    'Hair' AS category_name,
    (SELECT id FROM categories WHERE name = 'Hair' AND parent_category_id IS NOT NULL LIMIT 1) AS hair_cat_id,
    (SELECT id FROM categories WHERE name = 'Skin Care' AND parent_category_id IS NOT NULL LIMIT 1) AS skincare_cat_id
)
UPDATE provider_services ps
SET category_id = cm.hair_cat_id
FROM category_map cm, providers p
WHERE p.business_name ILIKE '%Hussein Hair%'
  AND ps.provider_id = p.id
  AND ps.category_id = cm.skincare_cat_id;

-- Fix Bang on Brows: should be Brows (not Skin Care)
WITH category_map AS (
  SELECT 
    'Brows' AS category_name,
    (SELECT id FROM categories WHERE name = 'Brows' AND parent_category_id IS NOT NULL LIMIT 1) AS brows_cat_id,
    (SELECT id FROM categories WHERE name = 'Skin Care' AND parent_category_id IS NOT NULL LIMIT 1) AS skincare_cat_id
)
UPDATE provider_services ps
SET category_id = cm.brows_cat_id
FROM category_map cm, providers p
WHERE p.business_name ILIKE '%Bang on Brows%'
  AND ps.provider_id = p.id
  AND ps.category_id = cm.skincare_cat_id;

-- Fix BI HAIR NAIL: should be Hair OR Nails (not Skin Care)
-- If it has multiple services, update the Skin Care one to Nails
WITH category_map AS (
  SELECT 
    'Nails' AS category_name,
    (SELECT id FROM categories WHERE name = 'Nails' AND parent_category_id IS NOT NULL LIMIT 1) AS nails_cat_id,
    (SELECT id FROM categories WHERE name = 'Skin Care' AND parent_category_id IS NOT NULL LIMIT 1) AS skincare_cat_id
)
UPDATE provider_services ps
SET category_id = cm.nails_cat_id
FROM category_map cm, providers p
WHERE p.business_name ILIKE '%BI HAIR NAIL%'
  AND ps.provider_id = p.id
  AND ps.category_id = cm.skincare_cat_id;

-- Fix Minu Threading: should be Brows (not low-rated general beauty)
WITH category_map AS (
  SELECT 
    'Brows' AS category_name,
    (SELECT id FROM categories WHERE name = 'Brows' AND parent_category_id IS NOT NULL LIMIT 1) AS brows_cat_id
)
UPDATE providers p
SET is_featured = false
WHERE p.business_name ILIKE '%Minu Threading%'
  AND p.average_rating < 4.7;

-- Remove "New listing" badge from all high-review providers
-- This is handled in code now, but ensure no old data lingers
-- Verify: Check that all featured providers meet the new criteria
SELECT 
  id,
  business_name,
  average_rating,
  total_reviews,
  created_at,
  (CURRENT_TIMESTAMP - created_at) AS age_days,
  CASE 
    WHEN average_rating >= 4.7 AND total_reviews >= 50 THEN 'PASS: Featured eligible'
    ELSE 'FAIL: Does not meet featured criteria'
  END AS featured_check
FROM providers
WHERE status = 1  -- Approved
  AND provider_type = 0  -- Beauty
ORDER BY average_rating DESC, total_reviews DESC;

COMMIT;

-- Verification query (run after commit):
-- SELECT COUNT(*) as featured_count FROM providers 
-- WHERE status = 1 AND provider_type = 0 
-- AND average_rating >= 4.7 AND total_reviews >= 50
-- AND business_name NOT ILIKE '%chiropract%'
-- AND business_name NOT ILIKE '%physio%'
-- AND business_name NOT ILIKE '%osteopath%'
-- AND business_name NOT ILIKE '%massage chair%';
