import { createClient } from "@/lib/supabase/server";
import { ProductsContent } from "@/components/products/ProductsContent";
import type { Product } from "@/types";

export default async function ProductsPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("products")
    .select("id, name, slug, price, images, is_active, created_at, updated_at")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const products: Product[] = (data ?? []).map((p) => ({
    ...p,
    images: p.images ?? [],
  }));

  return (
    <div className="max-w-[1240px] mx-auto px-5 py-7 pb-16 md:px-12 md:py-[38px]">
      <ProductsContent products={products} />
    </div>
  );
}
