import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

// Service-role client — bypasses RLS, stays server-side only
const adminStorage = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  // Verify the caller is an authenticated admin
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.app_metadata?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { dataUrl } = await req.json() as { dataUrl: string };
  if (!dataUrl?.startsWith("data:")) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  // Convert base64 data URL → Buffer
  const [header, base64] = dataUrl.split(",");
  const declaredMime = header.match(/:(.*?);/)?.[1] ?? "";

  const ALLOWED_MIME_TO_EXT: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };
  const ext = ALLOWED_MIME_TO_EXT[declaredMime];
  if (!ext) {
    return NextResponse.json({ error: "Unsupported image type" }, { status: 400 });
  }

  const buffer = Buffer.from(base64, "base64");

  const MAX_BYTES = 5 * 1024 * 1024;
  if (buffer.length > MAX_BYTES) {
    return NextResponse.json({ error: "Image too large" }, { status: 400 });
  }

  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await adminStorage.storage
    .from("product-images")
    .upload(fileName, buffer, { contentType: declaredMime });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = adminStorage.storage
    .from("product-images")
    .getPublicUrl(fileName);

  return NextResponse.json({ url: data.publicUrl });
}
