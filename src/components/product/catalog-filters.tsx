"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { SlidersHorizontal } from "lucide-react";

import { cn } from "@/lib/format";

const TONES = [
  { code: "all", label: "Todos", hex: null },
  { code: "indigo", label: "Azul Ceniza Índigo", hex: "#1E2B4F" },
  { code: "chocolate", label: "Marrón Chocolate", hex: "#3B2318" },
  { code: "azabache", label: "Negro Azabache", hex: "#17161A" },
  { code: "caramelo", label: "Caramelo Tostado", hex: "#A9672F" },
  { code: "salvia", label: "Verde Salvia", hex: "#77876B" },
];

const TEXTURES = [
  { code: "all", label: "Todas las texturas" },
  { code: "lisa", label: "Vacuna lisa" },
  { code: "grano", label: "Grano natural" },
];

const SORTS = [
  { code: "popular", label: "Más populares" },
  { code: "price-asc", label: "Precio: menor a mayor" },
  { code: "price-desc", label: "Precio: mayor a menor" },
  { code: "new", label: "Novedades primero" },
];

export function CatalogFilters({
  categories,
  total,
}: {
  categories: { code: string; label: string; count: number }[];
  total: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  const current = {
    categoria: params.get("categoria") ?? "todas",
    tono: params.get("tono") ?? "all",
    textura: params.get("textura") ?? "all",
    orden: params.get("orden") ?? "popular",
  };

  const setParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value === "todas" || value === "all" || value === "popular") {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      const qs = next.toString();
      startTransition(() => {
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    },
    [params, pathname, router],
  );

  return (
    <div
      className={cn(
        "rounded-xl border border-outline-variant/70 bg-surface-lowest transition-opacity",
        pending && "opacity-60",
      )}
    >
      {/* Categorías */}
      <div className="flex flex-wrap items-center gap-2 border-b border-outline-variant/60 p-4">
        <button
          type="button"
          onClick={() => setParam("categoria", "todas")}
          className={chip(current.categoria === "todas")}
        >
          Todas ({total})
        </button>

        {categories.map((cat) => (
          <button
            key={cat.code}
            type="button"
            onClick={() => setParam("categoria", cat.code)}
            className={chip(current.categoria === cat.code)}
          >
            {cat.label} ({cat.count})
          </button>
        ))}

        <span className="ml-auto hidden items-center gap-1.5 eyebrow text-ink-muted sm:flex">
          <SlidersHorizontal size={13} strokeWidth={1.8} />
          Filtrado preciso
        </span>
      </div>

      {/* Tono + textura + orden */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4 p-4">
        <div className="flex items-center gap-2.5">
          <span className="eyebrow text-ink-muted">Tono</span>
          <div className="flex items-center gap-1.5">
            {TONES.map((tone) =>
              tone.hex === null ? (
                <button
                  key={tone.code}
                  type="button"
                  onClick={() => setParam("tono", tone.code)}
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider transition-colors",
                    current.tono === tone.code
                      ? "bg-anil text-algodon"
                      : "text-ink-muted hover:text-anil",
                  )}
                >
                  All
                </button>
              ) : (
                <button
                  key={tone.code}
                  type="button"
                  aria-label={tone.label}
                  title={tone.label}
                  onClick={() => setParam("tono", tone.code)}
                  style={{ backgroundColor: tone.hex }}
                  className={cn(
                    "h-5 w-5 rounded-full border transition-all",
                    current.tono === tone.code
                      ? "border-anil ring-2 ring-anil/25 ring-offset-1 ring-offset-surface-lowest"
                      : "border-piedra/15 hover:scale-110",
                  )}
                />
              ),
            )}
          </div>
        </div>

        <label className="flex items-center gap-2">
          <span className="eyebrow text-ink-muted">Textura</span>
          <select
            value={current.textura}
            onChange={(e) => setParam("textura", e.target.value)}
            className="cursor-pointer rounded-sm border border-outline-variant bg-surface-container px-3 py-1.5 text-[13px] text-ink focus:border-anil focus:outline-none"
          >
            {TEXTURES.map((t) => (
              <option key={t.code} value={t.code}>
                {t.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 sm:ml-auto">
          <span className="eyebrow text-ink-muted">Ordenar por</span>
          <select
            value={current.orden}
            onChange={(e) => setParam("orden", e.target.value)}
            className="cursor-pointer rounded-sm border border-outline-variant bg-surface-container px-3 py-1.5 text-[13px] text-ink focus:border-anil focus:outline-none"
          >
            {SORTS.map((s) => (
              <option key={s.code} value={s.code}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

function chip(active: boolean) {
  return cn(
    "rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors",
    active
      ? "border-anil bg-anil text-algodon"
      : "border-outline-variant bg-transparent text-ink-muted hover:border-anil hover:text-anil",
  );
}
