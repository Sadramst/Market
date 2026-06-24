-- APPILICO MARKET - COMPLETE STABILIZATION SCRIPT
-- Seeds all beauty categories, suburbs, providers + IT categories/providers
-- Database: appilico_market (PostgreSQL 16)
-- Execution: psql -h localhost -U postgres -d appilico_market < scripts/stabilization-complete.sql
-- 
-- This script is idempotent - safe to re-run without duplicates

BEGIN;
SET search_path TO public;

-- ============================================================================
-- BEAUTY CATEGORIES (9 total) - PROMPT 1
-- marketplace_type: 0=beauty, 1=it, 2=services
-- ============================================================================

INSERT INTO categories (name, slug, description, icon, marketplace_type, is_active, sort_order, created_at, updated_at)
VALUES 
  ('Nails', 'nails', 'Manicures, pedicures, gel nails, nail art and extensions', '💅', 0, true, 1, NOW(), NOW()),
  ('Hair', 'hair', 'Cuts, colour, balayage, highlights, blowouts and styling', '💇‍♀️', 0, true, 2, NOW(), NOW()),
  ('Lashes', 'lashes', 'Lash extensions, lifts, tints and lash treatments', '👁️', 0, true, 3, NOW(), NOW()),
  ('Brows', 'brows', 'Threading, tinting, lamination, microblading and henna', '✨', 0, true, 4, NOW(), NOW()),
  ('Skin Care', 'skin-care', 'Facials, peels, microdermabrasion and skin treatments', '🧴', 0, true, 5, NOW(), NOW()),
  ('Makeup', 'makeup', 'Bridal, occasion, everyday and special event makeup', '💄', 0, true, 6, NOW(), NOW()),
  ('Body', 'body', 'Massage, waxing, spray tan, body wraps and tanning', '🌸', 0, true, 7, NOW(), NOW()),
  ('Cosmetic', 'cosmetic', 'Injectables, fillers, anti-wrinkle and cosmetic aesthetics', '💉', 0, true, 8, NOW(), NOW()),
  ('Wellness', 'wellness', 'Holistic health, spa, meditation and wellness therapies', '🧘', 0, true, 9, NOW(), NOW())
ON CONFLICT (slug) WHERE marketplace_type = 0 DO NOTHING;

-- ============================================================================
-- BEAUTY SUBURBS (60 total) - PROMPT 1
-- ============================================================================

