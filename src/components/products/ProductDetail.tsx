"use client";

import { useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/store/cart";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, Minus, Plus, Check } from "lucide-react";
import type { Product, ProductVariant } from "@/types";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addItem(product, selectedVariant, quantity);
    toast(`${product.name} added to cart!`);
  };

  const maxQuantity = selectedVariant?.stock_quantity || 1;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
      {/* Images */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="aspect-square overflow-hidden rounded-xl bg-surface-800 border border-surface-700">
          {product.images?.[selectedImage] ? (
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-surface-300">
              No Image
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {product.images && product.images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`h-16 w-16 shrink-0 rounded-lg overflow-hidden border-2 transition-colors cursor-pointer ${
                  selectedImage === i
                    ? "border-brand-500"
                    : "border-surface-700 hover:border-surface-300"
                }`}
              >
                <Image
                  src={img}
                  alt={`${product.name} ${i + 1}`}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        {product.category && (
          <span className="text-sm text-brand-400">{product.category.name}</span>
        )}

        <h1 className="text-3xl font-bold text-white">{product.name}</h1>

        <p className="text-3xl font-bold text-white">
          {formatPrice(product.price)}
        </p>

        {product.description && (
          <p className="text-surface-300 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Size Selector */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">
            Select Size
          </h3>
          <div className="flex flex-wrap gap-2">
            {product.variants
              ?.sort((a, b) => Number(a.size) - Number(b.size))
              .map((variant) => {
                const outOfStock = variant.stock_quantity === 0;
                const isSelected = selectedVariant?.id === variant.id;

                return (
                  <button
                    key={variant.id}
                    onClick={() => {
                      if (!outOfStock) {
                        setSelectedVariant(variant);
                        setQuantity(1);
                      }
                    }}
                    disabled={outOfStock}
                    className={`relative h-11 min-w-[44px] px-3 flex items-center justify-center rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      isSelected
                        ? "bg-brand-500 text-white ring-2 ring-brand-400"
                        : outOfStock
                        ? "bg-surface-800 text-surface-300/40 cursor-not-allowed line-through"
                        : "bg-surface-700 text-surface-200 hover:bg-surface-800 hover:text-white"
                    }`}
                  >
                    {variant.size}
                    {isSelected && (
                      <Check className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-brand-500 text-white" />
                    )}
                  </button>
                );
              })}
          </div>
          {selectedVariant && (
            <p className="mt-2 text-xs text-surface-300">
              {selectedVariant.stock_quantity} in stock
            </p>
          )}
        </div>

        {/* Quantity */}
        {selectedVariant && (
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Quantity</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-700 text-white hover:bg-surface-800 cursor-pointer"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center text-lg font-semibold text-white">
                {quantity}
              </span>
              <button
                onClick={() =>
                  setQuantity(Math.min(maxQuantity, quantity + 1))
                }
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-700 text-white hover:bg-surface-800 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Add to Cart */}
        <Button
          size="lg"
          className="w-full gap-2"
          onClick={handleAddToCart}
          disabled={!selectedVariant}
        >
          <ShoppingBag className="h-5 w-5" />
          {selectedVariant ? "Add to Cart" : "Select a Size"}
        </Button>
      </div>
    </div>
  );
}
