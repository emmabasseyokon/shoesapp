import { createClient } from "@/lib/supabase/server";
import { AdminProducts } from "@/components/admin/AdminProducts";
import type { Product } from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("products")
    .select("id, name, slug, price, images, is_active, created_at, updated_at")
    .order("created_at", { ascending: false });

  const products: Product[] = (data ?? []).map((p) => ({
    ...p,
    images: p.images ?? [],
  }));

  return (
    <main className="max-w-[1240px] mx-auto px-5 py-7 pb-16 md:px-12 md:py-[38px]">
      <AdminProducts products={products} />
    </main>
  );
}
