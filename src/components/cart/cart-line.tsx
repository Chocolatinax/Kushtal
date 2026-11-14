"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Check, Gift, Loader2, Trash2 } from "lucide-react";

import {
  removeCartItem,
  setCartItemGift,
  updateCartItemQuantity,
} from "@/app/actions/cart";
import { Badge } from "@/components/ui/badge";
import { cn, formatPrice } from "@/lib/format";
import type { CartItem } from "@/lib/types";

export function CartLine({ item }: { item: CartItem }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function setQuantity(quantity: number) {
    startTransition(async () => {
      await updateCartItemQuantity({ itemId: item.id, quantity });
      router.refresh();
    });
  }

  function remove() {
    startTransition(async () => {
      await removeCartItem(item.id);
      router.refresh();
    });
  }

  function toggleGift(gift: boolean) {
    startTransition(async () => {
      await setCartItemGift({ itemId: item.id, gift });
      router.refresh();
    });
  }

  const isGift = Boolean(item.gift && item.config.estuche === item.gift.code);
  const engraving = item.details.find((d) => d.group_code === "grabado");
  // El empaque se muestra como el botón de regalo, no en la lista.
  const specs = item.details.filter(
    (d) => d.group_code !== "grabado" && !(item.gift && d.group_code === "estuche"),
  );

  return (
    <article
      className={cn(
        "flex flex-col gap-4 border-b border-outline-variant/60 py-6 transition-opacity last:border-b-0 sm:flex-row sm:gap-5",
        pending && "opacity-50",
      )}
    >
      <Link
        href={`/personalizar/${item.product.slug}`}
        className="relative aspect-4/3 w-full shrink-0 overflow-hidden rounded-lg bg-surface-container sm:aspect-4/5 sm:w-32"
      >
        {item.product.hero_image && (
          <Image
            src={item.product.hero_image}
            alt={item.product.name}
            fill
            sizes="(max-width: 640px) 100vw, 128px"
            className="object-cover"
          />
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="eyebrow text-cafe">{item.product.tagline}</p>
            <h3 className="mt-1 font-display text-lg leading-6 font-semibold text-piedra">
              <Link
                href={`/personalizar/${item.product.slug}`}
                className="hover:text-anil"
              >
                {item.product.name}
              </Link>
            </h3>
          </div>

          <p className="shrink-0 font-display text-lg font-semibold text-piedra tabular-nums">
            {formatPrice(item.unit_price_cents * item.quantity)}
          </p>
        </div>

        {specs.length > 0 && (
          <ul className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5">
            {specs.map((d) => (
              <li
                key={d.group_code}
                className="flex items-center gap-1.5 text-[14px] sm:text-[12px] text-ink-muted"
              >
                {d.hex && (
                  <span
                    className="h-3 w-3 rounded-full border border-piedra/15"
                    style={{ backgroundColor: d.hex }}
                  />
                )}
                <span className="text-piedra">{d.value_label}</span>
              </li>
            ))}
          </ul>
        )}

        {engraving && (
          <p className="mt-3">
            <Badge tone="craft">Grabado: &ldquo;{engraving.value_label}&rdquo;</Badge>
          </p>
        )}

        {/* Opción de regalo visible en la bolsa: en las pruebas no se veía
            al final del configurador. */}
        {item.gift && (
          <button
            type="button"
            role="switch"
            aria-checked={isGift}
            disabled={pending}
            onClick={() => toggleGift(!isGift)}
            className={cn(
              "mt-3 flex w-fit items-start gap-2 rounded-lg border px-3 py-2 text-left text-[14px] leading-5 font-semibold transition-colors",
              isGift
                ? "border-cafe bg-cafe-container text-cafe"
                : "border-dashed border-cafe/60 text-piedra hover:bg-cafe-container/50",
            )}
          >
            {isGift ? (
              <Check size={16} strokeWidth={2.5} className="mt-0.5 shrink-0 text-cafe" aria-hidden />
            ) : (
              <Gift size={16} strokeWidth={1.8} className="mt-0.5 shrink-0 text-cafe" aria-hidden />
            )}
            <span>
              {isGift ? (
                <>Para regalo: {item.gift.label}</>
              ) : (
                <>
                  ¿Es un regalo? Añadir {item.gift.label.toLowerCase()}{" "}
                  <span className="text-cafe">
                    (+{formatPrice(item.gift.price_delta_cents)})
                  </span>
                </>
              )}
            </span>
          </button>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-4">
          <div className="flex items-center rounded-sm border border-outline-variant">
            <button
              type="button"
              aria-label="Quitar una unidad"
              disabled={pending || item.quantity <= 1}
              onClick={() => setQuantity(item.quantity - 1)}
              className="grid h-8 w-8 place-items-center text-ink-muted transition-colors hover:text-anil disabled:opacity-30"
            >
              −
            </button>
            <span className="w-7 text-center text-[14px] font-semibold tabular-nums text-piedra">
              {pending ? (
                <Loader2 size={12} className="mx-auto animate-spin" />
              ) : (
                item.quantity
              )}
            </span>
            <button
              type="button"
              aria-label="Añadir una unidad"
              disabled={pending || item.quantity >= 10}
              onClick={() => setQuantity(item.quantity + 1)}
              className="grid h-8 w-8 place-items-center text-ink-muted transition-colors hover:text-anil disabled:opacity-30"
            >
              +
            </button>
          </div>

          <p className="text-[14px] sm:text-[12px] text-ink-muted">
            {formatPrice(item.unit_price_cents)} c/u
          </p>

          <button
            type="button"
            onClick={remove}
            disabled={pending}
            className="ml-auto inline-flex items-center gap-1.5 text-[14px] sm:text-[12px] font-semibold text-ink-muted transition-colors hover:text-danger-ink"
          >
            <Trash2 size={13} strokeWidth={1.8} />
            Quitar
          </button>
        </div>
      </div>
    </article>
  );
}
