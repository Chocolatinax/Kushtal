import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Hand, Leaf, LifeBuoy } from "lucide-react";

import { CheckoutForm } from "@/components/checkout/checkout-form";
import { Badge } from "@/components/ui/badge";
import { getCart } from "@/lib/db/cart";
import { formatPrice, formatPriceUSD } from "@/lib/format";
import { isStripeEnabled } from "@/lib/stripe";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import type { ShippingAddress } from "@/lib/types";

export const metadata: Metadata = {
  title: "Pago Seguro",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

const PROMISES = [
  {
    icon: Hand,
    title: "Confección Artesanal a Mano",
    body: "Cada billetera y tarjetero es cortado y cosido individualmente bajo demanda en nuestro taller.",
  },
  {
    icon: Leaf,
    title: "Embalaje Consciente y Cuidado",
    body: "Cajas rígidas de fibra reciclada, funda de algodón orgánico y sello de cera natural.",
  },
  {
    icon: LifeBuoy,
    title: "Atención Personalizada Posventa",
    body: "Garantía vitalicia en costuras a dos agujas y servicio de acondicionamiento de piel.",
  },
];

export default async function CheckoutPage() {
  const cart = await getCart().catch(() => null);

  if (!cart || cart.items.length === 0) {
    redirect("/bolsa");
  }

  const user = await getCurrentUser().catch(() => null);
  let defaults: Partial<Record<string, string>> = {};

  if (user) {
    const supabase = await createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, phone, default_address")
      .eq("id", user.id)
      .maybeSingle();

    const address = profile?.default_address as ShippingAddress | null;
    const [first, ...rest] = (profile?.full_name ?? "").split(" ");

    defaults = {
      email: user.email ?? "",
      first_name: address?.first_name ?? first ?? "",
      last_name: address?.last_name ?? rest.join(" "),
      address: address?.address ?? "",
      city: address?.city ?? "",
      postal_code: address?.postal_code ?? "",
      phone: address?.phone ?? profile?.phone ?? "",
    };
  }

  return (
    <div className="canvas py-8 lg:py-12">
      {/* Encabezado propio del checkout, sin distracciones */}
      <div className="relative flex items-center justify-center py-4">
        <Link
          href="/bolsa"
          className="absolute left-0 inline-flex items-center gap-2 eyebrow text-ink-muted transition-colors hover:text-anil"
        >
          <ArrowLeft size={14} strokeWidth={2} />
          <span className="hidden sm:inline">Volver a la bolsa</span>
        </Link>

        <div className="text-center">
          <p className="font-display text-2xl font-semibold tracking-[0.14em] text-piedra">
            KUSHTAL
          </p>
          <p className="mt-0.5 eyebrow text-cafe">Atelier de Marroquinería</p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-10">
        <CheckoutForm
          subtotalCents={cart.subtotal_cents}
          stripeEnabled={isStripeEnabled()}
          defaults={defaults}
        />

        <aside className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-outline-variant/70 bg-surface-lowest p-6">
            <header className="flex items-center justify-between gap-3">
              <h2 className="font-display text-[26px] font-semibold text-piedra">
                Resumen del Pedido
              </h2>
              <Badge tone="craft">
                {cart.item_count}{" "}
                {cart.item_count === 1 ? "artículo" : "artículos"}
              </Badge>
            </header>

            <ul className="mt-6 flex flex-col divide-y divide-outline-variant/60">
              {cart.items.map((item) => {
                const engraving = item.details.find(
                  (d) => d.group_code === "grabado",
                );
                const specs = item.details
                  .filter((d) => d.group_code !== "grabado")
                  .slice(0, 2)
                  .map((d) => d.value_label)
                  .join(" • ");

                return (
                  <li key={item.id} className="flex gap-4 py-4 first:pt-0">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-sm bg-surface-container">
                      {item.product.hero_image && (
                        <Image
                          src={item.product.hero_image}
                          alt={item.product.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-display text-[15px] leading-5 font-semibold text-piedra">
                          {item.product.name}
                        </p>
                        <p className="shrink-0 font-display text-[15px] font-semibold text-piedra tabular-nums">
                          {formatPrice(item.unit_price_cents * item.quantity)}
                        </p>
                      </div>

                      {specs && (
                        <p className="mt-1 text-[12px] text-ink-muted">{specs}</p>
                      )}

                      <div className="mt-2 flex items-center justify-between gap-3">
                        {engraving ? (
                          <Badge tone="craft" className="text-[10px]">
                            Grabado: &ldquo;{engraving.value_label}&rdquo;
                          </Badge>
                        ) : (
                          <span />
                        )}
                        <span className="shrink-0 text-[12px] text-ink-muted">
                          Cant: {item.quantity}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <dl className="mt-5 flex flex-col gap-2.5 border-t border-outline-variant/60 pt-5 text-[14px]">
              <div className="flex justify-between">
                <dt className="text-ink-muted">Subtotal marroquinería</dt>
                <dd className="font-medium text-piedra tabular-nums">
                  {formatPriceUSD(cart.subtotal_cents)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">Grabados artesanales</dt>
                <dd className="text-torogoz-ink">Incluidos</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">Costes de envío</dt>
                <dd className="text-ink-muted">Según modalidad</dd>
              </div>
            </dl>

            <div className="mt-5 flex items-end justify-between gap-4 border-t border-outline-variant/60 pt-5">
              <div>
                <p className="font-display text-xl font-semibold text-piedra">
                  Total a abonar
                </p>
                <p className="mt-0.5 text-[12px] text-ink-muted">
                  Impuestos incluidos con factura formal
                </p>
              </div>
              <p className="font-display text-[26px] leading-8 font-semibold text-piedra tabular-nums">
                {formatPriceUSD(cart.total_cents)}
              </p>
            </div>

            <p className="mt-5 text-center text-[12px] leading-4 text-ink-muted">
              Al confirmar tu pedido, nuestro maestro guarnicionero iniciará la
              preparación de tus cueros.
            </p>
          </div>

          <div className="rounded-xl bg-surface-high/70 p-6">
            <ul className="flex flex-col gap-5">
              {PROMISES.map((promise) => (
                <li key={promise.title} className="flex gap-3.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface-lowest text-cafe">
                    <promise.icon size={16} strokeWidth={1.6} />
                  </span>
                  <div>
                    <p className="text-[14px] font-semibold text-piedra">
                      {promise.title}
                    </p>
                    <p className="mt-1 text-[12px] leading-4 text-ink-muted">
                      {promise.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
