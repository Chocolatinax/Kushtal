import Link from "next/link";
import { Search, ShoppingBag, User } from "lucide-react";

import { getCartCount } from "@/lib/db/cart";
import { getCurrentUser } from "@/lib/supabase/server";
import { MobileNav } from "./mobile-nav";

const NAV = [
  { href: "/coleccion", label: "Colección" },
  { href: "/personalizar", label: "Personalizador" },
  { href: "/artesania", label: "Artesanía" },
  { href: "/sobre-kushtal", label: "Sobre Kushtal" },
];

export async function Header() {
  const [count, user] = await Promise.all([
    getCartCount().catch(() => 0),
    getCurrentUser().catch(() => null),
  ]);

  return (
    <>
      {/* Barra de anuncio */}
      <div className="bg-anil text-algodon">
        <div className="canvas flex h-9 items-center justify-center">
          <p className="eyebrow text-center text-[10px] sm:text-[11px]">
            Envío de cortesía en pedidos superiores a $150
            <span className="mx-2 opacity-50">|</span>
            Grabado personalizado incluido
          </p>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-outline-variant/60 bg-algodon/95 backdrop-blur-sm">
        <div className="canvas flex h-16 items-center gap-6">
          <MobileNav items={NAV} />

          <Link
            href="/"
            className="font-display text-xl font-semibold tracking-[0.12em] text-piedra"
          >
            KUSHTAL
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="label-pill text-[11px] text-ink-muted transition-colors hover:text-anil"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-4">
            <span className="hidden text-[13px] text-ink-muted md:inline">
              USD $
            </span>

            <button
              type="button"
              aria-label="Buscar"
              className="rounded-sm p-1.5 text-ink-muted transition-colors hover:text-anil"
            >
              <Search size={19} strokeWidth={1.6} />
            </button>

            <Link
              href="/bolsa"
              aria-label={`Bolsa de compra, ${count} piezas`}
              className="relative rounded-sm p-1.5 text-ink-muted transition-colors hover:text-anil"
            >
              <ShoppingBag size={19} strokeWidth={1.6} />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-cafe px-1 text-[10px] font-bold text-algodon">
                  {count}
                </span>
              )}
            </Link>

            <Link
              href={user ? "/cuenta" : "/ingresar"}
              aria-label={user ? "Mi cuenta" : "Ingresar"}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-anil text-algodon transition-transform hover:scale-105"
            >
              <User size={15} strokeWidth={1.8} />
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
