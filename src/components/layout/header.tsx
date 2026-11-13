import Link from "next/link";
import { Search, ShoppingBag, User } from "lucide-react";

import { childrenOf, routePath, SILOS } from "@/lib/catalog-routes";
import { getCartCount } from "@/lib/db/cart";
import { getCatalog } from "@/lib/db/products";
import { AnnouncementBar } from "./announcement-bar";
import { CollectionMenu } from "./collection-menu";
import { MobileNav, type NavItem } from "./mobile-nav";

/**
 * "Colección" abre un panel con las categorías de la arquitectura web. Cada
 * silo muestra sus subcategorías; si no tiene (p. ej. Billeteras mujer), muestra
 * sus modelos para que el menú no quede vacío. Sin "Inicio" (el logo ya lleva a
 * la home) ni "Personalizador" (cada producto abre su configurador).
 */
async function collectionGroups() {
  return Promise.all(
    SILOS.map(async (silo) => {
      const subs = childrenOf(silo);
      const links =
        subs.length > 0
          ? subs.map((sub) => ({ href: routePath(sub), label: sub.label }))
          : (await getCatalog(silo.filter).catch(() => [])).map((p) => ({
              href: `/personalizar/${p.slug}`,
              label: p.name,
            }));
      return { href: routePath(silo), label: silo.label, links };
    }),
  );
}

export async function Header() {
  const [count, groups] = await Promise.all([
    getCartCount().catch(() => 0),
    collectionGroups(),
  ]);

  const NAV: NavItem[] = [
    { href: "/coleccion", label: "Colección", groups },
    { href: "/artesania", label: "Artesanía" },
    { href: "/sobre-kushtal", label: "Sobre Kushtal" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-outline-variant/60 bg-algodon/95 backdrop-blur-sm">
        {/* Dentro del header fijo: así se ve siempre, aunque el navegador
            recuerde el scroll al recargar. */}
        <AnnouncementBar />
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
              href="/cuenta"
              aria-label="Mis pedidos"
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
