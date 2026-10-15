import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Plus } from "lucide-react";

import { ProductCard } from "@/components/product/product-card";
import { Badge, Eyebrow } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { getFeaturedProducts } from "@/lib/db/products";
import type { Product } from "@/lib/types";

export const revalidate = 300;

const LEATHERS = [
  {
    name: "Caramelo Tostado",
    note: "Curtido toscano tradicional",
    hex: "#A9672F",
  },
  {
    name: "Marrón Chocolate",
    note: "Profundo y aterciopelado en caliente",
    hex: "#3B2318",
  },
  {
    name: "Azul Ceniza Índigo",
    note: "Mate añil sobrio y sereno",
    hex: "#1E2B4F",
  },
  {
    name: "Negro Azabache",
    note: "Acabado pulido mate, sobriedad arquitectónica",
    hex: "#17161A",
  },
];

const RITUAL = [
  {
    step: "01",
    tag: "Estructura",
    title: "Selecciona la silueta",
    body: "Escoge el patrón base: concebido para tu firme, desde el esbelto Tarjetero Minimal hasta la amplitud funcional de la Bifold Continental.",
    meta: "6 siluetas maestras disponibles",
  },
  {
    step: "02",
    tag: "Personalización",
    title: "Modela cada detalle",
    body: "Combina pieles anteriores e interiores, tono del hilo encerado, contraste del canto, e inscribe tus iniciales en golpe seco o pan de oro de 22k.",
    meta: "Monograma incluido a foil dorado",
  },
  {
    step: "03",
    tag: "Atelier",
    title: "Confección a mano",
    body: "Cortada, cosida punto por punto y pulida en nuestro taller. Despachada en un estuche rígido con certificado de trazabilidad firmado por el artesano.",
    meta: "Estuche de lino virgen de regalo",
  },
];

