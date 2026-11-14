"use client";

import { useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";

/**
 * Bloque de suscripción antes del footer. Es solo visual (demostración):
 * revisa el correo y la casilla de consentimiento en el navegador y muestra
 * el mensaje de éxito, pero no guarda ni envía nada.
 */
export function NewsletterSignup() {
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.elements.namedItem("email") as HTMLInputElement;
    const consent = form.elements.namedItem("consent") as HTMLInputElement;

    if (!email.value.trim() || !email.validity.valid) {
      setError("Revisa el correo electrónico");
    } else if (!consent.checked) {
      setError("Marca la casilla para aceptar recibir correos");
    } else {
      setError(null);
      setDone(true);
    }
  }

  return (
    <section
      aria-labelledby="suscripcion-titulo"
      className="mt-24 border-t border-outline-variant/60 bg-surface-container"
    >
      <div className="canvas grid gap-6 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:items-center lg:gap-12 lg:py-14">
        <div className="flex items-start gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-cafe-container text-cafe">
            <Mail size={19} strokeWidth={1.6} />
          </span>
          <div>
            <h2
              id="suscripcion-titulo"
              className="font-display text-[24px] leading-8 text-piedra lg:text-[28px] lg:leading-9"
            >
              Recibe la guía de cueros y acceso anticipado a las campañas
            </h2>
            <p className="mt-2 text-[14px] leading-5 text-ink-muted sm:text-[13px]">
              Cómo elegir y cuidar cada piel, y las nuevas colecciones antes que
              nadie. Sin spam: puedes darte de baja cuando quieras.
            </p>
          </div>
        </div>

        {done ? (
          <p
            role="status"
            className="flex items-start gap-2 rounded-lg bg-torogoz-container px-4 py-3 text-[14px] leading-5 text-torogoz-ink"
          >
            <CheckCircle2 size={17} strokeWidth={2} className="mt-px shrink-0" />
            ¡Listo! Te enviaremos la guía de cueros y el acceso anticipado a las
            campañas.
          </p>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="tucorreo@gmail.com"
                aria-label="Correo electrónico"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "suscripcion-error" : undefined}
                className="bg-surface-lowest sm:flex-1"
              />
              <Button type="submit" variant="craft" className="sm:w-auto">
                Suscribirme
              </Button>
            </div>

            <label className="flex items-start gap-2.5 text-[14px] leading-5 text-ink-muted sm:text-[13px]">
              <input
                type="checkbox"
                name="consent"
                required
                className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded-xs border-[1.5px] border-piedra/35 accent-torogoz"
              />
              Acepto recibir correos y mensajes promocionales de Kushtal
            </label>

            {error && (
              <p
                id="suscripcion-error"
                role="alert"
                className="flex items-start gap-2 text-[14px] leading-5 text-danger-ink sm:text-[13px]"
              >
                <AlertCircle size={15} strokeWidth={2} className="mt-0.5 shrink-0" />
                {error}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
