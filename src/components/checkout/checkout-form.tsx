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
import { Field, Input, Select } from "@/components/ui/field";
import { cn, formatPrice } from "@/lib/format";
import { shippingCostCents } from "@/lib/pricing";
import { SHIPPING_OPTIONS, SV_DEPARTMENTS } from "@/lib/types";

/**
 * Las pestañas son las del diseño de Stitch. Tarjeta, Apple Pay y Google Pay
 * se cobran en la pasarela de Stripe (que muestra las billeteras digitales
 * según el dispositivo); PayPal y transferencia se coordinan por correo.
 */
const PAYMENT_TABS = [
  {
    code: "card",
    label: "Tarjeta",
    icon: CreditCard,
    note: "Visa, Mastercard o American Express, en la pasarela cifrada de Stripe.",
  },
  {
    code: "wallet",
    label: "Apple Pay / G Pay",
    icon: Smartphone,
    note: "Si tu dispositivo lo admite, Stripe te mostrará Apple Pay o Google Pay al pagar.",
  },
  {
    code: "paypal",
    label: "PayPal",
    icon: Banknote,
    note: "Registramos tu pedido y te enviamos el enlace de PayPal a tu correo en menos de 24 horas.",
  },
  {
    code: "transfer",
    label: "Transferencia",
    icon: Landmark,
    note: "Te enviamos los datos de nuestra cuenta bancaria en El Salvador. Tu pieza entra al taller cuando confirmamos el pago.",
  },
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
  // Tras un error, la action devuelve lo enviado para no vaciar los campos.
  const values = { ...defaults, ...state.values };
  const [shipping, setShipping] = useState("standard");
  const [payment, setPayment] = useState("card");

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="shipping_method" value={shipping} />
      <input type="hidden" name="country" value="SV" />
      <input type="hidden" name="payment_method" value={payment} />

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
              Contacto y envío
            </h2>
          </div>
          <p className="eyebrow text-cafe">Entregas en El Salvador</p>
        </header>

        <div className="mt-6 flex flex-col gap-4">
          <Field
            label="Correo electrónico"
            hint="Te enviaremos la confirmación y el seguimiento de tu pedido."
            error={state.field === "email" ? state.error : undefined}
          >
            <Input
              name="email"
              type="email"
              required
              autoComplete="email"
              defaultValue={values.email}
              placeholder="tucorreo@gmail.com"
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
                defaultValue={values.first_name}
                placeholder="Andrea"
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
                defaultValue={values.last_name}
                placeholder="Martínez López"
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
              defaultValue={values.address}
              placeholder="Col. Escalón, Calle El Mirador #24, casa 5"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Departamento"
              error={state.field === "department" ? state.error : undefined}
            >
              <Select
                // El reset del formulario no respeta el nuevo defaultValue de
                // un <select>: la key lo vuelve a montar con lo enviado.
                key={values.department}
                name="department"
                required
                autoComplete="address-level1"
                defaultValue={values.department ?? "San Salvador"}
              >
                {SV_DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </Select>
            </Field>
            <Field
              label="Municipio"
              error={state.field === "city" ? state.error : undefined}
            >
              <Input
                name="city"
                required
                autoComplete="address-level2"
                defaultValue={values.city}
                placeholder="San Salvador Centro"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Teléfono"
              hint="Para coordinar la entrega."
              error={state.field === "phone" ? state.error : undefined}
            >
              <Input
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                defaultValue={values.phone}
                placeholder="+503 7123-4567"
              />
            </Field>
            <Field
              label="Código postal (opcional)"
              error={state.field === "postal_code" ? state.error : undefined}
            >
              <Input
                name="postal_code"
                autoComplete="postal-code"
                defaultValue={values.postal_code}
                placeholder="CP 1101"
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
            Guardar estos datos para mis próximos pedidos.
          </label>
        </div>
      </section>

      {/* ------------------------------------- 2. Envío */}
      <section className="rounded-xl border border-outline-variant/70 bg-surface-lowest p-6 md:p-8">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <StepDot>2</StepDot>
            <h2 className="font-display text-[26px] font-semibold text-piedra">
              Tipo de envío
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
                  {shippingCostCents(subtotalCents, option.code) === 0
                    ? "Gratis"
                    : formatPrice(shippingCostCents(subtotalCents, option.code))}
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
            Método de pago
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

        <p className="mt-4 text-[13px] leading-5 text-ink-muted">
          {PAYMENT_TABS.find((t) => t.code === payment)?.note}
        </p>

        <div className="mt-4 rounded-lg bg-surface-container p-5">
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
                cobro real. Agrega{" "}
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
  const total = subtotalCents + shippingCostCents(subtotalCents, shipping);

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
