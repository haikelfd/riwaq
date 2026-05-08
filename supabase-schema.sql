-- RIWAQ Database Schema
-- Run this in your Supabase SQL Editor

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- Locations table (Tunisian governorates)
CREATE TABLE locations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE
);

-- Sellers table
CREATE TABLE sellers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  management_token UUID DEFAULT uuid_generate_v4() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subcategories table
CREATE TABLE subcategories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL DEFAULT '',
  slug TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL DEFAULT 'package',
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- Listings table
CREATE TABLE listings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC,
  condition TEXT NOT NULL CHECK (condition IN ('neuf', 'occasion')),
  category_id UUID NOT NULL REFERENCES categories(id),
  location_id UUID NOT NULL REFERENCES locations(id),
  phone TEXT NOT NULL,
  seller_name TEXT,
  seller_id UUID REFERENCES sellers(id) ON DELETE SET NULL,
  brand TEXT,
  model TEXT,
  year INTEGER,
  energy_type TEXT CHECK (energy_type IN ('electrique', 'gaz', 'manuel', 'mixte') OR energy_type IS NULL),
  delivery_type TEXT CHECK (delivery_type IN ('sur_place', 'livraison', 'livraison_nationale') OR delivery_type IS NULL),
  cuisine_type TEXT CHECK (cuisine_type IN ('tunisienne', 'française', 'italienne', 'libanaise', 'turque', 'chinoise', 'japonaise', 'thaïlandaise', 'mexicaine', 'indienne', 'coréenne', 'américaine', 'autre') OR cuisine_type IS NULL),
  subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL,
  specs JSONB DEFAULT '{}',
  management_token UUID DEFAULT uuid_generate_v4() NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'expired', 'deleted', 'sold')),
  search_vector TSVECTOR,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Listing images table
CREATE TABLE listing_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- Admin users table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Moderation log table
CREATE TABLE moderation_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  admin_id UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_listings_category ON listings(category_id);
CREATE INDEX idx_listings_location ON listings(location_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_created_at ON listings(created_at DESC);
CREATE INDEX idx_listings_management_token ON listings(management_token);
CREATE INDEX idx_listings_search_vector ON listings USING GIN(search_vector);
CREATE INDEX idx_listings_seller_id ON listings(seller_id);
CREATE INDEX idx_listings_subcategory ON listings(subcategory_id);
CREATE INDEX idx_subcategories_category ON subcategories(category_id);
CREATE INDEX idx_listing_images_listing ON listing_images(listing_id);
CREATE INDEX idx_sellers_management_token ON sellers(management_token);

-- Full-text search trigger (includes brand and model)
CREATE OR REPLACE FUNCTION listings_search_vector_update() RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('french', unaccent(coalesce(NEW.title, ''))), 'A') ||
    setweight(to_tsvector('french', unaccent(coalesce(NEW.brand, '') || ' ' || coalesce(NEW.model, ''))), 'A') ||
    setweight(to_tsvector('french', unaccent(coalesce(NEW.description, ''))), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER listings_search_vector_trigger
  BEFORE INSERT OR UPDATE OF title, description, brand, model ON listings
  FOR EACH ROW
  EXECUTE FUNCTION listings_search_vector_update();

-- Updated_at trigger for listings
CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER listings_updated_at_trigger
  BEFORE UPDATE ON listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER sellers_updated_at_trigger
  BEFORE UPDATE ON sellers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_log ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Subcategories are viewable by everyone" ON subcategories FOR SELECT USING (true);
CREATE POLICY "Locations are viewable by everyone" ON locations FOR SELECT USING (true);
CREATE POLICY "Sellers are viewable by everyone" ON sellers FOR SELECT USING (true);
CREATE POLICY "Active listings are viewable by everyone" ON listings FOR SELECT USING (status = 'active');
CREATE POLICY "Listing images are viewable by everyone" ON listing_images FOR SELECT USING (true);

-- Insert policies (anyone can create listings and sellers)
CREATE POLICY "Anyone can create listings" ON listings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can add listing images" ON listing_images FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create sellers" ON sellers FOR INSERT WITH CHECK (true);

-- Update/delete policies (via management_token, handled in server actions)
CREATE POLICY "Listings can be updated via service role" ON listings FOR UPDATE USING (true);
CREATE POLICY "Listings can be deleted via service role" ON listings FOR DELETE USING (true);
CREATE POLICY "Sellers can be updated via service role" ON sellers FOR UPDATE USING (true);

-- Admin policies
CREATE POLICY "Admins can view admin_users" ON admin_users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view moderation_log" ON moderation_log FOR SELECT USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);
CREATE POLICY "Admins can insert moderation_log" ON moderation_log FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);

