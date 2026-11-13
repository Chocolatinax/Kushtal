"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { FREE_SHIPPING_THRESHOLD_CENTS } from "@/lib/types";

const MESSAGES = [
  `Envío gratis en compras desde $${FREE_SHIPPING_THRESHOLD_CENTS / 100}`,
  "30 días de garantía en todas nuestras piezas",
];

const INTERVAL_MS = 5000;

/**
 * Barra de anuncios sobre el header, visible en todas las páginas.
 * Rota los mensajes automáticamente (solo texto, sin enlaces); se pausa
 * al pasar el mouse o enfocar las flechas, que permiten cambiar a mano.
 */
export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % MESSAGES.length),
      INTERVAL_MS,
    );
    return () => clearInterval(id);
  }, [paused, index]);

  const go = (step: number) =>
    setIndex((i) => (i + step + MESSAGES.length) % MESSAGES.length);

  return (
    <div
      className="bg-anil text-algodon"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="canvas flex h-9 items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Anuncio anterior"
          className="rounded-sm p-1 text-algodon/70 transition-colors hover:text-algodon"
        >
          <ChevronLeft size={16} strokeWidth={1.8} />
        </button>

        <div
          className="relative h-full flex-1 overflow-hidden"
          aria-live="polite"
          aria-atomic="true"
        >
          {MESSAGES.map((msg, i) => (
            <p
              key={msg}
              aria-hidden={i !== index}
              className={`absolute inset-0 flex items-center justify-center text-center text-[12px] font-medium tracking-[0.04em] transition-all duration-500 ease-out sm:text-[13px] ${
                i === index
                  ? "translate-y-0 opacity-100"
                  : i < index
                    ? "-translate-y-full opacity-0"
                    : "translate-y-full opacity-0"
              }`}
            >
              {msg}
            </p>
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Anuncio siguiente"
          className="rounded-sm p-1 text-algodon/70 transition-colors hover:text-algodon"
        >
          <ChevronRight size={16} strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}
