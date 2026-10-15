"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export function MobileNav({
  items,
}: {
  items: { href: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);

  // El fondo no debe hacer scroll detrás del panel abierto.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
        className="rounded-sm p-1.5 text-ink-muted transition-colors hover:text-anil lg:hidden"
      >
        <Menu size={20} strokeWidth={1.6} />
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-piedra/40 backdrop-blur-[2px]"
          />

          <nav className="absolute inset-y-0 left-0 flex w-[82%] max-w-80 flex-col bg-algodon shadow-warm-lg">
            <div className="flex h-16 items-center justify-between border-b border-outline-variant/60 px-6">
              <span className="font-display text-lg font-semibold tracking-[0.12em] text-piedra">
                KUSHTAL
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú"
                className="rounded-sm p-1 text-ink-muted"
              >
                <X size={20} strokeWidth={1.6} />
              </button>
            </div>

            <div className="flex flex-col gap-1 p-4">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-sm px-3 py-3 font-display text-lg text-piedra transition-colors hover:bg-surface-container"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <p className="mt-auto border-t border-outline-variant/60 px-6 py-5 text-[13px] leading-5 text-ink-muted">
              Marroquinería de silencio y permanencia. Cada pieza se confecciona
              a mano en nuestro taller.
            </p>
          </nav>
        </div>
      )}
    </>
  );
}
