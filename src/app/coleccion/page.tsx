import type { Metadata } from "next";
import { Suspense } from "react";
import { ArrowRight, Infinity as InfinityIcon, Leaf, Scissors } from "lucide-react";

import { CatalogFilters } from "@/components/product/catalog-filters";
import { ProductCard } from "@/components/product/product-card";
import { Badge, Eyebrow } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { getCatalog, getCategories, type CatalogSort } from "@/lib/db/products";
import type { Product } from "@/lib/types";

export const metadata: Metadata = {
  title: "Colección de Billeteras & Tarjeteros",
  description:
    "Diseños minimalistas creados para envejecer con nobleza. Cada silueta es un lienzo táctil para tu personalización en piel, pespunte y monograma.",
};

const PILLARS = [
  {
    icon: Leaf,
    eyebrow: "Piel curtida al vegetal",
    title: "Curtición Vegetal",
    body: "Curtidas con extractos de corteza de mimosa y quebracho. Libres de sales de cromo sintéticas, con un olor inconfundible y resistencia superior.",
    tag: "Certificación LWG Oro",
  },
  {
    icon: Scissors,
    eyebrow: "Puntada de guarnicionero",
    title: "Costuras Enceradas",
    body: "Unimos cada panel con hilo de lino japonés encerado a mano. A diferencia del cosido a máquina, si un punto se rompe la estructura permanece inextinguible e intacta.",
    tag: "Saddle stitch tradicional",
  },
  {
    icon: InfinityIcon,
    eyebrow: "Promesa de herencia",
    title: "Garantía Vitalicia",
    body: "Respaldamos cada costura, herraje y ensamble por toda la vida útil del portador. Ofrecemos servicio de restauración periódica con cera y costura en taller.",
    tag: "Mantenimiento en taller",
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
    tone: one("tono"),
    texture: one("textura"),
    sort: (one("orden") as CatalogSort | undefined) ?? "popular",
  };

  let products: Product[] = [];
  let categories: { code: string; label: string; count: number }[] = [];
  let total = 0;
  let dbError: string | null = null;

  try {
    [products, categories] = await Promise.all([
      getCatalog(filters),
      getCategories(),
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
              <Eyebrow>Catálogo artesanal</Eyebrow>
              <span className="h-px w-8 bg-outline-variant" />
              <p className="eyebrow text-ink-muted">Serie Atelier 2026</p>
            </div>

            <h1 className="mt-4 font-display text-[30px] leading-[38px] font-semibold text-piedra md:text-[40px] md:leading-[48px]">
              Colección de Billeteras &amp; Tarjeteros
            </h1>

            <p className="mt-4 text-[15px] leading-6 text-ink-muted">
              Diseños minimalistas creados para envejecer con nobleza. Cada
              silueta se convierte en un lienzo táctil: selecciona la
              personalización en piel, pespunte y monograma.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-outline-variant/70 bg-surface-lowest px-5 py-4">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-surface-high font-display text-sm font-semibold text-piedra">
              A
            </span>
            <div>
              <p className="eyebrow text-ink-muted">Configuración vital</p>
              <p className="mt-0.5 font-display text-lg font-semibold text-piedra">
                {total || "—"} modelos trazables
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Suspense fallback={<div className="h-28 rounded-xl bg-surface-container" />}>
            <CatalogFilters categories={categories} total={total} />
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
              Configurá Supabase siguiendo el README y volvé a cargar.
            </p>
            <p className="mt-3 font-mono text-[11px] text-ink-muted">{dbError}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-xl border border-outline-variant/70 bg-surface-lowest p-12 text-center">
            <p className="font-display text-xl font-semibold text-piedra">
              Ninguna pieza coincide con ese filtro
            </p>
            <p className="mt-2 text-[13px] text-ink-muted">
              Probá quitando el tono o la textura para ver la colección completa.
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
              Mostrando {products.length} de {total} piezas de colección
            </p>
          </>
        )}
      </section>

      {/* Pilares del taller */}
      <section className="border-t border-outline-variant/60 bg-surface-container/50 py-16 lg:py-20">
        <div className="canvas">
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow className="text-center">Compromiso del taller Kushtal</Eyebrow>
            <h2 className="mt-3 font-display text-[28px] leading-9 font-semibold text-piedra md:text-[34px] md:leading-[44px]">
              Cada pieza se corta, bisela y graba a mano en nuestro taller
              artesanal.
            </h2>
            <p className="mt-4 text-[15px] leading-6 text-ink-muted">
              Rechazamos la producción acelerada. Nuestras pieles absorben la
              luz, el aceite de tus manos y las marcas del camino, cobrando una
              pátina única e irrepetible a lo largo de las décadas.
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
              <Eyebrow>Experiencia Atelier</Eyebrow>
              <p className="mt-2 font-display text-[22px] leading-7 font-semibold text-piedra">
                ¿Deseas una configuración totalmente a medida?
              </p>
              <p className="mt-2 max-w-xl text-[13px] leading-5 text-ink-muted">
                Nuestro configurador interactivo te deja elegir el color del
                hilo, el tipo de borde y visualizar tu monograma estampado en
                golpe seco o lámina dorada antes de la confección.
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-3">
              <ButtonLink
                href={products[0] ? `/personalizar/${products[0].slug}` : "/coleccion"}
                size="lg"
              >
                Abrir configurador
                <ArrowRight size={15} strokeWidth={2} />
              </ButtonLink>
              <ButtonLink href="/contacto" variant="ghost" size="lg">
                Solicitar muestrario de piel
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
