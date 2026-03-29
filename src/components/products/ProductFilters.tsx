"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Search, SlidersHorizontal } from "lucide-react";
import type { Category } from "@/types";

interface ProductFiltersProps {
  categories: Category[];
}

const SIZES = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"];

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const currentCategory = searchParams.get("category") || "";
  const currentSize = searchParams.get("size") || "";
  const currentSort = searchParams.get("sort") || "";
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/products?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearAll = () => {
    router.push("/products");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams("q", search);
  };

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");
    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div>
      {/* Mobile Toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden flex items-center gap-2 text-sm text-surface-200 mb-4 cursor-pointer"
      >
        <SlidersHorizontal className="h-4 w-4" /> Filters
      </button>

      <div className={`space-y-6 ${open ? "block" : "hidden lg:block"}`}>
        {/* Search */}
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-300 cursor-pointer">
              <Search className="h-4 w-4" />
            </button>
          </div>
        </form>

        {/* Sort */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Sort By</h3>
          <div className="space-y-2">
            {[
              { value: "", label: "Newest" },
              { value: "price_asc", label: "Price: Low to High" },
              { value: "price_desc", label: "Price: High to Low" },
              { value: "name", label: "Name: A-Z" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => updateParams("sort", opt.value)}
                className={`block w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  currentSort === opt.value
                    ? "bg-brand-500/20 text-brand-400"
                    : "text-surface-300 hover:text-white hover:bg-surface-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Category</h3>
          <div className="space-y-2">
            <button
              onClick={() => updateParams("category", "")}
              className={`block w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                !currentCategory
                  ? "bg-brand-500/20 text-brand-400"
                  : "text-surface-300 hover:text-white hover:bg-surface-700"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => updateParams("category", cat.slug)}
                className={`block w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  currentCategory === cat.slug
                    ? "bg-brand-500/20 text-brand-400"
                    : "text-surface-300 hover:text-white hover:bg-surface-700"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Price Range</h3>
          <div className="flex gap-2 items-end">
            <Input
              placeholder="Min"
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <span className="text-surface-300 pb-2">-</span>
            <Input
              placeholder="Max"
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 w-full"
            onClick={applyPriceFilter}
          >
            Apply
          </Button>
        </div>

        {/* Sizes */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Size</h3>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((size) => (
              <button
                key={size}
                onClick={() =>
                  updateParams("size", currentSize === size ? "" : size)
                }
                className={`h-9 w-9 flex items-center justify-center rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  currentSize === size
                    ? "bg-brand-500 text-white"
                    : "bg-surface-700 text-surface-200 hover:bg-surface-800"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Clear */}
        <Button variant="ghost" size="sm" className="w-full" onClick={clearAll}>
          Clear All Filters
        </Button>
      </div>
    </div>
  );
}
