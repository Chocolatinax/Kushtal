import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Hand, MapPin, ShieldCheck } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/format";

export const metadata: Metadata = {
  title: "Sobre Kushtal",
  description:
    "Kushtal es una tienda de billeteras personalizables nacida en El Salvador e inspirada en The Wallet Exercise de Stanford: diseñas tu pieza y la ves antes de comprarla. Desde $50.",
  alternates: { canonical: "/sobre-kushtal" },
};

/* Diseño: pantalla "Sobre Kushtal" de Stitch (manifiesto editorial, sin
   tarjetas, separadores de línea fina y numeración grande en cursiva). */

const FACTS = [
  { label: "Origen", value: "Taller en El Salvador" },
  { label: "Producción", value: "Hecho a pedido · sin producción en serie" },
  { label: "Garantía", value: "1 año en costuras y herrajes" },
];

/** Tira de fotos reales en lugar de la imagen de Stitch (era una captura). */
const STRIP = [
  {
    src: "/configurador/modelos/bifold-signature-atelier/caramelo.jpg",
    alt: "Billetera Bifold Signature en caramelo tostado",
  },
  {
    src: "/configurador/modelos/tarjetero-atelier-no-01/salvia.jpg",
    alt: "Tarjetero No. 01 en verde salvia",
  },
  {
    src: "/configurador/modelos/billetera-continental-roma/chocolate.jpg",
    alt: "Billetera Continental Roma en marrón chocolate",
  },
];

/** Los montos salen de los grupos de opciones del configurador (seed). */
const PRICE_BLOCKS = [
  {
    tag: "01 / Base",
    title: "Modelo base",
    price: "$50 USD",
    body: "Cualquiera de los seis modelos, cortado y cosido a mano en cuero vacuno liso, con funda de lino y monograma en golpe seco.",
    foot: "Punto de partida",
  },
  {
    tag: "02 / Piel",
    title: "Tipo de cuero",
    price: "+$0 a +$18",
    body: "Vacuno liso incluido; piel de grano entero, curtido vegetal o Crazy Horse según el tacto y la pátina que prefieras.",
    foot: "Según el uso",
  },
  {
    tag: "03 / Interior y metales",
    title: "Forro y herrajes",
    price: "+$0 a +$8",
    body: "Forro de lino, algodón, lona añil o tela técnica impermeable. Herrajes en níquel mate, latón cepillado u oro mate.",
    foot: "Detalle a detalle",
  },
  {
    tag: "04 / Función",
    title: "Accesorios",
    price: "+$6 a +$10 c/u",
    body: "Bloqueo RFID contra la lectura de tus tarjetas, espacio oculto para AirTag o clip para billetes.",
    foot: "Seguridad y orden",
  },
  {
    tag: "05 / Identidad",
    title: "Monograma y empaque",
    price: "Incluido / opcional",
    body: "Grabado de hasta 12 caracteres incluido. Lámina de oro (+$8) y caja de regalo rígida (+$10) si es para regalar.",
    foot: "Tu sello",
  },
];

const AUDIENCES = [
  {
    n: "01",
    title: "Profesionales que cuidan los detalles",
    body: "Quienes buscan una pieza sobria, funcional y delgada para el día a día, en el bolsillo delantero o el saco. Personas que prefieren líneas limpias a logotipos grandes.",
    foot: "Uso diario · Perfil slim",
  },
  {
    n: "02",
    title: "Quien busca un regalo con significado",
    body: "Una pieza para marcar un momento: grabada con nombre o iniciales, con el color favorito de quien la recibe y entregada en caja de regalo rígida.",
    foot: "Monograma · Ocasión especial",
  },
  {
    n: "03",
    title: "Empresas y pedidos corporativos",
    body: "Regalos para clientes o equipos, con el logo o las iniciales de la empresa. Hacemos pedidos a partir de 10 unidades con cotización a medida.",
    foot: "Pedidos corporativos · Desde 10 unidades",
  },
];

const hairline = "border-outline-variant/60";

