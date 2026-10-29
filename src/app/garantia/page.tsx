import type { Metadata } from "next";

import { InfoPage } from "@/components/layout/info-page";

export const metadata: Metadata = {
  title: "Garantía",
  description:
    "Todas las billeteras Kushtal tienen 1 año de garantía en costuras y herrajes por defectos de fabricación.",
  alternates: { canonical: "/garantia" },
};

export default function WarrantyPage() {
  return (
    <InfoPage
      eyebrow="Garantía"
      title="1 año de garantía en costuras y herrajes"
      intro="Si tu billetera presenta un defecto de fabricación durante el primer año, la reparamos o la cambiamos sin costo."
      sections={[
        {
          title: "Qué cubre",
          body: (
            <p>
              Costuras que se abren, herrajes o cremalleras que fallan, y
              grabados que se desprenden por un defecto de fabricación.
            </p>
          ),
        },
        {
          title: "Qué no cubre",
          body: (
            <p>
              El desgaste normal, la pátina y los cambios de tono propios del
              cuero, los daños por agua, calor o golpes, y las reparaciones
              hechas fuera de Kushtal.
            </p>
          ),
        },
        {
          title: "Cómo usarla",
          body: (
            <p>
              Escríbenos con tu número de pedido y fotos del problema. Te
              respondemos en un máximo de 48 horas hábiles con los pasos a
              seguir.
            </p>
          ),
        },
      ]}
    />
  );
}
