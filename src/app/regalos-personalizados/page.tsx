import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Gift, PenLine, Package } from "lucide-react";

import { ProductCard } from "@/components/product/product-card";
import { Eyebrow } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { getCatalog } from "@/lib/db/products";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Regalos personalizados de cuero en El Salvador",
  description:
    "Billeteras y tarjeteros de cuero con su nombre grabado y caja de regalo. Regalos personalizados para Navidad, San Valentín, Día del Padre y Día de la Madre desde $50.",
  alternates: { canonical: "/regalos-personalizados" },
};

/** Fotos de la página (prompts en docs/prompt-imagenes-regalos.md). */
const IMAGES = {
  hero: "/regalos/hero-regalo.webp",
  navidad: "/regalos/navidad.webp",
  sanValentin: "/regalos/san-valentin.webp",
  diaDelPadre: "/regalos/dia-del-padre.webp",
  diaDeLaMadre: "/regalos/dia-de-la-madre.webp",
  caja: "/regalos/caja-regalo.webp",
};

const OCCASIONS = [
  {
    title: "Navidad",
    body: "Un regalo que se usa todos los días del año, con su nombre grabado.",
    image: IMAGES.navidad,
  },
  {
    title: "San Valentín",
    body: "Sus iniciales y una fecha que solo ustedes dos entienden.",
    image: IMAGES.sanValentin,
  },
  {
    title: "Día del Padre",
    body: "Una billetera de cuero que madura con él y gana pátina con los años.",
    image: IMAGES.diaDelPadre,
  },
  {
    title: "Día de la Madre",
    body: "Una billetera amplia y elegante, en el color que más le gusta.",
    image: IMAGES.diaDeLaMadre,
  },
];

const STEPS = [
  {
    icon: Gift,
    title: "Elige el modelo",
    body: "Billetera, tarjetero o portadocumentos, en el color y la piel que mejor le van.",
  },
  {
    icon: PenLine,
    title: "Graba su nombre",
    body: "Hasta 12 caracteres en golpe seco (incluido) o lámina de oro.",
  },
  {
    icon: Package,
    title: "Agrega la caja de regalo",
    body: "Caja rígida de fibra reciclada con tarjeta escrita a mano (+$10).",
  },
];

const FAQ = [
  {
    q: "¿Con cuánta anticipación debo pedir un regalo personalizado?",
    a: "Con envío estándar llega en 4 a 6 días hábiles, y con envío express en 3 días hábiles. Para fechas especiales te recomendamos pedir al menos 10 días antes.",
  },
  {
    q: "¿Puedo enviar el regalo directamente a otra persona?",
    a: "Sí. En el checkout escribe la dirección de quien lo recibe. No incluimos el precio dentro de la caja.",
  },
  {
    q: "¿Qué puedo grabar?",
    a: "Un nombre, iniciales o una fecha, de hasta 12 caracteres. Lo ves en la vista previa del configurador antes de comprar.",
  },
];

/** Enlace al configurador con la caja de regalo ya elegida y el grabado a la vista. */
function giftHref(slug: string) {
  return `/personalizar/${slug}?estuche=rigido#grupo-grabado`;
}

