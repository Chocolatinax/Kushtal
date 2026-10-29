import type { Metadata } from "next";

import { InfoPage } from "@/components/layout/info-page";
import { formatPrice } from "@/lib/format";
import { FREE_SHIPPING_THRESHOLD_CENTS, SHIPPING_OPTIONS } from "@/lib/types";

export const metadata: Metadata = {
  title: "Envíos y devoluciones",
  description:
    "Envíos a los 14 departamentos de El Salvador. Envío estándar gratis desde $75. Tiempos de entrega y política de devoluciones de Kushtal.",
  alternates: { canonical: "/envios" },
};

export default function ShippingPage() {
  return (
    <InfoPage
      eyebrow="Envíos y devoluciones"
      title="Llegamos a todo El Salvador"
      intro={`Enviamos a los 14 departamentos. El envío estándar es gratis en pedidos desde ${formatPrice(FREE_SHIPPING_THRESHOLD_CENTS)}.`}
      sections={[
        {
          title: "Opciones de envío",
          body: (
            <ul className="flex flex-col gap-2">
              {SHIPPING_OPTIONS.map((option) => (
                <li key={option.code}>
                  <strong className="text-piedra">
                    {option.label} · {formatPrice(option.price_cents)}
                  </strong>
                  <br />
                  {option.description}
                </li>
              ))}
            </ul>
          ),
        },
        {
          title: "Tiempos",
          body: (
            <p>
              Cada pieza se hace bajo pedido: de 3 a 5 días hábiles de
              confección, más el tiempo de entrega. Te escribimos cuando tu
              pedido sale del taller.
            </p>
          ),
        },
        {
          title: "Devoluciones",
          body: (
            <>
              <p>
                Como cada billetera se fabrica con tu diseño y tu monograma, no
                aceptamos devoluciones por cambio de opinión.
              </p>
              <p>
                Si tu pieza llega con un defecto de fabricación o no coincide
                con lo que configuraste, escríbenos en los 7 días siguientes a
                la entrega y la reparamos, la cambiamos o te devolvemos el
                dinero.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
