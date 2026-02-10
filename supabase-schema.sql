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
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_log ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
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
  ('Mobilier', 'أثاث', 'mobilier', 'chair', 4),
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

-- Storage bucket (run in Supabase Dashboard > Storage)
-- Create a public bucket called "listing-images"
-- Set file size limit to 5MB
-- Allow only image/* mime types

-- Auto-expire cron job (enable pg_cron extension first)
-- SELECT cron.schedule('expire-listings', '0 3 * * *', $$
--   UPDATE listings SET status = 'expired' WHERE status = 'active' AND expires_at < NOW();
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
