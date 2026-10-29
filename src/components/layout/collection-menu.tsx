"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";

import { cn } from "@/lib/format";
import type { NavItem } from "./mobile-nav";

/**
 * Panel de "Colección" con las categorías y subcategorías de la arquitectura.
 *
 * Se abre con hover y con foco de teclado (CSS). Al elegir un enlace se
 * cierra: el header no se recarga al navegar, y sin esto el panel quedaba
 * abierto porque el mouse sigue encima y el enlace conserva el foco. Vuelve a
 * abrirse cuando el mouse sale y entra de nuevo, o al volver con Tab.
 */
export function CollectionMenu({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const [closed, setClosed] = useState(false);

  // Si la ruta cambia por otro lado (atrás/adelante), también se cierra.
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setClosed(true);
  }

  const groups = item.groups ?? [];

  return (
    // El grupo ocupa todo el alto del header para que el mouse no "caiga" en
    // un hueco al bajar al panel, que se ancla al header.
    <div
      className="group flex h-full items-center"
      onMouseLeave={() => setClosed(false)}
      onFocus={(e) => {
        // Volver a entrar con el teclado lo reabre.
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setClosed(false);
        }
      }}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a")) {
          setClosed(true);
          (document.activeElement as HTMLElement | null)?.blur();
        }
      }}
    >
      <Link
        href={item.href}
        aria-expanded={!closed}
        className={cn(
          "flex items-center gap-1 label-pill text-[11px] text-ink-muted transition-colors hover:text-anil",
          !closed && "group-hover:text-anil group-focus-within:text-anil",
        )}
      >
        {item.label}
        <ChevronDown
          size={12}
          strokeWidth={2}
          className={cn(
            "transition-transform",
            !closed && "group-hover:rotate-180 group-focus-within:rotate-180",
          )}
        />
      </Link>

      <div
        className={cn(
          "invisible absolute inset-x-0 top-full z-50 border-y border-outline-variant/60 bg-algodon opacity-0 shadow-warm transition-opacity duration-200",
          !closed &&
            "group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100",
        )}
      >
        <div className="canvas grid gap-10 py-10 lg:grid-cols-12">
          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-9">
            {groups.map((group) => (
              <div key={group.href}>
                <Link
                  href={group.href}
                  className="font-display text-[22px] leading-7 text-piedra transition-colors hover:text-anil"
                >
                  {group.label}
                </Link>
                <ul className="mt-4 flex flex-col gap-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[14px] text-ink-muted transition-colors hover:text-anil"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href={group.href}
                      className="text-[14px] text-ink-muted transition-colors hover:text-anil"
                    >
                      Ver todas
                    </Link>
                  </li>
                </ul>
              </div>
            ))}

            <Link
              href={item.href}
              className="inline-flex w-fit items-center gap-2 border-b border-piedra pb-1 text-[13px] font-semibold tracking-wider text-piedra uppercase transition-colors hover:border-anil hover:text-anil sm:col-span-3"
            >
              Ver toda la colección
              <ArrowRight size={15} strokeWidth={1.8} />
            </Link>
          </div>

          <Link
            href="/personalizar/bifold-signature-atelier"
            className="group/card relative hidden overflow-hidden rounded-lg lg:col-span-3 lg:block"
          >
            <span className="relative block aspect-[4/5]">
              <Image
                src="/configurador/modelos/bifold-signature-atelier/caramelo.jpg"
                alt=""
                fill
                sizes="300px"
                className="object-cover transition-transform duration-500 group-hover/card:scale-105"
              />
            </span>
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-piedra/80 to-transparent p-4 text-algodon">
              <span className="block eyebrow text-algodon/80">Desde $50</span>
              <span className="font-display text-[18px]">Diseña la tuya</span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
