"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

interface ProductData {
  name: string;
  price: number;
  images: string[];
}

export async function createProduct(data: ProductData) {
  const supabase = await createClient();

  const { error } = await supabase.from("products").insert({
    name: data.name,
    slug: slugify(data.name),
    price: data.price,
    images: data.images,
    is_active: true,
    is_featured: false,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin");
}

export async function updateProduct(id: string, data: ProductData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .update({
      name: data.name,
      price: data.price,
      images: data.images,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin");
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin");
}
