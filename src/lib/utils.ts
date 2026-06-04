import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function naira(n: number | null | undefined): string {
  return "₦" + Number(n || 0).toLocaleString("en-NG");
}

export function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-") +
    "-" +
    Date.now()
  );
}

export function productPhotos(
  product: { images?: string[] | null } | null | undefined
): string[] {
  if (!product) return [];
  if (Array.isArray(product.images)) return product.images.filter(Boolean);
  return [];
}
