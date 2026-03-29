"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Upload, X, Loader2 } from "lucide-react";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      setUploading(true);

      const supabase = createClient();
      const newImages: string[] = [];

      for (const file of Array.from(files)) {
        if (file.size > 5 * 1024 * 1024) {
          alert(`File ${file.name} is too large. Max 5MB.`);
          continue;
        }

        const ext = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error } = await supabase.storage
          .from("product-images")
          .upload(fileName, file);

        if (!error) {
          const {
            data: { publicUrl },
          } = supabase.storage.from("product-images").getPublicUrl(fileName);
          newImages.push(publicUrl);
        }
      }

      onChange([...images, ...newImages]);
      setUploading(false);
    },
    [images, onChange]
  );

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      handleUpload(e.dataTransfer.files);
    },
    [handleUpload]
  );

  return (
    <div className="space-y-3">
      {/* Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-surface-700 rounded-xl p-8 text-center hover:border-brand-500/50 transition-colors cursor-pointer"
        onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.multiple = true;
          input.accept = "image/*";
          input.onchange = (e) =>
            handleUpload((e.target as HTMLInputElement).files);
          input.click();
        }}
      >
        {uploading ? (
          <Loader2 className="h-8 w-8 text-brand-400 mx-auto animate-spin" />
        ) : (
          <Upload className="h-8 w-8 text-surface-300 mx-auto mb-2" />
        )}
        <p className="text-sm text-surface-300">
          {uploading
            ? "Uploading..."
            : "Click or drag images here to upload"}
        </p>
        <p className="text-xs text-surface-300/60 mt-1">Max 5MB per image</p>
      </div>

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map((url, i) => (
            <div
              key={i}
              className="relative h-20 w-20 rounded-lg overflow-hidden border border-surface-700 group"
            >
              <Image
                src={url}
                alt={`Product ${i + 1}`}
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
              <button
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
