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
  price       INTEGER NOT NULL DEFAULT 0,   -- whole Naira, no decimals
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
