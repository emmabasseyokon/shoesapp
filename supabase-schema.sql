-- ============================================================
-- HushCobbler – Supabase schema
-- Run this once in the SQL editor of a fresh Supabase project.
-- ============================================================

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  price       INTEGER NOT NULL DEFAULT 0,   -- whole Naira, no decimals
  stock       INTEGER NOT NULL DEFAULT 0,
  images      TEXT[] DEFAULT '{}',          -- up to 3 public Storage URLs
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_is_active   ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_created_at  ON public.products(created_at DESC);

-- auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Anyone can read active products (public store)
CREATE POLICY "Public read products"
  ON public.products FOR SELECT USING (TRUE);

-- Only authenticated users (admin) can write
CREATE POLICY "Authenticated insert products"
  ON public.products FOR INSERT TO authenticated WITH CHECK (TRUE);

CREATE POLICY "Authenticated update products"
  ON public.products FOR UPDATE TO authenticated USING (TRUE);

CREATE POLICY "Authenticated delete products"
  ON public.products FOR DELETE TO authenticated USING (TRUE);

-- ============================================================
-- STORAGE BUCKET  (product photos)
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Public can view images (needed to show them in the store)
CREATE POLICY "Public read product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Authenticated users (admin) can upload
CREATE POLICY "Authenticated upload product images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images');

-- Authenticated users (admin) can delete
CREATE POLICY "Authenticated delete product images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'product-images');

-- ============================================================
-- ADMIN USER SETUP
--
-- IMPORTANT: do this AFTER creating the user in Supabase Auth
-- (Authentication → Users → Add user).
-- Replace the email below with your admin email, then run
-- only these two statements.
-- ============================================================
UPDATE auth.users
  SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
  WHERE email = 'emmabasseyokon@gmail.com';

-- ============================================================
-- SEED PRODUCTS  (optional – uncomment to load sample data)
-- ============================================================
-- INSERT INTO public.products (name, slug, description, price, stock) VALUES
--   ('Classic Leather Shoes',  'classic-leather-shoes',  'Great shoes',                     12000, 20),
--   ('Casual Sneakers',        'casual-sneakers',         'Everyday comfort, all-day wear',  18000, 12),
--   ('Handmade Loafers',       'handmade-loafers',        'Soft sole, hand-stitched leather',35000,  8),
--   ('Elegant Heels',          'elegant-heels',           'Crossed-strap statement pair',    28000,  6),
--   ('Novela',                 'novela',                  'Nice leather foot rides',         50000,  4),
--   ('Half Shoe',              'half-shoe',               'Plush slip-on with logo strap',   20000,  4),
--   ('Palm Slides',            'palm-slides',             'Lightweight woven palm slides',   15000, 10),
--   ('Cross Strap Sandals',    'cross-strap-sandals',     'Suede cross-strap sandals',       22000,  7);
