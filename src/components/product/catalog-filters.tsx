"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { Search, X } from "lucide-react";

import { cn } from "@/lib/format";

/** Mismos codes que el grupo "textura" del configurador. */
const TEXTURES = [
  { code: "all", label: "Todas las pieles" },
  { code: "vacuna-lisa", label: "Cuero vacuno liso" },
  { code: "grano-natural", label: "Piel de grano entero" },
  { code: "curtido-vegetal", label: "Curtido vegetal" },
  { code: "crazy-horse", label: "Cuero Crazy Horse" },
];

const SORTS = [
  { code: "popular", label: "Destacados" },
  { code: "name", label: "Nombre (A–Z)" },
  { code: "new", label: "Novedades primero" },
];

const DEFAULTS: Record<string, string> = {
  categoria: "todas",
  textura: "all",
  orden: "popular",
  q: "",
};

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
    textura: params.get("textura") ?? "all",
    orden: params.get("orden") ?? "popular",
    q: params.get("q") ?? "",
  };

  const [query, setQuery] = useState(current.q);

  const setParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value === DEFAULTS[key]) {
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

  const hasFilters =
    current.textura !== "all" || current.q !== "";

  return (
    <div
      className={cn(
        "rounded-xl border border-outline-variant/70 bg-surface-lowest transition-opacity",
        pending && "opacity-60",
      )}
    >
      {/* Categorías + buscador */}
      <div className="flex flex-wrap items-center gap-2 border-b border-outline-variant/60 p-4">
        <button
          type="button"
          onClick={() => setParam("categoria", "todas")}
          aria-pressed={current.categoria === "todas"}
          className={chip(current.categoria === "todas")}
        >
          Todas ({total})
        </button>

        {categories.map((cat) => (
          <button
            key={cat.code}
            type="button"
            onClick={() => setParam("categoria", cat.code)}
            aria-pressed={current.categoria === cat.code}
            disabled={cat.count === 0 && current.categoria !== cat.code}
            className={chip(current.categoria === cat.code)}
          >
            {cat.label} ({cat.count})
          </button>
        ))}

        <form
          role="search"
          className="relative w-full sm:ml-auto sm:w-64"
          onSubmit={(e) => {
            e.preventDefault();
            setParam("q", query.trim());
          }}
        >
          <Search
            size={15}
            strokeWidth={1.8}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
          />
          <input
            id="buscar"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={() => query.trim() !== current.q && setParam("q", query.trim())}
            placeholder="Buscar billeteras o tarjeteros"
            aria-label="Buscar en la colección"
            className="w-full scroll-mt-28 rounded-full border border-outline-variant bg-surface-container py-2 pl-9 pr-3 text-[13px] text-ink placeholder:text-ink-muted/70 focus:border-anil focus:outline-none"
          />
        </form>
      </div>

      {/* Piel + orden. Sin filtro de tono: cada modelo tiene sus propios colores. */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4 p-4">
        <label className="flex items-center gap-2">
          <span className="eyebrow text-ink-muted">Piel</span>
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

        {hasFilters && (
          <button
            type="button"
            onClick={() =>
              startTransition(() => {
                const next = new URLSearchParams(params.toString());
                next.delete("textura");
                next.delete("q");
                const qs = next.toString();
                router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
              })
            }
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-cafe hover:text-anil"
          >
            <X size={13} strokeWidth={2} />
            Limpiar filtros
          </button>
        )}

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
    "rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40",
    active
      ? "border-anil bg-anil text-algodon"
      : "border-outline-variant bg-transparent text-ink-muted hover:border-anil hover:text-anil",
  );
}
