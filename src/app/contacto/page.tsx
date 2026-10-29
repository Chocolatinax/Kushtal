import type { Metadata } from "next";
import { Briefcase, Mail, MessageCircle } from "lucide-react";

import { InfoPage } from "@/components/layout/info-page";
import { CONTACT_EMAIL, WHATSAPP_NUMBER } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Escríbenos por WhatsApp o correo para dudas sobre tu pedido, muestras de piel o pedidos corporativos de billeteras personalizadas.",
  alternates: { canonical: "/contacto" },
};

const CHANNELS = [
  {
    icon: MessageCircle,
    title: "WhatsApp",
    body: "La forma más rápida para dudas sobre tu pedido o tu diseño.",
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
    cta: "Abrir WhatsApp",
    external: true,
  },
  {
    icon: Mail,
    title: "Correo",
    body: "Para garantías, cambios o solicitar muestras de piel.",
    href: `mailto:${CONTACT_EMAIL}`,
    cta: CONTACT_EMAIL,
    external: false,
  },
  {
    icon: Briefcase,
    title: "Pedidos corporativos",
    body: "Billeteras con el logo de tu empresa, a partir de 10 unidades. Te enviamos una cotización.",
    href: `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Pedido corporativo")}`,
    cta: "Pedir cotización",
    external: false,
  },
];

export default function ContactPage() {
  return (
    <InfoPage
      eyebrow="Contacto"
      title="¿En qué te ayudamos?"
      intro="Respondemos de lunes a viernes, de 8:00 a 17:00, en un máximo de 24 horas hábiles."
    >
      <div className="mt-10 grid max-w-4xl gap-5 md:grid-cols-3">
        {CHANNELS.map((channel) => (
          <a
            key={channel.title}
            href={channel.href}
            {...(channel.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="flex flex-col rounded-xl border border-outline-variant/70 bg-surface-lowest p-6 transition-colors hover:border-anil/50"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-torogoz/12 text-torogoz-ink">
              <channel.icon size={18} strokeWidth={1.6} />
            </span>
            <h2 className="mt-4 font-display text-[20px] font-semibold text-piedra">
              {channel.title}
            </h2>
            <p className="mt-2 flex-1 text-[13px] leading-5 text-ink-muted">
              {channel.body}
            </p>
            <span className="mt-4 text-[13px] font-semibold text-anil">
              {channel.cta}
            </span>
          </a>
        ))}
      </div>
    </InfoPage>
  );
}
