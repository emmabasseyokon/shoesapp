import type { SupabaseClient } from "@supabase/supabase-js";

export async function requireAdmin(supabase: SupabaseClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  return user;
}
