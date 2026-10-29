import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Mail, MapPin, Package, Scissors, Truck } from "lucide-react";

import { Badge, Eyebrow } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { getOrderByNumber, STATUS_LABELS } from "@/lib/db/orders";
import { formatDate, formatPrice, formatPriceUSD } from "@/lib/format";
import { resolveShipping } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Pedido confirmado",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

const TIMELINE = [
  {
    icon: Check,
    title: "Encargo recibido",
    body: "Tu configuración quedó registrada y la revisamos antes de cortar.",
  },
  {
    icon: Scissors,
    title: "Corte y grabado",
    body: "Cortamos la piel que elegiste y grabamos tu monograma en caliente.",
  },
  {
    icon: Package,
    title: "Costura y embalaje",
    body: "Costura a dos agujas, acabado de cantos y el empaque que elegiste.",
  },
  {
    icon: Truck,
    title: "Envío",
    body: "Salida del taller con seguimiento. De 4 a 6 días hábiles en total.",
  },
];

interface PageProps {
  params: Promise<{ number: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function OrderPage({ params, searchParams }: PageProps) {
  const { number } = await params;
  const sp = await searchParams;
  const token = Array.isArray(sp.t) ? sp.t[0] : sp.t;

  const order = await getOrderByNumber(number, token).catch(() => null);
  if (!order) notFound();

  const status = STATUS_LABELS[order.status] ?? STATUS_LABELS.pending;
  const shipping = resolveShipping(order.shipping_method);
  const address = order.shipping_address;

  return (
    <div className="canvas py-12 lg:py-16">
      {/* ------------------------------------------- Confirmación */}
      <div className="mx-auto max-w-2xl text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-torogoz/15 text-torogoz-ink">
          <Check size={26} strokeWidth={2.2} />
        </span>

        <Eyebrow className="mt-6 text-center">{status.label}</Eyebrow>

        <h1 className="mt-3 font-display text-[32px] leading-10 font-semibold text-piedra md:text-[44px] md:leading-[54px]">
          Gracias, {address.first_name}. Tu encargo está en marcha.
        </h1>

        <p className="mt-4 text-[15px] leading-6 text-ink-muted">
          {status.note} Te enviamos la confirmación a{" "}
          <strong className="text-piedra">{order.email}</strong> y te
          avisaremos cuando tu pieza salga del taller.
        </p>

        <div className="mt-7 inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-lg border border-outline-variant/70 bg-surface-lowest px-6 py-4">
          <div>
            <p className="eyebrow text-ink-muted">Número de pedido</p>
            <p className="mt-1 font-display text-xl font-semibold tracking-wider text-piedra">
              {order.order_number}
            </p>
          </div>
          <span className="hidden h-9 w-px bg-outline-variant sm:block" />
          <div>
            <p className="eyebrow text-ink-muted">Fecha</p>
            <p className="mt-1 text-[14px] font-semibold text-piedra">
              {formatDate(order.created_at)}
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------- Ritual */}
      <section className="mt-16">
        <Eyebrow>Qué sigue en el taller</Eyebrow>
        <ol className="mt-5 grid gap-4 md:grid-cols-4">
          {TIMELINE.map((step, index) => (
            <li
              key={step.title}
              className="rounded-xl border border-outline-variant/70 bg-surface-lowest p-5"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-surface-high text-cafe">
                  <step.icon size={16} strokeWidth={1.7} />
                </span>
                <span className="font-display text-lg font-semibold text-outline-variant">
                  0{index + 1}
                </span>
              </div>

              <p className="mt-4 font-display text-[17px] leading-6 font-semibold text-piedra">
                {step.title}
              </p>
              <p className="mt-1.5 text-[12px] leading-4 text-ink-muted">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* ------------------------------------------- Detalle */}
      <div className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
        <section>
          <h2 className="font-display text-[26px] font-semibold text-piedra">
            Piezas de tu encargo
          </h2>

          <ul className="mt-5 flex flex-col divide-y divide-outline-variant/60 rounded-xl border border-outline-variant/70 bg-surface-lowest px-6">
            {order.items.map((item) => {
              const engraving = item.details.find(
                (d) => d.group_code === "grabado",
              );
              const specs = item.details.filter(
                (d) => d.group_code !== "grabado",
              );

              return (
                <li key={item.id} className="flex gap-5 py-6">
                  <Link
                    href={`/personalizar/${item.product_slug}`}
                    className="relative aspect-4/5 w-24 shrink-0 overflow-hidden rounded-lg bg-surface-container"
                  >
                    {item.product_image && (
                      <Image
                        src={item.product_image}
                        alt={item.product_name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    )}
                  </Link>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-display text-lg leading-6 font-semibold text-piedra">
                        {item.product_name}
                      </h3>
                      <p className="shrink-0 font-display text-lg font-semibold text-piedra tabular-nums">
                        {formatPrice(item.unit_price_cents * item.quantity)}
                      </p>
                    </div>

                    {specs.length > 0 && (
                      <dl className="mt-3 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
                        {specs.map((d) => (
                          <div
                            key={d.group_code}
                            className="flex items-center gap-2 text-[12px]"
                          >
                            <dt className="text-ink-muted">{d.group_label}:</dt>
                            <dd className="flex items-center gap-1.5 font-medium text-piedra">
                              {d.hex && (
                                <span
                                  className="h-3 w-3 rounded-full border border-piedra/15"
                                  style={{ backgroundColor: d.hex }}
                                />
                              )}
                              {d.value_label}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      {engraving && (
                        <Badge tone="craft">
                          Grabado: &ldquo;{engraving.value_label}&rdquo;
                        </Badge>
                      )}
                      <span className="text-[12px] text-ink-muted">
                        Cantidad: {item.quantity}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <aside className="flex flex-col gap-5">
          <div className="rounded-xl border border-outline-variant/70 bg-surface-lowest p-6">
            <h2 className="font-display text-xl font-semibold text-piedra">
              Totales
            </h2>

            <dl className="mt-4 flex flex-col gap-2.5 text-[14px]">
              <div className="flex justify-between">
                <dt className="text-ink-muted">Subtotal</dt>
                <dd className="font-medium text-piedra tabular-nums">
                  {formatPriceUSD(order.subtotal_cents)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">{shipping.label}</dt>
                <dd className="font-medium text-piedra tabular-nums">
                  {order.shipping_cents === 0
                    ? "Cortesía"
                    : formatPrice(order.shipping_cents)}
                </dd>
              </div>
            </dl>

            <div className="mt-4 flex items-end justify-between gap-4 border-t border-outline-variant/60 pt-4">
              <p className="font-display text-lg font-semibold text-piedra">
                Total del pedido
              </p>
              <p className="font-display text-[24px] leading-7 font-semibold text-piedra tabular-nums">
                {formatPriceUSD(order.total_cents)}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-outline-variant/70 bg-surface-lowest p-6">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-piedra">
              <MapPin size={16} strokeWidth={1.7} className="text-cafe" />
              Destino
            </h2>

            <address className="mt-3 text-[13px] leading-5 not-italic text-ink-muted">
              <strong className="block text-piedra">
                {address.first_name} {address.last_name}
              </strong>
              {address.address}
              <br />
              {[address.city, address.department].filter(Boolean).join(", ")}
              {address.postal_code && ` · CP ${address.postal_code}`}
              <br />
              {address.phone}
            </address>

            <p className="mt-4 flex items-center gap-2 border-t border-outline-variant/60 pt-4 text-[12px] text-ink-muted">
              <Mail size={13} strokeWidth={1.7} />
              {order.email}
            </p>
          </div>

          <ButtonLink href="/coleccion" variant="outline" className="w-full">
            Seguir explorando la colección
          </ButtonLink>
        </aside>
      </div>
    </div>
  );
}
