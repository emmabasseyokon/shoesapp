import { createClient } from "@/lib/supabase/server";
import { AdminProducts } from "@/components/admin/AdminProducts";
import type { Product } from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("products")
    .select("id, name, slug, description, price, stock, images, is_active, created_at, updated_at")
    .order("created_at", { ascending: false });

  const products: Product[] = (data ?? []).map((p) => ({
    ...p,
    stock: p.stock ?? 0,
    description: p.description ?? "",
    images: p.images ?? [],
  }));

  return (
    <main className="max-w-[1240px] mx-auto px-5 py-7 pb-16 md:px-12 md:py-[38px]">
      <h1 className="text-[clamp(28px,6vw,42px)] font-extrabold tracking-[-0.5px] m-0 mb-[22px]">
        Manage Products
      </h1>
      <AdminProducts products={products} />
    </main>
  );
}
