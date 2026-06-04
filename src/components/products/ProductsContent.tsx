"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductModal } from "./ProductModal";
import { naira, productPhotos } from "@/lib/utils";
import type { Product } from "@/types";

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2349094579266";

function orderViaWhatsApp(p: Product) {
  const msg = `Hello HushCobbler! I'd like to order the *${p.name}* (${naira(p.price)}). Is it available?`;
  window.open(
    `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`,
    "_blank",
    "noopener"
  );
}

function ProductImage({ product }: { product: Product }) {
  const photos = productPhotos(product);
  if (photos.length) {
    return (
      <Image
        src={photos[0]}
        alt={product.name}
        fill
        className="object-cover"
        sizes="(max-width:560px) 100vw, (max-width:920px) 50vw, 33vw"
      />
    );
  }
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center gap-1 text-center bg-ph p-3"
      style={{
        backgroundImage:
          "repeating-linear-gradient(45deg, transparent 0 12px, rgba(0,0,0,.035) 12px 24px)",
      }}
    >
      <span className="text-[15px] font-semibold text-muted">{product.name}</span>
      <span className="font-mono text-[11px] uppercase tracking-[0.04em] text-muted">
        admin upload
      </span>
    </div>
  );
}

interface Props {
  products: Product[];
}

export function ProductsContent({ products }: Props) {
  const [selected, setSelected] = useState<Product | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-2 min-[920px]:grid-cols-3 min-[920px]:gap-7">
        {products.map((p) => (
          <article
            key={p.id}
            className="bg-white border border-line rounded-[12px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,.05)] flex flex-col"
          >
            <div className="relative w-full aspect-[1/0.78] bg-ph">
              <ProductImage product={p} />
            </div>
            <div className="px-5 pb-[22px] pt-5 flex flex-col gap-3 text-center flex-1">
              <h3 className="text-[clamp(19px,4.5vw,22px)] font-bold m-0">{p.name}</h3>
              {p.description && (
                <p className="text-muted m-0 text-[16px]">{p.description}</p>
              )}
              <div className="text-[22px] font-extrabold my-1">{naira(p.price)}</div>
              <button
                className="w-full border border-[#212529] rounded-[7px] px-4 py-3 text-[16px] font-semibold cursor-pointer transition-colors bg-white text-ink hover:bg-[#f1f3f5]"
                onClick={() => setSelected(p)}
              >
                View details
              </button>
              <button
                className="w-full border border-transparent rounded-[7px] px-4 py-3 text-[16px] font-semibold cursor-pointer transition-colors bg-accent text-white hover:bg-accent-dark"
                onClick={() => orderViaWhatsApp(p)}
              >
                Order now
              </button>
            </div>
          </article>
        ))}
      </div>

      {selected && (
        <ProductModal product={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
