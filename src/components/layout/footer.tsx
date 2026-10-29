import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";

import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
} from "@/components/ui/social-icons";
import { routePath, SILOS } from "@/lib/catalog-routes";
import { CONTACT_EMAIL, SOCIAL_LINKS, WHATSAPP_NUMBER } from "@/lib/site";

const SOCIALS = [
  { href: SOCIAL_LINKS.instagram, label: "Instagram", icon: InstagramIcon },
  { href: SOCIAL_LINKS.tiktok, label: "TikTok", icon: TikTokIcon },
  { href: SOCIAL_LINKS.facebook, label: "Facebook", icon: FacebookIcon },
];

const COLUMNS = [
  {
    title: "Categorías",
    links: [
      ...SILOS.map((s) => ({ label: s.label, href: routePath(s) })),
      { label: "Toda la colección", href: "/coleccion" },
    ],
  },
  {
    title: "Ayuda",
    links: [
      { label: "Artesanía y cuidado del cuero", href: "/artesania" },
      { label: "Envíos y devoluciones", href: "/envios" },
      { label: "Garantía", href: "/garantia" },
      { label: "Contacto", href: "/contacto" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-outline-variant/60 bg-surface-high/50">
      <div className="canvas grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:pr-8">
          <p className="font-display text-xl font-semibold tracking-[0.12em] text-piedra">
            KUSHTAL
          </p>
          <p className="mt-4 max-w-xs text-[13px] leading-5 text-ink-muted">
            Billeteras y tarjeteros de cuero que diseñas tú. Elige cada
            detalle en nuestro configurador y nosotros la hacemos a mano en El
            Salvador.
          </p>

          <p className="mt-8 eyebrow text-ink-muted">Escríbenos</p>
          <div className="mt-3 flex flex-col gap-2 text-[13px]">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-ink-muted transition-colors hover:text-anil"
            >
              <MessageCircle size={15} strokeWidth={1.7} />
              WhatsApp
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 text-ink-muted transition-colors hover:text-anil"
            >
              <Mail size={15} strokeWidth={1.7} />
              {CONTACT_EMAIL}
            </a>
          </div>

          <p className="mt-8 eyebrow text-ink-muted">Síguenos</p>
          <ul className="mt-3 flex items-center gap-2">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Kushtal en ${s.label}`}
                  className="grid h-9 w-9 place-items-center rounded-full border border-outline-variant text-ink-muted transition-colors hover:border-anil hover:text-anil"
                >
                  <s.icon size={17} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="eyebrow text-piedra">{col.title}</p>
            <ul className="mt-5 flex flex-col gap-3">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-ink-muted transition-colors hover:text-anil"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <p className="eyebrow text-piedra">Compromiso</p>
          <p className="mt-5 max-w-xs text-[13px] leading-5 text-ink-muted">
            Cada pieza se hace bajo pedido: no producimos en serie ni
            acumulamos inventario. Envíos a los 14 departamentos.
          </p>
          <p className="mt-4 eyebrow text-cafe">
            Desde $50
            <br />
            Hecho a mano
          </p>
        </div>
      </div>

      <div className="border-t border-outline-variant/60">
        <div className="canvas flex flex-col gap-3 py-5 text-[11px] text-ink-muted sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} Kushtal. Todos los derechos
            reservados.
          </p>
          <div className="flex gap-5 sm:ml-6">
            <Link href="/terminos" className="hover:text-anil">
              Términos
            </Link>
            <Link href="/privacidad" className="hover:text-anil">
              Privacidad
            </Link>
          </div>
          <p className="label-pill text-[10px] sm:ml-auto">
            Pago seguro{" "}
            <span className="ml-3">Visa · Mastercard · Apple Pay · PayPal</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
