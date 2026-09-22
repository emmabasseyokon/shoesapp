"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

interface ProductData {
  name: string;
  price: number;
  images: string[];
  is_featured: boolean;
}

function sanitize(data: ProductData) {
  const name = data.name.trim();
  if (!name) throw new Error("Product name is required.");

  const price = Number(data.price);
  if (!Number.isFinite(price) || price < 0) {
    throw new Error("Price must be a non-negative number.");
  }

  return { name, price: Math.round(price), images: data.images.slice(0, 3) };
}

export async function createProduct(data: ProductData) {
  const supabase = await createClient();
  await requireAdmin(supabase);
  const clean = sanitize(data);

  const { error } = await supabase.from("products").insert({
    name: clean.name,
    slug: slugify(clean.name),
    price: clean.price,
    images: clean.images,
    is_active: true,
    is_featured: data.is_featured,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin");
}

export async function updateProduct(id: string, data: ProductData) {
  const supabase = await createClient();
  await requireAdmin(supabase);
  const clean = sanitize(data);

  const { error } = await supabase
    .from("products")
    .update({
      name: clean.name,
      price: clean.price,
      images: clean.images,
      is_featured: data.is_featured,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin");
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  await requireAdmin(supabase);

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin");
}
