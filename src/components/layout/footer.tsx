import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";

const COLUMNS = [
  {
    title: "Explorar",
    links: [
      { label: "Billeteras Bifold", href: "/coleccion?categoria=bifold" },
      { label: "Tarjeteros Minimal", href: "/coleccion?categoria=tarjetero" },
      { label: "Billeteras Largas", href: "/coleccion?categoria=larga" },
      { label: "Configurador Atelier", href: "/personalizar" },
    ],
  },
  {
    title: "Atención al patrón",
    links: [
      { label: "Cuidado y Restauración de Piel", href: "/artesania" },
      { label: "Envíos y Devoluciones", href: "/envios" },
      { label: "Garantía de por Vida", href: "/garantia" },
      { label: "Contacto con el Taller", href: "/contacto" },
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
            Marroquinería de silencio y permanencia. Cada pieza se confecciona a
            mano con pieles de curtición vegetal de procedencia trazable,
            honrando la tradición artesanal y el paso del tiempo.
          </p>

          <p className="mt-8 eyebrow text-ink-muted">El cuaderno de taller</p>
          <form className="mt-3 flex gap-2">
            <Input
              type="email"
              required
              placeholder="Su correo electrónico"
              aria-label="Correo electrónico"
              className="h-10 bg-surface-lowest py-0 text-[13px]"
            />
            <Button type="submit" size="sm" className="shrink-0">
              Suscribirse
            </Button>
          </form>
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
            Trazabilidad íntegra desde curtidurías certificadas en España e
            Italia. Cero mermas sintéticas.
          </p>
          <p className="mt-4 eyebrow text-cafe">
            Piel curtida al vegetal
            <br />
            Hecho a mano
          </p>
        </div>
      </div>

      <div className="border-t border-outline-variant/60">
        <div className="canvas flex flex-col gap-3 py-5 text-[11px] text-ink-muted sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} Kushtal Atelier. Todos los derechos
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
            Pago seguro <span className="ml-3">Visa Mastercard Apple Pay</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