INSERT INTO suburbs (name, slug, postcode, latitude, longitude, marketplace_type, is_active, created_at, updated_at)
VALUES
  ('Perth CBD', 'perth-cbd', '6000', -31.9505, 115.8605, 0, true, NOW(), NOW()),
  ('Subiaco', 'subiaco', '6008', -31.9485, 115.8270, 0, true, NOW(), NOW()),
  ('Fremantle', 'fremantle', '6160', -32.0569, 115.7439, 0, true, NOW(), NOW()),
  ('Joondalup', 'joondalup', '6027', -31.7437, 115.7661, 0, true, NOW(), NOW()),
  ('Claremont', 'claremont', '6010', -31.9802, 115.7826, 0, true, NOW(), NOW()),
  ('Scarborough', 'scarborough', '6019', -31.8942, 115.7606, 0, true, NOW(), NOW()),
  ('Applecross', 'applecross', '6153', -32.0174, 115.8437, 0, true, NOW(), NOW()),
  ('Mount Lawley', 'mount-lawley', '6050', -31.9296, 115.8709, 0, true, NOW(), NOW()),
  ('Leederville', 'leederville', '6007', -31.9358, 115.8390, 0, true, NOW(), NOW()),
  ('Nedlands', 'nedlands', '6009', -31.9780, 115.8119, 0, true, NOW(), NOW()),
  ('Victoria Park', 'victoria-park', '6100', -31.9744, 115.9001, 0, true, NOW(), NOW()),
  ('Canning Vale', 'canning-vale', '6155', -32.0750, 115.9225, 0, true, NOW(), NOW()),
  ('Osborne Park', 'osborne-park', '6017', -31.8999, 115.8273, 0, true, NOW(), NOW()),
  ('Cockburn Central', 'cockburn-central', '6164', -32.1171, 115.8438, 0, true, NOW(), NOW()),
  ('Midland', 'midland', '6056', -31.8883, 116.0019, 0, true, NOW(), NOW()),
  ('Armadale', 'armadale', '6112', -32.1520, 116.0072, 0, true, NOW(), NOW()),
  ('Rockingham', 'rockingham', '6168', -32.2774, 115.7299, 0, true, NOW(), NOW()),
  ('Mandurah', 'mandurah', '6210', -32.5279, 115.7215, 0, true, NOW(), NOW()),
  ('Balcatta', 'balcatta', '6021', -31.8753, 115.8248, 0, true, NOW(), NOW()),
  ('Karrinyup', 'karrinyup', '6018', -31.8690, 115.7762, 0, true, NOW(), NOW()),
  ('Floreat', 'floreat', '6014', -31.9395, 115.8010, 0, true, NOW(), NOW()),
  ('Cottesloe', 'cottesloe', '6011', -31.9995, 115.7585, 0, true, NOW(), NOW()),
  ('Dalkeith', 'dalkeith', '6009', -31.9882, 115.8051, 0, true, NOW(), NOW()),
  ('Swanbourne', 'swanbourne', '6010', -31.9743, 115.7730, 0, true, NOW(), NOW()),
  ('Mosman Park', 'mosman-park', '6012', -31.9750, 115.7656, 0, true, NOW(), NOW()),
  ('Peppermint Grove', 'peppermint-grove', '6011', -31.9958, 115.7706, 0, true, NOW(), NOW()),
  ('North Perth', 'north-perth', '6006', -31.9200, 115.8613, 0, true, NOW(), NOW()),
  ('Highgate', 'highgate', '6003', -31.9388, 115.8714, 0, true, NOW(), NOW()),
  ('Inglewood', 'inglewood', '6052', -31.9153, 115.8768, 0, true, NOW(), NOW()),
  ('Maylands', 'maylands', '6051', -31.9297, 115.8897, 0, true, NOW(), NOW()),
  ('Bayswater', 'bayswater', '6053', -31.9188, 115.9088, 0, true, NOW(), NOW()),
  ('Morley', 'morley', '6062', -31.8884, 115.9049, 0, true, NOW(), NOW()),
  ('Dianella', 'dianella', '6059', -31.8806, 115.8762, 0, true, NOW(), NOW()),
  ('Mirrabooka', 'mirrabooka', '6061', -31.8679, 115.8570, 0, true, NOW(), NOW()),
  ('Wanneroo', 'wanneroo', '6065', -31.7502, 115.8010, 0, true, NOW(), NOW()),
  ('Ellenbrook', 'ellenbrook', '6069', -31.7640, 115.9917, 0, true, NOW(), NOW()),
  ('Swan View', 'swan-view', '6056', -31.8739, 116.0517, 0, true, NOW(), NOW()),
  ('Kalamunda', 'kalamunda', '6076', -31.9740, 116.0580, 0, true, NOW(), NOW()),
  ('Forrestfield', 'forrestfield', '6058', -31.9790, 116.0127, 0, true, NOW(), NOW()),
  ('Thornlie', 'thornlie', '6108', -32.0573, 115.9601, 0, true, NOW(), NOW()),
  ('Gosnells', 'gosnells', '6110', -32.0843, 116.0073, 0, true, NOW(), NOW()),
  ('Bentley', 'bentley', '6102', -31.9979, 115.9163, 0, true, NOW(), NOW()),
  ('East Victoria Park', 'east-victoria-park', '6101', -31.9889, 115.9059, 0, true, NOW(), NOW()),
  ('South Perth', 'south-perth', '6151', -31.9693, 115.8619, 0, true, NOW(), NOW()),
  ('Como', 'como', '6152', -31.9840, 115.8619, 0, true, NOW(), NOW()),
  ('Manning', 'manning', '6152', -32.0051, 115.8837, 0, true, NOW(), NOW()),
  ('Melville', 'melville', '6156', -31.9987, 115.8209, 0, true, NOW(), NOW()),
  ('Palmyra', 'palmyra', '6157', -32.0356, 115.8144, 0, true, NOW(), NOW()),
  ('Bicton', 'bicton', '6157', -32.0311, 115.8063, 0, true, NOW(), NOW()),
  ('East Fremantle', 'east-fremantle', '6158', -32.0336, 115.7736, 0, true, NOW(), NOW()),
  ('Hamilton Hill', 'hamilton-hill', '6163', -32.0897, 115.8035, 0, true, NOW(), NOW()),
  ('Spearwood', 'spearwood', '6163', -32.0938, 115.7765, 0, true, NOW(), NOW()),
  ('Success', 'success', '6164', -32.1044, 115.8427, 0, true, NOW(), NOW()),
  ('Bibra Lake', 'bibra-lake', '6163', -32.1056, 115.8241, 0, true, NOW(), NOW()),
  ('Beeliar', 'beeliar', '6164', -32.1248, 115.8011, 0, true, NOW(), NOW()),
  ('Yangebup', 'yangebup', '6164', -32.0967, 115.8220, 0, true, NOW(), NOW()),
  ('Waikiki', 'waikiki', '6169', -32.3035, 115.7628, 0, true, NOW(), NOW()),
  ('Secret Harbour', 'secret-harbour', '6173', -32.3803, 115.7561, 0, true, NOW(), NOW()),
  ('Baldivis', 'baldivis', '6171', -32.3116, 115.8335, 0, true, NOW(), NOW()),
  ('Bertram', 'bertram', '6167', -32.2342, 115.8297, 0, true, NOW(), NOW())
