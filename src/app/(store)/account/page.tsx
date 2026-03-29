import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Package, User, MapPin } from "lucide-react";

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { count: orderCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("customer_id", user.id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="rounded-xl border border-surface-700 bg-surface-800 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/20">
              <User className="h-5 w-5 text-brand-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Profile</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-surface-300">Name</p>
              <p className="text-sm text-white">{profile?.name || "Not set"}</p>
            </div>
            <div>
              <p className="text-xs text-surface-300">Email</p>
              <p className="text-sm text-white">{user.email}</p>
            </div>
            <div>
              <p className="text-xs text-surface-300">Phone</p>
              <p className="text-sm text-white">{profile?.phone || "Not set"}</p>
            </div>
          </div>
        </div>

        {/* Orders Card */}
        <Link
          href="/account/orders"
          className="rounded-xl border border-surface-700 bg-surface-800 p-6 hover:border-brand-500/50 transition-colors"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/20">
              <Package className="h-5 w-5 text-brand-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">My Orders</h2>
          </div>
          <p className="text-3xl font-bold text-white">{orderCount || 0}</p>
          <p className="text-sm text-surface-300 mt-1">Total orders placed</p>
        </Link>

        {/* Address Card */}
        <div className="rounded-xl border border-surface-700 bg-surface-800 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/20">
              <MapPin className="h-5 w-5 text-brand-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Address</h2>
          </div>
          <p className="text-sm text-surface-300">
            {profile?.address || "No address saved yet"}
          </p>
        </div>
      </div>
    </div>
  );
}
