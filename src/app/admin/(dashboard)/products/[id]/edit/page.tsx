"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { slugify } from "@/lib/utils";
import { Plus, X } from "lucide-react";
import type { Category, Product } from "@/types";

const QUICK_SIZES = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"];

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [variants, setVariants] = useState<
    { id?: string; size: string; stock: string }[]
  >([]);

  useEffect(() => {
    const supabase = createClient();

    // Load categories
    supabase
      .from("categories")
      .select("*")
      .order("name")
      .then(({ data }) => {
        if (data) setCategories(data);
      });

    // Load product
    supabase
      .from("products")
      .select("*, variants:product_variants(*)")
      .eq("id", id)
      .single()
      .then(({ data }: { data: Product | null }) => {
        if (data) {
          setName(data.name);
          setDescription(data.description || "");
          setPrice(String(data.price));
          setCategoryId(data.category_id || "");
          setImages(data.images || []);
          setIsFeatured(data.is_featured);
          setIsActive(data.is_active);
          setVariants(
            data.variants?.map((v) => ({
              id: v.id,
              size: v.size,
              stock: String(v.stock_quantity),
            })) || []
          );
        }
        setFetching(false);
      });
  }, [id]);

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
    setVariants([...variants, { size, stock: "10" }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const slug = slugify(name);

    // Update product
    const { error } = await supabase
      .from("products")
      .update({
        name,
        slug,
        description: description || null,
        price: Number(price),
        category_id: categoryId || null,
        images,
        is_featured: isFeatured,
        is_active: isActive,
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    // Delete existing variants and re-insert
    await supabase.from("product_variants").delete().eq("product_id", id);

    const validVariants = variants.filter((v) => v.size && v.stock);
    if (validVariants.length > 0) {
      await supabase.from("product_variants").insert(
        validVariants.map((v) => ({
          product_id: id,
          size: v.size,
          stock_quantity: Number(v.stock),
        }))
      );
    }

    router.push("/admin/products");
    router.refresh();
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-surface-300">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-white mb-6">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="rounded-xl border border-surface-700 bg-surface-800 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Basic Info</h2>

          <Input
            id="name"
            label="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Textarea
            id="description"
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="price"
              label="Price (NGN)"
              type="number"
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

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-surface-700 bg-surface-800 text-brand-500"
              />
              <span className="text-sm text-surface-200">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-surface-700 bg-surface-800 text-brand-500"
              />
              <span className="text-sm text-surface-200">Active</span>
            </label>
          </div>
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
            Save Changes
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
