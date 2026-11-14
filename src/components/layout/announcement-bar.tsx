"use client";

import { useEffect, useState } from "react";

import { FREE_SHIPPING_THRESHOLD_CENTS } from "@/lib/types";

/**
 * `short` es la versión para celular: a 14 px el texto completo no cabe en
 * una línea en 375 px.
 */
const MESSAGES = [
  {
    full: `Envío gratis en compras desde $${FREE_SHIPPING_THRESHOLD_CENTS / 100}`,
    short: `Envío gratis desde $${FREE_SHIPPING_THRESHOLD_CENTS / 100}`,
  },
  {
    full: "30 días de garantía en todas nuestras piezas",
    short: "30 días de garantía",
  },
];

const INTERVAL_MS = 5000;

/**
 * Barra de anuncios sobre el header, visible en todas las páginas.
 * Rota los mensajes automáticamente (solo texto, sin enlaces ni flechas);
 * se pausa al pasar el mouse para poder leer con calma.
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
  }, [paused]);

  return (
    <div
      className="bg-anil text-algodon"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="canvas relative h-9 overflow-hidden"
        aria-live="polite"
        aria-atomic="true"
      >
        {MESSAGES.map((msg, i) => (
          <p
            key={msg.full}
            aria-hidden={i !== index}
            className={`absolute inset-0 flex items-center justify-center whitespace-nowrap text-center text-[14px] font-medium transition-all duration-500 ease-out sm:text-[13px] sm:tracking-[0.04em] ${
              i === index
                ? "translate-y-0 opacity-100"
                : i < index
                  ? "-translate-y-full opacity-0"
                  : "translate-y-full opacity-0"
            }`}
          >
            <span className="sm:hidden">{msg.short}</span>
            <span className="hidden sm:inline">{msg.full}</span>
          </p>
        ))}
      </div>
    </div>
  );
}
