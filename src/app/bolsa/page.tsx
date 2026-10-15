import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Hourglass, ShieldCheck } from "lucide-react";

import { CartLine } from "@/components/cart/cart-line";
import { ProductCard } from "@/components/product/product-card";
import { Badge, Eyebrow } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { getCart } from "@/lib/db/cart";
import { getFeaturedProducts } from "@/lib/db/products";
import { formatPrice, formatPriceUSD } from "@/lib/format";
import { qualifiesForFreeShipping } from "@/lib/pricing";
import type { Cart } from "@/lib/types";

export const metadata: Metadata = {
  title: "Tu Bolsa de Compra",
};

export const dynamic = "force-dynamic";

export default async function CartPage() {
  let cart: Cart;

  try {
    cart = await getCart();
  } catch {
    cart = {
      id: "",
      items: [],
      subtotal_cents: 0,
      shipping_cents: 0,
      total_cents: 0,
      item_count: 0,
      free_shipping_threshold_cents: 15000,
    };
  }

  const suggestions = await getFeaturedProducts(3).catch(() => []);
  const freeShipping = qualifiesForFreeShipping(cart.subtotal_cents);
  const missingForFree = cart.free_shipping_threshold_cents - cart.subtotal_cents;

  if (cart.items.length === 0) {
    return (
      <div className="canvas py-16 lg:py-24">
        <Eyebrow>Atelier de marroquinería</Eyebrow>
        <h1 className="mt-3 font-display text-[30px] leading-[38px] font-semibold text-piedra md:text-[40px]">
          Tu bolsa está vacía
        </h1>
        <p className="mt-3 max-w-md text-[15px] leading-6 text-ink-muted">
          Todavía no has configurado ninguna pieza. Elegí una silueta y hacela
          tuya: tono, textura, pespunte y monograma.
        </p>

        <ButtonLink href="/coleccion" size="lg" className="mt-7">
          Explorar la colección
          <ArrowRight size={15} strokeWidth={2} />
        </ButtonLink>

        {suggestions.length > 0 && (
          <section className="mt-20">
            <Eyebrow>Arquetipos del taller</Eyebrow>
            <h2 className="mt-2 font-display text-[26px] font-semibold text-piedra">
              Creaciones icónicas
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {suggestions.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  return (
    <div className="canvas py-10 lg:py-14">
      <nav aria-label="Migas de pan" className="eyebrow text-ink-muted">
        <Link href="/" className="hover:text-anil">
          Atelier de marroquinería
        </Link>
        <span className="mx-2 opacity-50">/</span>
        <span className="text-cafe">Pedido privado</span>
      </nav>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-5">
        <h1 className="font-display text-[30px] leading-[38px] font-semibold text-piedra md:text-[40px] md:leading-[48px]">
          Tu Bolsa de Compra
          <span className="ml-3 font-sans text-base font-normal text-ink-muted">
            ({cart.item_count}{" "}
            {cart.item_count === 1 ? "pieza artesanal" : "piezas artesanales"})
          </span>
        </h1>

        <p className="rounded-full bg-surface-high px-5 py-2.5 text-[13px] text-ink-muted">
          {freeShipping ? (
            <>
              Tienes <strong className="text-anil">envío gratuito</strong> y
              grabado de cortesía incluido
            </>
          ) : (
            <>
              Te faltan{" "}
              <strong className="text-anil">{formatPrice(missingForFree)}</strong>{" "}
              para el envío de cortesía
            </>
          )}
        </p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-14">
        {/* ------------------------------------------- Líneas */}
        <div>
          <div className="rounded-xl border border-outline-variant/70 bg-surface-lowest px-6">
            {cart.items.map((item) => (
              <CartLine key={item.id} item={item} />
            ))}
          </div>

          <div className="mt-6 flex items-start gap-4 rounded-xl bg-surface-high/70 p-5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface-lowest text-cafe">
              <Hourglass size={17} strokeWidth={1.6} />
            </span>

            <div className="flex-1">
              <p className="font-display text-lg font-semibold text-piedra">
                Tiempo de confección artesanal estimado
              </p>
              <p className="mt-1 text-[13px] leading-5 text-ink-muted">
                Cada pieza personalizada se corta, estampa y cose pacientemente
                a mano en nuestro taller. Envío programado en 4 a 6 días
                hábiles.
              </p>
            </div>

            <Badge tone="craft" className="shrink-0">
              Trazabilidad 100%
            </Badge>
          </div>
        </div>

        {/* ------------------------------------------- Resumen */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-outline-variant/70 bg-surface-lowest p-6">
            <h2 className="font-display text-[22px] font-semibold text-piedra">
              Resumen del pedido
            </h2>

            <dl className="mt-5 flex flex-col gap-3 text-[14px]">
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
                <dd className="text-ink-muted">Se calculan al pagar</dd>
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
              <p className="font-display text-[28px] leading-8 font-semibold text-piedra tabular-nums">
                {formatPriceUSD(cart.total_cents)}
              </p>
            </div>

            <ButtonLink href="/checkout" size="lg" className="mt-6 w-full">
              Continuar al pago seguro
              <ArrowRight size={15} strokeWidth={2} />
            </ButtonLink>

            <ButtonLink
              href="/coleccion"
              variant="outline"
              className="mt-3 w-full"
            >
              Seguir explorando
            </ButtonLink>

            <p className="mt-5 flex items-start gap-2 text-[12px] leading-4 text-ink-muted">
              <ShieldCheck size={14} strokeWidth={1.7} className="mt-px shrink-0 text-torogoz" />
              Al confirmar tu pedido, nuestro maestro guarnicionero iniciará la
              preparación de tus cueros.
            </p>
          </div>
        </aside>
      </div>

      {suggestions.length > 0 && (
        <section className="mt-20 border-t border-outline-variant/60 pt-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>Cuidado y complementos</Eyebrow>
              <h2 className="mt-2 font-display text-[26px] leading-8 font-semibold text-piedra md:text-[32px]">
                También te podría gustar
              </h2>
            </div>
            <p className="max-w-sm text-[13px] leading-5 text-ink-muted">
              Añade accesorios confeccionados con los mismos estándares de
              longevidad para enriquecer la experiencia de tu pedido.
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {suggestions.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
