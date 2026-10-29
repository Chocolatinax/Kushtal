"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/format";

/** Mismos tonos que el grupo "tono" del configurador, con una foto real. */
const LEATHERS = [
  {
    code: "caramelo",
    name: "Caramelo tostado",
    note: "Curtido tradicional, se oscurece con el uso",
    hex: "#A9672F",
    photo: "/configurador/modelos/bifold-signature-atelier/caramelo.jpg",
    model: "Bifold Signature",
    href: "/personalizar/bifold-signature-atelier?tono=caramelo",
  },
  {
    code: "chocolate",
    name: "Marrón chocolate",
    note: "Profundo y cálido",
    hex: "#3B2318",
    photo: "/configurador/modelos/billetera-continental-roma/chocolate.jpg",
    model: "Billetera Continental Roma",
    href: "/personalizar/billetera-continental-roma?tono=chocolate",
  },
  {
    code: "salvia",
    name: "Verde salvia",
    note: "Tinte botánico de baja saturación",
    hex: "#77876B",
    photo: "/configurador/modelos/tarjetero-atelier-no-01/salvia.jpg",
    model: "Tarjetero No. 01",
    href: "/personalizar/tarjetero-atelier-no-01?tono=salvia",
  },
  {
    code: "indigo",
    name: "Azul añil",
    note: "Mate añil, sereno",
    hex: "#1E2B4F",
    photo: "/configurador/modelos/bifold-signature-atelier/indigo.jpg",
    model: "Bifold Signature",
    href: "/personalizar/bifold-signature-atelier?tono=indigo",
  },
  {
    code: "azabache",
    name: "Negro azabache",
    note: "Acabado mate, sobrio y ejecutivo",
    hex: "#17161A",
    photo: "/configurador/modelos/tarjetero-plegable-slim/azabache.jpg",
    model: "Tarjetero Plegable Slim",
    href: "/personalizar/tarjetero-plegable-slim?tono=azabache",
  },
];

/**
 * "Paleta de cueros" de la home (diseño de Stitch): al elegir un tono se ve
 * un modelo real en ese color y se puede abrir el configurador con él.
 */
export function LeatherPalette() {
  const [active, setActive] = useState(LEATHERS[0].code);
  const leather = LEATHERS.find((l) => l.code === active) ?? LEATHERS[0];

  return (
    <div className="grid items-center gap-6 lg:grid-cols-12">
      <div
        role="radiogroup"
        aria-label="Tonos de cuero"
        className="grid gap-2 sm:grid-cols-2 lg:col-span-7"
      >
        {LEATHERS.map((l, i) => {
          const isActive = l.code === active;
          return (
            <button
              key={l.code}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => setActive(l.code)}
              className={cn(
                "flex items-center gap-3 rounded-lg border p-2 text-left shadow-sm transition-all duration-300",
                i === LEATHERS.length - 1 && "sm:col-span-2",
                isActive
                  ? "border-anil bg-ceniza/50 shadow-md"
                  : "border-ceniza bg-algodon hover:border-cafe",
              )}
            >
              <span
                className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-inner"
                style={{ backgroundColor: l.hex }}
              >
                <span
                  className={cn(
                    "h-3 w-3 rounded-full bg-algodon transition-opacity",
                    isActive ? "opacity-100" : "opacity-0",
                  )}
                />
              </span>
              <span className="flex flex-col">
                <span className="text-[13px] font-semibold tracking-wider text-anil uppercase">
                  {l.name}
                </span>
                <span className="text-[13px] leading-5 text-ink-muted">{l.note}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col justify-between rounded-xl border border-ceniza bg-algodon p-4 shadow-md lg:col-span-5">
        <div className="relative mb-2 aspect-video w-full overflow-hidden rounded-lg bg-ceniza">
          <Image
            key={leather.photo}
            src={leather.photo}
            alt={`${leather.model} en ${leather.name.toLowerCase()}`}
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="animate-[fade-in_300ms_ease-out] object-cover"
          />
          <span className="absolute left-3 top-3 rounded border border-ceniza/80 bg-algodon/90 px-2.5 py-1 text-[9px] font-semibold tracking-wider text-anil uppercase backdrop-blur-sm">
            {leather.model}
          </span>
        </div>
        <div className="flex items-center justify-between pt-2">
          <div>
            <p className="font-display text-[18px] font-medium text-piedra">
              {leather.name}
            </p>
            <p className="text-[13px] text-ink-muted">
              Disponible desde $50 en el configurador.
            </p>
          </div>
          <Link
            href={leather.href}
            aria-label={`Diseñar en ${leather.name.toLowerCase()}`}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-outline-variant text-anil transition-colors hover:border-cafe hover:text-cafe"
          >
            <ArrowRight size={18} strokeWidth={1.8} />
          </Link>
        </div>
      </div>
    </div>
  );
}
