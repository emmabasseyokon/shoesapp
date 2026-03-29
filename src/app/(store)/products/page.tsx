import { createClient } from "@/lib/supabase/server";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";

interface Props {
  searchParams: Promise<{
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    size?: string;
    sort?: string;
    q?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase = await createClient();

  // Fetch categories for filter
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  // Build products query
  let query = supabase
    .from("products")
    .select("*, category:categories(*), variants:product_variants(*)")
    .eq("is_active", true);

  // Category filter
  if (params.category) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", params.category)
      .single();
    if (cat) {
      query = query.eq("category_id", cat.id);
    }
  }

  // Price filters
  if (params.minPrice) {
    query = query.gte("price", Number(params.minPrice));
  }
  if (params.maxPrice) {
    query = query.lte("price", Number(params.maxPrice));
  }

  // Search
  if (params.q) {
    query = query.ilike("name", `%${params.q}%`);
  }

  // Sort
  switch (params.sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "name":
      query = query.order("name", { ascending: true });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data: products } = await query;

  // Filter by size (post-query since it's in variants)
  let filteredProducts = products || [];
  if (params.size) {
    filteredProducts = filteredProducts.filter((p) =>
      p.variants?.some(
        (v: { size: string; stock_quantity: number }) =>
          v.size === params.size && v.stock_quantity > 0
      )
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          {params.category
            ? categories?.find((c) => c.slug === params.category)?.name ||
              "Products"
            : params.q
            ? `Search: "${params.q}"`
            : "All Products"}
        </h1>
        <p className="mt-2 text-surface-300">
          {filteredProducts.length} product
          {filteredProducts.length !== 1 ? "s" : ""} found
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <ProductFilters categories={categories || []} />
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <ProductGrid products={filteredProducts} />
        </div>
      </div>
    </div>
  );
}
