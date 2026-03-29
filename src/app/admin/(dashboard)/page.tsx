import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
} from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch stats
  const { count: totalProducts } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  const { count: totalOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true });

  const { count: totalCustomers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "customer");

  const { data: deliveredOrders } = await supabase
    .from("orders")
    .select("total")
    .eq("status", "delivered");

  const revenue =
    deliveredOrders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;

  // Recent orders
  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*, customer:profiles(*)")
    .order("created_at", { ascending: false })
    .limit(10);

  const stats = [
    {
      label: "Total Products",
      value: totalProducts || 0,
      icon: Package,
      color: "text-blue-400",
      bg: "bg-blue-500/20",
    },
    {
      label: "Total Orders",
      value: totalOrders || 0,
      icon: ShoppingCart,
      color: "text-green-400",
      bg: "bg-green-500/20",
    },
    {
      label: "Customers",
      value: totalCustomers || 0,
      icon: Users,
      color: "text-purple-400",
      bg: "bg-purple-500/20",
    },
    {
      label: "Revenue",
      value: formatPrice(revenue),
      icon: DollarSign,
      color: "text-brand-400",
      bg: "bg-brand-500/20",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-surface-700 bg-surface-800 p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.bg}`}
                >
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-surface-300 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl border border-surface-700 bg-surface-800">
        <div className="px-6 py-4 border-b border-surface-700">
          <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-300 uppercase">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-300 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-300 uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-300 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-300 uppercase">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders?.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-surface-700/50 hover:bg-surface-700/30"
                >
                  <td className="px-6 py-3 text-sm font-mono text-white">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="px-6 py-3 text-sm text-surface-200">
                    {order.customer?.name || "Unknown"}
                  </td>
                  <td className="px-6 py-3 text-sm text-white font-medium">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-6 py-3">
                    <Badge variant={order.status}>{order.status}</Badge>
                  </td>
                  <td className="px-6 py-3 text-sm text-surface-300">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {(!recentOrders || recentOrders.length === 0) && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-sm text-surface-300"
                  >
                    No orders yet
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