ON CONFLICT (slug) WHERE marketplace_type = 0 DO NOTHING;

-- ============================================================================
-- BEAUTY DEMO PROVIDERS (15 total) - PROMPT 1
-- provider_type: 0=beauty, 1=it, 2=services
-- ============================================================================

DO $$ 
DECLARE
  v_nails_id UUID;
  v_lashes_id UUID;
  v_hair_id UUID;
  v_brows_id UUID;
  v_skincare_id UUID;
  v_makeup_id UUID;
  v_wellness_id UUID;
  v_body_id UUID;
  v_cosmetic_id UUID;
  v_subiaco_id UUID;
  v_perth_id UUID;
  v_fremantle_id UUID;
  v_claremont_id UUID;
  v_nedlands_id UUID;
  v_scarborough_id UUID;
  v_leederville_id UUID;
  v_mount_lawley_id UUID;
  v_applecross_id UUID;
  v_victoria_park_id UUID;
  v_joondalup_id UUID;
  v_cottesloe_id UUID;
BEGIN

-- Get category IDs
  SELECT id INTO v_nails_id FROM categories WHERE slug = 'nails' AND marketplace_type = 0 LIMIT 1;
  SELECT id INTO v_lashes_id FROM categories WHERE slug = 'lashes' AND marketplace_type = 0 LIMIT 1;
  SELECT id INTO v_hair_id FROM categories WHERE slug = 'hair' AND marketplace_type = 0 LIMIT 1;
  SELECT id INTO v_brows_id FROM categories WHERE slug = 'brows' AND marketplace_type = 0 LIMIT 1;
  SELECT id INTO v_skincare_id FROM categories WHERE slug = 'skin-care' AND marketplace_type = 0 LIMIT 1;
  SELECT id INTO v_makeup_id FROM categories WHERE slug = 'makeup' AND marketplace_type = 0 LIMIT 1;
  SELECT id INTO v_wellness_id FROM categories WHERE slug = 'wellness' AND marketplace_type = 0 LIMIT 1;
  SELECT id INTO v_body_id FROM categories WHERE slug = 'body' AND marketplace_type = 0 LIMIT 1;
  SELECT id INTO v_cosmetic_id FROM categories WHERE slug = 'cosmetic' AND marketplace_type = 0 LIMIT 1;

