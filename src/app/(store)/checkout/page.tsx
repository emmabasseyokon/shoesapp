"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCartStore } from "@/store/cart";
import { useToast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { formatPrice } from "@/lib/utils";
import type { User } from "@supabase/supabase-js";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
      return;
    }

    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user);
        setEmail(data.user.email || "");
        // Load profile name
        supabase
          .from("profiles")
          .select("name, address")
          .eq("id", data.user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile) {
              setName(profile.name || "");
              setAddress(profile.address || "");
            }
          });
      }
    });
  }, [items.length, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password: user ? undefined : password,
          address,
          notes,
          items: items.map((item) => ({
            product_id: item.product.id,
            variant_id: item.variant.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to place order");
      }

      // If new account was created, sign them in
      if (data.newAccount) {
        const supabase = createClient();
        await supabase.auth.signInWithPassword({ email, password });
      }

      clearCart();
      router.push(`/checkout/success?order=${data.orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      toast(err instanceof Error ? err.message : "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3 space-y-6">
            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Account Section */}
            {!user && (
              <div className="rounded-xl border border-surface-700 bg-surface-800 p-6 space-y-4">
                <h2 className="text-lg font-semibold text-white">
                  Create Your Account
                </h2>
                <p className="text-sm text-surface-300">
                  An account will be created so you can track your orders
                </p>
                <Input
                  id="name"
                  label="Full Name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  id="email"
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  id="password"
                  label="Password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            )}

            {user && (
              <div className="rounded-xl border border-surface-700 bg-surface-800 p-6 space-y-4">
                <h2 className="text-lg font-semibold text-white">
                  Your Details
                </h2>
                <Input
                  id="name"
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  id="email"
                  label="Email"
                  type="email"
                  value={email}
                  disabled
                />
              </div>
            )}

            {/* Shipping */}
            <div className="rounded-xl border border-surface-700 bg-surface-800 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-white">
                Delivery Address
              </h2>
              <Textarea
                id="address"
                label="Full Address"
                placeholder="Street address, city, state"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
              <Textarea
                id="notes"
                label="Order Notes (optional)"
                placeholder="Any special instructions?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-surface-700 bg-surface-800 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-white mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.variant.id} className="flex gap-3">
                    <div className="h-12 w-12 shrink-0 rounded-lg overflow-hidden bg-surface-700">
                      {item.product.images?.[0] && (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-surface-300">
                        Size: {item.variant.size} x {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-white">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-surface-700 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-surface-300">Subtotal</span>
                  <span className="text-white">
                    {formatPrice(totalPrice())}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-surface-700">
                  <span className="text-white">Total</span>
                  <span className="text-white">
                    {formatPrice(totalPrice())}
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                loading={loading}
                className="w-full mt-6"
              >
                Place Order
              </Button>

              <p className="text-xs text-surface-300 text-center mt-3">
                Pay on delivery. No online payment required.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
