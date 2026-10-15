import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { Configurator } from "@/components/configurator/configurator";
import { Badge, Eyebrow } from "@/components/ui/badge";
import { getCatalog, getProductWithOptions } from "@/lib/db/products";

interface PageProps {
  params: Promise<{ slug: string }>;
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
      title: `Personalizar ${product.name}`,
      description: product.description ?? undefined,
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

export default async function ConfiguratorPage({ params }: PageProps) {
  const { slug } = await params;

  const product = await getProductWithOptions(slug).catch(() => null);
  if (!product) notFound();

  return (
    <div className="canvas py-8 lg:py-12">
      <nav
        aria-label="Migas de pan"
        className="flex flex-wrap items-center gap-1.5 eyebrow text-ink-muted"
      >
        <Link href="/" className="hover:text-anil">
          Atelier
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
              <dt className="eyebrow text-ink-muted">Piel</dt>
              <dd className="mt-1 text-[13px] font-semibold text-piedra">
                {product.leather_label}
              </dd>
            </div>
          )}
        </dl>
      </header>

      <div className="mt-10 lg:mt-14">
        <Configurator product={product} />
      </div>
    </div>
  );
}
