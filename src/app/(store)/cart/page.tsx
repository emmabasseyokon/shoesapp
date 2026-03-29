"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <ShoppingBag className="h-20 w-20 text-surface-700 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-white mb-3">
          Your cart is empty
        </h1>
        <p className="text-surface-300 mb-8">
          Browse our collection and add items to your cart
        </p>
        <Link href="/products">
          <Button size="lg" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.variant.id}
              className="flex gap-4 rounded-xl border border-surface-700 bg-surface-800 p-4"
            >
              {/* Image */}
              <div className="h-24 w-24 shrink-0 rounded-lg overflow-hidden bg-surface-700">
                {item.product.images?.[0] ? (
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-surface-300">
                    No img
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-white truncate">
                  {item.product.name}
                </h3>
                <p className="text-xs text-surface-300 mt-1">
                  Size: {item.variant.size}
                </p>
                <p className="text-sm font-semibold text-white mt-2">
                  {formatPrice(item.product.price)}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() =>
                      updateQuantity(item.variant.id, item.quantity - 1)
                    }
                    className="flex h-7 w-7 items-center justify-center rounded bg-surface-700 text-white hover:bg-surface-900 cursor-pointer"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-8 text-center text-sm text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.variant.id,
                        Math.min(
                          item.variant.stock_quantity,
                          item.quantity + 1
                        )
                      )
                    }
                    className="flex h-7 w-7 items-center justify-center rounded bg-surface-700 text-white hover:bg-surface-900 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => removeItem(item.variant.id)}
                    className="ml-auto p-1 text-red-400 hover:text-red-300 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="rounded-xl border border-surface-700 bg-surface-800 p-6 h-fit sticky top-24">
          <h2 className="text-lg font-semibold text-white mb-4">
            Order Summary
          </h2>
          <div className="space-y-3 border-b border-surface-700 pb-4 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-surface-300">
                Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)
              </span>
              <span className="text-white">{formatPrice(totalPrice())}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-surface-300">Delivery</span>
              <span className="text-green-400">Calculated at checkout</span>
            </div>
          </div>
          <div className="flex justify-between text-lg font-bold mb-6">
            <span className="text-white">Total</span>
            <span className="text-white">{formatPrice(totalPrice())}</span>
          </div>
          <Link href="/checkout">
            <Button size="lg" className="w-full">
              Proceed to Checkout
            </Button>
          </Link>
          <Link
            href="/products"
            className="block text-center text-sm text-brand-400 hover:text-brand-300 mt-4"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
