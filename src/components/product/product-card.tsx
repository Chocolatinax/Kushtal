import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { RFID_MODELS } from "@/lib/catalog-routes";
import { formatPriceUSD } from "@/lib/format";
import type { Product } from "@/lib/types";

const TONES: Record<string, { label: string; hex: string }> = {
  caramelo: { label: "Caramelo tostado", hex: "#A9672F" },
  chocolate: { label: "Marrón chocolate", hex: "#3B2318" },
  azabache: { label: "Negro azabache", hex: "#17161A" },
  indigo: { label: "Azul añil", hex: "#1E2B4F" },
  salvia: { label: "Verde salvia", hex: "#77876B" },
};

/**
 * `href` permite entrar al configurador con un preset (ver catalog-routes).
 * `rfid`: "included" cuando la tarjeta abre la versión con bloqueo RFID;
 * si no se indica, los modelos que existen con RFID muestran un enlace a esa
 * versión (en las pruebas costaba encontrar qué modelos lo traen).
 * `rfidDeltaCents`: lo que suma el RFID cuando viene incluido, para que el
 * "Desde" coincida con el precio que muestra el configurador.
 */
export function ProductCard({
  product,
  href = `/personalizar/${product.slug}`,
  rfid,
  rfidDeltaCents = 0,
}: {
  product: Product;
  href?: string;
  rfid?: "included" | "none";
  rfidDeltaCents?: number;
}) {
  const fromPrice =
    product.base_price_cents + (rfid === "included" ? rfidDeltaCents : 0);
  const rfidAvailable = rfid !== "none" && RFID_MODELS.includes(product.slug);
  const visibleTones = product.tones.slice(0, 4);
  const rest = product.tones.length - visibleTones.length;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-outline-variant/70 bg-surface-lowest transition-all duration-300 hover:-translate-y-0.5 hover:shadow-warm">
      <Link
        href={href}
        className="relative block aspect-4/5 overflow-hidden bg-surface-container"
      >
        {product.hero_image ? (
          <Image
            src={product.hero_image}
            alt={`${product.name}, ${product.tagline ?? "billetera"} de cuero personalizable`}
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

        {rfidAvailable && (
          rfid === "included" ? (
            <p className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-torogoz/15 px-2.5 py-1 label-pill text-torogoz-ink">
              <ShieldCheck size={14} strokeWidth={2} aria-hidden />
              Con bloqueo RFID
            </p>
          ) : (
            <Link
              href={`/personalizar/${product.slug}?rfid=si`}
              className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-torogoz/15 px-2.5 py-1 label-pill text-torogoz-ink transition-colors hover:bg-torogoz/25"
            >
              <ShieldCheck size={14} strokeWidth={2} aria-hidden />
              Disponible con bloqueo RFID
            </Link>
          )
        )}

        <h3 className="mt-2 font-display text-[22px] leading-7 font-semibold text-piedra">
          <Link href={href} className="hover:text-anil">
            {product.name}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 text-[14px] sm:text-[13px] leading-5 text-ink-muted">
          {product.description}
        </p>

        <div
          className="mt-4 flex items-center gap-1.5"
          aria-label={`Tonos: ${product.tones.map((t) => TONES[t]?.label ?? t).join(", ")}`}
        >
          {visibleTones.map((tone) => (
            <span
              key={tone}
              title={TONES[tone]?.label ?? tone}
              className="h-3.5 w-3.5 rounded-full border border-piedra/15"
              style={{ backgroundColor: TONES[tone]?.hex ?? "#CCC" }}
            />
          ))}
          {rest > 0 && (
            <span className="ml-1 text-[14px] sm:text-[11px] text-ink-muted">+{rest} tonos</span>
          )}
        </div>

        <div className="mt-5 flex items-end justify-between gap-3 border-t border-outline-variant/60 pt-4">
          <div>
            <p className="eyebrow text-ink-muted">
              {fromPrice > product.base_price_cents
                ? "Con grabado y RFID incluidos"
                : "Con grabado incluido"}
            </p>
            <p className="mt-1 font-display text-lg font-semibold text-piedra">
              Desde {formatPriceUSD(fromPrice)}
            </p>
          </div>

          <Link
            href={href}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-sm bg-anil px-4 text-[14px] sm:text-[13px] font-semibold text-algodon transition-colors hover:bg-anil-deep"
          >
            Personalizar
            <ArrowRight size={14} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </article>
  );
}
