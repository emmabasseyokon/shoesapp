"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { slugify } from "@/lib/utils";
import { Plus, X } from "lucide-react";
import type { Category } from "@/types";

const QUICK_SIZES = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"];

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [variants, setVariants] = useState<{ size: string; stock: string }[]>([
    { size: "", stock: "" },
  ]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("categories")
      .select("*")
      .order("name")
      .then(({ data }) => {
        if (data) setCategories(data);
      });
  }, []);

  const addVariant = () => {
    setVariants([...variants, { size: "", stock: "" }]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (
    index: number,
    field: "size" | "stock",
    value: string
  ) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const addQuickSize = (size: string) => {
    if (variants.some((v) => v.size === size)) return;
    setVariants([...variants.filter((v) => v.size !== ""), { size, stock: "10" }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const slug = slugify(name);

    // Insert product
    const { data: product, error } = await supabase
      .from("products")
      .insert({
        name,
        slug,
        description: description || null,
        price: Number(price),
        category_id: categoryId || null,
        images,
        is_featured: isFeatured,
        is_active: true,
      })
      .select("id")
      .single();

    if (error || !product) {
      alert(error?.message || "Failed to create product");
      setLoading(false);
      return;
    }

    // Insert variants
    const validVariants = variants.filter((v) => v.size && v.stock);
    if (validVariants.length > 0) {
      await supabase.from("product_variants").insert(
        validVariants.map((v) => ({
          product_id: product.id,
          size: v.size,
          stock_quantity: Number(v.stock),
        }))
      );
    }

    router.push("/admin/products");
    router.refresh();
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-white mb-6">Add New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="rounded-xl border border-surface-700 bg-surface-800 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Basic Info</h2>

          <Input
            id="name"
            label="Product Name"
            placeholder="Nike Air Max 90"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Textarea
            id="description"
            label="Description"
            placeholder="Describe the product..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="price"
              label="Price (NGN)"
              type="number"
              placeholder="25000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="0"
              step="0.01"
            />

            <div className="space-y-1">
              <label className="block text-sm font-medium text-surface-200">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-lg border border-surface-700 bg-surface-800 px-4 py-2.5 text-sm text-foreground focus:border-brand-500 focus:outline-none"
              >
                <option value="">No category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-surface-700 bg-surface-800 text-brand-500"
            />
            <span className="text-sm text-surface-200">Featured product</span>
          </label>
        </div>

        {/* Images */}
        <div className="rounded-xl border border-surface-700 bg-surface-800 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Images</h2>
          <ImageUploader images={images} onChange={setImages} />
        </div>

        {/* Variants */}
        <div className="rounded-xl border border-surface-700 bg-surface-800 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">
            Sizes &amp; Stock
          </h2>

          {/* Quick Add Sizes */}
          <div>
            <p className="text-xs text-surface-300 mb-2">Quick add sizes:</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => addQuickSize(size)}
                  className={`h-8 px-3 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    variants.some((v) => v.size === size)
                      ? "bg-brand-500 text-white"
                      : "bg-surface-700 text-surface-200 hover:bg-surface-800"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Variant Rows */}
          <div className="space-y-3">
            {variants.map((variant, i) => (
              <div key={i} className="flex gap-3 items-end">
                <Input
                  label={i === 0 ? "Size" : undefined}
                  placeholder="42"
                  value={variant.size}
                  onChange={(e) => updateVariant(i, "size", e.target.value)}
                />
                <Input
                  label={i === 0 ? "Stock" : undefined}
                  type="number"
                  placeholder="10"
                  value={variant.stock}
                  onChange={(e) => updateVariant(i, "stock", e.target.value)}
                  min="0"
                />
                <button
                  type="button"
                  onClick={() => removeVariant(i)}
                  className="p-2 text-red-400 hover:text-red-300 shrink-0 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addVariant}
            className="gap-1"
          >
            <Plus className="h-3 w-3" /> Add Size
          </Button>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <Button type="submit" loading={loading} size="lg">
            Create Product
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
