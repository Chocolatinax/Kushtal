import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Gift,
  LayoutGrid,
  Package,
  PenLine,
  ShieldCheck,
} from "lucide-react";

import { LeatherPalette } from "@/components/home/leather-palette";
import { ProductCard } from "@/components/product/product-card";
import { ButtonLink } from "@/components/ui/button";
import { childrenOf, routePath, SILOS } from "@/lib/catalog-routes";
import { getFeaturedProducts } from "@/lib/db/products";
import { SITE_URL } from "@/lib/site";
import type { Product } from "@/lib/types";

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: "Kushtal · Billeteras personalizadas en El Salvador" },
  description:
    "Billeteras personalizadas de cuero desde $50: diseña la tuya eligiendo color, tipo de piel, forro, accesorios y monograma, y mírala en tiempo real. Envíos a todo El Salvador.",
  alternates: { canonical: "/" },
};

/** Datos estructurados de la marca para buscadores. */
const ORGANIZATION_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Kushtal",
  url: SITE_URL,
  description:
    "Billeteras y tarjeteros de cuero personalizables con configurador en tiempo real.",
  areaServed: { "@type": "Country", name: "El Salvador" },
};

/* Diseño: home de Stitch, ordenada de zona caliente (arriba: atracción +
   oferta) a zona fría (abajo: confianza para cerrar la compra). */

/** Foto y texto de cada silo para "Compra por categoría". */
const SILO_CARDS: Record<string, { image: string; blurb: string }> = {
  "billeteras-hombre": {
    image: "/configurador/modelos/bifold-signature-atelier/chocolate.jpg",
    blurb: "Bifold clásica, tarjeteros slim y porta pasaporte para el día a día.",
  },
  "billeteras-mujer": {
    image: "/configurador/modelos/billetera-continental-roma/caramelo.jpg",
    blurb: "Continental larga, con cremallera y tarjeteros compactos.",
  },
  tarjeteros: {
    image: "/configurador/modelos/tarjetero-atelier-no-01/indigo.jpg",
    blurb: "Lo esencial en 5 mm: para el bolsillo delantero o el saco.",
  },
};

const STEPS = [
  {
    n: "01",
    tag: "Modelo",
    title: "Elige el modelo",
    body: "Desde el tarjetero minimalista hasta la billetera continental o con cremallera. Todos parten de $50.",
    meta: "6 modelos disponibles",
    icon: LayoutGrid,
  },
  {
    n: "02",
    tag: "Personalización",
    title: "Diseña cada detalle",
    body: "Color, tipo de piel, forro, herrajes y accesorios como bloqueo RFID. Graba tus iniciales en golpe seco o lámina de oro y mira el precio en tiempo real.",
    meta: "Monograma en golpe seco incluido",
    icon: PenLine,
  },
  {
    n: "03",
    tag: "Taller",
    title: "Hecha a mano",
    body: "La cortamos, cosemos y pulimos a mano en 3 a 5 días, y te la llevamos a cualquier departamento de El Salvador.",
    meta: "Funda de lino incluida",
    icon: Package,
  },
];

const MOSAIC = [
  { src: "/home/taller-corte.jpg", tag: "El corte", caption: "Cortada a mano" },
  { src: "/home/taller-monograma.jpg", tag: "Tu monograma", caption: "Lámina de oro" },
  { src: "/home/taller-patina.jpg", tag: "La pátina", caption: "Mejora con el uso" },
  { src: "/home/taller-entrega.jpg", tag: "La entrega", caption: "Lista para regalar" },
];

