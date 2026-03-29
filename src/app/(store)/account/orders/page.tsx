import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";
import { Package } from "lucide-react";

export default async function CustomerOrdersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: orders } = await supabase
    .from("orders")
    .select(
      `
      *,
      items:order_items(
        *,
        product:products(*),
        variant:product_variants(*)
      )
    `
    )
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">My Orders</h1>

      {!orders || orders.length === 0 ? (
        <div className="text-center py-20">
          <Package className="h-16 w-16 text-surface-700 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">No orders yet</h2>
          <p className="text-surface-300">
            Start shopping to see your orders here
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-surface-700 bg-surface-800 overflow-hidden"
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-surface-700 px-6 py-4">
                <div>
                  <p className="text-sm text-surface-300">Order</p>
                  <p className="text-sm font-mono text-white">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-surface-300">Date</p>
                  <p className="text-sm text-white">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-surface-300">Total</p>
                  <p className="text-sm font-semibold text-white">
                    {formatPrice(order.total)}
                  </p>
                </div>
                <Badge variant={order.status}>{order.status}</Badge>
              </div>

              {/* Order Items */}
              <div className="px-6 py-4 space-y-3">
                {order.items?.map((item: { id: string; quantity: number; price: number; product?: { name: string; images: string[] }; variant?: { size: string } }) => (
                  <div key={item.id} className="flex items-center gap-4">
                    {item.product?.images?.[0] && (
                      <img
                        src={item.product.images[0]}
                        alt={item.product?.name || ""}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-sm text-white">
                        {item.product?.name || "Product"}
                      </p>
                      <p className="text-xs text-surface-300">
                        Size: {item.variant?.size} &middot; Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm text-white">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
