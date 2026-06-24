-- APPILICO STABILIZATION PROMPTS 1 & 4
-- Fix: Featured section + category misassignments (Prompt 1)
-- Fix: IT providers seeding (Prompt 4)
-- Database: appilico_market (production)
-- Run on: VPS PostgreSQL as appilico user
-- 
-- Execution: psql -U appilico -d appilico_market < scripts/stabilization-prompt-1-4.sql

BEGIN;

-- ============================================================================
-- PROMPT 1: Fix category misassignments for beauty providers
-- ============================================================================

-- Fix Hussein Hair Dresser: should be Hair (not Skin Care)
UPDATE provider_services ps
SET category_id = (
  SELECT id FROM categories 
  WHERE slug = 'hair' AND marketplace_type = 0 
  LIMIT 1
)
WHERE provider_id = (
  SELECT id FROM providers 
  WHERE slug = 'hussein-hair-dresser-bentley' AND provider_type = 0
  LIMIT 1
)
AND category_id = (
  SELECT id FROM categories 
  WHERE slug = 'skin-care' AND marketplace_type = 0 
  LIMIT 1
);

-- Fix Bang on Brows: should be Brows (not Skin Care)
UPDATE provider_services ps
SET category_id = (
  SELECT id FROM categories 
  WHERE slug = 'brows' AND marketplace_type = 0 
  LIMIT 1
)
WHERE provider_id = (
  SELECT id FROM providers 
  WHERE slug = 'bang-on-brows-cockburn' AND provider_type = 0
  LIMIT 1
)
AND category_id = (
  SELECT id FROM categories 
  WHERE slug = 'skin-care' AND marketplace_type = 0 
  LIMIT 1
);

-- Fix BI HAIR NAIL & BEAUTY SALON: should be Nails (not Skin Care)
UPDATE provider_services ps
SET category_id = (
  SELECT id FROM categories 
  WHERE slug = 'nails' AND marketplace_type = 0 
  LIMIT 1
)
WHERE provider_id = (
  SELECT id FROM providers 
  WHERE slug = 'bi-hair-nail-beauty-salon-morley' AND provider_type = 0
  LIMIT 1
)
AND category_id = (
  SELECT id FROM categories 
  WHERE slug = 'skin-care' AND marketplace_type = 0 
  LIMIT 1
);

-- Fix Minu Threading and Beauty: should be Brows (not Nails)
UPDATE provider_services ps
SET category_id = (
  SELECT id FROM categories 
  WHERE slug = 'brows' AND marketplace_type = 0 
  LIMIT 1
)
WHERE provider_id = (
  SELECT id FROM providers 
  WHERE slug = 'minu-threading-and-beauty-madeley' AND provider_type = 0
  LIMIT 1
)
AND category_id = (
  SELECT id FROM categories 
  WHERE slug = 'nails' AND marketplace_type = 0 
  LIMIT 1
);

-- Fix Arch Beauty Bar Beeliar: should be Nails (not Skin Care)
UPDATE provider_services ps
SET category_id = (
  SELECT id FROM categories 
  WHERE slug = 'nails' AND marketplace_type = 0 
  LIMIT 1
)
WHERE provider_id = (
  SELECT id FROM providers 
  WHERE slug = 'arch-beauty-bar-beeliar' AND provider_type = 0
  LIMIT 1
)
AND category_id = (
  SELECT id FROM categories 
  WHERE slug = 'skin-care' AND marketplace_type = 0 
  LIMIT 1
);

-- Deactivate non-beauty retailers (massage chair, portable massager, etc.)
UPDATE providers
SET status = 2  -- Suspended status
WHERE provider_type = 0  -- Beauty type
AND (
  business_name ILIKE '%massage chair%'
  OR business_name ILIKE '%portable massager%'
  OR business_name ILIKE '%irelax%'
);

-- Verify Prompt 1 fixes
SELECT 
  p.business_name,
  c.name as category,
  p.average_rating,
  p.total_reviews,
  p.created_at
FROM providers p
JOIN provider_services ps ON p.id = ps.provider_id
JOIN categories c ON ps.category_id = c.id
WHERE p.slug IN (
  'hussein-hair-dresser-bentley',
  'bang-on-brows-cockburn',
  'bi-hair-nail-beauty-salon-morley',
  'minu-threading-and-beauty-madeley',
  'arch-beauty-bar-beeliar'
)
AND p.provider_type = 0
ORDER BY p.business_name;

-- ============================================================================
-- PROMPT 4: Seed IT Service Providers
-- ============================================================================

