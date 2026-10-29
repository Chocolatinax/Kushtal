import type { Metadata } from "next";
import { Suspense } from "react";
import { ArrowRight, Leaf, Scissors, ShieldCheck } from "lucide-react";

import { CatalogFilters } from "@/components/product/catalog-filters";
import { ProductCard } from "@/components/product/product-card";
import { Badge, Eyebrow } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { getCatalog, getCategories, type CatalogSort } from "@/lib/db/products";
import type { Product } from "@/lib/types";

export const metadata: Metadata = {
  title: "Billeteras y tarjeteros personalizados",
  description:
    "Billeteras y tarjeteros de cuero personalizables desde $50 en El Salvador. Elige color, piel, forro, accesorios y monograma, y mira el diseño en tiempo real.",
  alternates: { canonical: "/coleccion" },
};

/** Modelo que abre el botón "Abrir configurador". */
const DEFAULT_SLUG = "bifold-signature-atelier";

const PILLARS = [
  {
    icon: Leaf,
    eyebrow: "Tú eliges la piel",
    title: "Cuatro tipos de cuero",
    body: "Cuero vacuno liso, piel de grano entero, curtido vegetal o Crazy Horse. Cada uno tiene un tacto distinto y envejece a su manera.",
    tag: "Desde $50",
  },
  {
    icon: Scissors,
    eyebrow: "Hecha a mano",
    title: "Costura a dos agujas",
    body: "Unimos cada panel con hilo de lino encerado, a mano. Si un punto se rompe, la costura no se deshace.",
    tag: "Hecha a mano",
  },
  {
    icon: ShieldCheck,
    eyebrow: "Compra tranquila",
    title: "Garantía Kushtal",
    body: "Si una costura o un herraje falla por un defecto de fabricación, la reparamos o la cambiamos sin costo.",
    tag: "1 año de garantía",
  },
];

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CatalogPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const one = (key: string) => {
    const v = sp[key];
    return Array.isArray(v) ? v[0] : v;
  };

  const filters = {
    category: one("categoria"),
    texture: one("textura"),
    q: one("q"),
    sort: (one("orden") as CatalogSort | undefined) ?? "popular",
  };

  let products: Product[] = [];
  let categories: { code: string; label: string; count: number }[] = [];
  let total = 0;
  let dbError: string | null = null;

  try {
    [products, categories] = await Promise.all([
      getCatalog(filters),
      getCategories({ texture: filters.texture, q: filters.q }),
    ]);
    total = categories.reduce((n, c) => n + c.count, 0);
  } catch (err) {
    dbError = err instanceof Error ? err.message : "Error desconocido";
  }

  return (
    <>
      <section className="canvas pt-10 pb-8 lg:pt-14">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <Eyebrow>Colección personalizable</Eyebrow>
              <span className="h-px w-8 bg-outline-variant" />
              <p className="eyebrow text-ink-muted">Todo desde $50</p>
            </div>

            <h1 className="mt-4 font-display text-[30px] leading-[38px] font-semibold text-piedra md:text-[40px] md:leading-[48px]">
              Billeteras y tarjeteros personalizados
            </h1>

            <p className="mt-4 text-[15px] leading-6 text-ink-muted">
              Elige un modelo y hazlo tuyo: color, tipo de piel, forro,
              accesorios y monograma. Todas parten de $50 y ves el diseño final
              antes de comprar.
            </p>
          </div>

        </div>

        <div className="mt-8">
          <Suspense fallback={<div className="h-28 rounded-xl bg-surface-container" />}>
            <CatalogFilters
              key={filters.q ?? ""}
              categories={categories}
              total={total}
            />
          </Suspense>
        </div>
      </section>

      <section className="canvas pb-16">
        {dbError ? (
          <div className="rounded-xl border border-dashed border-cafe/40 bg-cafe-container/40 p-8">
            <p className="font-display text-lg font-semibold text-piedra">
              El catálogo todavía no está conectado
            </p>
            <p className="mt-2 text-[13px] text-ink-muted">
              Configura Supabase siguiendo el README y vuelve a cargar.
            </p>
            <p className="mt-3 font-mono text-[11px] text-ink-muted">{dbError}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-xl border border-outline-variant/70 bg-surface-lowest p-12 text-center">
            <p className="font-display text-xl font-semibold text-piedra">
              Ninguna pieza coincide con ese filtro
            </p>
            <p className="mt-2 text-[13px] text-ink-muted">
              Prueba quitando la piel o la búsqueda para ver la
              colección completa.
            </p>
            <ButtonLink href="/coleccion" variant="outline" className="mt-6">
              Limpiar filtros
            </ButtonLink>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <p className="mt-8 text-[13px] text-ink-muted">
              Mostrando {products.length} de {total} modelos
            </p>
          </>
        )}
      </section>

      {/* Pilares del taller */}
      <section className="border-t border-outline-variant/60 bg-surface-container/50 py-16 lg:py-20">
        <div className="canvas">
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow className="text-center">Cómo trabajamos</Eyebrow>
            <h2 className="mt-3 font-display text-[28px] leading-9 font-semibold text-piedra md:text-[34px] md:leading-[44px]">
              Cada pieza se corta, cose y graba a mano cuando haces tu pedido.
            </h2>
            <p className="mt-4 text-[15px] leading-6 text-ink-muted">
              No fabricamos en serie: tu billetera empieza a hacerse cuando
              terminas de configurarla. El cuero toma con el uso una pátina que
              la hace única.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {PILLARS.map((pillar) => (
              <article
                key={pillar.title}
                className="flex flex-col rounded-xl border border-outline-variant/70 bg-surface-lowest p-6"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-torogoz/12 text-torogoz-ink">
                  <pillar.icon size={18} strokeWidth={1.6} />
                </span>

                <p className="mt-5 eyebrow text-cafe">{pillar.eyebrow}</p>
                <h3 className="mt-2 font-display text-[22px] leading-7 font-semibold text-piedra">
                  {pillar.title}
                </h3>
                <p className="mt-2.5 flex-1 text-[13px] leading-5 text-ink-muted">
                  {pillar.body}
                </p>

                <div className="mt-5">
                  <Badge tone="craft">{pillar.tag}</Badge>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-5 rounded-xl bg-surface-high/70 p-8 md:flex-row md:items-center md:p-10">
            <div className="flex-1">
              <Eyebrow>Configurador</Eyebrow>
              <p className="mt-2 font-display text-[22px] leading-7 font-semibold text-piedra">
                ¿Quieres diseñar tu billetera desde cero?
              </p>
              <p className="mt-2 max-w-xl text-[13px] leading-5 text-ink-muted">
                Elige color, piel, forro, herrajes y accesorios como
                bloqueo RFID, y mira tu monograma en golpe seco o lámina de oro
                antes de comprar.
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-3">
              <ButtonLink
                href={`/personalizar/${DEFAULT_SLUG}`}
                size="lg"
              >
                Abrir configurador
                <ArrowRight size={15} strokeWidth={2} />
              </ButtonLink>
              <ButtonLink href="/contacto" variant="ghost" size="lg">
                Pedir muestras de piel
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
