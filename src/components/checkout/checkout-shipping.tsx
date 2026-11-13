"use client";

import { createContext, useContext, useState } from "react";

import { formatPrice, formatPriceUSD } from "@/lib/format";
import { resolveShipping, shippingCostCents } from "@/lib/pricing";

/**
 * Comparte el tipo de envío elegido en el formulario con el resumen del
 * pedido (que vive en otra columna), para mostrar su costo y el total.
 */
const ShippingContext = createContext<{
  shipping: string;
  setShipping: (code: string) => void;
  subtotalCents: number;
} | null>(null);

export function CheckoutShippingProvider({
  subtotalCents,
  children,
}: {
  subtotalCents: number;
  children: React.ReactNode;
}) {
  const [shipping, setShipping] = useState("standard");
  return (
    <ShippingContext.Provider value={{ shipping, setShipping, subtotalCents }}>
      {children}
    </ShippingContext.Provider>
  );
}

export function useCheckoutShipping() {
  const ctx = useContext(ShippingContext);
  if (!ctx) {
    throw new Error("useCheckoutShipping va dentro de CheckoutShippingProvider");
  }
  return ctx;
}

/** Fila "Envío" del resumen: nombre corto del envío elegido y su costo. */
export function SummaryShippingRow() {
  const { shipping, subtotalCents } = useCheckoutShipping();
  const cost = shippingCostCents(subtotalCents, shipping);
  const label = resolveShipping(shipping).code === "express" ? "express" : "estándar";

  return (
    <div className="flex justify-between">
      <dt className="text-ink-muted">Envío {label}</dt>
      <dd
        className={
          cost === 0
            ? "text-torogoz-ink"
            : "font-medium text-piedra tabular-nums"
        }
      >
        {cost === 0 ? "Gratis" : formatPrice(cost)}
      </dd>
    </div>
  );
}

/** Total del resumen: subtotal + envío elegido. */
export function SummaryTotal() {
  const { shipping, subtotalCents } = useCheckoutShipping();
  const total = subtotalCents + shippingCostCents(subtotalCents, shipping);
  return <>{formatPriceUSD(total)}</>;
}