-- Get suburb IDs
  SELECT id INTO v_subiaco_id FROM suburbs WHERE slug = 'subiaco' AND marketplace_type = 0 LIMIT 1;
  SELECT id INTO v_perth_id FROM suburbs WHERE slug = 'perth-cbd' AND marketplace_type = 0 LIMIT 1;
  SELECT id INTO v_fremantle_id FROM suburbs WHERE slug = 'fremantle' AND marketplace_type = 0 LIMIT 1;
  SELECT id INTO v_claremont_id FROM suburbs WHERE slug = 'claremont' AND marketplace_type = 0 LIMIT 1;
  SELECT id INTO v_nedlands_id FROM suburbs WHERE slug = 'nedlands' AND marketplace_type = 0 LIMIT 1;
  SELECT id INTO v_scarborough_id FROM suburbs WHERE slug = 'scarborough' AND marketplace_type = 0 LIMIT 1;
  SELECT id INTO v_leederville_id FROM suburbs WHERE slug = 'leederville' AND marketplace_type = 0 LIMIT 1;
  SELECT id INTO v_mount_lawley_id FROM suburbs WHERE slug = 'mount-lawley' AND marketplace_type = 0 LIMIT 1;
  SELECT id INTO v_applecross_id FROM suburbs WHERE slug = 'applecross' AND marketplace_type = 0 LIMIT 1;
  SELECT id INTO v_victoria_park_id FROM suburbs WHERE slug = 'victoria-park' AND marketplace_type = 0 LIMIT 1;
  SELECT id INTO v_joondalup_id FROM suburbs WHERE slug = 'joondalup' AND marketplace_type = 0 LIMIT 1;
  SELECT id INTO v_cottesloe_id FROM suburbs WHERE slug = 'cottesloe' AND marketplace_type = 0 LIMIT 1;

  INSERT INTO providers (business_name, slug, description, phone, email, address, suburb_id, average_rating, total_reviews, is_active, is_verified, provider_type, created_at, updated_at)
  VALUES
    ('Luxe Nails Subiaco', 'luxe-nails-subiaco', 'Premium gel nails and extensions with expert technicians', '0812345601', 'info@luxenails.com.au', '123 Rokeby Rd, Subiaco', v_subiaco_id, 4.8, 42, true, true, 0, NOW(), NOW()),
    ('The Lash Studio Perth', 'the-lash-studio-perth', 'Lash extensions and treatments by certified professionals', '0812345602', 'lashes@thelaststudio.com.au', '45 Murray St, Perth', v_perth_id, 4.9, 67, true, true, 0, NOW(), NOW()),
    ('Glam Hair Fremantle', 'glam-hair-fremantle', 'Cuts, colour and styling in a boutique salon atmosphere', '0812345603', 'hello@glamhair.com.au', '67 High St, Fremantle', v_fremantle_id, 4.7, 38, true, true, 0, NOW(), NOW()),
    ('Brow Bar Claremont', 'brow-bar-claremont', 'Threading, tinting and microblading expert services', '0812345604', 'brows@browbar.com.au', '89 Bay View Terrace, Claremont', v_claremont_id, 4.6, 29, true, true, 0, NOW(), NOW()),
    ('Skin by Sarah Nedlands', 'skin-by-sarah-nedlands', 'Facial treatments and professional skincare consultations', '0812345605', 'sarah@skinbysarah.com.au', '111 Underwood Ave, Nedlands', v_nedlands_id, 4.8, 55, true, true, 0, NOW(), NOW()),
    ('Bridal Makeup Perth', 'bridal-makeup-perth', 'Wedding and special occasion makeup by experienced artists', '0812345606', 'bridal@makeupperth.com.au', '22 William St, Scarborough', v_scarborough_id, 5.0, 18, true, true, 0, NOW(), NOW()),
    ('The Wellness Room Leederville', 'wellness-room-leederville', 'Holistic therapies and relaxation in a peaceful setting', '0812345607', 'info@wellnessroom.com.au', '33 Oxford St, Leederville', v_leederville_id, 4.5, 31, true, true, 0, NOW(), NOW()),
    ('Body Bliss Mount Lawley', 'body-bliss-mount-lawley', 'Massage, waxing and body treatments for relaxation', '0812345608', 'bliss@bodybliss.com.au', '44 Beaufort St, Mount Lawley', v_mount_lawley_id, 4.7, 44, true, true, 0, NOW(), NOW()),
    ('Aesthetic Studio Applecross', 'aesthetic-studio-applecross', 'Cosmetic injectables and aesthetic treatments', '0812345609', 'admin@aestheticstudio.com.au', '55 Canning Hwy, Applecross', v_applecross_id, 4.9, 23, true, true, 0, NOW(), NOW()),
    ('Nail Art by Mia', 'nail-art-by-mia', 'Creative nail designs and professional manicures', '0812345610', 'mia@nailartby.com.au', '66 Victoria St, Victoria Park', v_victoria_park_id, 4.6, 57, true, true, 0, NOW(), NOW()),
    ('Lash Lounge Joondalup', 'lash-lounge-joondalup', 'Lash extensions with premium care and comfort', '0812345611', 'lounge@lashlounge.com.au', '77 Grand Boulevard, Joondalup', v_joondalup_id, 4.8, 34, true, true, 0, NOW(), NOW()),
    ('Hair House Subiaco', 'hair-house-subiaco', 'Boutique hair salon with experienced stylists', '0812345612', 'cuts@hairhouse.com.au', '88 Rokeby Rd, Subiaco', v_subiaco_id, 4.7, 61, true, true, 0, NOW(), NOW()),
    ('Skin Clinic Cottesloe', 'skin-clinic-cottesloe', 'Advanced skincare treatments and facials', '0812345613', 'clinic@skinclinic.com.au', '99 Marine Pde, Cottesloe', v_cottesloe_id, 4.9, 48, true, true, 0, NOW(), NOW()),
    ('Brow & Lash Lab', 'brow-lash-lab', 'Expert brow and lash services in Mount Lawley', '0812345614', 'lab@browlash.com.au', '110 Beaufort St, Mount Lawley', v_mount_lawley_id, 4.8, 37, true, true, 0, NOW(), NOW()),
    ('Glow Body Studio', 'glow-body-studio', 'Body treatments and wellness in Fremantle', '0812345615', 'glow@bodystudio.com.au', '121 High St, Fremantle', v_fremantle_id, 4.6, 26, true, true, 0, NOW(), NOW())
  ON CONFLICT (slug) DO NOTHING;

