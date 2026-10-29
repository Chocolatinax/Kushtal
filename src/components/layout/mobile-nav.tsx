"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Menu, X } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  /** Categorías con sus subcategorías (panel en desktop, acordeón en celular). */
  groups?: {
    href: string;
    label: string;
    links: { href: string; label: string }[];
  }[];
}

export function MobileNav({ items }: { items: NavItem[] }) {
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

      {/* Portal al body: el header tiene backdrop-blur, que convierte a sus
          hijos "fixed" en relativos al header y aplastaba el panel. */}
      {open && createPortal(
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

            <div className="flex flex-col gap-1 overflow-y-auto p-4">
              {items.map((item) =>
                item.groups ? (
                  <details key={item.href} open className="group/col">
                    <summary className="flex cursor-pointer list-none items-center justify-between rounded-sm px-3 py-3 font-display text-lg text-piedra transition-colors hover:bg-surface-container">
                      {item.label}
                      <ChevronDown
                        size={18}
                        strokeWidth={1.6}
                        className="text-ink-muted transition-transform group-open/col:rotate-180"
                      />
                    </summary>
                    <div className="mb-2 flex flex-col gap-4 px-3 pt-1 pb-2">
                      {item.groups.map((group) => (
                        <div key={group.href}>
                          <Link
                            href={group.href}
                            onClick={() => setOpen(false)}
                            className="eyebrow text-cafe"
                          >
                            {group.label}
                          </Link>
                          <ul className="mt-1.5 border-l border-outline-variant/70 pl-3">
                            {group.links.map((link) => (
                              <li key={link.href}>
                                <Link
                                  href={link.href}
                                  onClick={() => setOpen(false)}
                                  className="block py-1.5 text-[14px] text-ink-muted transition-colors hover:text-anil"
                                >
                                  {link.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="text-[14px] font-semibold text-anil"
                      >
                        Ver toda la colección
                      </Link>
                    </div>
                  </details>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-sm px-3 py-3 font-display text-lg text-piedra transition-colors hover:bg-surface-container"
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </div>

            <p className="mt-auto border-t border-outline-variant/60 px-6 py-5 text-[13px] leading-5 text-ink-muted">
              Billeteras de cuero que diseñas tú, hechas a mano en El Salvador.
            </p>
          </nav>
        </div>,
        document.body,
      )}
    </>
  );
}
