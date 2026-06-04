"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductModal } from "./ProductModal";
import { productPhotos } from "@/lib/utils";
import type { Product } from "@/types";

interface Props {
  products: Product[];
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
        sizes="(max-width:560px) 100vw, (max-width:920px) 50vw, (max-width:1180px) 33vw, 25vw"
      />
    );
  }
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-center bg-ph p-3"
      style={{
        backgroundImage: "repeating-linear-gradient(45deg, transparent 0 12px, rgba(0,0,0,.035) 12px 24px)",
      }}
    >
      <span className="text-[15px] font-semibold text-muted">{product.name}</span>
      <span className="font-mono text-[11px] uppercase tracking-[0.04em] text-muted">admin upload</span>
    </div>
  );
}

export function HomeGrid({ products }: Props) {
  const [selected, setSelected] = useState<Product | null>(null);

  return (
    <>
      {/* Hero */}
      <section className="flex flex-col items-center text-center gap-[26px] pt-[40px] pb-[18px] min-[920px]:pt-[72px] min-[920px]:pb-[28px]">
        <div className="flex flex-col items-center max-w-[760px]">
          <span className="inline-block font-mono text-[12px] tracking-[0.14em] uppercase text-accent mb-[14px]">
            Handcrafted footwear
          </span>
          <h1 className="font-serif text-[clamp(33px,8.5vw,56px)] leading-[1.06] font-bold m-0 mb-[18px] tracking-[-0.5px] text-balance text-ink">
            Footwear that beautifies your steps.
          </h1>
          <p className="text-[clamp(16px,4.4vw,20px)] leading-[1.55] text-[#444] m-0 mx-auto mb-[26px] max-w-[560px]">
            Versatile, durable, and original — from everyday slides to premium
            collections, every pair is built to make you stand out.
          </p>
          <div className="flex gap-3 flex-wrap justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center border border-transparent rounded-[7px] px-[22px] py-[13px] text-[16px] font-semibold no-underline transition-colors bg-accent text-white hover:bg-accent-dark"
            >
              Shop the collection
            </Link>
          </div>
        </div>
      </section>

      {/* Grid heading */}
      <h2 className="text-center font-serif text-[clamp(30px,6.5vw,48px)] font-bold mt-7 mb-[14px]">
        Our Products
      </h2>
      <p className="text-center text-[#555] text-[clamp(15px,4vw,19px)] m-0 mx-auto mb-9 max-w-[640px]">
        Browse our handcrafted collection designed for style and comfort.
      </p>

      {/* Tiles grid */}
      <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 min-[920px]:grid-cols-3 min-[1180px]:grid-cols-4 min-[920px]:gap-[26px]">
        {products.map((p) => (
          <button
            key={p.id}
            className="flex flex-col p-0 cursor-pointer bg-white border-2 border-[#111] rounded-[16px] overflow-hidden text-center transition-transform duration-150 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,.14)]"
            onClick={() => setSelected(p)}
          >
            <div className="relative w-full aspect-[1/0.82] bg-ph">
              <ProductImage product={p} />
            </div>
            <div className="px-[14px] py-5 font-serif text-[clamp(20px,4.5vw,26px)] font-semibold">
              {p.name}
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <ProductModal product={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
