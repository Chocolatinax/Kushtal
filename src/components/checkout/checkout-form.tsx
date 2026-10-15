"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  AlertCircle,
  Banknote,
  CreditCard,
  Landmark,
  Loader2,
  Lock,
  Smartphone,
} from "lucide-react";

import { placeOrder, type CheckoutState } from "@/app/actions/checkout";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { cn, formatPrice } from "@/lib/format";
import { SHIPPING_OPTIONS } from "@/lib/types";

const PAYMENT_TABS = [
  { code: "card", label: "Tarjeta", icon: CreditCard },
  { code: "apple", label: "Apple Pay", icon: Smartphone },
  { code: "paypal", label: "PayPal", icon: Banknote },
  { code: "transfer", label: "Transferencia", icon: Landmark },
];

export function CheckoutForm({
  subtotalCents,
  stripeEnabled,
  defaults,
}: {
  subtotalCents: number;
  stripeEnabled: boolean;
  defaults: Partial<Record<string, string>>;
}) {
  const [state, formAction] = useActionState<CheckoutState, FormData>(
    placeOrder,
    {},
  );
  const [shipping, setShipping] = useState("standard");
  const [payment, setPayment] = useState("card");

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="shipping_method" value={shipping} />
      <input type="hidden" name="country" value="ES" />

      {state.error && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-lg bg-danger-container px-4 py-3 text-[13px] text-danger-ink"
        >
          <AlertCircle size={15} strokeWidth={2} className="mt-px shrink-0" />
          {state.error}
        </p>
      )}

      {/* ------------------------------------- 1. Contacto y envío */}
      <section className="rounded-xl border border-outline-variant/70 bg-surface-lowest p-6 md:p-8">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <StepDot>1</StepDot>
            <h2 className="font-display text-[26px] font-semibold text-piedra">
              Contacto y Envío
            </h2>
          </div>
          <p className="eyebrow text-cafe">Taller · Destino</p>
        </header>

        <div className="mt-6 flex flex-col gap-4">
          <Field
            label="Correo electrónico para seguimiento artesanal"
            hint="Recibirás fotografías del proceso de troquelado y grabado de tus piezas."
            error={state.field === "email" ? state.error : undefined}
          >
            <Input
              name="email"
              type="email"
              required
              autoComplete="email"
              defaultValue={defaults.email}
              placeholder="ejemplo@kushtal.com"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Nombre"
              error={state.field === "first_name" ? state.error : undefined}
            >
              <Input
                name="first_name"
                required
                autoComplete="given-name"
                defaultValue={defaults.first_name}
                placeholder="Mateo"
              />
            </Field>
            <Field
              label="Apellidos"
              error={state.field === "last_name" ? state.error : undefined}
            >
              <Input
                name="last_name"
                required
                autoComplete="family-name"
                defaultValue={defaults.last_name}
                placeholder="Valenzuela Ruiz"
              />
            </Field>
          </div>

          <Field
            label="Dirección completa"
            error={state.field === "address" ? state.error : undefined}
          >
            <Input
              name="address"
              required
              autoComplete="street-address"
              defaultValue={defaults.address}
              placeholder="Calle de los Artesanos 14, Piso 3 Izq."
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field
              label="Ciudad"
              error={state.field === "city" ? state.error : undefined}
            >
              <Input
                name="city"
                required
                autoComplete="address-level2"
                defaultValue={defaults.city}
                placeholder="Madrid"
              />
            </Field>
            <Field
              label="Código postal"
              error={state.field === "postal_code" ? state.error : undefined}
            >
              <Input
                name="postal_code"
                required
                autoComplete="postal-code"
                defaultValue={defaults.postal_code}
                placeholder="28001"
              />
            </Field>
            <Field
              label="Teléfono"
              error={state.field === "phone" ? state.error : undefined}
            >
              <Input
                name="phone"
                required
                autoComplete="tel"
                defaultValue={defaults.phone}
                placeholder="+34 600 000 000"
              />
            </Field>
          </div>

          <label className="mt-1 flex items-center gap-2.5 text-[13px] text-ink-muted">
            <input
              type="checkbox"
              name="save_info"
              value="true"
              defaultChecked
              className="h-4 w-4 cursor-pointer rounded-xs border-[1.5px] border-piedra/35 accent-torogoz"
            />
            Guardar esta información para mis futuros encargos en el atelier.
          </label>
        </div>
      </section>

      {/* ------------------------------------- 2. Envío */}
      <section className="rounded-xl border border-outline-variant/70 bg-surface-lowest p-6 md:p-8">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <StepDot>2</StepDot>
            <h2 className="font-display text-[26px] font-semibold text-piedra">
              Modalidad de Envío
            </h2>
          </div>
          <p className="eyebrow text-cafe">Logística cuidada</p>
        </header>

        <div className="mt-6 flex flex-col gap-3">
          {SHIPPING_OPTIONS.map((option) => {
            const isActive = shipping === option.code;
            return (
              <button
                key={option.code}
                type="button"
                onClick={() => setShipping(option.code)}
                aria-pressed={isActive}
                className={cn(
                  "flex items-start gap-3 rounded-lg border p-4 text-left transition-all",
                  isActive
                    ? "border-anil border-[1.5px] bg-anil/[0.04]"
                    : "border-outline-variant hover:border-anil/50",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border-[1.5px]",
                    isActive ? "border-anil" : "border-piedra/35",
                  )}
                >
                  {isActive && <span className="h-2 w-2 rounded-full bg-anil" />}
                </span>

                <span className="flex-1">
                  <span className="flex flex-wrap items-center gap-2.5">
                    <span className="font-display text-[17px] font-semibold text-piedra">
                      {option.label}
                    </span>
                    <span className="rounded-full bg-surface-high px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-piedra">
                      {option.badge}
                    </span>
                  </span>
                  <span className="mt-1 block text-[13px] leading-5 text-ink-muted">
                    {option.description}
                  </span>
                </span>

                <span className="shrink-0 font-display text-[15px] font-semibold text-piedra">
                  {option.price_cents === 0
                    ? "Gratis"
                    : formatPrice(option.price_cents)}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------- 3. Pago */}
      <section className="rounded-xl border border-outline-variant/70 bg-surface-lowest p-6 md:p-8">
        <div className="flex items-center gap-3">
          <StepDot>3</StepDot>
          <h2 className="font-display text-[26px] font-semibold text-piedra">
            Método de Pago
          </h2>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {PAYMENT_TABS.map((tab) => {
            const isActive = payment === tab.code;
            return (
              <button
                key={tab.code}
                type="button"
                onClick={() => setPayment(tab.code)}
                aria-pressed={isActive}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-sm border px-3 py-3 transition-all",
                  isActive
                    ? "border-anil bg-anil text-algodon"
                    : "border-outline-variant bg-surface-container text-ink-muted hover:border-anil/50",
                )}
              >
                <tab.icon size={17} strokeWidth={1.7} />
                <span className="text-[12px] font-semibold">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 rounded-lg bg-surface-container p-5">
          {stripeEnabled ? (
            <>
              <p className="flex items-center gap-2 font-display text-[17px] font-semibold text-piedra">
                <Lock size={15} strokeWidth={1.8} className="text-torogoz" />
                Pago seguro con Stripe
              </p>
              <p className="mt-2 text-[13px] leading-5 text-ink-muted">
                Al confirmar te llevamos a la pasarela cifrada de Stripe. Los
                datos de tu tarjeta nunca pasan por nuestros servidores.
              </p>
              <p className="mt-3 rounded-sm bg-surface-high px-3 py-2 font-mono text-[11px] text-ink-muted">
                Modo prueba: 4242 4242 4242 4242 · cualquier fecha futura · CVC
                123
              </p>
            </>
          ) : (
            <>
              <p className="flex items-center gap-2 font-display text-[17px] font-semibold text-piedra">
                <Lock size={15} strokeWidth={1.8} className="text-cafe" />
                Pasarela en modo simulado
              </p>
              <p className="mt-2 text-[13px] leading-5 text-ink-muted">
                Todavía no hay claves de Stripe configuradas. El pedido se
                registrará igual y verás la confirmación completa, pero sin
                cobro real. Agregá{" "}
                <code className="rounded bg-surface-high px-1.5 py-0.5 text-[11px]">
                  STRIPE_SECRET_KEY
                </code>{" "}
                para activar el cobro de prueba.
              </p>
            </>
          )}
        </div>
      </section>

      <SubmitButton subtotalCents={subtotalCents} shipping={shipping} />
    </form>
  );
}

function SubmitButton({
  subtotalCents,
  shipping,
}: {
  subtotalCents: number;
  shipping: string;
}) {
  const { pending } = useFormStatus();
  const option = SHIPPING_OPTIONS.find((o) => o.code === shipping);
  const total = subtotalCents + (option?.price_cents ?? 0);

  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          Confirmando tu encargo…
        </>
      ) : (
        <>
          <Lock size={15} strokeWidth={1.9} />
          Confirmar pedido · {formatPrice(total)}
        </>
      )}
    </Button>
  );
}

function StepDot({ children }: { children: React.ReactNode }) {
  return (
    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-anil text-[13px] font-bold text-algodon">
      {children}
    </span>
  );
}
