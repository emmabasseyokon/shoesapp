import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-900">
      <AdminSidebar />
      <div className="lg:ml-64">
        <div className="p-4 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