-- Seed categories
INSERT INTO categories (name, name_ar, slug, icon, sort_order) VALUES
  ('Café & Coffee', 'قهوة ومعدات المقاهي', 'cafe-coffee', 'coffee', 1),
  ('Cuisine chaude', 'معدات الطبخ', 'cuisine-chaude', 'flame', 2),
  ('Froid & Réfrigération', 'تبريد وتجميد', 'froid-refrigeration', 'snowflake', 3),
  ('Meubles & Agencement', 'أثاث و تجهيزات', 'mobilier', 'chair', 4),
  ('Équipements divers', 'معدات متنوعة', 'equipements-divers', 'wrench', 5),
  ('Pâtisserie & Boulangerie', 'حلويات ومخابز', 'patisserie-boulangerie', 'croissant', 6);

-- Seed locations (Tunisian governorates)
INSERT INTO locations (name, name_ar, slug) VALUES
  ('Tunis', 'تونس', 'tunis'),
  ('Ariana', 'أريانة', 'ariana'),
  ('Ben Arous', 'بن عروس', 'ben-arous'),
  ('Manouba', 'منوبة', 'manouba'),
  ('Nabeul', 'نابل', 'nabeul'),
  ('Zaghouan', 'زغوان', 'zaghouan'),
  ('Bizerte', 'بنزرت', 'bizerte'),
  ('Béja', 'باجة', 'beja'),
  ('Jendouba', 'جندوبة', 'jendouba'),
  ('Le Kef', 'الكاف', 'le-kef'),
  ('Siliana', 'سليانة', 'siliana'),
  ('Sousse', 'سوسة', 'sousse'),
  ('Monastir', 'المنستير', 'monastir'),
  ('Mahdia', 'المهدية', 'mahdia'),
  ('Sfax', 'صفاقس', 'sfax'),
  ('Kairouan', 'القيروان', 'kairouan'),
  ('Kasserine', 'القصرين', 'kasserine'),
  ('Sidi Bouzid', 'سيدي بوزيد', 'sidi-bouzid'),
  ('Gabès', 'قابس', 'gabes'),
  ('Médenine', 'مدنين', 'medenine'),
  ('Tataouine', 'تطاوين', 'tataouine'),
  ('Gafsa', 'قفصة', 'gafsa'),
  ('Tozeur', 'توزر', 'tozeur'),
  ('Kébili', 'قبلي', 'kebili');

-- Seed subcategories
-- Note: category_id references are placeholders — use the actual UUIDs from your categories table.
-- The migration section below uses subqueries to resolve them automatically.