END $$;

-- ============================================================================
-- IT CATEGORIES (12 total) - PROMPT 4
-- ============================================================================

INSERT INTO categories (name, slug, description, icon, marketplace_type, is_active, sort_order, created_at, updated_at)
VALUES
  ('Web Development', 'web-development', 'Website design, development and custom web solutions', '🌐', 1, true, 1, NOW(), NOW()),
  ('Mobile Apps', 'mobile-apps', 'iOS and Android app development and maintenance', '📱', 1, true, 2, NOW(), NOW()),
  ('Cloud & DevOps', 'cloud-devops', 'Cloud infrastructure, deployment and DevOps solutions', '☁️', 1, true, 3, NOW(), NOW()),
  ('Cybersecurity', 'cybersecurity', 'Security audits, penetration testing and threat management', '🔒', 1, true, 4, NOW(), NOW()),
  ('Data & Analytics', 'data-analytics', 'Data analysis, business intelligence and reporting', '📊', 1, true, 5, NOW(), NOW()),
  ('IT Support', 'it-support', 'Technical support, helpdesk and IT maintenance', '🛠️', 1, true, 6, NOW(), NOW()),
  ('AI & ML', 'ai-ml', 'Artificial intelligence and machine learning solutions', '🤖', 1, true, 7, NOW(), NOW()),
  ('UI/UX Design', 'ui-ux-design', 'User interface and experience design services', '✏️', 1, true, 8, NOW(), NOW()),
  ('IT Consulting', 'it-consulting', 'Technology consulting and strategic IT planning', '💼', 1, true, 9, NOW(), NOW()),
  ('Networking', 'networking', 'Network design, installation and management', '🔗', 1, true, 10, NOW(), NOW()),
  ('E-Commerce', 'ecommerce', 'E-commerce platform development and optimization', '🛒', 1, true, 11, NOW(), NOW()),
  ('Digital Marketing', 'digital-marketing', 'SEO, PPC and digital marketing strategies', '📢', 1, true, 12, NOW(), NOW())
