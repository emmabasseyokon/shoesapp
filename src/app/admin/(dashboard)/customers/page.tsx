import { createClient } from "@/lib/supabase/server";

export default async function AdminCustomersPage() {
  const supabase = await createClient();

  const { data: customers } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "customer")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Customers</h1>

      <div className="rounded-xl border border-surface-700 bg-surface-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-300 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-300 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-300 uppercase">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-300 uppercase">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-300 uppercase">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody>
              {customers?.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-surface-700/50 hover:bg-surface-700/30"
                >
                  <td className="px-6 py-3 text-sm font-medium text-white">
                    {customer.name}
                  </td>
                  <td className="px-6 py-3 text-sm text-surface-200">
                    {customer.email || "—"}
                  </td>
                  <td className="px-6 py-3 text-sm text-surface-200">
                    {customer.phone || "—"}
                  </td>
                  <td className="px-6 py-3 text-sm text-surface-200 max-w-xs truncate">
                    {customer.address || "—"}
                  </td>
                  <td className="px-6 py-3 text-sm text-surface-300">
                    {new Date(customer.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {(!customers || customers.length === 0) && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-sm text-surface-300"
                  >
                    No customers yet
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
