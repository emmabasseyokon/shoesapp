"use client";

import { useRef, useState } from "react";
import Image from "next/image";

interface Props {
  photos: string[];
  name: string;
  sizes: string;
}

export function CardPhotoCarousel({ photos, name, sizes }: Props) {
  const [idx, setIdx] = useState(0);
  const startX = useRef<number | null>(null);
  const n = photos.length;

  const go = (step: number) => setIdx((c) => (c + step + n) % n);

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    startX.current = null;
  };

  return (
    <div
      className="group relative w-full h-full overflow-hidden touch-pan-y"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="flex h-full transition-transform duration-[320ms] ease-[cubic-bezier(.4,0,.2,1)]"
        style={{ transform: `translateX(-${idx * 100}%)` }}
      >
        {photos.map((src, i) => (
          <div key={i} className="flex-none w-full h-full relative">
            <Image
              src={src}
              alt={`${name} photo ${i + 1}`}
              fill
              className="object-cover"
              draggable={false}
              sizes={sizes}
            />
          </div>
        ))}
      </div>

      {/* Prev / next arrows (desktop hover) */}
      <button
        type="button"
        className="hidden sm:flex absolute left-1.5 top-1/2 -translate-y-1/2 items-center justify-center w-8 h-8 rounded-full bg-black/45 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        onClick={() => go(-1)}
        aria-label="Previous photo"
      >
        ‹
      </button>
      <button
        type="button"
        className="hidden sm:flex absolute right-1.5 top-1/2 -translate-y-1/2 items-center justify-center w-8 h-8 rounded-full bg-black/45 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        onClick={() => go(1)}
        aria-label="Next photo"
      >
        ›
      </button>

      {/* Dots */}
      <div className="absolute bottom-[10px] left-0 right-0 flex justify-center gap-2">
        {photos.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`w-[8px] h-[8px] rounded-full border-none p-0 cursor-pointer transition-all duration-150 ${
              i === idx ? "bg-white scale-[1.25]" : "bg-white/50"
            }`}
            onClick={() => setIdx(i)}
            aria-label={`Go to photo ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