export default async function HomePage() {
  let featured: Product[] = [];
  let dbError: string | null = null;

  try {
    featured = await getFeaturedProducts(3);
  } catch (err) {
    dbError = err instanceof Error ? err.message : "Error desconocido";
  }

  const heroImage = featured[0]?.images?.[1] ?? featured[0]?.hero_image ?? null;
  const macroImage = featured[0]?.images?.[2] ?? null;

  return (
    <>
      {/* ------------------------------------------------- HERO */}
      <section className="canvas grid items-center gap-12 py-14 lg:grid-cols-[1fr_1.05fr] lg:py-20">
        <div>
          <Eyebrow>· Curtición vegetal & taller bespoke</Eyebrow>

          <h1 className="mt-5 font-display text-[38px] leading-[46px] font-semibold text-piedra md:text-[56px] md:leading-[64px]">
            El arte del cuero hecho a tu medida
          </h1>

          <p className="mt-5 max-w-md text-[15px] leading-6 text-ink-muted md:text-[17px] md:leading-7">
            Piezas atemporales elaboradas artesanalmente con pieles de curtición
            vegetal y personalizadas con tu impronta única. Cada pespunte celebra
            la calma y la permanencia.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <ButtonLink href="/coleccion" size="lg">
              Diseña tu billetera
              <Plus size={16} strokeWidth={2} />
            </ButtonLink>
            <ButtonLink href="/coleccion" variant="ghost" size="lg">
              Explorar colección
              <ArrowRight size={15} strokeWidth={2} />
            </ButtonLink>
          </div>

          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-outline-variant/60 pt-7">
            {[
              ["100%", "Piel trazable europea"],
              ["Garantía", "De por vida en costuras"],
              ["Gratis", "Grabado de iniciales"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="font-display text-xl font-semibold text-piedra">
                  {value}
                </dt>
                <dd className="mt-1 eyebrow text-ink-muted">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-surface-container">
            {heroImage && (
              <Image
                src={heroImage}
                alt="Billetera bifold de piel curtida al vegetal sobre pedestal de piedra"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
            )}
          </div>

          <figure className="absolute -bottom-6 left-4 right-4 rounded-lg border border-outline-variant/70 bg-algodon/95 p-4 shadow-warm backdrop-blur-sm sm:left-8 sm:right-auto sm:max-w-sm">
            <figcaption className="eyebrow text-cafe">
              Silueta Bifold N° 01
            </figcaption>
            <p className="mt-1.5 text-[13px] leading-5 text-ink-muted">
              Piel vacuno curtida en barrica de roble con cantos bruñidos a cera
              virgen de abeja.
            </p>
          </figure>
        </div>
      </section>

      {/* ------------------------------------------------- PALETA */}
      <section className="canvas grid gap-10 border-t border-outline-variant/60 py-16 lg:grid-cols-[1fr_1fr] lg:gap-16 lg:py-24">
        <div>
          <Eyebrow>Materias nobles</Eyebrow>
          <h2 className="mt-3 font-display text-[30px] leading-[38px] font-semibold text-piedra md:text-[40px] md:leading-[48px]">
            Paleta Botánica de Cueros
          </h2>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {LEATHERS.map((leather) => (
              <div
                key={leather.name}
                className="flex items-start gap-3 rounded-lg border border-outline-variant/70 bg-surface-lowest p-4"
              >
                <span
                  className="mt-0.5 h-7 w-7 shrink-0 rounded-full border border-piedra/15"
                  style={{ backgroundColor: leather.hex }}
                />
                <div>
                  <p className="label-pill text-piedra">{leather.name}</p>
                  <p className="mt-1 text-[12px] leading-4 text-ink-muted">
                    {leather.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:pt-16">
          <p className="max-w-sm text-[13px] leading-5 text-ink-muted">
            Curtidos exclusivamente con extractos de castaño, mimosa y quebracho.
            Tonos que maduran desarrollando una pátina irrepetible con el roce
            cotidiano.
          </p>

          <div className="mt-6 overflow-hidden rounded-xl border border-outline-variant/70 bg-surface-lowest">
            <div className="relative aspect-16/10 bg-surface-container">
              {macroImage && (
                <Image
                  src={macroImage}
                  alt="Macrofotografía del grano natural del cuero"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
              )}
              <span className="absolute left-3 top-3">
                <Badge tone="neutral">Aumento táctil 4x</Badge>
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 p-5">
              <div>
                <p className="font-display text-lg font-semibold text-piedra">
                  Grano Natural Caramelo
                </p>
                <p className="mt-1 text-[12px] text-ink-muted">
                  Calibre 1.4mm. Textura mantecosa con pátina dorada rápida.
                </p>
              </div>
              <Link
                href="/coleccion"
                aria-label="Ver colección"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-outline-variant text-piedra transition-colors hover:border-anil hover:text-anil"
              >
                <ArrowRight size={16} strokeWidth={1.8} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------- RITUAL */}
      <section className="border-y border-outline-variant/60 bg-surface-container/60 py-16 lg:py-24">
        <div className="canvas">
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow className="text-center">Oficio y ritual</Eyebrow>
            <h2 className="mt-3 font-display text-[30px] leading-[38px] font-semibold text-piedra md:text-[40px] md:leading-[48px]">
              Cómo se da vida a tu pieza
            </h2>
            <p className="mt-4 text-[15px] leading-6 text-ink-muted">
              De la elección de la estructura al último toque de monograma en
              caliente. Un diálogo directo entre tus hábitos y las manos de
              nuestros artesanos.
            </p>
          </div>

          <ol className="mt-12 grid gap-5 md:grid-cols-3">
            {RITUAL.map((item) => (
              <li
                key={item.step}
                className="flex flex-col rounded-xl border border-outline-variant/70 bg-surface-lowest p-6"
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-2xl font-semibold text-outline-variant">
                    {item.step}
                  </span>
                  <span className="eyebrow text-cafe">{item.tag}</span>
                </div>

                <h3 className="mt-4 font-display text-[22px] leading-7 font-semibold text-piedra">
                  {item.title}
                </h3>
                <p className="mt-2.5 flex-1 text-[13px] leading-5 text-ink-muted">
                  {item.body}
                </p>

                <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-surface-high px-3 py-1.5 text-[11px] font-semibold text-piedra">
                  <Check size={12} strokeWidth={2.5} className="text-torogoz" />
                  {item.meta}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-10 text-center">
            <ButtonLink href="/coleccion" variant="ghost">
              Abrir configurador Atelier
              <ArrowUpRight size={15} strokeWidth={2} />
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------- DESTACADOS */}
      <section className="canvas py-16 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>Arquetipos del taller</Eyebrow>
            <h2 className="mt-3 font-display text-[30px] leading-[38px] font-semibold text-piedra md:text-[40px] md:leading-[48px]">
              Creaciones Icónicas
            </h2>
          </div>

          <ButtonLink href="/coleccion" variant="ghost">
            Ver catálogo completo
            <ArrowRight size={15} strokeWidth={2} />
          </ButtonLink>
        </div>

        {dbError ? (
          <SetupNotice message={dbError} />
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ------------------------------------------------- COMPROMISO */}
      <section className="canvas pb-16 lg:pb-24">
        <div className="flex flex-col gap-6 rounded-xl bg-anil p-8 text-algodon md:flex-row md:items-center md:p-10">
          <div className="flex-1">
            <p className="font-display text-xl font-semibold">
              Compromiso Eterno Kushtal
            </p>
            <p className="mt-2 max-w-2xl text-[13px] leading-5 text-algodon/75">
              Cada creación incluye garantía de costura por vida y un servicio
              gratuito anual de limpieza y reacondicionamiento con bálsamo de
              cera en nuestro taller.
            </p>
          </div>

          <ButtonLink href="/coleccion" variant="craft" size="lg" className="shrink-0">
            Comenzar personalización
            <ArrowRight size={15} strokeWidth={2} />
          </ButtonLink>
        </div>
      </section>
    </>
  );
}

/** Se muestra si Supabase todavía no está configurado, en vez de un 500 seco. */
function SetupNotice({ message }: { message: string }) {
  return (
    <div className="mt-10 rounded-xl border border-dashed border-cafe/40 bg-cafe-container/40 p-8">
      <p className="font-display text-lg font-semibold text-piedra">
        El catálogo todavía no está conectado
      </p>
      <p className="mt-2 max-w-xl text-[13px] leading-5 text-ink-muted">
        Copiá <code className="rounded bg-surface-high px-1.5 py-0.5">.env.example</code> a{" "}
        <code className="rounded bg-surface-high px-1.5 py-0.5">.env.local</code>, pegá
        las credenciales de tu proyecto de Supabase y corré la migración junto
        con el seed. El detalle está en el README.
      </p>
      <p className="mt-4 font-mono text-[11px] text-ink-muted">{message}</p>
    </div>
  );
}
