"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types";

const STATUSES = ["all", "pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const supabase = createClient();
    let query = supabase
      .from("orders")
      .select("*, customer:profiles(*), items:order_items(*, product:products(*), variant:product_variants(*))")
      .order("created_at", { ascending: false });

    if (filter !== "all") {
      query = query.eq("status", filter);
    }

    const { data } = await query;
    setOrders((data as Order[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateStatus = async (orderId: string, newStatus: string) => {
    const response = await fetch(`/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (response.ok) {
      fetchOrders();
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Orders</h1>

      {/* Status Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {STATUSES.map((status) => (
          <button
            key={status}
            onClick={() => {
              setFilter(status);
              setLoading(true);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors whitespace-nowrap cursor-pointer ${
              filter === status
                ? "bg-brand-500 text-white"
                : "bg-surface-800 text-surface-300 hover:text-white hover:bg-surface-700 border border-surface-700"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders */}
      {loading ? (
        <div className="text-center py-12 text-surface-300">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 text-surface-300">
          No {filter !== "all" ? filter : ""} orders found
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-surface-700 bg-surface-800 overflow-hidden"
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-surface-700 px-6 py-4">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-xs text-surface-300">Order</p>
                    <p className="text-sm font-mono text-white">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-surface-300">Customer</p>
                    <p className="text-sm text-white">
                      {order.customer?.name || "Unknown"}
                    </p>
                    <p className="text-xs text-surface-300">
                      {order.customer?.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-surface-300">Total</p>
                    <p className="text-sm font-semibold text-white">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-surface-300">Date</p>
                    <p className="text-sm text-white">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={order.status}>{order.status}</Badge>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="rounded-lg border border-surface-700 bg-surface-900 px-3 py-1.5 text-xs text-surface-200 focus:outline-none focus:border-brand-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Items */}
              <div className="px-6 py-4 space-y-2">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-sm">
                    {item.product?.images?.[0] && (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product?.name || ""}
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded object-cover"
                      />
                    )}
                    <span className="text-white">
                      {item.product?.name || "Product"}
                    </span>
                    <span className="text-surface-300">
                      Size: {item.variant?.size}
                    </span>
                    <span className="text-surface-300">x{item.quantity}</span>
                    <span className="ml-auto text-white">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
                {order.shipping_address && (
                  <div className="mt-3 pt-3 border-t border-surface-700">
                    <p className="text-xs text-surface-300">Delivery Address:</p>
                    <p className="text-sm text-surface-200">
                      {order.shipping_address}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
