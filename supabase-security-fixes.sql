-- ============================================================
-- HushCobbler / GeemanFootwears – RLS security hardening
--
-- Run this once in the Supabase SQL editor of your project.
-- Fixes: "Authenticated ... WITH CHECK (TRUE)" policies granted
-- write access to ANY logged-in Supabase user (including a
-- self-registered attacker), not just the app's admin. Also
-- restricts public SELECT to active products, and adds a
-- non-negative price constraint.
-- ============================================================

-- ----- PRODUCTS: replace blanket "authenticated" policies -----
DROP POLICY IF EXISTS "Authenticated insert products" ON public.products;
DROP POLICY IF EXISTS "Authenticated update products" ON public.products;
DROP POLICY IF EXISTS "Authenticated delete products" ON public.products;
DROP POLICY IF EXISTS "Public read products" ON public.products;

-- Public (including anon) can only read active products.
CREATE POLICY "Public read active products"
  ON public.products FOR SELECT
  USING (is_active = TRUE);

-- Admins can read everything, including inactive/draft rows.
CREATE POLICY "Admins read all products"
  ON public.products FOR SELECT TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins insert products"
  ON public.products FOR INSERT TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins update products"
  ON public.products FOR UPDATE TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins delete products"
  ON public.products FOR DELETE TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Defense-in-depth: reject negative prices at the schema level too.
ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS products_price_non_negative;
ALTER TABLE public.products
  ADD CONSTRAINT products_price_non_negative CHECK (price >= 0);

-- ----- STORAGE: same fix for the product-images bucket -----
DROP POLICY IF EXISTS "Authenticated upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete product images" ON storage.objects;

CREATE POLICY "Admins upload product images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'product-images'
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admins delete product images"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'product-images'
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- ============================================================
-- ALSO DO THIS MANUALLY (not possible from SQL):
-- Authentication → Providers/Settings in the Supabase dashboard:
--   - Disable public sign-ups (or at least confirm this app's
--     anon key isn't meant to allow self-registration).
--   - Disable anonymous sign-ins if not intentionally used.
-- Without this, any visitor could still create their own
-- Supabase auth user — these RLS policies now correctly reject
-- that user's writes, but disabling signup closes the door
-- entirely at the source.
-- ============================================================
