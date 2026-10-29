import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { ProductCard } from "@/components/product/product-card";
import { Eyebrow } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import {
  childrenOf,
  configuratorHref,
  routePath,
  SILOS,
  type CatalogRoute,
} from "@/lib/catalog-routes";
import { getCatalog } from "@/lib/db/products";
import { SITE_URL } from "@/lib/site";
import type { Product } from "@/lib/types";

export async function CategoryPage({ route }: { route: CatalogRoute }) {
  const products: Product[] = await getCatalog(route.filter).catch(() => []);
  const silo = SILOS.find((s) => s.segments[0] === route.segments[0])!;
  const isSilo = route.segments.length === 1;
  const subs = childrenOf(silo);

  const crumbs = [
    { name: "Inicio", href: "/" },
    { name: "Colección", href: "/coleccion" },
    { name: silo.label, href: routePath(silo) },
    ...(isSilo ? [] : [{ name: route.label, href: routePath(route) }]),
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.name,
        item: `${SITE_URL}${c.href === "/" ? "" : c.href}`,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: route.h1,
      itemListElement: products.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/personalizar/${p.slug}`,
        name: p.name,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: route.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <div className="canvas py-10 lg:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Migas de pan" className="flex flex-wrap items-center gap-1.5 eyebrow text-ink-muted">
        {crumbs.map((c, i) => (
          <span key={c.href} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={12} strokeWidth={2} className="opacity-50" />}
            {i === crumbs.length - 1 ? (
              <span className="text-cafe">{c.name}</span>
            ) : (
              <Link href={c.href} className="hover:text-anil">
                {c.name}
              </Link>
            )}
          </span>
        ))}
      </nav>

      <header className="mt-5 max-w-3xl">
        <Eyebrow>Desde $50 · Hecha a mano en El Salvador</Eyebrow>
        <h1 className="mt-3 font-display text-[30px] leading-[38px] font-semibold text-piedra md:text-[40px] md:leading-[48px]">
          {route.h1}
        </h1>
        <p className="mt-4 text-[15px] leading-6 text-ink-muted">{route.intro}</p>
      </header>

      {/* Subcategorías del silo */}
      {subs.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="eyebrow text-ink-muted">Filtrar:</span>
          <Link
            href={routePath(silo)}
            aria-current={isSilo ? "page" : undefined}
            className={chip(isSilo)}
          >
            Todas
          </Link>
          {subs.map((sub) => (
            <Link
              key={routePath(sub)}
              href={routePath(sub)}
              aria-current={sub === route ? "page" : undefined}
              className={chip(sub === route)}
            >
              {sub.label}
            </Link>
          ))}
        </div>
      )}

      <section className="mt-10">
        {products.length === 0 ? (
          <div className="rounded-xl border border-outline-variant/70 bg-surface-lowest p-12 text-center">
            <p className="font-display text-xl font-semibold text-piedra">
              Todavía no hay modelos en esta categoría
            </p>
            <ButtonLink href="/coleccion" variant="outline" className="mt-6">
              Ver toda la colección
            </ButtonLink>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  href={configuratorHref(product.slug, route)}
                />
              ))}
            </div>
            <p className="mt-6 text-[13px] text-ink-muted">
              {products.length} {products.length === 1 ? "modelo" : "modelos"}
              {route.preset?.rfid && " · el bloqueo RFID ya viene activado al abrirlos"}
            </p>
          </>
        )}
      </section>

      {/* Preguntas frecuentes (keywords secundarias) */}
      {route.faq.length > 0 && (
        <section className="mt-16 max-w-3xl border-t border-outline-variant/60 pt-10">
          <h2 className="font-display text-[24px] leading-8 font-semibold text-piedra">
            Preguntas frecuentes
          </h2>
          <div className="mt-6 flex flex-col divide-y divide-outline-variant/60 border-y border-outline-variant/60">
            {route.faq.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold text-piedra">
                  {f.q}
                  <ChevronRight
                    size={16}
                    strokeWidth={2}
                    className="shrink-0 text-ink-muted transition-transform group-open:rotate-90"
                  />
                </summary>
                <p className="mt-2 text-[14px] leading-6 text-ink-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function chip(active: boolean) {
  return [
    "rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors",
    active
      ? "border-anil bg-anil text-algodon"
      : "border-outline-variant text-ink-muted hover:border-anil hover:text-anil",
  ].join(" ");
}
