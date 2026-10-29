import Link from "next/link";
import { Search, ShoppingBag, User } from "lucide-react";

import { childrenOf, routePath, SILOS } from "@/lib/catalog-routes";
import { getCartCount } from "@/lib/db/cart";
import { getCurrentUser } from "@/lib/supabase/server";
import { CollectionMenu } from "./collection-menu";
import { MobileNav, type NavItem } from "./mobile-nav";

/**
 * "Colección" abre un panel con las categorías y subcategorías de la
 * arquitectura web. Sin "Inicio" (el logo ya lleva a la home) ni
 * "Personalizador" (cada producto abre su configurador).
 */
const COLLECTION_GROUPS = SILOS.map((silo) => ({
  href: routePath(silo),
  label: silo.label,
  links: childrenOf(silo).map((sub) => ({
    href: routePath(sub),
    label: sub.label,
  })),
}));

const NAV: NavItem[] = [
  { href: "/coleccion", label: "Colección", groups: COLLECTION_GROUPS },
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
      <header className="sticky top-0 z-50 border-b border-outline-variant/60 bg-algodon/95 backdrop-blur-sm">
        <div className="canvas flex h-16 items-center gap-8">
          <MobileNav items={NAV} />

          <Link
            href="/"
            className="font-display text-xl font-semibold tracking-[0.12em] text-piedra"
          >
            KUSHTAL
          </Link>

          <nav className="hidden h-full items-center gap-7 lg:flex">
            {NAV.map((item) =>
              item.groups ? (
                <CollectionMenu key={item.href} item={item} />
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="label-pill text-[11px] text-ink-muted transition-colors hover:text-anil"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="ml-auto flex items-center gap-4">
            <span className="hidden text-[13px] text-ink-muted md:inline">
              USD $
            </span>

            <Link
              href="/coleccion#buscar"
              aria-label="Buscar en la colección"
              className="rounded-sm p-1.5 text-ink-muted transition-colors hover:text-anil"
            >
              <Search size={19} strokeWidth={1.6} />
            </Link>

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
