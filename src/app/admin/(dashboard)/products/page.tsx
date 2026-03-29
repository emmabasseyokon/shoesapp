import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { Plus, Pencil } from "lucide-react";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export default async function AdminProductsPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*, category:categories(name), variants:product_variants(*)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Products</h1>
        <Link href="/admin/products/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border border-surface-700 bg-surface-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-300 uppercase">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-300 uppercase">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-300 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-300 uppercase">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-300 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-surface-300 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products?.map((product) => {
                const totalStock =
                  product.variants?.reduce(
                    (sum: number, v: { stock_quantity: number }) =>
                      sum + v.stock_quantity,
                    0
                  ) || 0;

                return (
                  <tr
                    key={product.id}
                    className="border-b border-surface-700/50 hover:bg-surface-700/30"
                  >
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 rounded-lg overflow-hidden bg-surface-700">
                          {product.images?.[0] && (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {product.name}
                          </p>
                          {product.is_featured && (
                            <span className="text-xs text-brand-400">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-sm text-surface-200">
                      {product.category?.name || "—"}
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-white">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-3 text-sm text-surface-200">
                      {totalStock} units
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          product.is_active
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {product.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-2 text-surface-300 hover:text-white transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <DeleteProductButton productId={product.id} />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {(!products || products.length === 0) && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-sm text-surface-300"
                  >
                    No products yet. Add your first product!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
