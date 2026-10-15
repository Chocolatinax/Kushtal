import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatPriceUSD } from "@/lib/format";
import type { Product } from "@/lib/types";

const TONE_HEX: Record<string, string> = {
  caramelo: "#A9672F",
  chocolate: "#3B2318",
  azabache: "#17161A",
  indigo: "#1E2B4F",
  salvia: "#77876B",
};

export function ProductCard({ product }: { product: Product }) {
  const visibleTones = product.tones.slice(0, 4);
  const rest = product.tones.length - visibleTones.length;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-outline-variant/70 bg-surface-lowest transition-all duration-300 hover:-translate-y-0.5 hover:shadow-warm">
      <Link
        href={`/personalizar/${product.slug}`}
        className="relative block aspect-4/5 overflow-hidden bg-surface-container"
      >
        {product.hero_image ? (
          <Image
            src={product.hero_image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-ink-muted">
            <span className="eyebrow">Sin fotografía</span>
          </div>
        )}

        {product.badge && (
          <span className="absolute left-3 top-3">
            <Badge tone={product.badge.toLowerCase().includes("novedad") ? "eco" : "neutral"}>
              {product.badge}
            </Badge>
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between gap-3">
          <p className="eyebrow text-cafe">{product.tagline}</p>
          {product.capacity_label && (
            <p className="eyebrow text-ink-muted">{product.capacity_label}</p>
          )}
        </div>

        <h3 className="mt-2 font-display text-[22px] leading-7 font-semibold text-piedra">
          <Link href={`/personalizar/${product.slug}`} className="hover:text-anil">
            {product.name}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 text-[13px] leading-5 text-ink-muted">
          {product.description}
        </p>

        <div className="mt-4 flex items-center gap-1.5">
          {visibleTones.map((tone) => (
            <span
              key={tone}
              title={tone}
              className="h-3.5 w-3.5 rounded-full border border-piedra/15"
              style={{ backgroundColor: TONE_HEX[tone] ?? "#CCC" }}
            />
          ))}
          {rest > 0 && (
            <span className="ml-1 text-[11px] text-ink-muted">+{rest} tonos</span>
          )}
        </div>

        <div className="mt-5 flex items-end justify-between gap-3 border-t border-outline-variant/60 pt-4">
          <div>
            <p className="eyebrow text-ink-muted">Con grabado incluido</p>
            <p className="mt-1 font-display text-lg font-semibold text-piedra">
              Desde {formatPriceUSD(product.base_price_cents)}
            </p>
          </div>

          <Link
            href={`/personalizar/${product.slug}`}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-sm bg-anil px-4 text-[13px] font-semibold text-algodon transition-colors hover:bg-anil-deep"
          >
            Personalizar
            <ArrowRight size={14} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </article>
  );
}
