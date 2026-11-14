"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  AlertCircle,
  Banknote,
  CreditCard,
  Loader2,
  Lock,
} from "lucide-react";

import { placeOrder, type CheckoutState } from "@/app/actions/checkout";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { cn, formatPrice } from "@/lib/format";
import { shippingCostCents } from "@/lib/pricing";
import { SHIPPING_OPTIONS, SV_DEPARTMENTS } from "@/lib/types";
import { useCheckoutShipping } from "./checkout-shipping";

/**
 * Solo tarjeta (pago simulado, sin pasarela) y PayPal (se coordina por
 * correo).
 */
const PAYMENT_TABS = [
  {
    code: "card",
    label: "Tarjeta",
    icon: CreditCard,
    note: "Al confirmar, tu pedido queda registrado como pagado. No te pedimos los datos de tu tarjeta.",
  },
  {
    code: "paypal",
    label: "PayPal",
    icon: Banknote,
    note: "Registramos tu pedido y te enviamos el enlace de PayPal a tu correo en menos de 24 horas.",
  },
];

export function CheckoutForm({
  subtotalCents,
  defaults,
}: {
  subtotalCents: number;
  defaults: Partial<Record<string, string>>;
}) {
  const [state, formAction] = useActionState<CheckoutState, FormData>(
    placeOrder,
    {},
  );
  // Tras un error, la action devuelve lo enviado para no vaciar los campos.
  const values = { ...defaults, ...state.values };
  const { shipping, setShipping } = useCheckoutShipping();
  const [payment, setPayment] = useState("card");

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="shipping_method" value={shipping} />
      <input type="hidden" name="country" value="SV" />
      <input type="hidden" name="payment_method" value={payment} />

      {state.error && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-lg bg-danger-container px-4 py-3 text-[14px] sm:text-[13px] text-danger-ink"
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

          <label className="mt-1 flex items-start gap-2.5 text-[14px] leading-5 sm:text-[13px] text-ink-muted">
            <input
              type="checkbox"
              name="save_info"
              value="true"
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded-xs border-[1.5px] border-piedra/35 accent-torogoz"
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
                    <span className="rounded-full bg-surface-high px-2 py-0.5 text-[14px] sm:text-[10px] font-bold uppercase tracking-wider text-piedra">
                      {option.badge}
                    </span>
                  </span>
                  <span className="mt-1 block text-[14px] sm:text-[13px] leading-5 text-ink-muted">
                    {option.description}
                  </span>
                </span>

                <span className="shrink-0 font-display text-base sm:text-[15px] font-semibold text-piedra">
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

        <div className="mt-6 grid grid-cols-2 gap-2">
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
                <span className="text-[14px] sm:text-[12px] font-semibold">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Un solo bloque limpio para el cliente: sin campos de tarjeta
            ni detalles técnicos. */}
        <div className="mt-4 flex items-start gap-3 rounded-lg bg-surface-container p-4">
          <Lock
            size={15}
            strokeWidth={1.8}
            className="mt-0.5 shrink-0 text-torogoz"
          />
          <div className="min-w-0">
            <p className="text-[14px] sm:text-[13px] leading-5 text-ink-muted">
              {PAYMENT_TABS.find((t) => t.code === payment)?.note}
            </p>
            {payment === "card" && (
              <p className="mt-2 flex flex-wrap gap-1.5">
                {["Visa", "Mastercard", "Amex"].map((brand) => (
                  <span
                    key={brand}
                    className="rounded-xs border border-outline-variant bg-surface-lowest px-2 py-0.5 text-[14px] sm:text-[10px] font-semibold tracking-wide text-piedra"
                  >
                    {brand}
                  </span>
                ))}
              </p>
            )}
          </div>
        </div>

        {/* Aviso discreto: el pago con tarjeta es simulado. */}
        {payment === "card" && (
          <p className="mt-3 text-center text-[14px] sm:text-[11px] text-ink-muted">
            Tienda en modo demostración · no se realiza ningún cobro real
          </p>
        )}
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
    <Button data-whatsapp-avoid type="submit" size="lg" disabled={pending} className="w-full">
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
    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-anil text-[14px] sm:text-[13px] font-bold text-algodon">
      {children}
    </span>
  );
}
