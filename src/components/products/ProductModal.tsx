"use client";

import { useEffect } from "react";
import { PhotoCarousel } from "./PhotoCarousel";
import { naira, productPhotos } from "@/lib/utils";
import type { Product } from "@/types";

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2349094579266";

function orderViaWhatsApp(p: Product) {
  const msg = `Hello GeemanFootwears! I'd like to order the *${p.name}* (${naira(p.price)}). Is it available?`;
  window.open(
    `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`,
    "_blank",
    "noopener"
  );
}

interface Props {
  product: Product;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white rounded-[12px] w-full max-w-[560px] max-h-[92vh] overflow-auto shadow-[0_30px_80px_rgba(0,0,0,.35)]"
        role="dialog"
        aria-modal="true"
      >
        {/* Head */}
        <div className="flex items-center justify-between gap-3 px-5 py-[18px] border-b border-line">
          <h2 className="m-0 text-[clamp(20px,5vw,26px)] font-bold">{product.name}</h2>
          <button
            className="bg-none border-none text-[30px] leading-none cursor-pointer text-[#555] w-10 h-10 flex-none"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-[22px] text-center">
          <PhotoCarousel
            key={product.id}
            photos={productPhotos(product)}
            name={product.name}
          />
          <p className="text-[17px] m-0 mb-[14px]">
            {product.description || "Handcrafted footwear."}
          </p>
          <div className="text-[clamp(24px,6vw,30px)] font-extrabold">
            {naira(product.price)}
          </div>
        </div>

        {/* Foot */}
        <div className="flex justify-end gap-3 px-5 pb-[22px] pt-4 flex-wrap">
          <button
            className="flex-auto min-w-0 max-w-[180px] border border-transparent rounded-[7px] px-[22px] py-[11px] text-[16px] font-semibold cursor-pointer transition-colors bg-[#6c757d] text-white hover:bg-[#5c636a]"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="flex-auto min-w-0 max-w-[220px] border border-transparent rounded-[7px] px-[22px] py-[11px] text-[16px] font-semibold cursor-pointer transition-colors bg-accent text-white hover:bg-accent-dark"
            onClick={() => {
              orderViaWhatsApp(product);
              onClose();
            }}
          >
            Order on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
