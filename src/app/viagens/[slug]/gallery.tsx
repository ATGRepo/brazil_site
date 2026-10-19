"use client";

import { useState } from "react";

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  if (images.length === 0) return <div className="aspect-[4/3] rounded-xl bg-surface-muted" />;
  const go = (step: number) => setIndex((i) => (i + step + images.length) % images.length);

  return (
    <div className="grid gap-3 sm:grid-cols-[110px_1fr]">
      <div className="order-2 flex gap-2 overflow-x-auto sm:order-1 sm:max-h-[400px] sm:flex-col sm:overflow-y-auto">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setIndex(i)}
            className={`shrink-0 overflow-hidden rounded-lg border-2 ${i === index ? "border-accent" : "border-transparent"}`}
            aria-label={`Foto ${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" loading="lazy" className="h-16 w-24 object-cover sm:h-20 sm:w-full" />
          </button>
        ))}
      </div>
      <div className="relative order-1 aspect-[4/3] overflow-hidden rounded-xl bg-surface-muted sm:order-2 sm:aspect-auto sm:h-[400px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[index]} alt={alt} className="h-full w-full object-cover" />
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full bg-white/90 text-lg text-primary shadow"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Próxima foto"
              className="absolute right-3 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full bg-white/90 text-lg text-primary shadow"
            >
              ›
            </button>
          </>
        )}
      </div>
    </div>
  );
}