ON CONFLICT (slug) WHERE marketplace_type = 1 DO NOTHING;

-- ============================================================================
-- IT SUBURBS - Include key Perth business districts - PROMPT 4
-- ============================================================================

INSERT INTO suburbs (name, slug, postcode, latitude, longitude, marketplace_type, is_active, created_at, updated_at)
VALUES
  ('Perth CBD', 'perth-cbd-it', '6000', -31.9505, 115.8605, 1, true, NOW(), NOW()),
  ('Osborne Park', 'osborne-park-it', '6017', -31.8999, 115.8273, 1, true, NOW(), NOW()),
  ('Joondalup', 'joondalup-it', '6027', -31.7437, 115.7661, 1, true, NOW(), NOW()),
  ('Fremantle', 'fremantle-it', '6160', -32.0569, 115.7439, 1, true, NOW(), NOW()),
  ('West Perth', 'west-perth-it', '6005', -31.9324, 115.8373, 1, true, NOW(), NOW())
ON CONFLICT (slug) WHERE marketplace_type = 1 DO NOTHING;

-- ============================================================================
-- IT DEMO PROVIDERS (7 total) - PROMPT 4
-- ============================================================================

DO $$
DECLARE
  v_webdev_id UUID;
  v_mobileapp_id UUID;
  v_clouddevops_id UUID;
  v_cybersec_id UUID;
  v_data_id UUID;
  v_itsupport_id UUID;
  v_aiml_id UUID;
  v_perth_it_id UUID;
  v_osborne_it_id UUID;
  v_joondalup_it_id UUID;
  v_fremantle_it_id UUID;
  v_westperth_it_id UUID;
BEGIN

-- Get IT category IDs
  SELECT id INTO v_webdev_id FROM categories WHERE slug = 'web-development' AND marketplace_type = 1 LIMIT 1;
  SELECT id INTO v_mobileapp_id FROM categories WHERE slug = 'mobile-apps' AND marketplace_type = 1 LIMIT 1;
  SELECT id INTO v_clouddevops_id FROM categories WHERE slug = 'cloud-devops' AND marketplace_type = 1 LIMIT 1;
  SELECT id INTO v_cybersec_id FROM categories WHERE slug = 'cybersecurity' AND marketplace_type = 1 LIMIT 1;
  SELECT id INTO v_data_id FROM categories WHERE slug = 'data-analytics' AND marketplace_type = 1 LIMIT 1;
  SELECT id INTO v_itsupport_id FROM categories WHERE slug = 'it-support' AND marketplace_type = 1 LIMIT 1;
  SELECT id INTO v_aiml_id FROM categories WHERE slug = 'ai-ml' AND marketplace_type = 1 LIMIT 1;

