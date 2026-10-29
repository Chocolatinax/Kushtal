import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/format";

export const metadata: Metadata = {
  title: "Artesanía y cuidado del cuero",
  description:
    "Cómo hacemos tu billetera a mano: los cuatro tipos de cuero, los forros, el proceso en el taller y cómo cuidar el cuero para que dure años.",
  alternates: { canonical: "/artesania" },
};

/* Diseño: pantalla "Artesanía" de Stitch (manifiesto editorial sin tarjetas,
   separadores de línea fina y numeración grande). */

const FACTS = [
  {
    eyebrow: "Técnica",
    title: "Costura a dos agujas",
    note: "Hilo de lino encerado, a mano",
  },
  {
    eyebrow: "Materiales",
    title: "Cuatro tipos de cuero",
    note: "Del vacuno liso al Crazy Horse",
  },
  {
    eyebrow: "Tiempo de taller",
    title: "3 a 5 días hábiles de confección",
    note: "Cada pieza se hace bajo pedido",
  },
];

const FEATURED_LEATHERS = [
  {
    n: "01",
    name: "Cuero vacuno liso",
    meta: "Calibre 1.2 mm",
    title: "Firme, de poro cerrado y fácil de cuidar.",
    body: "Una superficie pareja y suave al tacto que resiste bien el roce del bolsillo. Es la opción más sobria para el uso diario y la que incluye el precio base.",
    specs: ["Acabado: satinado suave", "Tacto: firme", "Pátina: 6 a 12 meses"],
    image: "/configurador/materiales/textura/vacuna-lisa.jpg",
  },
  {
    n: "02",
    name: "Piel de grano entero",
    meta: "Flor íntegra",
    title: "Conserva el grano natural de la piel y gana carácter.",
    body: "No se lija ni se corrige: conserva las marcas y la textura propias del cuero. Con los meses se oscurece y toma un brillo que hace única a cada pieza.",
    specs: ["Acabado: natural", "Tacto: texturizado y cálido", "Pátina: rápida y profunda"],
    image: "/configurador/materiales/textura/grano-natural.jpg",
  },
];

const OTHER_LEATHERS = [
  {
    n: "03",
    name: "Curtido vegetal",
    meta: "Taninos naturales",
    title: "Curtido lento con extractos de cortezas.",
    body: "Se curte con taninos vegetales en lugar de sales de cromo. Huele a cuero de verdad y reacciona a la luz y al uso, oscureciéndose más rápido que los demás.",
    tags: ["Taninos vegetales", "Pátina rápida", "Aroma natural"],
  },
  {
    n: "04",
    name: "Cuero Crazy Horse",
    meta: "Efecto pull-up",
    title: "Encerado, rústico y con memoria.",
    body: "Va impregnado de ceras. Al doblarlo o presionarlo, la cera se desplaza y el color se aclara en esa zona. Los rayones leves se disimulan frotando con el dedo.",
    tags: ["Disimula rayones", "Aspecto rústico", "Repele el agua"],
  },
];

const LININGS = [
  {
    eyebrow: "Incluido",
    name: "Arena natural",
    body: "Lino de algodón sin teñir. Suave, discreto y combina con cualquier color exterior.",
    image: "/configurador/materiales/interior/arena.jpg",
  },
  {
    eyebrow: "Incluido",
    name: "Algodón crudo",
    body: "Lona de algodón de trama cerrada en tono crema. Los billetes se deslizan sin engancharse.",
    image: "/configurador/materiales/interior/algodon.jpg",
  },
  {
    eyebrow: "+$4",
    name: "Lona añil",
    body: "Algodón encerado en azul profundo. Resiste manchas y humedad y da contraste al abrirla.",
    image: "/configurador/materiales/interior/anil.jpg",
  },
  {
    eyebrow: "+$6",
    name: "Verde tormenta",
    body: "Tela técnica impermeable en verde azulado. La más resistente al agua y al uso intenso.",
    image: "/configurador/materiales/interior/tormenta.jpg",
  },
];

const STEPS = [
  {
    n: "01",
    tag: "Trazado",
    title: "Corte a mano",
    body: "Trazamos y cortamos cada pieza a mano, orientando el cuero para que las zonas que más trabajan queden en la dirección más resistente.",
    detail: "Piel elegida en el configurador",
  },
  {
    n: "02",
    tag: "Unión",
    title: "Costura a dos agujas",
    body: "Cosemos sin máquina: dos agujas pasan en sentido contrario por cada orificio con hilo de lino encerado. Si un punto se rompe, la costura no se deshace.",
    detail: "Hilo de lino encerado",
  },
  {
    n: "03",
    tag: "Terminación",
    title: "Cantos y herrajes",
    body: "Lijamos y sellamos los bordes, bruñidos a cera o pintados a mano, y colocamos los herrajes y accesorios que agregaste.",
    detail: "Bruñido o pintado",
  },
  {
    n: "04",
    tag: "Firma",
    title: "Monograma y revisión",
    body: "Grabamos tu monograma en caliente, en golpe seco o lámina de oro, y revisamos la pieza completa antes de empacarla.",
    detail: "Hasta 12 caracteres",
  },
];