-- Storage bucket (run in Supabase Dashboard > Storage)
-- Create a public bucket called "listing-images"
-- Set file size limit to 5MB
-- Allow only image/* mime types

-- Auto-expire anonymous listings (run in Supabase SQL Editor)
-- Expires anonymous listings (no user account) after their 30-day expires_at date.
-- Authenticated users' listings never expire (expires_at = NULL).
--
-- CREATE EXTENSION IF NOT EXISTS pg_cron;
-- SELECT cron.schedule('expire-anonymous-listings', '0 3 * * *', $$
--   UPDATE listings SET status = 'expired'
--   WHERE status = 'active' AND user_id IS NULL AND expires_at < NOW();
-- $$);

-- ============================================================
-- MIGRATION: If you already have the database and need to add
-- the new seller/equipment columns, run this instead:
-- ============================================================
-- CREATE TABLE sellers (
--   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
--   full_name TEXT NOT NULL,
--   phone TEXT NOT NULL,
--   email TEXT,
--   management_token UUID DEFAULT uuid_generate_v4() NOT NULL,
--   created_at TIMESTAMPTZ DEFAULT NOW(),
--   updated_at TIMESTAMPTZ DEFAULT NOW()
-- );
-- CREATE INDEX idx_sellers_management_token ON sellers(management_token);
-- ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Sellers are viewable by everyone" ON sellers FOR SELECT USING (true);
-- CREATE POLICY "Anyone can create sellers" ON sellers FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Sellers can be updated via service role" ON sellers FOR UPDATE USING (true);
-- CREATE TRIGGER sellers_updated_at_trigger BEFORE UPDATE ON sellers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
--
-- ALTER TABLE listings ADD COLUMN seller_id UUID REFERENCES sellers(id) ON DELETE SET NULL;
-- ALTER TABLE listings ADD COLUMN brand TEXT;
-- ALTER TABLE listings ADD COLUMN model TEXT;
-- ALTER TABLE listings ADD COLUMN year INTEGER;
-- ALTER TABLE listings ADD COLUMN energy_type TEXT CHECK (energy_type IN ('electrique','gaz','manuel','mixte') OR energy_type IS NULL);
-- CREATE INDEX idx_listings_seller_id ON listings(seller_id);
--
-- DROP TRIGGER IF EXISTS listings_search_vector_trigger ON listings;
-- CREATE OR REPLACE FUNCTION listings_search_vector_update() RETURNS TRIGGER AS $$
-- BEGIN
--   NEW.search_vector :=
--     setweight(to_tsvector('french', unaccent(coalesce(NEW.title, ''))), 'A') ||
--     setweight(to_tsvector('french', unaccent(coalesce(NEW.brand, '') || ' ' || coalesce(NEW.model, ''))), 'A') ||
--     setweight(to_tsvector('french', unaccent(coalesce(NEW.description, ''))), 'B');
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;
-- CREATE TRIGGER listings_search_vector_trigger
--   BEFORE INSERT OR UPDATE OF title, description, brand, model ON listings
--   FOR EACH ROW EXECUTE FUNCTION listings_search_vector_update();
--
-- UPDATE categories SET icon = 'coffee' WHERE slug = 'cafe-coffee';
-- UPDATE categories SET icon = 'flame' WHERE slug = 'cuisine-chaude';
-- UPDATE categories SET icon = 'snowflake' WHERE slug = 'froid-refrigeration';
-- UPDATE categories SET icon = 'chair' WHERE slug = 'mobilier';
-- UPDATE categories SET icon = 'wrench' WHERE slug = 'equipements-divers';
-- UPDATE categories SET icon = 'croissant' WHERE slug = 'patisserie-boulangerie';
--
-- ============================================================
-- MIGRATION: Add 'sold' to listings status constraint
-- (for save-for-later + sold status feature)
-- ============================================================
-- ALTER TABLE listings DROP CONSTRAINT IF EXISTS listings_status_check;
-- ALTER TABLE listings ADD CONSTRAINT listings_status_check
--   CHECK (status IN ('active', 'pending', 'expired', 'deleted', 'sold'));
--
-- ============================================================
-- MIGRATION: Phone OTP Auth + User Profiles
-- ============================================================
--
-- CREATE TABLE profiles (
--   id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
--   phone TEXT NOT NULL,
--   full_name TEXT,
--   avatar_url TEXT,
--   has_seen_tour BOOLEAN NOT NULL DEFAULT FALSE,
--   created_at TIMESTAMPTZ DEFAULT NOW(),
--   updated_at TIMESTAMPTZ DEFAULT NOW()
-- );
--
-- CREATE INDEX idx_profiles_phone ON profiles(phone);
--
-- CREATE TRIGGER profiles_updated_at_trigger
--   BEFORE UPDATE ON profiles
--   FOR EACH ROW EXECUTE FUNCTION update_updated_at();
--
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
--
-- CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
-- CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
-- CREATE POLICY "Service role can insert profiles" ON profiles FOR INSERT WITH CHECK (true);
--
-- CREATE OR REPLACE FUNCTION handle_new_user() RETURNS TRIGGER AS $$
-- BEGIN
--   INSERT INTO profiles (id, phone) VALUES (NEW.id, COALESCE(NEW.phone, ''));
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;
--
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION handle_new_user();
--
-- ALTER TABLE listings ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
-- CREATE INDEX idx_listings_user_id ON listings(user_id);
--
-- CREATE POLICY "Users can view own listings" ON listings FOR SELECT USING (auth.uid() = user_id);

-- ============================================================
-- SECURITY MIGRATION: Run this in Supabase SQL Editor
-- Hides management_token from public API access
-- ============================================================
--
-- Step 1: Revoke column-level access to management_token
-- This prevents the anon and authenticated roles from reading
-- management_token via the REST API, even with select=*
--
-- REVOKE SELECT (management_token) ON listings FROM anon, authenticated;
-- REVOKE SELECT (management_token) ON sellers FROM anon, authenticated;
--
-- Step 2: Replace overly-permissive UPDATE/DELETE policies
-- These policies use USING(true) which is redundant since
-- the service role bypasses RLS anyway. Drop them to reduce
-- attack surface if service role key is ever compromised.
--
-- DROP POLICY IF EXISTS "Listings can be updated via service role" ON listings;
-- DROP POLICY IF EXISTS "Listings can be deleted via service role" ON listings;
-- DROP POLICY IF EXISTS "Sellers can be updated via service role" ON sellers;
--
-- Step 3: Lock down admin_users INSERT (prevent self-registration)
-- By default there's no INSERT policy so anon can't insert,
-- but explicitly deny for safety:
--
-- CREATE POLICY "No public insert on admin_users" ON admin_users
--   FOR INSERT WITH CHECK (false);
--
-- ============================================================
-- MIGRATION: Add delivery_type to listings
-- ============================================================
-- ALTER TABLE listings ADD COLUMN delivery_type TEXT
--   CHECK (delivery_type IN ('sur_place', 'livraison', 'livraison_nationale') OR delivery_type IS NULL);
--
-- ============================================================
-- MIGRATION: Subcategories system
-- Run this if you already have the database set up
-- ============================================================
--
-- CREATE TABLE subcategories (
--   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
--   category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
--   name TEXT NOT NULL,
--   name_ar TEXT NOT NULL DEFAULT '',
--   slug TEXT NOT NULL UNIQUE,
--   icon TEXT NOT NULL DEFAULT 'package',
--   sort_order INTEGER NOT NULL DEFAULT 0
-- );
--
-- CREATE INDEX idx_subcategories_category ON subcategories(category_id);
-- ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Subcategories are viewable by everyone" ON subcategories FOR SELECT USING (true);
--
-- ALTER TABLE listings ADD COLUMN subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL;
-- CREATE INDEX idx_listings_subcategory ON listings(subcategory_id);
--
-- -- Seed subcategories (uses subqueries to resolve category UUIDs)
-- INSERT INTO subcategories (category_id, name, name_ar, slug, icon, sort_order) VALUES
--   -- Café & Coffee (8)
--   ((SELECT id FROM categories WHERE slug = 'cafe-coffee'), 'Machine espresso', 'آلة إسبريسو', 'machine-espresso', 'espresso', 1),
--   ((SELECT id FROM categories WHERE slug = 'cafe-coffee'), 'Moulin à café', 'مطحنة قهوة', 'moulin-cafe', 'grinder', 2),
--   ((SELECT id FROM categories WHERE slug = 'cafe-coffee'), 'Percolateur', 'برّاد قهوة', 'percolateur', 'coffee', 3),
--   ((SELECT id FROM categories WHERE slug = 'cafe-coffee'), 'Machine à café filtre', 'آلة قهوة فلتر', 'machine-cafe-filtre', 'filter-coffee', 4),
--   ((SELECT id FROM categories WHERE slug = 'cafe-coffee'), 'Vitrine pâtisserie', 'واجهة حلويات', 'vitrine-patisserie-cafe', 'display-case', 5),
--   ((SELECT id FROM categories WHERE slug = 'cafe-coffee'), 'Blender / Mixeur', 'خلّاط', 'blender-mixeur', 'blender', 6),
--   ((SELECT id FROM categories WHERE slug = 'cafe-coffee'), 'Presse-agrumes', 'عصّارة حوامض', 'presse-agrumes', 'juicer', 7),
--   ((SELECT id FROM categories WHERE slug = 'cafe-coffee'), 'Fontaine à boissons', 'نافورة مشروبات', 'fontaine-boissons', 'dispenser', 8),
--   -- Cuisine chaude (12)
--   ((SELECT id FROM categories WHERE slug = 'cuisine-chaude'), 'Four', 'فرن', 'four', 'oven', 1),
--   ((SELECT id FROM categories WHERE slug = 'cuisine-chaude'), 'Friteuse', 'مقلاة', 'friteuse', 'fryer', 2),
--   ((SELECT id FROM categories WHERE slug = 'cuisine-chaude'), 'Grill / Plancha', 'شواية', 'grill-plancha', 'grill', 3),
--   ((SELECT id FROM categories WHERE slug = 'cuisine-chaude'), 'Plaque de cuisson', 'لوحة طبخ', 'plaque-cuisson', 'cooking-pot', 4),
--   ((SELECT id FROM categories WHERE slug = 'cuisine-chaude'), 'Cuisinière', 'طبّاخة', 'cuisiniere', 'flame', 5),
--   ((SELECT id FROM categories WHERE slug = 'cuisine-chaude'), 'Bain-marie', 'حمام مائي', 'bain-marie', 'cooking-pot', 6),
--   ((SELECT id FROM categories WHERE slug = 'cuisine-chaude'), 'Four à pizza', 'فرن بيتزا', 'four-pizza', 'oven', 7),
--   ((SELECT id FROM categories WHERE slug = 'cuisine-chaude'), 'Salamandre', 'سلمندر', 'salamandre', 'grill', 8),
--   ((SELECT id FROM categories WHERE slug = 'cuisine-chaude'), 'Rôtissoire', 'شوّاية دوّارة', 'rotissoire', 'rotisserie', 9),
--   ((SELECT id FROM categories WHERE slug = 'cuisine-chaude'), 'Crêpière', 'صانعة كريب', 'crepiere', 'cooking-pot', 10),
--   ((SELECT id FROM categories WHERE slug = 'cuisine-chaude'), 'Toaster professionnel', 'محمّصة خبز', 'toaster-pro', 'toaster', 11),
--   ((SELECT id FROM categories WHERE slug = 'cuisine-chaude'), 'Cuiseur à pâtes', 'طبّاخ معكرونة', 'cuiseur-pates', 'pasta', 12),
--   -- Froid & Réfrigération (9)
--   ((SELECT id FROM categories WHERE slug = 'froid-refrigeration'), 'Réfrigérateur', 'ثلاجة', 'refrigerateur', 'fridge', 1),
--   ((SELECT id FROM categories WHERE slug = 'froid-refrigeration'), 'Congélateur', 'مُجمّد', 'congelateur', 'freezer', 2),
--   ((SELECT id FROM categories WHERE slug = 'froid-refrigeration'), 'Vitrine réfrigérée', 'واجهة مبرّدة', 'vitrine-refrigeree', 'display-case', 3),
--   ((SELECT id FROM categories WHERE slug = 'froid-refrigeration'), 'Machine à glaçons', 'آلة ثلج', 'machine-glacons', 'ice-cube', 4),
--   ((SELECT id FROM categories WHERE slug = 'froid-refrigeration'), 'Table réfrigérée', 'طاولة مبرّدة', 'table-refrigeree', 'fridge', 5),
--   ((SELECT id FROM categories WHERE slug = 'froid-refrigeration'), 'Chambre froide', 'غرفة تبريد', 'chambre-froide', 'freezer', 6),
--   ((SELECT id FROM categories WHERE slug = 'froid-refrigeration'), 'Saladette / Table pizza', 'طاولة سلطات', 'saladette', 'fridge', 7),
--   ((SELECT id FROM categories WHERE slug = 'froid-refrigeration'), 'Machine à glace', 'آلة مثلّجات', 'machine-glace', 'ice-cream', 8),
--   ((SELECT id FROM categories WHERE slug = 'froid-refrigeration'), 'Fontaine à eau', 'نافورة ماء', 'fontaine-eau', 'water-drop', 9),
--   -- Mobilier (9)
--   ((SELECT id FROM categories WHERE slug = 'mobilier'), 'Table', 'طاولة', 'table', 'table', 1),
--   ((SELECT id FROM categories WHERE slug = 'mobilier'), 'Chaise / Tabouret', 'كرسي', 'chaise-tabouret', 'stool', 2),
--   ((SELECT id FROM categories WHERE slug = 'mobilier'), 'Comptoir / Bar', 'كونتوار', 'comptoir-bar', 'counter', 3),
--   ((SELECT id FROM categories WHERE slug = 'mobilier'), 'Étagère / Rayonnage', 'رفّ', 'etagere-rayonnage', 'shelf', 4),
--   ((SELECT id FROM categories WHERE slug = 'mobilier'), 'Vitrine d''exposition', 'واجهة عرض', 'vitrine-exposition', 'display-case', 5),
--   ((SELECT id FROM categories WHERE slug = 'mobilier'), 'Banquette', 'أريكة', 'banquette', 'stool', 6),
--   ((SELECT id FROM categories WHERE slug = 'mobilier'), 'Chariot de service', 'عربة خدمة', 'chariot-service', 'cart', 7),
--   ((SELECT id FROM categories WHERE slug = 'mobilier'), 'Armoire inox', 'خزانة ستانلس', 'armoire-inox', 'shelf', 8),
--   ((SELECT id FROM categories WHERE slug = 'mobilier'), 'Parasol / Terrasse', 'مظلّة', 'parasol-terrasse', 'parasol', 9),
--   -- Équipements divers (10)
--   ((SELECT id FROM categories WHERE slug = 'equipements-divers'), 'Lave-vaisselle', 'غسّالة صحون', 'lave-vaisselle', 'dishwasher', 1),
--   ((SELECT id FROM categories WHERE slug = 'equipements-divers'), 'Hotte / Extracteur', 'شفّاطة', 'hotte-extracteur', 'hood', 2),
--   ((SELECT id FROM categories WHERE slug = 'equipements-divers'), 'Balance', 'ميزان', 'balance', 'scale', 3),
--   ((SELECT id FROM categories WHERE slug = 'equipements-divers'), 'Trancheur', 'قطّاعة', 'trancheur', 'slicer', 4),
--   ((SELECT id FROM categories WHERE slug = 'equipements-divers'), 'Caisse enregistreuse', 'صندوق محاسبة', 'caisse-enregistreuse', 'cash-register', 5),
--   ((SELECT id FROM categories WHERE slug = 'equipements-divers'), 'Robot coupe / Cutter', 'روبو كوب', 'robot-coupe', 'processor', 6),
--   ((SELECT id FROM categories WHERE slug = 'equipements-divers'), 'Machine sous vide', 'آلة تغليف', 'machine-sous-vide', 'vacuum-seal', 7),
--   ((SELECT id FROM categories WHERE slug = 'equipements-divers'), 'Évier professionnel', 'حوض غسيل', 'evier-pro', 'sink', 8),
--   ((SELECT id FROM categories WHERE slug = 'equipements-divers'), 'Adoucisseur / Filtre eau', 'مصفّي ماء', 'adoucisseur-eau', 'water-drop', 9),
--   ((SELECT id FROM categories WHERE slug = 'equipements-divers'), 'Bac gastro / Inox', 'صحون ستانلس', 'bac-gastro', 'tray', 10),
--   -- Pâtisserie & Boulangerie (9)
--   ((SELECT id FROM categories WHERE slug = 'patisserie-boulangerie'), 'Four pâtissier', 'فرن حلويات', 'four-patissier', 'oven', 1),
--   ((SELECT id FROM categories WHERE slug = 'patisserie-boulangerie'), 'Pétrin', 'عجّانة', 'petrin', 'mixer', 2),
--   ((SELECT id FROM categories WHERE slug = 'patisserie-boulangerie'), 'Batteur', 'خفّاقة', 'batteur', 'mixer', 3),
--   ((SELECT id FROM categories WHERE slug = 'patisserie-boulangerie'), 'Laminoir', 'رقّاقة عجين', 'laminoir', 'rolling-pin', 4),
--   ((SELECT id FROM categories WHERE slug = 'patisserie-boulangerie'), 'Chambre de pousse', 'غرفة تخمير', 'chambre-de-pousse', 'rise', 5),
--   ((SELECT id FROM categories WHERE slug = 'patisserie-boulangerie'), 'Diviseuse', 'مقسّمة عجين', 'diviseuse', 'slicer', 6),
--   ((SELECT id FROM categories WHERE slug = 'patisserie-boulangerie'), 'Façonneuse', 'مشكّلة عجين', 'faconneuse', 'rolling-pin', 7),
--   ((SELECT id FROM categories WHERE slug = 'patisserie-boulangerie'), 'Cellule de refroidissement', 'خلية تبريد', 'cellule-refroidissement', 'freezer', 8),
--   ((SELECT id FROM categories WHERE slug = 'patisserie-boulangerie'), 'Vitrine pâtisserie', 'واجهة حلويات', 'vitrine-patisserie', 'display-case', 9);
--
-- -- Grant column access for the new subcategory_id
-- GRANT SELECT (subcategory_id) ON listings TO anon, authenticated;
-- NOTIFY pgrst, 'reload schema';
--
-- ============================================================
-- MIGRATION: Add specs JSONB column to listings
-- Stores subcategory-specific product attributes as key/value pairs
-- ============================================================
-- ALTER TABLE listings ADD COLUMN specs JSONB DEFAULT '{}';
-- CREATE INDEX idx_listings_specs ON listings USING GIN(specs);
-- GRANT SELECT (specs) ON listings TO anon, authenticated;
-- NOTIFY pgrst, 'reload schema';
--
-- ============================================================
-- MIGRATION: Add tier column to profiles
-- Supports tier-based limits: compte (3 listings, 14d expiry),
-- premium (20 listings, no expiry), store (unlimited, no expiry)
-- ============================================================
-- ALTER TABLE profiles ADD COLUMN tier TEXT NOT NULL DEFAULT 'compte'
--   CHECK (tier IN ('compte', 'premium', 'store'));
--
-- -- Update the pg_cron job to handle tier-based expiry
-- -- (Anonymous = 4 days, compte = 30 days, premium/store = never)
-- SELECT cron.unschedule('expire-anonymous-listings');
-- SELECT cron.schedule('expire-listings', '0 3 * * *', $$
--   UPDATE listings SET status = 'expired'
--   WHERE status = 'active'
--     AND expires_at IS NOT NULL
--     AND expires_at < NOW();
-- $$);
--
-- ============================================================
-- MIGRATION: Add view_count to listings + increment RPC
-- Tracks page views per listing for analytics
-- ============================================================
-- ALTER TABLE listings ADD COLUMN view_count INTEGER NOT NULL DEFAULT 0;
--
-- CREATE OR REPLACE FUNCTION increment_view_count(listing_id UUID)
-- RETURNS VOID AS $$
-- BEGIN
--   UPDATE listings SET view_count = view_count + 1
--   WHERE id = listing_id AND status IN ('active', 'sold');
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;
--
-- GRANT EXECUTE ON FUNCTION increment_view_count(UUID) TO anon, authenticated;

-- ============================================================
-- MIGRATION: Listing Reports (user-submitted flags)
-- ============================================================
-- CREATE TABLE listing_reports (
--   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
--   listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
--   reason TEXT NOT NULL CHECK (reason IN (
--     'photos_misleading', 'seller_unresponsive', 'already_sold',
--     'scam', 'inappropriate', 'other'
--   )),
--   description TEXT,
--   reporter_phone TEXT,
--   status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed')),
--   reviewed_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
--   reviewed_at TIMESTAMPTZ,
--   created_at TIMESTAMPTZ DEFAULT NOW()
-- );
--
-- CREATE INDEX idx_listing_reports_listing ON listing_reports(listing_id);
-- CREATE INDEX idx_listing_reports_status ON listing_reports(status);
--
-- ALTER TABLE listing_reports ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Anyone can create reports" ON listing_reports FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Reports viewable by admins via service role" ON listing_reports FOR SELECT USING (true);
-- CREATE POLICY "Reports updatable via service role" ON listing_reports FOR UPDATE USING (true);
--
-- ============================================================
-- MIGRATION: Enhanced search vector (include category + subcategory names)
-- ============================================================
-- DROP TRIGGER IF EXISTS listings_search_vector_trigger ON listings;
-- CREATE OR REPLACE FUNCTION listings_search_vector_update() RETURNS TRIGGER AS $$
-- DECLARE
--   cat_name TEXT;
--   subcat_name TEXT;
-- BEGIN
--   SELECT name INTO cat_name FROM categories WHERE id = NEW.category_id;
--   SELECT name INTO subcat_name FROM subcategories WHERE id = NEW.subcategory_id;
--   NEW.search_vector :=
--     setweight(to_tsvector('french', unaccent(coalesce(NEW.title, ''))), 'A') ||
--     setweight(to_tsvector('french', unaccent(coalesce(NEW.brand, '') || ' ' || coalesce(NEW.model, ''))), 'A') ||
--     setweight(to_tsvector('french', unaccent(coalesce(cat_name, '') || ' ' || coalesce(subcat_name, ''))), 'B') ||
--     setweight(to_tsvector('french', unaccent(coalesce(NEW.description, ''))), 'B');
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;
-- CREATE TRIGGER listings_search_vector_trigger
--   BEFORE INSERT OR UPDATE OF title, description, brand, model, category_id, subcategory_id ON listings
--   FOR EACH ROW EXECUTE FUNCTION listings_search_vector_update();
--
-- -- Re-index all active listings
-- UPDATE listings SET updated_at = NOW() WHERE status = 'active';

-- ============================================================
-- MIGRATION: Google OAuth Support
-- Adds email to profiles and updates trigger for Google metadata
-- ============================================================
--
-- ALTER TABLE profiles ADD COLUMN email TEXT;
-- CREATE INDEX idx_profiles_email ON profiles(email);
-- ALTER TABLE profiles ALTER COLUMN phone SET DEFAULT '';
--
-- CREATE OR REPLACE FUNCTION handle_new_user() RETURNS TRIGGER AS $$
-- BEGIN
--   INSERT INTO profiles (id, phone, full_name, avatar_url, email)
--   VALUES (
--     NEW.id,
--     COALESCE(NEW.phone, ''),
--     COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
--     NEW.raw_user_meta_data->>'avatar_url',
--     NEW.email
--   );
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- MIGRATION: Anonymous phone rate limit index
-- Speeds up the monthly listing count query per phone number
-- ============================================================
-- CREATE INDEX idx_listings_phone_created ON listings(phone, created_at);