-- Get IT suburb IDs
  SELECT id INTO v_perth_it_id FROM suburbs WHERE slug = 'perth-cbd-it' AND marketplace_type = 1 LIMIT 1;
  SELECT id INTO v_osborne_it_id FROM suburbs WHERE slug = 'osborne-park-it' AND marketplace_type = 1 LIMIT 1;
  SELECT id INTO v_joondalup_it_id FROM suburbs WHERE slug = 'joondalup-it' AND marketplace_type = 1 LIMIT 1;
  SELECT id INTO v_fremantle_it_id FROM suburbs WHERE slug = 'fremantle-it' AND marketplace_type = 1 LIMIT 1;
  SELECT id INTO v_westperth_it_id FROM suburbs WHERE slug = 'west-perth-it' AND marketplace_type = 1 LIMIT 1;

  INSERT INTO providers (business_name, slug, description, phone, email, address, suburb_id, average_rating, total_reviews, is_active, is_verified, provider_type, created_at, updated_at)
  VALUES
    ('TechVision Solutions', 'techvision-solutions', 'Web and mobile development for growing businesses', '+61 8 9000 1111', 'info@techvision.com.au', '100 St Georges Terrace, Perth', v_perth_it_id, 4.9, 52, true, true, 1, NOW(), NOW()),
    ('Cloud Nine DevOps', 'cloud-nine-devops', 'Cloud infrastructure and deployment automation', '+61 8 9000 2222', 'hello@cloudnine.com.au', '200 Osborne Ave, Osborne Park', v_osborne_it_id, 4.7, 38, true, true, 1, NOW(), NOW()),
    ('SecureIT Consulting', 'secureit-consulting', 'Cybersecurity and threat assessment services', '+61 8 9000 3333', 'security@secureit.com.au', '300 Grand Boulevard, Joondalup', v_joondalup_it_id, 4.8, 45, true, true, 1, NOW(), NOW()),
    ('DataFlow Analytics', 'dataflow-analytics', 'Business intelligence and data analytics solutions', '+61 8 9000 4444', 'data@dataflow.com.au', '400 High St, Fremantle', v_fremantle_it_id, 4.9, 41, true, true, 1, NOW(), NOW()),
    ('AI Innovations Lab', 'ai-innovations-lab', 'Machine learning and AI-powered solutions', '+61 8 9000 5555', 'lab@aiinnovations.com.au', '500 Hay St, West Perth', v_westperth_it_id, 4.8, 36, true, true, 1, NOW(), NOW()),
    ('Swift Support IT', 'swift-support-it', 'Managed IT services and technical support', '+61 8 9000 6666', 'support@swiftit.com.au', '150 St Georges Terrace, Perth', v_perth_it_id, 4.7, 48, true, true, 1, NOW(), NOW()),
    ('Digital Forge Agency', 'digital-forge-agency', 'Full-stack development and digital transformation', '+61 8 9000 7777', 'forge@digitalforge.com.au', '250 Osborne Ave, Osborne Park', v_osborne_it_id, 4.9, 39, true, true, 1, NOW(), NOW())
  ON CONFLICT (slug) DO NOTHING;

END $$;

-- ============================================================================
-- REVIEW DATA - Sample reviews for providers
-- ============================================================================

-- Note: Add reviews as needed to populate review data in production

COMMIT;

-- Verify data was inserted
SELECT COUNT(*) as beauty_categories FROM categories WHERE marketplace_type = 0;
SELECT COUNT(*) as it_categories FROM categories WHERE marketplace_type = 1;
SELECT COUNT(*) as beauty_suburbs FROM suburbs WHERE marketplace_type = 0;
SELECT COUNT(*) as it_suburbs FROM suburbs WHERE marketplace_type = 1;
SELECT COUNT(*) as beauty_providers FROM providers WHERE provider_type = 0;
SELECT COUNT(*) as it_providers FROM providers WHERE provider_type = 1;

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
