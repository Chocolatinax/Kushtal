"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";

import { removeCartItem, updateCartItemQuantity } from "@/app/actions/cart";
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

  const engraving = item.details.find((d) => d.group_code === "grabado");
  const specs = item.details.filter((d) => d.group_code !== "grabado");

  return (
    <article
      className={cn(
        "flex gap-5 border-b border-outline-variant/60 py-6 transition-opacity last:border-b-0",
        pending && "opacity-50",
      )}
    >
      <Link
        href={`/personalizar/${item.product.slug}`}
        className="relative aspect-4/5 w-24 shrink-0 overflow-hidden rounded-lg bg-surface-container sm:w-32"
      >
        {item.product.hero_image && (
          <Image
            src={item.product.hero_image}
            alt={item.product.name}
            fill
            sizes="128px"
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
                className="flex items-center gap-1.5 text-[12px] text-ink-muted"
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

        <div className="mt-auto flex items-center gap-4 pt-4">
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

          <p className="text-[12px] text-ink-muted">
            {formatPrice(item.unit_price_cents)} c/u
          </p>

          <button
            type="button"
            onClick={remove}
            disabled={pending}
            className="ml-auto inline-flex items-center gap-1.5 text-[12px] font-semibold text-ink-muted transition-colors hover:text-danger-ink"
          >
            <Trash2 size={13} strokeWidth={1.8} />
            Quitar
          </button>
        </div>
      </div>
    </article>
  );
}