export default function AboutPage() {
  return (
    <>
      {/* ------------------------------------------- Manifiesto */}
      <section className="canvas pt-12 pb-12 md:pt-20">
        <p className="mb-6 flex items-center gap-2 eyebrow tracking-[0.25em] text-ink-muted md:mb-10">
          <span className="h-1.5 w-1.5 rounded-full bg-cafe" />
          Kushtal · Quiénes somos · El Salvador
        </p>

        <h1 className="mb-12 max-w-4xl font-display text-[40px] leading-[1.08] font-normal tracking-tight text-anil md:mb-16 md:text-[56px]">
          Una billetera que <span className="italic text-cafe">diseñas tú.</span>
        </h1>

        <div className={cn("grid gap-6 border-t pt-8 lg:grid-cols-12", hairline)}>
          <p className="max-w-2xl text-[18px] leading-[30px] font-light text-ink-muted lg:col-span-7">
            Kushtal es una tienda de billeteras y tarjeteros personalizables
            nacida en El Salvador. Lo que nos diferencia no es solo el cuero: es
            la experiencia de diseñar tu propia pieza, elegir cada detalle y
            verla terminada antes de que empecemos a coserla.
          </p>

          <dl
            className={cn(
              "grid gap-6 sm:grid-cols-3 lg:col-span-5 lg:grid-cols-1 lg:gap-5 lg:border-l lg:pl-8",
              hairline,
            )}
          >
            {FACTS.map((fact) => (
              <div key={fact.label} className="flex flex-col">
                <dt className="mb-1 eyebrow tracking-widest text-outline">
                  {fact.label}
                </dt>
                <dd className="text-[15px] font-medium text-piedra">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ------------------------------------------- Imagen */}
      <section className="canvas mb-20 md:mb-28">
        <div className="grid aspect-[16/9] grid-cols-3 gap-1 overflow-hidden bg-surface-high md:aspect-[21/9]">
          {STRIP.map((photo) => (
            <div key={photo.src} className="relative">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 33vw, 450px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <div
          className={cn(
            "flex items-baseline justify-between gap-4 border-b pt-4 pb-3 text-[11px] font-bold tracking-wider text-ink-muted",
            hairline,
          )}
        >
          <span>
            Fig. 01 — Bifold Signature, Tarjetero No. 01 y Continental Roma,
            hechos a pedido.
          </span>
          <span className="hidden text-outline sm:inline">
            SAN SALVADOR, C.A.
          </span>
        </div>
      </section>

      {/* ------------------------------------------- 01 · Origen de la idea */}
      <section className="canvas mb-24 md:mb-32">
        <div className="grid items-start gap-6 lg:grid-cols-12">
          <div className="flex flex-col lg:col-span-5">
            <p className="mb-4 eyebrow tracking-[0.2em] text-cafe">
              01 / De dónde viene la idea
            </p>
            <h2 className="mb-8 font-display text-[28px] leading-tight font-normal text-anil md:text-[40px]">
              El ejercicio de la billetera:{" "}
              <br className="hidden sm:block" />
              <span className="italic text-cafe">de Stanford al taller.</span>
            </h2>
            <div className="mb-8 h-px w-12 bg-cafe" />
            <p className="text-[13px] leading-5 tracking-wider text-outline uppercase">
              Diseño centrado en las personas, inspirado en la d.school, aplicado
              al oficio del cuero.
            </p>
          </div>

          <div className="flex flex-col pt-2 lg:col-span-7">
            <div className="space-y-6 text-[18px] leading-[30px] font-light text-ink-muted">
              <p>
                Nos inspiramos en{" "}
                <strong className="font-medium text-piedra">
                  The Wallet Exercise
                </strong>{" "}
                de la d.school de Stanford, un ejercicio de diseño centrado en
                las personas que parte de una pregunta simple:{" "}
                <span className="font-display italic text-piedra">
                  ¿cómo sería la billetera ideal para una persona en particular?
                </span>
              </p>
              <p>
                Una billetera no es solo un lugar para guardar billetes y
                tarjetas: es uno de los objetos más personales que llevamos todos
                los días. Nuestro configurador lleva esa pregunta a la compra, para
                que cada cliente diseñe su propia pieza.
              </p>
            </div>

            <blockquote className={cn("mt-12 border-t pt-10", hairline)}>
              <p className="font-display text-[22px] leading-snug italic text-anil md:text-[28px]">
                “El objeto más personal no se elige de un estante; se diseña a
                partir de los hábitos de quien lo lleva.”
              </p>
              <footer className="mt-4 eyebrow tracking-widest text-outline">
                — Kushtal
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ------------------------------------------- 02 · Precio */}
      <section className="canvas mb-24 md:mb-32">
        <div className={cn("mb-12 border-t pt-12 md:mb-16", hairline)}>
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="mb-4 eyebrow tracking-[0.2em] text-cafe">
                02 / Cómo funciona el precio
              </p>
              <h2 className="font-display text-[28px] leading-tight font-normal text-anil md:text-[40px]">
                Precio claro:{" "}
                <br />
                <span className="italic text-cafe">sin sorpresas al pagar.</span>
              </h2>
            </div>
            <p className="flex max-w-xl items-end text-[18px] leading-[30px] font-light text-ink-muted lg:col-span-7">
              <span>
                Todos los modelos parten de{" "}
                <strong className="font-medium text-anil">$50 USD</strong>. Cada
                elemento que personalizas suma un monto fijo que ves en tiempo
                real en el configurador, antes de agregarlo a tu bolsa.
              </span>
            </p>
          </div>
        </div>

        <div
          className={cn(
            "grid divide-y border-y py-2 md:grid-cols-3 md:divide-y-0 md:py-8 lg:grid-cols-5",
            hairline,
            "divide-outline-variant/60 md:[&>*:not(:first-child)]:border-l md:[&>*]:border-outline-variant/60",
          )}
        >
          {PRICE_BLOCKS.map((block) => (
            <div
              key={block.tag}
              className="flex flex-col justify-between py-8 md:px-6 md:py-0 md:first:pl-0 lg:last:pr-0"
            >
              <div>
                <p className="mb-2 eyebrow tracking-widest text-cafe">
                  {block.tag}
                </p>
                <h3 className="mb-1 font-display text-[22px] leading-[30px] font-normal text-anil">
                  {block.title}
                </h3>
                <p className="mb-4 font-display text-[16px] font-semibold text-cafe">
                  {block.price}
                </p>
                <p className="text-[13px] leading-5 text-ink-muted">
                  {block.body}
                </p>
              </div>
              <p
                className={cn(
                  "mt-6 border-t pt-4 eyebrow text-outline",
                  hairline,
                )}
              >
                {block.foot}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------- 03 · Para quién */}
      <section className="canvas mb-24 md:mb-32">
        <div className={cn("mb-12 border-t pt-12", hairline)}>
          <div className="max-w-2xl">
            <p className="mb-4 eyebrow tracking-[0.2em] text-cafe">
              03 / Para quién
            </p>
            <h2 className="font-display text-[28px] leading-tight font-normal text-anil md:text-[40px]">
              Para quién hacemos{" "}
              <span className="italic text-cafe">nuestras piezas.</span>
            </h2>
          </div>
        </div>

        <div className="grid gap-12 md:grid-cols-3 lg:gap-16">
          {AUDIENCES.map((audience) => (
            <div key={audience.n} className="flex flex-col">
              <span
                aria-hidden
                className="mb-4 font-display text-[40px] leading-none italic text-cafe/40 select-none md:text-[56px]"
              >
                {audience.n}
              </span>
              <h3 className="mb-4 font-display text-[22px] leading-[30px] font-normal text-anil">
                {audience.title}
              </h3>
              <p className="text-[15px] leading-[26px] font-light text-ink-muted">
                {audience.body}
              </p>
              <p
                className={cn(
                  "mt-8 flex items-center gap-2 border-t pt-4 eyebrow tracking-wider text-outline",
                  hairline,
                )}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-cafe" />
                {audience.foot}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------- Cierre */}
      <section className={cn("canvas border-t pt-16 pb-24", hairline)}>
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <p className="mb-4 eyebrow tracking-[0.25em] text-cafe">
            Empieza aquí
          </p>
          <h2 className="mb-6 font-display text-[40px] leading-tight font-normal text-anil md:text-[56px]">
            Empieza a diseñar <span className="italic text-cafe">tu pieza.</span>
          </h2>
          <p className="mb-10 max-w-xl text-[18px] leading-[30px] font-light text-ink-muted">
            Entra al configurador y elige el cuero, el forro, los herrajes, los
            accesorios y tu monograma, viendo el resultado en tiempo real.
          </p>
          <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
            <ButtonLink
              href="/personalizar/bifold-signature-atelier"
              size="lg"
              className="w-full sm:w-auto"
            >
              Ir al configurador
              <ArrowRight size={16} strokeWidth={2} />
            </ButtonLink>
            <ButtonLink
              href="/coleccion"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              Ver la colección
            </ButtonLink>
          </div>
          <p className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 eyebrow tracking-widest text-ink-muted">
            <span className="flex items-center gap-1.5">
              <Hand size={15} strokeWidth={1.8} className="text-cafe" />
              Hecho a mano
            </span>
            <span className="text-outline-variant">·</span>
            <span className="flex items-center gap-1.5">
              <MapPin size={15} strokeWidth={1.8} className="text-cafe" />
              Envíos a todo El Salvador
            </span>
            <span className="text-outline-variant">·</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={15} strokeWidth={1.8} className="text-cafe" />
              1 año de garantía
            </span>
          </p>
        </div>
      </section>
    </>
  );
}
