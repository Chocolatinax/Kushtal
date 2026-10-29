import type { Metadata } from "next";

import { InfoPage } from "@/components/layout/info-page";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  alternates: { canonical: "/terminos" },
};

export default function TermsPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Términos y condiciones"
      intro="Al comprar en Kushtal aceptas estas condiciones. Las escribimos en lenguaje claro; si algo no se entiende, escríbenos."
      sections={[
        {
          title: "Precios y pagos",
          body: (
            <p>
              Los precios están en dólares estadounidenses e incluyen IVA. El
              precio de cada pieza es el precio base del modelo más los
              elementos que personalizas, y queda fijo al agregarla a tu bolsa.
            </p>
          ),
        },
        {
          title: "Productos personalizados",
          body: (
            <p>
              Fabricamos cada pieza según tu configuración. Revisa el monograma
              antes de confirmar: lo grabamos tal como lo escribes. El color
              final puede variar ligeramente respecto a la vista previa por el
              lote de piel.
            </p>
          ),
        },
        {
          title: "Envíos, devoluciones y garantía",
          body: (
            <p>
              Se rigen por lo descrito en nuestras páginas de envíos y
              devoluciones y de garantía.
            </p>
          ),
        },
        {
          title: "Derechos del consumidor",
          body: (
            <p>
              Nada en estos términos limita los derechos que te reconoce la Ley
              de Protección al Consumidor de El Salvador.
            </p>
          ),
        },
      ]}
    />
  );
}