-- First ensure IT service categories exist (if not already seeded)
INSERT INTO categories (id, name, slug, description, marketplace_type, is_active, sort_order, parent_category_id, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'Web Development', 'web-development', 'Custom web application development and maintenance', 1, true, 1, NULL, NOW(), NOW()),
  (gen_random_uuid(), 'Mobile Apps', 'mobile-apps', 'iOS and Android application development', 1, true, 2, NULL, NOW(), NOW()),
  (gen_random_uuid(), 'Cloud & DevOps', 'cloud-devops', 'Cloud infrastructure and DevOps services', 1, true, 3, NULL, NOW(), NOW()),
  (gen_random_uuid(), 'Cybersecurity', 'cybersecurity', 'Security audits and protection services', 1, true, 4, NULL, NOW(), NOW()),
  (gen_random_uuid(), 'Data & Analytics', 'data-analytics', 'Data engineering and business intelligence', 1, true, 5, NULL, NOW(), NOW()),
  (gen_random_uuid(), 'IT Support', 'it-support', 'Managed IT support and helpdesk services', 1, true, 6, NULL, NOW(), NOW()),
  (gen_random_uuid(), 'AI & ML', 'ai-ml', 'Artificial intelligence and machine learning', 1, true, 7, NULL, NOW(), NOW()),
  (gen_random_uuid(), 'UI/UX Design', 'ui-ux-design', 'User interface and experience design', 1, true, 8, NULL, NOW(), NOW()),
  (gen_random_uuid(), 'Consulting', 'consulting', 'IT strategy and business consulting', 1, true, 9, NULL, NOW(), NOW()),
  (gen_random_uuid(), 'Networking', 'networking', 'Network design and infrastructure', 1, true, 10, NULL, NOW(), NOW()),
  (gen_random_uuid(), 'E-Commerce', 'ecommerce', 'E-commerce platforms and solutions', 1, true, 11, NULL, NOW(), NOW()),
  (gen_random_uuid(), 'Digital Marketing', 'digital-marketing', 'Digital marketing and SEO services', 1, true, 12, NULL, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Get suburbs for seeding (Perth WA suburbs)
-- Ensure Perth suburbs exist for IT services
INSERT INTO suburbs (id, name, slug, postcode, state, is_active, marketplace_type, latitude, longitude, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'Perth', 'perth', '6000', 'WA', true, 1, -31.9454, 115.8596, NOW(), NOW()),
  (gen_random_uuid(), 'Osborne Park', 'osborne-park', '6017', 'WA', true, 1, -31.9205, 115.7869, NOW(), NOW()),
  (gen_random_uuid(), 'Joondalup', 'joondalup', '6027', 'WA', true, 1, -31.7411, 115.7696, NOW(), NOW()),
  (gen_random_uuid(), 'Fremantle', 'fremantle', '6160', 'WA', true, 1, -32.0555, 115.7452, NOW(), NOW()),
  (gen_random_uuid(), 'West Perth', 'west-perth', '6005', 'WA', true, 1, -31.9382, 115.8374, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Seed IT service providers (only if they don't already exist)
WITH new_providers AS (
  INSERT INTO providers (
    id, user_id, business_name, slug, description, phone, email, website, status, provider_type,
    is_verified, is_featured, average_rating, total_reviews, follower_count, city, state, postal_code,
    full_address, is_claimed, claimed_by_user_id, claimed_at, data_source, has_real_data,
    tagline, created_at, updated_at
  ) VALUES
    -- Web Development
    (gen_random_uuid(), '', 'Elephant in the Boardroom', 'elephant-in-the-boardroom-perth', 
     'Award-winning digital agency. 2,000+ completed projects across WA.', 
     '(08) 6365 4060', '', 'https://www.elephantintheboardroom.com.au',
     1, 1, false, true, 4.9, 87, 0, 'Perth', 'WA', '6000',
     'Level 14, 191 St Georges Tce, Perth WA 6000', false, NULL, NULL, 'seeded', true,
     'Award-winning web and digital solutions', NOW(), NOW()),
    
    -- IT Support
    (gen_random_uuid(), '', 'Techwell IT', 'techwell-it-perth',
     'Trusted managed IT support for SMBs. Fast local response times.',
     '(08) 6102 6040', '', 'https://www.techwellit.com.au',
     1, 1, false, true, 4.8, 112, 0, 'Osborne Park', 'WA', '6017',
     'Osborne Park, WA 6017', false, NULL, NULL, 'seeded', true,
     'Managed IT support for Perth businesses', NOW(), NOW()),
    
    (gen_random_uuid(), '', 'iT4 Business', 'it4-business-joondalup',
     'Joondalup-based managed IT, cloud and cybersecurity services.',
     '(08) 9300 0100', '', 'https://www.it4business.com.au',
     1, 1, false, true, 4.9, 78, 0, 'Joondalup', 'WA', '6027',
     'Joondalup, WA 6027', false, NULL, NULL, 'seeded', true,
     'Managed IT and cybersecurity', NOW(), NOW()),
    
    -- Digital Marketing
    (gen_random_uuid(), '', 'Webprofits Perth', 'webprofits-perth',
     'Performance-focused digital growth. SEO, Google Ads, paid social.',
     '', '', 'https://www.webprofits.com.au',
     1, 1, false, true, 4.8, 64, 0, 'Perth', 'WA', '6000',
     'Perth, WA 6000', false, NULL, NULL, 'seeded', true,
     'Digital marketing and growth', NOW(), NOW()),
    
    -- UI/UX Design
    (gen_random_uuid(), '', 'Ample Digital', 'ample-digital-fremantle',
     'Fremantle design studio. UX research, product design, brand identity.',
     '', '', 'https://www.ampledigital.com.au',
     1, 1, false, true, 4.9, 57, 0, 'Fremantle', 'WA', '6160',
     'Fremantle, WA 6160', false, NULL, NULL, 'seeded', true,
     'UX/UI design and brand strategy', NOW(), NOW()),
    
    -- Cloud & DevOps
    (gen_random_uuid(), '', 'Katana Cloud', 'katana-cloud-west-perth',
     'AWS, Azure, Google Cloud and DevOps automation specialists.',
     '', '', 'https://www.katanacloud.com.au',
     1, 1, false, false, 4.7, 38, 0, 'West Perth', 'WA', '6005',
     'West Perth, WA 6005', false, NULL, NULL, 'seeded', true,
     'Cloud infrastructure experts', NOW(), NOW()),
    
    -- Cybersecurity
    (gen_random_uuid(), '', 'StrategicIT Security', 'strategicit-security-perth',
     'Cybersecurity consultancy. Pen testing, audits, compliance.',
     '', '', 'https://www.strategicit.com.au',
     1, 1, false, false, 4.8, 43, 0, 'Perth', 'WA', '6000',
     'Perth, WA 6000', false, NULL, NULL, 'seeded', true,
     'Cybersecurity and compliance', NOW(), NOW())
  ON CONFLICT (slug) DO NOTHING
  RETURNING id, business_name, slug
)
-- Link providers to their categories
INSERT INTO provider_services (id, provider_id, category_id, description, created_at, updated_at)
SELECT
  gen_random_uuid(),
  np.id,
  CASE 
    WHEN np.slug = 'elephant-in-the-boardroom-perth' THEN (SELECT id FROM categories WHERE slug = 'web-development' LIMIT 1)
    WHEN np.slug = 'techwell-it-perth' THEN (SELECT id FROM categories WHERE slug = 'it-support' LIMIT 1)
    WHEN np.slug = 'it4-business-joondalup' THEN (SELECT id FROM categories WHERE slug = 'it-support' LIMIT 1)
    WHEN np.slug = 'webprofits-perth' THEN (SELECT id FROM categories WHERE slug = 'digital-marketing' LIMIT 1)
    WHEN np.slug = 'ample-digital-fremantle' THEN (SELECT id FROM categories WHERE slug = 'ui-ux-design' LIMIT 1)
    WHEN np.slug = 'katana-cloud-west-perth' THEN (SELECT id FROM categories WHERE slug = 'cloud-devops' LIMIT 1)
    WHEN np.slug = 'strategicit-security-perth' THEN (SELECT id FROM categories WHERE slug = 'cybersecurity' LIMIT 1)
  END,
  NULL,
  NOW(),
  NOW()
FROM new_providers np;

-- Verify Prompt 4 seeding
SELECT 
  COUNT(*) as total_it_providers,
  COUNT(DISTINCT provider_type) as provider_types
FROM providers
WHERE provider_type = 1 AND status = 1;

-- Summary log
SELECT 'Prompt 1: Category fixes applied' as operation, COUNT(*) as affected_rows
FROM provider_services WHERE created_at > NOW() - INTERVAL '5 minutes'
UNION ALL
SELECT 'Prompt 4: IT providers seeded', COUNT(*)
FROM providers WHERE slug IN (
  'elephant-in-the-boardroom-perth',
  'techwell-it-perth',
  'it4-business-joondalup',
  'webprofits-perth',
  'ample-digital-fremantle',
  'katana-cloud-west-perth',
  'strategicit-security-perth'
);

COMMIT;
