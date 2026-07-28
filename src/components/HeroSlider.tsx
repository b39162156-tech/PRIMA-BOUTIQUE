"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { storageUrl } from "@/lib/utils";
import type { Slide } from "@/lib/types";

export default function HeroSlider({ slides, durationMs = 3700 }: { slides: Slide[]; durationMs?: number }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), durationMs);
    return () => clearInterval(timer);
  }, [slides.length, durationMs]);

  if (slides.length === 0) return null;

  return (
    <div className="relative rounded-xl2 overflow-hidden mt-5 h-[260px]">
      {slides.map((slide, i) => {
        const url = storageUrl("slider-images", slide.storage_path);
        return (
          <div
            key={slide.id}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === index ? 1 : 0 }}
          >
            {url && <Image src={url} alt={slide.title} fill className="object-cover" priority={i === 0} />}
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative h-full flex flex-col justify-center px-12 max-w-md">
              <h2 className="font-display text-3xl text-white mb-2">{slide.title}</h2>
              {slide.subtitle && <p className="text-white/95 text-[15px]">{slide.subtitle}</p>}
            </div>
          </div>
        );
      })}

      {slides.length > 1 && (
        <>
          <button
            aria-label="Précédent"
            onClick={() => setIndex((index - 1 + slides.length) % slides.length)}
            className="absolute top-1/2 left-3.5 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 flex items-center justify-center z-10"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            aria-label="Suivant"
            onClick={() => setIndex((index + 1) % slides.length)}
            className="absolute top-1/2 right-3.5 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 flex items-center justify-center z-10"
          >
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Aller à la diapositive ${i + 1}`}
                onClick={() => setIndex(i)}
                className="h-2 rounded-full bg-white transition-all duration-300"
                style={{ width: i === index ? 22 : 8, opacity: i === index ? 1 : 0.5 }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
