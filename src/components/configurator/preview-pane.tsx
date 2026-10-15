"use client";

import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/format";
import type { ProductWithOptions } from "@/lib/types";

/**
 * Lienzo del configurador.
 *
 * No es un render 3D: tiñe la fotografía del producto con el tono elegido
 * usando mezcla de capas, y estampa el monograma sobre la piel. Es honesto
 * con lo que la foto puede mostrar y se siente vivo al cambiar opciones.
 * Cuando tengas una foto por tono, cambiá `tintStyle` por la imagen real.
 */
export function PreviewPane({
  product,
  toneHex,
  toneLabel,
  textureLabel,
  threadHex,
  engraving,
  engravingFinish,
}: {
  product: ProductWithOptions;
  toneHex: string | null;
  toneLabel: string | null;
  textureLabel: string | null;
  threadHex: string | null;
  engraving: string;
  engravingFinish: "golpe-seco" | "foil-oro" | null;
}) {
  const isGold = engravingFinish === "foil-oro";

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-4/5 overflow-hidden rounded-xl border border-outline-variant/70 bg-surface-container sm:aspect-square lg:aspect-4/5">
        {product.hero_image && (
          <Image
            src={product.hero_image}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover"
          />
        )}

        {/* Tinte del tono elegido sobre la piel */}
        {toneHex && (
          <div
            aria-hidden
            className="absolute inset-0 transition-colors duration-500"
            style={{
              backgroundColor: toneHex,
              mixBlendMode: "color",
              opacity: 0.78,
            }}
          />
        )}

        {/* Recupera profundidad que el tinte plano se come */}
        {toneHex && (
          <div
            aria-hidden
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              background:
                "radial-gradient(130% 90% at 30% 20%, rgba(255,255,255,.16), transparent 60%)",
              mixBlendMode: "soft-light",
            }}
          />
        )}

        {/* Monograma estampado */}
        {engraving && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-[18%]">
            <span
              className={cn(
                "font-display text-3xl font-semibold tracking-[0.18em] transition-all duration-300 sm:text-4xl",
                isGold ? "text-[#D9B14B]" : "text-[#1c1512]",
              )}
              style={
                isGold
                  ? {
                      textShadow:
                        "0 1px 0 rgba(255,245,210,.55), 0 2px 5px rgba(0,0,0,.45)",
                    }
                  : {
                      opacity: 0.55,
                      textShadow:
                        "0 1px 0 rgba(255,255,255,.22), 0 -1px 2px rgba(0,0,0,.35)",
                    }
              }
            >
              {engraving}
            </span>
          </div>
        )}

        {/* Hilo del pespunte, como cinta en el borde inferior */}
        {threadHex && (
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1.5 transition-colors duration-500"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, ${threadHex} 0 10px, transparent 10px 18px)`,
              opacity: 0.85,
            }}
          />
        )}

        <span className="absolute left-3 top-3">
          <Badge tone="neutral">Vista previa del atelier</Badge>
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-lg border border-outline-variant/70 bg-surface-lowest px-4 py-3">
        <Spec label="Tono" value={toneLabel} swatch={toneHex} />
        <Spec label="Textura" value={textureLabel} />
        <Spec label="Pespunte" value={null} swatch={threadHex} />
        {engraving && <Spec label="Monograma" value={engraving} />}
      </div>

      <p className="text-[12px] leading-4 text-ink-muted">
        La vista previa aproxima el tono y el monograma sobre la silueta real.
        El color definitivo depende del lote de piel y su pátina natural.
      </p>
    </div>
  );
}

function Spec({
  label,
  value,
  swatch,
}: {
  label: string;
  value?: string | null;
  swatch?: string | null;
}) {
  if (!value && !swatch) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="eyebrow text-ink-muted">{label}</span>
      {swatch && (
        <span
          className="h-3.5 w-3.5 rounded-full border border-piedra/15"
          style={{ backgroundColor: swatch }}
        />
      )}
      {value && (
        <span className="text-[13px] font-medium text-piedra">{value}</span>
      )}
    </div>
  );
}
