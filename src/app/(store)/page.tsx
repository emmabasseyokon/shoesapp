import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ArrowRight, Truck, Shield, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  const { data: featuredProducts } = await supabase
    .from("products")
    .select("*, category:categories(*), variants:product_variants(*)")
    .eq("is_featured", true)
    .eq("is_active", true)
    .limit(8);

  const { data: latestProducts } = await supabase
    .from("products")
    .select("*, category:categories(*), variants:product_variants(*)")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(8);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-surface-900 via-surface-900/95 to-surface-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-500/20 via-transparent to-transparent" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-tight">
            Step Into
            <span className="block text-brand-400">Premium Style</span>
          </h1>
          <p className="mt-6 text-lg text-surface-300 max-w-2xl mx-auto">
            Discover our curated collection of premium footwear. From casual
            sneakers to elegant formal shoes, find your perfect pair.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/products">
              <Button size="lg" className="gap-2">
                Shop Now <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-white mb-8">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group relative flex h-32 items-center justify-center rounded-xl border border-surface-700 bg-surface-800 overflow-hidden hover:border-brand-500/50 transition-all"
              >
                {cat.image_url && (
                  <Image
                    src={cat.image_url}
                    alt={cat.name}
                    fill
                    className="object-cover opacity-30 group-hover:opacity-50 transition-opacity"
                  />
                )}
                <span className="relative z-10 text-sm font-semibold text-white">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Featured</h2>
            <Link
              href="/products"
              className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1"
            >
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <ProductGrid products={featuredProducts} />
        </section>
      )}

      {/* Latest Products */}
      {latestProducts && latestProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">New Arrivals</h2>
            <Link
              href="/products"
              className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1"
            >
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <ProductGrid products={latestProducts} />
        </section>
      )}

      {/* Value Props */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6 rounded-xl border border-surface-700 bg-surface-800">
            <Truck className="h-8 w-8 text-brand-400 mb-4" />
            <h3 className="text-white font-semibold mb-2">Fast Delivery</h3>
            <p className="text-sm text-surface-300">
              Quick and reliable delivery to your doorstep
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-xl border border-surface-700 bg-surface-800">
            <Shield className="h-8 w-8 text-brand-400 mb-4" />
            <h3 className="text-white font-semibold mb-2">Quality Guarantee</h3>
            <p className="text-sm text-surface-300">
              100% authentic products with quality assurance
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-xl border border-surface-700 bg-surface-800">
            <RefreshCw className="h-8 w-8 text-brand-400 mb-4" />
            <h3 className="text-white font-semibold mb-2">Easy Returns</h3>
            <p className="text-sm text-surface-300">
              Hassle-free returns within 7 days
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
