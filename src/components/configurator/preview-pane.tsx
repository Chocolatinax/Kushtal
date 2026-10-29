"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  Banknote,
  Camera,
  ChevronLeft,
  ChevronRight,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/format";
import type { ProductWithOptions } from "@/lib/types";
import type { VariantImages } from "@/lib/variant-images";

/** Una elección del configurador, con su foto de detalle si existe. */
export interface PreviewDetail {
  group: string;
  groupLabel: string;
  code: string;
  label: string;
  hex: string | null;
}

/** Lo que la vista previa muestra. Sale de la configuración actual. */
export interface PreviewState {
  toneCode: string | null;
  toneLabel: string | null;
  toneHex: string | null;
  /** Piel, forro, herrajes y accesorios elegidos, en ese orden. */
  details: PreviewDetail[];
  engraving: string;
  engravingFinishLabel: string | null;
}

const ACCESSORY_ICONS: Record<string, typeof ShieldCheck> = {
  rfid: ShieldCheck,
  airtag: MapPin,
  clip: Banknote,
};

/** Foto principal: la del modelo en el tono elegido, o la original. */
export function mainImageFor(
  product: ProductWithOptions,
  images: VariantImages,
  toneCode: string | null,
): { src: string | null; exact: boolean } {
  const exact = toneCode ? images.tones[toneCode] : undefined;
  return { src: exact ?? product.hero_image, exact: Boolean(exact) };
}

/**
 * Lienzo del configurador.
 *
 * Todo lo que se ve son fotografías reales, en un carrusel: la del modelo en
 * el tono elegido y las fotos de detalle de la piel, el forro, los herrajes y
 * los accesorios. No hay tintes ni capas sobre la foto. Las fotos salen de
 * public/configurador/ (ver src/lib/variant-images.ts).
 */