const CARE = [
  {
    tag: "01 / Limpieza",
    title: "Paño de algodón seco o apenas húmedo",
    body: "Para quitar polvo o manchas leves, pasa un paño suave sin pelusa, como mucho humedecido con agua. Nunca uses toallitas con alcohol ni limpiadores fuertes. Déjala secar al aire.",
  },
  {
    tag: "02 / Hidratación",
    title: "Crema o cera para cuero cada 3 a 6 meses",
    body: "Aplica una capa muy fina con movimientos circulares, retira el exceso y deja reposar la billetera unas horas. Así el cuero conserva su flexibilidad y no se agrieta.",
  },
  {
    tag: "03 / Humedad",
    title: "Si se moja, sécala a la sombra",
    body: "Sácale las tarjetas y déjala abierta a temperatura ambiente. No uses secadora de pelo ni la pongas al sol: el calor directo reseca el cuero y lo vuelve quebradizo.",
  },
];

/** Línea fina de separación, como en el diseño (sin tarjetas). */
const hairline = "border-outline-variant/60";

export default function CraftPage() {
  return (
    <>
      {/* ------------------------------------------- 00 · Manifiesto */}
      <section className="canvas pt-10 pb-16 lg:pt-14 lg:pb-20">
        <div
          className={cn(
            "flex flex-col justify-between gap-2 border-b pb-6 md:flex-row md:items-baseline",
            hairline,
          )}
        >
          <p className="flex items-center gap-2.5 eyebrow tracking-[0.25em] text-cafe">
            <span className="h-2 w-2 rounded-full bg-cafe" />
            Taller Kushtal · Cómo trabajamos
          </p>
          <p className="eyebrow tracking-widest text-outline">
            Artesanía y cuidado
          </p>
        </div>

        <div className="grid gap-8 pt-10 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-7">
            <h1 className="font-display text-[38px] leading-[46px] font-normal tracking-[-0.02em] text-piedra md:text-[52px] md:leading-[58px]">
              Hecha a mano,
              <br className="hidden sm:inline" />{" "}
              <span className="italic text-cafe">pensada para durar.</span>
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <span className="rounded-sm bg-torogoz/12 px-3 py-1 eyebrow text-torogoz-ink">
                Hecha bajo pedido
              </span>
              <span className="eyebrow tracking-wider text-outline">
                Sin producción en serie
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:col-span-5 lg:pt-2">
            <p className="text-[18px] leading-[30px] text-piedra">
              Cada billetera se corta, cose y termina a mano cuando haces tu
              pedido. No producimos en serie ni acumulamos inventario: tu pieza
              empieza a hacerse cuando terminas de diseñarla.
            </p>
            <p className="text-[15px] leading-[26px] text-ink-muted">
              Trabajamos el cuero para que envejezca bien. Con el uso toma una
              pátina propia que registra tus viajes y tu forma de usarla.
            </p>
          </div>
        </div>

        <dl
          className={cn(
            "mt-12 grid gap-6 border-t pt-8 sm:grid-cols-3",
            hairline,
          )}
        >
          {FACTS.map((fact) => (
            <div key={fact.eyebrow} className="flex flex-col gap-1">
              <dt className="eyebrow tracking-[0.15em] text-cafe">
                {fact.eyebrow}
              </dt>
              <dd className="text-[15px] font-medium text-piedra">
                {fact.title}
              </dd>
              <dd className="text-[13px] text-ink-muted">{fact.note}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ------------------------------------------- 01 · Pieles y forros */}
      <section className="bg-surface-container/60 py-16 lg:py-24">
        <div className="canvas">
          <div className="mb-14 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow tracking-[0.2em] text-cafe">
                Sección 01 / Materiales
              </p>
              <h2 className="mt-2 font-display text-[28px] leading-9 text-piedra">
                Pieles y texturas
              </h2>
            </div>
            <p className="flex items-center text-[15px] leading-[26px] text-ink-muted lg:col-span-8 lg:pl-6">
              Trabajamos con cuero que no esconde su origen: reacciona a la luz,
              absorbe los aceites de tus manos y desarrolla una pátina
              irrepetible. Cada tipo tiene un tacto y una forma de envejecer
              distinta; los cuatro se eligen en el configurador.
            </p>
          </div>

          <div className="flex flex-col gap-14">
            {FEATURED_LEATHERS.map((leather, i) => (
              <article
                key={leather.n}
                className={cn(
                  "grid items-center gap-6 border-b pb-10 lg:grid-cols-12",
                  hairline,
                )}
              >
                <span className="hidden font-display text-[22px] font-light text-outline-variant lg:col-span-1 lg:block">
                  {leather.n}
                </span>
                <div
                  className={cn(
                    "relative aspect-square w-full max-w-[420px] overflow-hidden rounded-sm lg:col-span-4",
                    i % 2 === 1 && "lg:order-last",
                  )}
                >
                  <Image
                    src={leather.image}
                    alt={`Detalle de ${leather.name.toLowerCase()}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 420px"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
                <div
                  className={cn(
                    "flex flex-col gap-3 lg:col-span-7",
                    i % 2 === 1 ? "lg:pr-6" : "lg:pl-6",
                  )}
                >
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="eyebrow tracking-widest text-cafe">
                      {leather.name}
                    </span>
                    <span className="eyebrow tracking-wider text-outline">
                      {leather.meta}
                    </span>
                  </div>
                  <h3 className="font-display text-[22px] leading-[30px] font-medium text-piedra">
                    {leather.title}
                  </h3>
                  <p className="text-[15px] leading-[26px] text-ink-muted">
                    {leather.body}
                  </p>
                  <ul className="flex flex-wrap gap-x-5 gap-y-1 pt-1 text-[12px] font-semibold text-ink-muted">
                    {leather.specs.map((spec) => (
                      <li key={spec}>· {spec}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}

            <div className="grid gap-6 pt-2 lg:grid-cols-2">
              {OTHER_LEATHERS.map((leather) => (
                <article
                  key={leather.n}
                  className={cn("flex flex-col gap-4 border-b pb-10", hairline)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="eyebrow tracking-widest text-cafe">
                      {leather.n} · {leather.name}
                    </span>
                    <span className="eyebrow text-outline">{leather.meta}</span>
                  </div>
                  <h3 className="font-display text-[22px] leading-[30px] font-medium text-piedra">
                    {leather.title}
                  </h3>
                  <p className="text-[15px] leading-[26px] text-ink-muted">
                    {leather.body}
                  </p>
                  <ul className="flex flex-wrap gap-x-6 gap-y-1 pt-1 text-[12px] font-semibold text-cafe">
                    {leather.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>

          {/* Forros */}
          <div className={cn("mt-16 border-t pt-16", hairline)}>
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="eyebrow tracking-[0.2em] text-cafe">
                  Por dentro
                </p>
                <h3 className="mt-2 font-display text-[28px] leading-9 text-piedra">
                  Forros de tela
                </h3>
              </div>
              <p className="max-w-md text-[13px] leading-5 text-ink-muted">
                El interior recibe el mismo cuidado que el exterior. Elige el
                forro en el configurador: es lo que ves cada vez que abres tu
                billetera.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {LININGS.map((lining) => (
                <div
                  key={lining.name}
                  className="grid items-center gap-4 sm:grid-cols-12"
                >
                  <div className="relative aspect-square overflow-hidden rounded-sm sm:col-span-5">
                    <Image
                      src={lining.image}
                      alt={`Forro ${lining.name.toLowerCase()}`}
                      fill
                      sizes="(max-width: 640px) 100vw, 240px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 sm:col-span-7">
                    <span className="eyebrow tracking-wider text-cafe">
                      {lining.eyebrow}
                    </span>
                    <h4 className="text-[18px] leading-[26px] font-bold text-piedra">
                      {lining.name}
                    </h4>
                    <p className="text-[13px] leading-5 text-ink-muted">
                      {lining.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------- 02 · Proceso */}
      <section className="canvas py-16 lg:py-24">
        <div
          className={cn(
            "flex flex-col justify-between gap-4 border-b pb-6 md:flex-row md:items-end",
            hairline,
          )}
        >
          <div>
            <p className="eyebrow tracking-[0.2em] text-cafe">
              Sección 02 / En el taller
            </p>
            <h2 className="mt-2 font-display text-[32px] leading-[40px] text-piedra md:text-[40px] md:leading-[48px]">
              Cómo se hace tu billetera
            </h2>
          </div>
          <p className="eyebrow tracking-wider text-outline">4 pasos</p>
        </div>

        <ol className="grid gap-10 pt-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {STEPS.map((step) => (
            <li key={step.n} className="flex flex-col gap-4">
              <div
                className={cn(
                  "flex items-baseline justify-between border-b pb-2",
                  hairline,
                )}
              >
                <span className="font-display text-[40px] leading-[48px] font-light text-cafe">
                  {step.n}
                </span>
                <span className="eyebrow tracking-wider text-outline">
                  {step.tag}
                </span>
              </div>
              <h3 className="font-display text-[22px] leading-[30px] font-medium text-piedra">
                {step.title}
              </h3>
              <p className="text-[15px] leading-[26px] text-ink-muted">
                {step.body}
              </p>
              <p className="pt-1 text-[12px] font-semibold text-piedra">
                {step.detail}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-14 grid items-center gap-6 rounded-sm bg-surface-container p-6 lg:grid-cols-12 lg:p-8">
          <div className="lg:col-span-4">
            <p className="eyebrow tracking-widest text-cafe">
              La costura a mano
            </p>
            <h4 className="mt-1 text-[18px] leading-[26px] font-bold text-piedra">
              ¿Por qué no la cosemos a máquina?
            </h4>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
            <div className="flex flex-col gap-1">
              <span className="text-[12px] font-bold tracking-[0.05em] text-piedra">
                Costura a mano (dos agujas)
              </span>
              <p className="text-[13px] leading-5 text-ink-muted">
                Dos hilos independientes se cruzan en cada orificio. Si uno se
                corta, el resto de la costura sigue firme.
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[12px] font-semibold tracking-[0.05em] text-outline">
                Costura de máquina
              </span>
              <p className="text-[13px] leading-5 text-ink-muted">
                Un hilo de arriba y uno de abajo enlazados. Si se rompe un
                punto, la costura se puede ir soltando poco a poco.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------- 03 · Cuidado */}
      <section className="bg-surface-high/40 py-16 lg:py-24">
        <div className="canvas grid items-start gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="flex flex-col gap-4 lg:sticky lg:top-28 lg:col-span-5">
            <p className="eyebrow tracking-[0.2em] text-cafe">
              Sección 03 / Cuidado
            </p>
            <h2 className="font-display text-[32px] leading-[40px] text-piedra md:text-[40px] md:leading-[48px]">
              Cómo cuidarla:
              <br />
              <span className="italic text-cafe">acompañar la pátina</span>
            </h2>
            <p className="text-[15px] leading-[26px] text-ink-muted">
              El cuero no necesita cuidados complicados, solo entender que es
              un material vivo. Con estas tres pautas tu billetera se mantiene
              flexible durante años.
            </p>
            <Link
              href="/garantia"
              className="inline-flex items-center gap-2 pt-2 eyebrow tracking-wider text-cafe hover:text-anil"
            >
              <ShieldCheck size={16} strokeWidth={1.8} />
              1 año de garantía en costuras y herrajes
            </Link>
          </div>

          <div className="flex flex-col gap-8 lg:col-span-7 lg:pl-6">
            {CARE.map((item, i) => (
              <div
                key={item.tag}
                className={cn(
                  "flex flex-col gap-1.5 pb-8",
                  i < CARE.length - 1 && cn("border-b", hairline),
                )}
              >
                <span className="eyebrow tracking-widest text-cafe">
                  {item.tag}
                </span>
                <h3 className="font-display text-[22px] leading-[30px] font-medium text-piedra">
                  {item.title}
                </h3>
                <p className="text-[15px] leading-[26px] text-ink-muted">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------- 04 · Cierre */}
      <section className="canvas py-16 lg:py-24">
        <div className="flex flex-col items-center text-center">
          <p className="eyebrow tracking-[0.25em] text-cafe">
            Tu historia grabada en cuero
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-[32px] leading-[40px] text-piedra md:text-[48px] md:leading-[56px]">
            Diseña una pieza hecha solo para ti.
          </h2>
          <p className="mt-4 max-w-xl text-[18px] leading-[30px] text-ink-muted">
            Elige el cuero, el forro, los herrajes y los accesorios, y agrega tu
            monograma en nuestro configurador. Desde $50.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <ButtonLink
              href="/personalizar/bifold-signature-atelier"
              size="lg"
            >
              Abrir el configurador
            </ButtonLink>
            <ButtonLink href="/coleccion" variant="ghost" size="lg">
              Ver la colección
            </ButtonLink>
          </div>
          <p className="mt-12 flex flex-wrap justify-center gap-x-5 gap-y-2 eyebrow tracking-widest text-outline">
            <span>Hecho a mano</span>
            <span>·</span>
            <span>Envíos a todo El Salvador</span>
            <span>·</span>
            <span>1 año de garantía</span>
          </p>
        </div>
      </section>
    </>
  );
}
