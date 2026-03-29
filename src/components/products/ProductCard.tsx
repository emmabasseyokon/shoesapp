"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const totalStock =
    product.variants?.reduce((sum, v) => sum + v.stock_quantity, 0) ?? 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block rounded-xl border border-surface-700 bg-surface-800 overflow-hidden hover:border-brand-500/50 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-surface-700">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-surface-300">
            No Image
          </div>
        )}
        {totalStock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
              Out of Stock
            </span>
          </div>
        )}
        {product.is_featured && (
          <span className="absolute top-3 left-3 rounded-full bg-brand-500 px-2.5 py-0.5 text-xs font-semibold text-white">
            Featured
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        {product.category && (
          <p className="text-xs text-brand-400 mb-1">{product.category.name}</p>
        )}
        <h3 className="text-sm font-medium text-white group-hover:text-brand-300 transition-colors line-clamp-1">
          {product.name}
        </h3>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-lg font-bold text-white">{formatPrice(product.price)}</p>
          {product.variants && product.variants.length > 0 && (
            <p className="text-xs text-surface-300">
              {product.variants.length} sizes
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
