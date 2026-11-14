import { Truck } from "lucide-react";

import { cn, formatPrice } from "@/lib/format";
import { shippingCostCents } from "@/lib/pricing";
import { FREE_SHIPPING_THRESHOLD_CENTS, SHIPPING_OPTIONS } from "@/lib/types";

/**
 * Costo y tiempo de envío antes del checkout, con lo que falta para el envío
 * gratis. En las pruebas de usabilidad la gente tenía que llegar al final del
 * carrito (o sumar a mano) para saber cuánto pagaría de envío.
 *
 * Sin hooks: sirve en la bolsa (servidor) y en el configurador (cliente).
 */
export function ShippingEstimate({
  subtotalCents,
  context = "bag",
  showProgress = true,
  className,
}: {
  /** Lo que habría en la bolsa (en el configurador incluye la pieza actual). */
  subtotalCents: number;
  /** En el configurador el mensaje habla de "esta pieza". */
  context?: "bag" | "product";
  /** En la bolsa el "te faltan $X" ya está arriba: aquí solo costos y tiempos. */
  showProgress?: boolean;
  className?: string;
}) {
  const missing = Math.max(0, FREE_SHIPPING_THRESHOLD_CENTS - subtotalCents);
  const progress = Math.min(1, subtotalCents / FREE_SHIPPING_THRESHOLD_CENTS);

  return (
    <div
      className={cn(
        "rounded-lg border border-outline-variant/70 bg-surface-container p-4",
        className,
      )}
    >
      {showProgress && (
      <>
      <p className="flex items-start gap-2 text-[15px] leading-5 font-semibold text-piedra">
        <Truck size={18} strokeWidth={1.7} className="mt-px shrink-0 text-torogoz" aria-hidden />
        {missing === 0 ? (
          <span>
            {context === "product" ? "Con esta pieza, tu " : "Tu "}
            envío estándar es <span className="text-torogoz-ink">gratis</span>
          </span>
        ) : (
          <span>
            Te faltan <span className="text-anil">{formatPrice(missing)}</span>{" "}
            para envío gratis
            {context === "product" && (
              <span className="font-normal text-ink-muted"> (contando esta pieza)</span>
            )}
          </span>
        )}
      </p>

      <div
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-highest"
        role="progressbar"
        aria-label="Avance hacia el envío gratis"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
      >
        <div
          className="h-full rounded-full bg-torogoz transition-[width] duration-500"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      </>
      )}

      <dl className={cn("flex flex-col gap-2 text-[14px] leading-5", showProgress && "mt-3")}>
        {SHIPPING_OPTIONS.map((option) => {
          const cost = shippingCostCents(subtotalCents, option.code);
          return (
            <div key={option.code} className="flex items-start justify-between gap-3">
              <dt className="text-ink-muted">
                <span className="font-semibold text-piedra">
                  {option.code === "express" ? "Express" : "Estándar"}
                </span>
                {" · "}
                {option.eta}
              </dt>
              <dd
                className={cn(
                  "shrink-0 font-semibold tabular-nums",
                  cost === 0 ? "text-torogoz-ink" : "text-piedra",
                )}
              >
                {cost === 0 ? "Gratis" : formatPrice(cost)}
              </dd>
            </div>
          );
        })}
      </dl>

      <p className="mt-2 text-[14px] leading-5 text-ink-muted">
        Envío estándar gratis desde {formatPrice(FREE_SHIPPING_THRESHOLD_CENTS)} a
        todo El Salvador.
      </p>
    </div>
  );
}