export function PreviewPane({
  product,
  images,
  state,
}: {
  product: ProductWithOptions;
  images: VariantImages;
  state: PreviewState;
}) {
  const main = mainImageFor(product, images, state.toneCode);

  // Diapositivas: la foto del modelo y luego cada detalle que tenga foto.
  // Se identifican por grupo, así al cambiar la piel la diapositiva de piel
  // sigue elegida y muestra la foto nueva.
  const slides: Slide[] = [
    {
      id: "modelo",
      src: main.src,
      alt:
        main.exact && state.toneLabel
          ? `${product.name} en ${state.toneLabel}`
          : product.name,
      caption: null,
    },
    ...state.details.flatMap((detail) => {
      const src = images.details[detail.group]?.[detail.code];
      return src
        ? [
            {
              id: detail.group,
              src,
              alt: `${detail.groupLabel}: ${detail.label}`,
              caption: `${detail.groupLabel} · ${detail.label}`,
            },
          ]
        : [];
    }),
  ];

  const [activeId, setActiveId] = useState("modelo");

  // Al cambiar de color se vuelve a la foto del modelo para ver el cambio.
  const [prevTone, setPrevTone] = useState(state.toneCode);
  if (prevTone !== state.toneCode) {
    setPrevTone(state.toneCode);
    setActiveId("modelo");
  }

  // Si la diapositiva elegida desaparece (p. ej. se quitó un accesorio),
  // se muestra la del modelo.
  const index = Math.max(
    0,
    slides.findIndex((s) => s.id === activeId),
  );
  const slide = slides[index];
  const go = (delta: number) =>
    setActiveId(slides[(index + delta + slides.length) % slides.length].id);

  // Deslizar con el dedo en móvil.
  const touchX = useRef<number | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <div
        role="region"
        aria-roledescription="carrusel"
        aria-label="Fotos de tu pieza"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
        onTouchStart={(e) => {
          touchX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          touchX.current = null;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        }}
        className="group relative aspect-square overflow-hidden rounded-xl border border-outline-variant/70 bg-surface-container focus-visible:outline-2 focus-visible:outline-anil lg:aspect-auto lg:h-[min(52vh,560px)]"
      >
        {slide.src && (
          <Image
            // La key fuerza el cambio de foto con un fundido limpio.
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            fill
            priority={slide.id === "modelo"}
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="animate-[fade-in_300ms_ease-out] object-cover"
          />
        )}

        <span className="absolute left-3 top-3">
          <Badge tone="neutral">
            {slide.id !== "modelo"
              ? "Detalle"
              : main.exact
                ? "Tu color"
                : "Foto de referencia"}
          </Badge>
        </span>

        {slide.caption && (
          <span className="absolute bottom-3 left-3 rounded-full bg-algodon/95 px-3 py-1.5 text-[12px] font-semibold text-piedra shadow-sm">
            {slide.caption}
          </span>
        )}

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-algodon/90 text-piedra shadow-sm transition-opacity hover:bg-algodon lg:opacity-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100"
            >
              <ChevronLeft size={20} strokeWidth={1.8} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Foto siguiente"
              className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-algodon/90 text-piedra shadow-sm transition-opacity hover:bg-algodon lg:opacity-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100"
            >
              <ChevronRight size={20} strokeWidth={1.8} />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-piedra/70 px-2.5 py-1 text-[11px] font-semibold text-algodon tabular-nums">
              {index + 1} / {slides.length}
            </span>
          </>
        )}
      </div>

      {!main.exact && state.toneLabel && slide.id === "modelo" && (
        <p className="-mt-1 text-[12px] leading-4 text-ink-muted">
          Esta foto muestra el modelo en otro color. Tu pieza se hará en{" "}
          <strong className="text-piedra">{state.toneLabel}</strong>.
        </p>
      )}

      {/* Miniaturas: tocar una la muestra en grande */}
      <ul className="grid grid-cols-4 gap-2.5 sm:grid-cols-7">
        <Thumb
          active={slide.id === "modelo"}
          onSelect={() => setActiveId("modelo")}
          src={main.src}
          eyebrow="Modelo"
          label={state.toneLabel ?? product.name}
          alt={product.name}
        />
        {state.details.map((detail) => {
          const src = images.details[detail.group]?.[detail.code] ?? null;
          return (
            <Thumb
              key={`${detail.group}-${detail.code}`}
              active={slide.id === detail.group}
              onSelect={src ? () => setActiveId(detail.group) : undefined}
              src={src}
              eyebrow={detail.groupLabel}
              label={detail.label}
              alt={`${detail.groupLabel}: ${detail.label}`}
              fallback={
                ACCESSORY_ICONS[detail.group] ? (
                  (() => {
                    const Icon = ACCESSORY_ICONS[detail.group];
                    return <Icon size={22} strokeWidth={1.5} className="text-anil" />;
                  })()
                ) : detail.hex ? (
                  <span
                    className="h-8 w-8 rounded-full border border-piedra/15"
                    style={{ backgroundColor: detail.hex }}
                  />
                ) : (
                  // Sin foto todavía: un ícono neutro, el nombre ya va debajo.
                  <Camera size={20} strokeWidth={1.4} className="text-outline" />
                )
              }
            />
          );
        })}
      </ul>

      {state.engraving && (
        <div className="flex items-center justify-between gap-4 rounded-lg border border-outline-variant/70 bg-surface-lowest px-4 py-3">
          <span className="eyebrow text-ink-muted">Monograma</span>
          <span className="font-display text-lg font-semibold tracking-[0.18em] text-piedra">
            {state.engraving}
          </span>
          {state.engravingFinishLabel && (
            <span className="text-[12px] text-ink-muted">
              {state.engravingFinishLabel}
            </span>
          )}
        </div>
      )}

      <p className="text-[12px] leading-4 text-ink-muted">
        El color final puede variar levemente según el lote de piel y su pátina
        natural.
      </p>
    </div>
  );
}

interface Slide {
  id: string;
  src: string | null;
  alt: string;
  caption: string | null;
}

function Thumb({
  active,
  onSelect,
  src,
  eyebrow,
  label,
  alt,
  fallback,
}: {
  active: boolean;
  onSelect?: () => void;
  src: string | null;
  eyebrow: string;
  label: string;
  alt: string;
  fallback?: React.ReactNode;
}) {
  return (
    <li className="flex flex-col gap-1.5">
      <button
        type="button"
        onClick={onSelect}
        disabled={!onSelect}
        aria-pressed={active}
        aria-label={`Ver ${alt}`}
        className={cn(
          "relative grid aspect-square place-items-center overflow-hidden rounded-lg border transition-all",
          active
            ? "border-anil ring-2 ring-anil/30 ring-offset-2 ring-offset-algodon"
            : "border-outline-variant/70 enabled:hover:border-anil/50",
          !src && "bg-surface-container",
          onSelect ? "cursor-pointer" : "cursor-default",
        )}
      >
        {src ? (
          <Image src={src} alt="" fill sizes="120px" className="object-cover" />
        ) : (
          fallback
        )}
      </button>
      <p className="eyebrow text-[9px] text-ink-muted">{eyebrow}</p>
      <p className="-mt-1 text-[12px] leading-4 font-medium text-piedra">
        {label}
      </p>
    </li>
  );
}
