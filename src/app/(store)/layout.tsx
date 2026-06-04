import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const isAdmin = data.user?.app_metadata?.role === "admin";

  return (
    <>
      <Navbar isAdmin={isAdmin} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
