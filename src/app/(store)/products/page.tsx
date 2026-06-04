import { createClient } from "@/lib/supabase/server";
import { ProductsContent } from "@/components/products/ProductsContent";
import type { Product } from "@/types";

export default async function ProductsPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("products")
    .select("id, name, slug, description, price, stock, images, is_active, created_at, updated_at")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const products: Product[] = (data ?? []).map((p) => ({
    ...p,
    stock: p.stock ?? 0,
    description: p.description ?? "",
    images: p.images ?? [],
  }));

  return (
    <div className="max-w-[1240px] mx-auto px-5 py-7 pb-16 md:px-12 md:py-[38px]">
      <div className="flex items-center justify-between gap-[14px] flex-wrap mb-6">
        <h1 className="text-[clamp(28px,6vw,42px)] font-extrabold tracking-[-0.5px] m-0">
          Our Products
        </h1>
      </div>
      <ProductsContent products={products} />
    </div>
  );
}
