"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { AlertCircle, Check, Loader2, ShoppingBag } from "lucide-react";

import { addToCart } from "@/app/actions/cart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PreviewPane } from "./preview-pane";
import { cn, formatPrice, formatPriceUSD } from "@/lib/format";
import {
  defaultConfiguration,
  missingRequiredGroups,
  normalizeEngraving,
  previewPrice,
} from "@/lib/pricing";
import type { Configuration, OptionGroup, ProductWithOptions } from "@/lib/types";

export function Configurator({ product }: { product: ProductWithOptions }) {
  const router = useRouter();
  const groups = product.option_groups;

  const [config, setConfig] = useState<Configuration>(() =>
    defaultConfiguration(groups),
  );
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [errorField, setErrorField] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [pending, startTransition] = useTransition();

  const unitPrice = useMemo(
    () => previewPrice(groups, product.base_price_cents, config),
    [groups, product.base_price_cents, config],
  );

  const missing = useMemo(
    () => missingRequiredGroups(groups, config),
    [groups, config],
  );

  const extras = useMemo(() => {
    const rows: { label: string; value: string; delta: number }[] = [];

    for (const group of groups) {
      const code = config[group.code];
      if (!code) continue;

      if (group.type === "engraving") {
        if (group.price_delta_cents !== 0 || code) {
          rows.push({
            label: group.label,
            value: normalizeEngraving(code),
            delta: group.price_delta_cents,
          });
        }
        continue;
      }

      const value = group.values.find((v) => v.code === code);
      if (value && value.price_delta_cents !== 0) {
        rows.push({
          label: group.label,
          value: value.label,
          delta: value.price_delta_cents,
        });
      }
    }

    return rows;
  }, [groups, config]);

  function choose(groupCode: string, value: string) {
    setConfig((prev) => ({ ...prev, [groupCode]: value }));
    setAdded(false);
    if (errorField === groupCode) {
      setError(null);
      setErrorField(null);
    }
  }

  function handleAdd() {
    setError(null);
    setErrorField(null);

    if (missing.length > 0) {
      setError(`Falta elegir: ${missing[0].label}`);
      setErrorField(missing[0].code);
      document
        .getElementById(`grupo-${missing[0].code}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    startTransition(async () => {
      const result = await addToCart({
        slug: product.slug,
        quantity,
        config,
      });

      if (!result.ok) {
        setError(result.error ?? "No se pudo agregar a tu bolsa");
        setErrorField(result.field ?? null);
        return;
      }

      setAdded(true);
      router.refresh();
    });
  }

  // Lo que necesita la vista previa
  const toneGroup = groups.find((g) => g.code === "tono");
  const tone = toneGroup?.values.find((v) => v.code === config.tono);
  const textureGroup = groups.find((g) => g.code === "textura");
  const texture = textureGroup?.values.find((v) => v.code === config.textura);
  const threadGroup = groups.find((g) => g.code === "hilo");
  const thread = threadGroup?.values.find((v) => v.code === config.hilo);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-14">
      {/* ------------------------------------------- Lienzo */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <PreviewPane
          product={product}
          toneHex={tone?.hex ?? null}
          toneLabel={tone?.label ?? null}
          textureLabel={texture?.label ?? null}
          threadHex={thread?.hex ?? null}
          engraving={normalizeEngraving(config.grabado ?? "")}
          engravingFinish={
            (config.grabado_acabado as "golpe-seco" | "foil-oro" | undefined) ??
            null
          }
        />
      </div>

      {/* ------------------------------------------- Opciones */}
      <div>
        <div className="flex flex-col gap-10">
          {groups.map((group) => (
            <OptionGroupBlock
              key={group.id}
              group={group}
              selected={config[group.code] ?? ""}
              invalid={errorField === group.code}
              onChange={(value) => choose(group.code, value)}
            />
          ))}
        </div>

        {/* ------------------------------------------- Resumen */}
        <div className="mt-10 rounded-xl border border-outline-variant/70 bg-surface-lowest p-6">
          <p className="eyebrow text-cafe">Resumen de tu pieza</p>

          <dl className="mt-4 flex flex-col gap-2.5 text-[14px]">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-ink-muted">
                {product.name} · silueta base
              </dt>
              <dd className="font-medium text-piedra">
                {formatPrice(product.base_price_cents)}
              </dd>
            </div>

            {extras.map((row) => (
              <div
                key={`${row.label}-${row.value}`}
                className="flex items-baseline justify-between gap-4"
              >
                <dt className="text-ink-muted">
                  {row.label}
                  <span className="ml-1.5 text-piedra">{row.value}</span>
                </dt>
                <dd className="font-medium text-piedra">
                  {row.delta > 0 ? `+${formatPrice(row.delta)}` : "Incluido"}
                </dd>
              </div>
            ))}

            {extras.length === 0 && (
              <p className="text-[13px] text-ink-muted">
                Sin elementos de coste adicional. Grabado y estuche de lino van
                incluidos.
              </p>
            )}
          </dl>

          <div className="mt-5 flex items-end justify-between gap-4 border-t border-outline-variant/60 pt-5">
            <div>
              <p className="eyebrow text-ink-muted">Precio de tu pieza</p>
              <p className="mt-1 font-display text-3xl font-semibold text-piedra tabular-nums">
                {formatPriceUSD(unitPrice)}
              </p>
            </div>

            <QuantityStepper value={quantity} onChange={setQuantity} />
          </div>

          {error && (
            <p
              role="alert"
              className="mt-4 flex items-start gap-2 rounded-sm bg-danger-container px-3 py-2.5 text-[13px] text-danger-ink"
            >
              <AlertCircle size={15} strokeWidth={2} className="mt-px shrink-0" />
              {error}
            </p>
          )}

          <Button
            onClick={handleAdd}
            disabled={pending}
            size="lg"
            className="mt-5 w-full"
          >
            {pending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Añadiendo…
              </>
            ) : added ? (
              <>
                <Check size={16} strokeWidth={2.5} />
                Añadido a tu bolsa
              </>
            ) : (
              <>
                <ShoppingBag size={16} strokeWidth={1.8} />
                Añadir a la bolsa · {formatPrice(unitPrice * quantity)}
              </>
            )}
          </Button>

          {added && (
            <a
              href="/bolsa"
              className="mt-3 block text-center text-[13px] font-semibold text-anil link-underline"
            >
              Ir a la bolsa de compra
            </a>
          )}

          <p className="mt-4 text-center text-[12px] leading-4 text-ink-muted">
            Confección artesanal de 3 a 5 días. Envío de cortesía desde $150.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function OptionGroupBlock({
  group,
  selected,
  invalid,
  onChange,
}: {
  group: OptionGroup;
  selected: string;
  invalid: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset id={`grupo-${group.code}`} className="scroll-mt-28">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <legend className="font-display text-[22px] leading-7 font-semibold text-piedra">
          {group.label}
          {!group.required && (
            <span className="ml-2 align-middle text-[11px] font-sans font-semibold uppercase tracking-wider text-ink-muted">
              Opcional
            </span>
          )}
        </legend>
      </div>

      {group.helper && (
        <p className="mt-1.5 text-[13px] leading-5 text-ink-muted">
          {group.helper}
        </p>
      )}

      <div className={cn("mt-4", invalid && "rounded-lg ring-2 ring-danger/40 ring-offset-4 ring-offset-algodon")}>
        {group.type === "engraving" ? (
          <EngravingInput
            value={selected}
            maxLength={group.max_length ?? 12}
            onChange={onChange}
          />
        ) : group.type === "color" ? (
          <ColorSwatches group={group} selected={selected} onChange={onChange} />
        ) : (
          <OptionCards group={group} selected={selected} onChange={onChange} />
        )}
      </div>
    </fieldset>
  );
}

function ColorSwatches({
  group,
  selected,
  onChange,
}: {
  group: OptionGroup;
  selected: string;
  onChange: (value: string) => void;
}) {
  const active = group.values.find((v) => v.code === selected);

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {group.values.map((value) => {
          const isActive = value.code === selected;
          return (
            <button
              key={value.id}
              type="button"
              onClick={() => onChange(value.code)}
              aria-pressed={isActive}
              title={value.label}
              className={cn(
                "group relative grid h-12 w-12 place-items-center rounded-full border transition-all",
                isActive
                  ? "border-anil ring-2 ring-anil/30 ring-offset-2 ring-offset-algodon"
                  : "border-piedra/15 hover:scale-105",
              )}
              style={{ backgroundColor: value.hex ?? "#CCC" }}
            >
              {isActive && (
                <Check
                  size={18}
                  strokeWidth={3}
                  className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,.5)]"
                />
              )}
            </button>
          );
        })}
      </div>

      {active && (
        <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="label-pill text-piedra">{active.label}</p>
          {active.price_delta_cents > 0 ? (
            <Badge tone="craft">+{formatPrice(active.price_delta_cents)}</Badge>
          ) : (
            <Badge tone="eco">Incluido</Badge>
          )}
          {active.description && (
            <p className="w-full text-[13px] text-ink-muted">
              {active.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function OptionCards({
  group,
  selected,
  onChange,
}: {
  group: OptionGroup;
  selected: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {group.values.map((value) => {
        const isActive = value.code === selected;
        return (
          <button
            key={value.id}
            type="button"
            onClick={() => onChange(value.code)}
            aria-pressed={isActive}
            className={cn(
              "flex flex-col rounded-lg border p-4 text-left transition-all",
              isActive
                ? "border-anil border-[1.5px] bg-anil/[0.04] shadow-[0_0_0_3px_rgb(30_43_79_/_0.07)]"
                : "border-outline-variant bg-surface-lowest hover:border-anil/50 hover:-translate-y-px",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="label-pill text-piedra">{value.label}</span>
              {isActive && (
                <Check size={15} strokeWidth={3} className="shrink-0 text-anil" />
              )}
            </div>

            {value.description && (
              <span className="mt-1.5 text-[12px] leading-4 text-ink-muted">
                {value.description}
              </span>
            )}

            <span
              className={cn(
                "mt-3 text-[13px] font-semibold",
                value.price_delta_cents > 0 ? "text-cafe" : "text-torogoz-ink",
              )}
            >
              {value.price_delta_cents > 0
                ? `+${formatPrice(value.price_delta_cents)}`
                : "Incluido"}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function EngravingInput({
  value,
  maxLength,
  onChange,
}: {
  value: string;
  maxLength: number;
  onChange: (value: string) => void;
}) {
  const clean = normalizeEngraving(value);

  return (
    <div>
      <div className="relative">
        <input
          type="text"
          value={value}
          maxLength={maxLength}
          placeholder="M.V.R."
          aria-label="Texto del monograma"
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-sm border border-outline-variant bg-surface-container px-4 py-3.5 font-display text-xl tracking-[0.12em] text-ink uppercase placeholder:text-ink-muted/40 placeholder:normal-case focus:border-anil focus:border-[1.5px] focus:outline-none focus:shadow-[0_0_0_3px_rgb(30_43_79_/_0.08)]"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] tabular-nums text-ink-muted">
          {clean.length}/{maxLength}
        </span>
      </div>

      <p className="mt-2 text-[12px] text-ink-muted">
        Letras, números y los signos . &amp; &apos; -. Se graba en versalitas
        sobre la cara interior.
      </p>
    </div>
  );
}

function QuantityStepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="flex items-center rounded-sm border border-outline-variant">
      <button
        type="button"
        aria-label="Quitar una unidad"
        disabled={value <= 1}
        onClick={() => onChange(Math.max(1, value - 1))}
        className="grid h-10 w-10 place-items-center text-lg text-ink-muted transition-colors hover:text-anil disabled:opacity-30"
      >
        −
      </button>
      <span className="w-8 text-center text-[15px] font-semibold tabular-nums text-piedra">
        {value}
      </span>
      <button
        type="button"
        aria-label="Añadir una unidad"
        disabled={value >= 10}
        onClick={() => onChange(Math.min(10, value + 1))}
        className="grid h-10 w-10 place-items-center text-lg text-ink-muted transition-colors hover:text-anil disabled:opacity-30"
      >
        +
      </button>
    </div>
  );
}
