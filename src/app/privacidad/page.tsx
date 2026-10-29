import type { Metadata } from "next";

import { InfoPage } from "@/components/layout/info-page";

export const metadata: Metadata = {
  title: "Política de privacidad",
  alternates: { canonical: "/privacidad" },
};

export default function PrivacyPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Política de privacidad"
      intro="Solo pedimos los datos necesarios para hacer y entregar tu pedido."
      sections={[
        {
          title: "Qué datos guardamos",
          body: (
            <p>
              Tu nombre, correo, teléfono y dirección de entrega, y el detalle
              de las piezas que compras. Si entras con Google, también tu
              nombre y foto de perfil.
            </p>
          ),
        },
        {
          title: "Para qué los usamos",
          body: (
            <p>
              Para fabricar y entregar tu pedido, informarte de su estado y
              atender garantías. No vendemos ni compartimos tus datos con
              terceros, salvo la empresa de envíos y la pasarela de pago, solo
              en lo necesario.
            </p>
          ),
        },
        {
          title: "Pagos",
          body: (
            <p>
              Los pagos con tarjeta se procesan en Stripe. Los datos de tu
              tarjeta nunca pasan por nuestros servidores.
            </p>
          ),
        },
        {
          title: "Tus derechos",
          body: (
            <p>
              Puedes pedirnos en cualquier momento que corrijamos o borremos tus
              datos escribiéndonos desde la página de contacto.
            </p>
          ),
        },
      ]}
    />
  );
}