export default async function HomePage() {
  let featured: Product[] = [];
  let dbError: string | null = null;

  try {
    featured = await getFeaturedProducts(3);
  } catch (err) {
    dbError = err instanceof Error ? err.message : "Error desconocido";
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_LD) }}
      />

      {/* ------------------------------------------- 1 · Hero (minimalista;
          la oferta vive en la barra superior) */}
      <section className="relative flex min-h-[78vh] items-center justify-center overflow-hidden bg-piedra">
        <Image
          src="/home/hero-taller.jpg"
          alt="Clientes diseñando su billetera en el taller Kushtal"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-piedra/90 via-piedra/45 to-piedra/30" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-piedra/60 via-transparent to-piedra/40" />

        <div className="canvas relative z-10 flex flex-col items-center py-16 text-center lg:py-24">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-algodon/20 bg-algodon/15 px-4 py-1.5 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-cafe-container" />
            <span className="text-[11px] font-semibold tracking-[0.25em] text-algodon uppercase">
              Kushtal Atelier · Cuero de autor
            </span>
          </span>

          <h1 className="mb-8 max-w-4xl font-display text-[40px] leading-[1.08] font-normal tracking-tight text-algodon lg:text-[56px]">
            Objetos que guardan historias.
            <br />
            <span className="italic font-light text-cafe-container">
              Diseñados por ti.
            </span>
          </h1>

          <Link
            href="/coleccion"
            className="group inline-flex items-center gap-2 rounded-full border border-algodon/60 px-8 py-3.5 text-[13px] font-semibold tracking-wider text-algodon uppercase backdrop-blur-sm transition-all duration-300 hover:border-algodon hover:bg-algodon/10"
          >
            Explorar colección
            <ArrowRight
              size={16}
              strokeWidth={2}
              className="text-cafe-container transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>

      {/* ------------------------------------------- 2 · Compra por categoría */}
      <section className="border-b border-ceniza/60 py-14 lg:py-20">
        <div className="canvas">
          <div className="mb-8 flex flex-col justify-between gap-2 md:flex-row md:items-end">
            <div>
              <p className="mb-1 eyebrow tracking-[0.25em] text-cafe">
                Compra por categoría
              </p>
              <h2 className="font-display text-[28px] leading-9 font-normal tracking-tight text-piedra lg:text-[40px] lg:leading-[48px]">
                ¿Qué estás buscando?
              </h2>
            </div>
            <ButtonLink href="/coleccion" variant="ghost">
              Ver toda la colección
              <ArrowRight size={15} strokeWidth={2} />
            </ButtonLink>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {SILOS.map((silo) => {
              const card = SILO_CARDS[silo.segments[0]];
              return (
                <article
                  key={silo.label}
                  className="group flex flex-col overflow-hidden rounded-xl border border-ceniza bg-surface-lowest"
                >
                  <Link
                    href={routePath(silo)}
                    className="relative block aspect-[4/3] overflow-hidden bg-ceniza/40"
                  >
                    <Image
                      src={card.image}
                      alt={silo.h1}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-[22px] leading-[30px] text-piedra">
                      <Link href={routePath(silo)} className="hover:text-anil">
                        {silo.h1}
                      </Link>
                    </h3>
                    <p className="mt-1 text-[13px] leading-5 text-ink-muted">
                      {card.blurb}
                    </p>
                    <ul className="mt-4 flex flex-wrap gap-2 border-t border-ceniza/60 pt-4">
                      {childrenOf(silo).map((sub) => (
                        <li key={sub.label}>
                          <Link
                            href={routePath(sub)}
                            className="inline-block rounded-full border border-outline-variant px-3 py-1 text-[12px] font-medium text-ink-muted transition-colors hover:border-anil hover:text-anil"
                          >
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------- 3 · Creaciones icónicas */}
      <section className="border-b border-ceniza/60 bg-ceniza/30 py-14 lg:py-20">
        <div className="canvas">
          <div className="mb-8 flex flex-col justify-between sm:flex-row sm:items-end">
            <div>
              <p className="mb-1 eyebrow tracking-[0.25em] text-cafe">
                Los más elegidos
              </p>
              <h2 className="font-display text-[28px] leading-9 font-normal tracking-tight text-piedra lg:text-[40px] lg:leading-[48px]">
                Creaciones icónicas
              </h2>
            </div>
            <ButtonLink href="/coleccion" variant="ghost" className="mt-4 sm:mt-0">
              Ver catálogo completo
              <ArrowRight size={15} strokeWidth={2} />
            </ButtonLink>
          </div>

          {dbError ? (
            <SetupNotice message={dbError} />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ------------------------------------------- 4 · Paleta de cueros */}
      <section className="border-b border-ceniza/60 bg-surface-lowest py-14 lg:py-20">
        <div className="canvas">
          <div className="mb-8 flex flex-col justify-between gap-2 md:flex-row md:items-end">
            <div>
              <p className="mb-1 eyebrow tracking-[0.25em] text-cafe">
                Colores del cuero
              </p>
              <h2 className="font-display text-[28px] leading-9 font-normal tracking-tight text-piedra lg:text-[40px] lg:leading-[48px]">
                Paleta de cueros
              </h2>
            </div>
            <p className="max-w-md text-[13px] leading-5 text-ink-muted">
              Cada tono madura con el uso y toma una pátina propia. Elige uno y
              mira cómo queda en un modelo real.
            </p>
          </div>
          <LeatherPalette />
        </div>
      </section>

      {/* ------------------------------------------- 5 · Cómo funciona */}
      <section className="border-b border-ceniza/50 py-14 lg:py-20">
        <div className="canvas">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-1 eyebrow tracking-[0.25em] text-cafe">Cómo funciona</p>
            <h2 className="font-display text-[28px] leading-9 font-normal tracking-tight text-piedra lg:text-[40px] lg:leading-[48px]">
              Cómo se da vida a tu pieza
            </h2>
            <p className="mt-2 text-[15px] leading-[26px] text-ink-muted">
              Del modelo al monograma: tú decides cada elemento y ves cuánto
              suma al precio antes de comprar.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <article
                key={step.n}
                className="flex flex-col justify-between rounded-xl border border-ceniza bg-surface-lowest p-7 shadow-sm transition-shadow duration-300 hover:shadow-md"
              >
                <div>
                  <div className="mb-4 flex items-baseline justify-between">
                    <span
                      className={
                        i === 1
                          ? "font-display text-[40px] text-cafe"
                          : "font-display text-[40px] text-ceniza"
                      }
                    >
                      {step.n}
                    </span>
                    <span
                      className={
                        i === 1
                          ? "eyebrow tracking-widest text-cafe"
                          : "eyebrow tracking-widest text-outline"
                      }
                    >
                      {step.tag}
                    </span>
                  </div>
                  <h3 className="mb-1 font-display text-[22px] leading-[30px] text-piedra">
                    {step.title}
                  </h3>
                  <p className="mb-4 text-[13px] leading-relaxed text-ink-muted">
                    {step.body}
                  </p>
                </div>
                <p className="flex items-center gap-2 rounded-lg border border-ceniza/50 bg-ceniza/40 p-2 text-[12px] text-piedra">
                  <step.icon size={18} strokeWidth={1.6} className="text-cafe" />
                  {step.meta}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/personalizar/bifold-signature-atelier"
              className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-wider text-anil uppercase transition-colors hover:text-cafe"
            >
              Abrir el configurador
              <ArrowUpRight size={16} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------- 6 · #KushtalAtelier */}
      <section className="py-14 lg:py-20">
        <div className="canvas">
          <div className="mb-8 flex flex-col justify-between gap-2 md:flex-row md:items-end">
            <div>
              <p className="mb-1 eyebrow tracking-[0.25em] text-cafe">
                Vida de taller
              </p>
              <h2 className="font-display text-[28px] leading-9 font-normal tracking-tight text-piedra lg:text-[40px] lg:leading-[48px]">
                #KushtalAtelier
              </h2>
            </div>
            <p className="max-w-sm text-[13px] leading-5 text-ink-muted">
              Así se hace y así se vive una pieza Kushtal: del corte en el
              taller a la pátina de todos los días.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {MOSAIC.map((photo, i) => (
              <figure
                key={photo.src}
                className={
                  "group relative aspect-[3/4] overflow-hidden rounded-xl border border-ceniza bg-ceniza shadow-sm" +
                  (i % 2 === 1 ? " lg:translate-y-4" : "")
                }
              >
                <Image
                  src={photo.src}
                  alt={`${photo.tag}: ${photo.caption}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <figcaption className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-anil/85 via-anil/20 to-transparent p-4 text-algodon opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
                  <span className="text-[9px] tracking-widest text-ceniza uppercase">
                    {photo.tag}
                  </span>
                  <span className="font-display text-[18px] italic">
                    {photo.caption}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>

          {/* ------------------------------------------- 7 · Compromiso */}
          <div className="mt-14 flex flex-col items-center justify-between gap-6 rounded-xl bg-anil p-7 text-algodon shadow-md lg:flex-row lg:p-10">
            <div className="flex items-center gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-anil-container">
                <ShieldCheck size={26} strokeWidth={1.6} className="text-cafe-container" />
              </span>
              <div>
                <h3 className="font-display text-[22px] leading-[30px]">
                  ¿Es un regalo o un pedido para tu empresa?
                </h3>
                <p className="max-w-xl text-[13px] leading-5 text-ceniza">
                  Agrega la caja de regalo y su nombre grabado, o escríbenos
                  para pedidos corporativos desde 10 unidades. Todas las piezas
                  tienen 1 año de garantía en costuras y herrajes.
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Link
                href="/personalizar/bifold-signature-atelier?estuche=rigido#grupo-grabado"
                className="inline-flex items-center gap-2 rounded-full bg-cafe px-6 py-3 text-[13px] font-semibold text-algodon transition-colors hover:bg-cafe/90"
              >
                <Gift size={16} strokeWidth={1.8} />
                Diseñar un regalo
              </Link>
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 rounded-full border border-algodon/50 px-6 py-3 text-[13px] font-semibold text-algodon transition-colors hover:bg-algodon/10"
              >
                Pedidos corporativos
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/** Se muestra si Supabase todavía no está configurado, en vez de un 500 seco. */
function SetupNotice({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-cafe/40 bg-cafe-container/40 p-8">
      <p className="font-display text-lg font-semibold text-piedra">
        El catálogo todavía no está conectado
      </p>
      <p className="mt-2 max-w-xl text-[13px] leading-5 text-ink-muted">
        Copia <code className="rounded bg-surface-high px-1.5 py-0.5">.env.example</code> a{" "}
        <code className="rounded bg-surface-high px-1.5 py-0.5">.env.local</code>, pega
        las credenciales de tu proyecto de Supabase y corre la migración junto
        con el seed. El detalle está en el README.
      </p>
      <p className="mt-4 font-mono text-[11px] text-ink-muted">{message}</p>
    </div>
  );
}
