"use client";

import { useState } from "react";
import Image from "next/image";

interface FormState {
  name: string;
  price: string;
  stock: string;
  images: string[];
}

interface Props {
  initial?: {
    id?: string;
    name?: string;
    price?: number;
    stock?: number;
    description?: string;
    images?: string[];
  };
  onClose: () => void;
  onSave: (data: {
    name: string;
    price: number;
    stock: number;
    description: string;
    images: string[];
  }) => Promise<void>;
}

async function compressImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const MAX = 1000;
        let { width, height } = img;
        if (Math.max(width, height) > MAX) {
          const scale = MAX / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
        try {
          resolve(canvas.toDataURL("image/jpeg", 0.82));
        } catch {
          resolve(reader.result as string);
        }
      };
      img.onerror = () => resolve(reader.result as string);
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

async function uploadImage(dataUrl: string): Promise<string> {
  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dataUrl }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Upload failed");
  return json.url as string;
}

export function ProductForm({ initial = {}, onClose, onSave }: Props) {
  const isNew = !initial.id;
  const [f, setF] = useState<FormState>({
    name: initial.name ?? "",
    price: initial.price != null ? String(initial.price) : "",
    stock: initial.stock != null ? String(initial.stock) : "",
    images: initial.images?.filter(Boolean) ?? [],
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nameError, setNameError] = useState("");

  const set = (k: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setF((s) => ({ ...s, [k]: e.target.value }));

  const onFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    e.target.value = "";
    setUploading(true);
    try {
      const compressed = await Promise.all(files.map(compressImage));
      const urls = await Promise.all(compressed.map(uploadImage));
      setF((s) => ({ ...s, images: [...s.images, ...urls].slice(0, 3) }));
    } catch (err) {
      alert("Upload failed: " + (err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idx: number) =>
    setF((s) => ({ ...s, images: s.images.filter((_, i) => i !== idx) }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name.trim()) {
      setNameError("Product name is required.");
      return;
    }
    setNameError("");
    setSaving(true);
    try {
      await onSave({
        name: f.name.trim(),
        price: Number(f.price) || 0,
        stock: Number(f.stock) || 0,
        description: "",
        images: f.images,
      });
      onClose();
    } catch (err) {
      alert("Save failed: " + (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form
        className="bg-white rounded-[12px] w-full max-w-[520px] max-h-[92vh] overflow-auto shadow-[0_30px_80px_rgba(0,0,0,.35)]"
        onSubmit={submit}
      >
        {/* Head */}
        <div className="flex items-center justify-between gap-3 px-5 py-[18px] border-b border-line">
          <h2 className="m-0 text-[clamp(20px,5vw,26px)] font-bold">
            {isNew ? "Add Product" : "Edit Product"}
          </h2>
          <button
            type="button"
            className="bg-none border-none text-[30px] leading-none cursor-pointer text-[#555] w-10 h-10"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-[22px] flex flex-col gap-4 text-left">
          {/* Photo slots */}
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-3 gap-3">
              {f.images.map((src, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-[10px] overflow-hidden bg-ph border border-line"
                >
                  <Image
                    src={src}
                    alt={`Photo ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                  {idx === 0 && (
                    <span className="absolute top-[6px] left-[6px] px-2 py-[2px] rounded-full bg-accent text-white text-[11px] font-bold uppercase tracking-[0.03em]">
                      Main
                    </span>
                  )}
                  <button
                    type="button"
                    className="absolute top-[6px] right-[6px] w-[26px] h-[26px] rounded-full border-none bg-black/60 text-white text-[18px] leading-none grid place-items-center cursor-pointer hover:bg-black/80 pb-[2px]"
                    onClick={() => removeImage(idx)}
                    aria-label="Remove photo"
                  >
                    ×
                  </button>
                </div>
              ))}
              {f.images.length < 3 && (
                <label className="relative aspect-square rounded-[10px] overflow-hidden bg-[#fbfbfc] border-[1.5px] border-dashed border-[#b9c0c7] flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors hover:border-accent hover:text-accent text-muted">
                  {uploading ? (
                    <span className="text-[13px] font-semibold">Uploading…</span>
                  ) : (
                    <>
                      <span className="text-[30px] leading-none font-light">+</span>
                      <span className="text-[13px] font-semibold">Add photo</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onFiles}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              )}
            </div>
            <span className="text-muted text-[14px]">
              Up to 3 photos. The first is the main image shown across the store.
            </span>
          </div>

          {/* Name */}
          <label className="flex flex-col gap-[6px] text-[15px] font-semibold">
            <span>Name</span>
            <input
              className={`font-[inherit] text-[16px] font-normal px-[13px] py-[11px] border rounded-[7px] w-full outline-none transition-shadow focus:border-accent focus:shadow-[0_0_0_3px_color-mix(in_srgb,#198754_22%,transparent)] ${nameError ? "border-danger" : "border-[#ced4da]"}`}
              value={f.name}
              onChange={(e) => {
                set("name")(e);
                if (e.target.value.trim()) setNameError("");
              }}
              placeholder="Product name"
            />
            {nameError && (
              <span className="text-[13px] text-danger font-normal">{nameError}</span>
            )}
          </label>

          {/* Price + Stock */}
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-[6px] text-[15px] font-semibold">
              <span>Price (₦)</span>
              <input
                type="number"
                min="0"
                className="font-[inherit] text-[16px] font-normal px-[13px] py-[11px] border border-[#ced4da] rounded-[7px] w-full outline-none focus:border-accent focus:shadow-[0_0_0_3px_color-mix(in_srgb,#198754_22%,transparent)]"
                value={f.price}
                onChange={set("price")}
                placeholder="0"
              />
            </label>
            <label className="flex flex-col gap-[6px] text-[15px] font-semibold">
              <span>Stock</span>
              <input
                type="number"
                min="0"
                className="font-[inherit] text-[16px] font-normal px-[13px] py-[11px] border border-[#ced4da] rounded-[7px] w-full outline-none focus:border-accent focus:shadow-[0_0_0_3px_color-mix(in_srgb,#198754_22%,transparent)]"
                value={f.stock}
                onChange={set("stock")}
                placeholder="0"
              />
            </label>
          </div>

        </div>

        {/* Foot */}
        <div className="flex justify-end gap-3 px-5 pb-[22px] pt-4 flex-wrap">
          <button
            type="button"
            className="flex-auto min-w-0 max-w-[140px] border border-transparent rounded-[7px] px-[22px] py-[11px] text-[16px] font-semibold cursor-pointer transition-colors bg-[#6c757d] text-white hover:bg-[#5c636a]"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || uploading}
            className="flex-auto min-w-0 max-w-[180px] border border-transparent rounded-[7px] px-[22px] py-[11px] text-[16px] font-semibold cursor-pointer transition-colors bg-accent text-white hover:bg-accent-dark disabled:opacity-60"
          >
            {saving ? "Saving…" : isNew ? "Add Product" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
