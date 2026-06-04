"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface Props {
  photos: string[];
  name: string;
}

export function PhotoCarousel({ photos, name }: Props) {
  const [idx, setIdx] = useState(0);
  const startX = useRef<number | null>(null);
  const n = photos.length;

  const go = (step: number) => setIdx((c) => (c + step + n) % n);

  useEffect(() => {
    if (n <= 1) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);

  if (!n) {
    return (
      <div className="w-[280px] max-w-full mx-auto mb-5 aspect-square bg-ph rounded-[8px] flex flex-col items-center justify-center text-muted gap-1">
        <span className="text-[15px] font-semibold text-muted">{name}</span>
        <span className="font-mono text-[11px] uppercase tracking-[0.04em]">no photos yet</span>
      </div>
    );
  }

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(dx) > 40 && n > 1) go(dx < 0 ? 1 : -1);
    startX.current = null;
  };

  return (
    <div className="w-[280px] max-w-full mx-auto mb-5">
      {/* Viewport */}
      <div
        className="relative w-full aspect-square bg-ph rounded-[8px] overflow-hidden touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Track */}
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
                sizes="280px"
              />
            </div>
          ))}
        </div>

        {n > 1 && (
          <>
            <button
              type="button"
              className="absolute top-1/2 -translate-y-1/2 left-[10px] w-[38px] h-[38px] rounded-full border-none bg-white/92 text-[#1b1b1b] text-2xl grid place-items-center cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,.18)] transition-colors hover:bg-white pb-[3px]"
              onClick={() => go(-1)}
              aria-label="Previous photo"
            >
              ‹
            </button>
            <button
              type="button"
              className="absolute top-1/2 -translate-y-1/2 right-[10px] w-[38px] h-[38px] rounded-full border-none bg-white/92 text-[#1b1b1b] text-2xl grid place-items-center cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,.18)] transition-colors hover:bg-white pb-[3px]"
              onClick={() => go(1)}
              aria-label="Next photo"
            >
              ›
            </button>
            <span className="absolute bottom-[10px] right-[10px] px-[9px] py-[3px] rounded-full bg-black/55 text-white text-[13px] font-semibold tracking-[0.02em]">
              {idx + 1} / {n}
            </span>
          </>
        )}
      </div>

      {/* Dots */}
      {n > 1 && (
        <div className="flex justify-center gap-2 mt-3">
          {photos.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`w-[9px] h-[9px] rounded-full border-none p-0 cursor-pointer transition-all duration-150 ${
                i === idx
                  ? "bg-accent scale-[1.25]"
                  : "bg-[#cfd4d9]"
              }`}
              onClick={() => setIdx(i)}
              aria-label={`Go to photo ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
