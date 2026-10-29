import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { Configurator } from "@/components/configurator/configurator";
import { Badge, Eyebrow } from "@/components/ui/badge";
import { getCatalog, getProductWithOptions } from "@/lib/db/products";
import { SITE_URL } from "@/lib/site";
import { COMMON_SPECS, PRODUCT_SPECS } from "@/lib/product-specs";
import { getVariantImages } from "@/lib/variant-images";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateStaticParams() {
  try {
    const products = await getCatalog();
    return products.map((p) => ({ slug: p.slug }));
  } catch {
    // Sin base de datos todavía: las rutas se resuelven bajo demanda.
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const product = await getProductWithOptions(slug);
    if (!product) return { title: "Pieza no encontrada" };

    return {
      title: `${product.name} personalizada desde $${product.base_price_cents / 100}`,
      description: product.description ?? undefined,
      alternates: { canonical: `/personalizar/${product.slug}` },
      openGraph: {
        title: `${product.name} · Configurador Kushtal`,
        description: product.description ?? undefined,
        images: product.hero_image ? [product.hero_image] : undefined,
      },
    };
  } catch {
    return { title: "Configurador" };
  }
}

export default async function ConfiguratorPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;

  // Preset desde la URL (?rfid=si al venir de una subcategoría). Solo texto
  // plano; el configurador ignora códigos que no existan para el producto.
  const sp = await searchParams;
  const preset = Object.fromEntries(
    Object.entries(sp).flatMap(([k, v]) =>
      typeof v === "string" && /^[a-z_]{2,20}$/.test(k) ? [[k, v.slice(0, 40)]] : [],
    ),
  );

  const product = await getProductWithOptions(slug).catch(() => null);
  if (!product) notFound();

  const specs = PRODUCT_SPECS[product.slug];

  // El precio publicado es el de partida; la personalización suma encima.
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? undefined,
    image:
      product.images.length > 0
        ? product.images.map((src) => new URL(src, SITE_URL).toString())
        : undefined,
    brand: { "@type": "Brand", name: "Kushtal" },
    additionalProperty: specs
      ? [
          { "@type": "PropertyValue", name: "Medidas", value: specs.dimensions },
          { "@type": "PropertyValue", name: "Capacidad", value: specs.capacity },
        ]
      : undefined,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/personalizar/${product.slug}`,
      priceCurrency: "USD",
      price: (product.base_price_cents / 100).toFixed(2),
      availability: "https://schema.org/MadeToOrder",
      areaServed: "SV",
    },
  };

  return (
    <div className="canvas py-8 lg:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />

      <nav
        aria-label="Migas de pan"
        className="flex flex-wrap items-center gap-1.5 eyebrow text-ink-muted"
      >
        <Link href="/" className="hover:text-anil">
          Inicio
        </Link>
        <ChevronRight size={12} strokeWidth={2} className="opacity-50" />
        <Link href="/coleccion" className="hover:text-anil">
          Colección
        </Link>
        <ChevronRight size={12} strokeWidth={2} className="opacity-50" />
        <span className="text-cafe">Configurador</span>
      </nav>

      <header className="mt-5 flex flex-wrap items-start justify-between gap-5">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-3">
            <Eyebrow>{product.tagline}</Eyebrow>
            {product.badge && <Badge tone="neutral">{product.badge}</Badge>}
          </div>

          <h1 className="mt-3 font-display text-[30px] leading-[38px] font-semibold text-piedra md:text-[40px] md:leading-[48px]">
            {product.name}
          </h1>

          <p className="mt-3 text-[15px] leading-6 text-ink-muted">
            {product.description}
          </p>
        </div>

        <dl className="flex gap-6 rounded-lg border border-outline-variant/70 bg-surface-lowest px-5 py-4">
          {product.capacity_label && (
            <div>
              <dt className="eyebrow text-ink-muted">Capacidad</dt>
              <dd className="mt-1 text-[13px] font-semibold text-piedra">
                {product.capacity_label}
              </dd>
            </div>
          )}
          {product.leather_label && (
            <div>
              <dt className="eyebrow text-ink-muted">Detalle</dt>
              <dd className="mt-1 text-[13px] font-semibold text-piedra">
                {product.leather_label}
              </dd>
            </div>
          )}
        </dl>
      </header>

      <div className="mt-10 lg:mt-14">
        <Configurator
          product={product}
          images={getVariantImages(product.slug)}
          preset={preset}
        />
      </div>

      {/* ------------------------------------------- Ficha del producto */}
      <section
        aria-labelledby="detalles"
        className="mt-16 grid gap-10 border-t border-outline-variant/60 pt-12 lg:grid-cols-12"
      >
        <div className="lg:col-span-4">
          <p className="eyebrow tracking-[0.2em] text-cafe">Ficha del producto</p>
          <h2
            id="detalles"
            className="mt-2 font-display text-[28px] leading-9 text-piedra"
          >
            Detalles de {product.name}
          </h2>
          {specs && (
            <p className="mt-3 text-[15px] leading-6 text-ink-muted">
              {specs.idealFor}
            </p>
          )}
        </div>

        <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:col-span-8">
          {specs && (
            <>
              <Spec label="Medidas" value={specs.dimensions} />
              <Spec label="Capacidad" value={specs.capacity} />
              <Spec label="Incluye" value={specs.includes.join(" · ")} />
            </>
          )}
          <Spec label="Precio" value="Desde $50; cada personalización suma al precio" />
          {COMMON_SPECS.map((s) => (
            <Spec key={s.label} label={s.label} value={s.value} />
          ))}
        </dl>
      </section>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-outline-variant/60 pb-4">
      <dt className="eyebrow text-ink-muted">{label}</dt>
      <dd className="mt-1 text-[14px] leading-6 text-piedra">{value}</dd>
    </div>
  );
}
