import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Check } from "lucide-react";

import { signInWithGoogle } from "@/app/actions/auth";
import { Eyebrow } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Ingresar",
};

const PERKS = [
  "Sigue el estado de confección de cada pieza",
  "Guarda tus datos de envío para tu próximo pedido",
  "Consulta el historial de tus pedidos",
];

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const user = await getCurrentUser().catch(() => null);
  if (user) redirect("/cuenta");

  const sp = await searchParams;
  const next = (Array.isArray(sp.next) ? sp.next[0] : sp.next) ?? "/cuenta";
  const error = Array.isArray(sp.error) ? sp.error[0] : sp.error;

  return (
    <div className="canvas grid min-h-[70vh] items-center py-12 lg:grid-cols-2 lg:gap-16">
      <div className="mx-auto w-full max-w-sm">
        <Eyebrow>Acceso al atelier</Eyebrow>

        <h1 className="mt-3 font-display text-[32px] leading-10 font-semibold text-piedra md:text-[40px] md:leading-[48px]">
          Entra a tu cuenta
        </h1>

        <p className="mt-3 text-[15px] leading-6 text-ink-muted">
          Una sola cuenta para seguir tus pedidos y guardar tus datos de
          envío.
        </p>

        {error && (
          <p
            role="alert"
            className="mt-6 rounded-lg bg-danger-container px-4 py-3 text-[13px] text-danger-ink"
          >
            No se pudo completar el ingreso. Intenta de nuevo.
          </p>
        )}

        <form action={signInWithGoogle} className="mt-8">
          <input type="hidden" name="next" value={next} />
          <Button
            type="submit"
            variant="outline"
            size="lg"
            className="w-full bg-surface-lowest"
          >
            <GoogleMark />
            Continuar con Google
          </Button>
        </form>

        <ul className="mt-8 flex flex-col gap-3">
          {PERKS.map((perk) => (
            <li
              key={perk}
              className="flex items-start gap-2.5 text-[13px] leading-5 text-ink-muted"
            >
              <Check
                size={14}
                strokeWidth={2.4}
                className="mt-0.5 shrink-0 text-torogoz"
              />
              {perk}
            </li>
          ))}
        </ul>

        <p className="mt-8 text-[12px] leading-4 text-ink-muted">
          No necesitas cuenta para comprar: puedes completar tu pedido como
          invitado y crearla después.
        </p>
      </div>

      <div className="hidden rounded-xl bg-anil p-10 text-algodon lg:block">
        <p className="font-display text-2xl leading-9 font-medium">
          &ldquo;No fabricamos en serie: cada billetera empieza a hacerse cuando
          terminas de diseñarla.&rdquo;
        </p>
        <p className="mt-6 eyebrow text-algodon/60">
          Taller Kushtal
        </p>
      </div>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" aria-hidden focusable="false">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.05l3.01-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
      />
    </svg>
  );
}