export default async function GiftsPage() {
  const products = await getCatalog().catch(() => []);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Regalos personalizados",
          item: `${SITE_URL}/regalos-personalizados`,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({
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

      <nav
        aria-label="Migas de pan"
        className="flex flex-wrap items-center gap-1.5 eyebrow text-ink-muted"
      >
        <Link href="/" className="hover:text-anil">
          Inicio
        </Link>
        <ChevronRight size={12} strokeWidth={2} className="opacity-50" />
        <span className="text-cafe">Regalos personalizados</span>
      </nav>

      {/* ------------------------------------------- Hero */}
      <section className="mt-6 grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
        <div>
          <Eyebrow>Desde $50 · Con su nombre grabado</Eyebrow>
          <h1 className="mt-3 font-display text-[32px] leading-10 font-semibold text-piedra md:text-[44px] md:leading-[54px]">
            Regalos personalizados que{" "}
            <span className="italic text-cafe">se usan todos los días</span>
          </h1>
          <p className="mt-4 max-w-xl text-base sm:text-[15px] leading-6 text-ink-muted">
            Billeteras y tarjeteros de cuero hechos a mano en El Salvador, con
            su nombre o iniciales grabados y listos para regalar en caja
            rígida.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonLink href="#modelos" size="lg">
              Elegir un regalo
            </ButtonLink>
            <ButtonLink href="/envios" variant="outline" size="lg">
              Tiempos de entrega
            </ButtonLink>
          </div>
        </div>

        <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-surface-container">
          <Image
            src={IMAGES.hero}
            alt="Billetera de cuero personalizada lista para regalar en su caja"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* ------------------------------------------- Ocasiones */}
      <section className="mt-20">
        <Eyebrow>Para cada temporada</Eyebrow>
        <h2 className="mt-2 font-display text-[26px] leading-9 font-semibold text-piedra md:text-[32px]">
          Un regalo para cada fecha especial
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {OCCASIONS.map((o) => (
            <article
              key={o.title}
              className="overflow-hidden rounded-xl border border-outline-variant/70 bg-surface-lowest"
            >
              <div className="relative aspect-4/3 bg-surface-container">
                <Image
                  src={o.image}
                  alt={`Regalo personalizado de cuero para ${o.title}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display text-[19px] font-semibold text-piedra">
                  {o.title}
                </h3>
                <p className="mt-1.5 text-[14px] sm:text-[13px] leading-5 text-ink-muted">
                  {o.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ------------------------------------------- Cómo armarlo */}
      <section className="mt-20 grid items-center gap-10 rounded-xl bg-surface-high/60 p-6 md:p-10 lg:grid-cols-2">
        <div>
          <Eyebrow>Cómo armar tu regalo</Eyebrow>
          <h2 className="mt-2 font-display text-[26px] leading-9 font-semibold text-piedra md:text-[32px]">
            Listo en tres pasos
          </h2>
          <ol className="mt-8 flex flex-col gap-6">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface-lowest text-cafe">
                  <step.icon size={18} strokeWidth={1.6} />
                </span>
                <div>
                  <p className="font-display text-[18px] font-semibold text-piedra">
                    <span className="mr-2 text-ink-muted">0{i + 1}</span>
                    {step.title}
                  </p>
                  <p className="mt-1 text-[14px] sm:text-[13px] leading-5 text-ink-muted">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-surface-container">
          <Image
            src={IMAGES.caja}
            alt="Caja de regalo rígida con tarjeta escrita a mano"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* ------------------------------------------- Modelos */}
      <section id="modelos" className="mt-20 scroll-mt-32">
        <Eyebrow>Elige el regalo</Eyebrow>
        <h2 className="mt-2 font-display text-[26px] leading-9 font-semibold text-piedra md:text-[32px]">
          Todos los modelos, listos para regalar
        </h2>
        <p className="mt-2 max-w-2xl text-[14px] leading-6 text-ink-muted">
          Al abrir un modelo desde aquí, la caja de regalo ya viene elegida y
          pasas directo al grabado del nombre.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              href={giftHref(product.slug)}
            />
          ))}
        </div>
      </section>

      {/* ------------------------------------------- FAQ */}
      <section className="mt-20 max-w-3xl border-t border-outline-variant/60 pt-10">
        <h2 className="font-display text-[24px] leading-8 font-semibold text-piedra">
          Preguntas frecuentes
        </h2>
        <div className="mt-6 flex flex-col divide-y divide-outline-variant/60 border-y border-outline-variant/60">
          {FAQ.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base sm:text-[15px] font-semibold text-piedra">
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
    </div>
  );
}
