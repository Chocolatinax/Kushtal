"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCart } from "@/lib/db/cart";
import { generateOrderNumber } from "@/lib/format";
import { resolveShipping, shippingCostCents } from "@/lib/pricing";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/lib/supabase/database.types";
import { getCurrentUser } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import { SV_DEPARTMENTS } from "@/lib/types";

export interface CheckoutState {
  error?: string;
  field?: string;
  /**
   * Lo que se envió. React 19 resetea el formulario después de cada action,
   * así que lo devolvemos para que los campos no se vacíen si hay un error.
   */
  values?: Record<string, string>;
}

const KEPT_FIELDS = [
  "email",
  "first_name",
  "last_name",
  "address",
  "department",
  "city",
  "phone",
  "postal_code",
] as const;

const checkoutSchema = z.object({
  email: z.string().trim().email("Revisa el correo electrónico"),
  first_name: z.string().trim().min(2, "Falta el nombre"),
  last_name: z.string().trim().min(2, "Faltan los apellidos"),
  address: z.string().trim().min(5, "Falta la dirección"),
  city: z.string().trim().min(2, "Falta el municipio"),
  department: z.enum(SV_DEPARTMENTS, "Elige un departamento"),
  postal_code: z.string().trim().max(10).default(""),
  // 8 dígitos, con o sin +503 y separadores.
  phone: z
    .string()
    .trim()
    .regex(
      /^(\+?503[\s-]?)?[267]\d{3}[\s-]?\d{4}$/,
      "Revisa el teléfono (8 dígitos, ej. 7123-4567)",
    ),
  country: z.string().trim().min(2).default("SV"),
  shipping_method: z.enum(["standard", "express"]).default("standard"),
  payment_method: z
    .enum(["card", "wallet", "paypal", "transfer"])
    .default("card"),
  save_info: z.coerce.boolean().default(false),
});

export async function placeOrder(
  _prev: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  // Si todo sale bien, submitOrder redirige y esto nunca vuelve.
  const result = await submitOrder(formData);

  const values: Record<string, string> = {};
  for (const key of KEPT_FIELDS) {
    const v = formData.get(key);
    if (typeof v === "string") values[key] = v;
  }
  return { ...result, values };
}

async function submitOrder(formData: FormData): Promise<CheckoutState> {
  const parsed = checkoutSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { error: issue.message, field: String(issue.path[0] ?? "") };
  }

  const input = parsed.data;

  const cart = await getCart();
  if (cart.items.length === 0) {
    return { error: "Tu bolsa está vacía" };
  }

  // Los totales se recalculan aquí; nunca llegan desde el formulario.
  const subtotal = cart.subtotal_cents;
  const shipping = shippingCostCents(subtotal, input.shipping_method);
  const total = subtotal + shipping;

  const supabase = createAdminClient();
  const user = await getCurrentUser();

  const shippingAddress = {
    first_name: input.first_name,
    last_name: input.last_name,
    email: input.email,
    address: input.address,
    city: input.city,
    department: input.department,
    postal_code: input.postal_code,
    phone: input.phone,
    country: input.country,
  };

  // PayPal y transferencia se cobran fuera de la web: el pedido queda
  // pendiente y se le escribe al cliente. Tarjeta y billeteras van a Stripe.
  const paysOffline =
    input.payment_method === "paypal" || input.payment_method === "transfer";
  const stripe = paysOffline ? null : getStripe();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: generateOrderNumber(),
      user_id: user?.id ?? null,
      email: input.email,
      // Sin Stripe el pedido queda pagado en modo simulado.
      status: stripe || paysOffline ? "pending" : "paid",
      subtotal_cents: subtotal,
      shipping_cents: shipping,
      total_cents: total,
      shipping_method: input.shipping_method,
      shipping_address: shippingAddress,
    })
    .select("id, order_number, access_token")
    .single();

  if (orderError || !order) {
    return { error: "No se pudo registrar el pedido. Intenta de nuevo." };
  }

  // config y details viajan como jsonb; el cast es solo para el tipo Json.
  const itemRows = cart.items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    product_name: item.product.name,
    product_slug: item.product.slug,
    product_image: item.product.hero_image,
    config: item.config as unknown as Json,
    details: item.details as unknown as Json,
    unit_price_cents: item.unit_price_cents,
    quantity: item.quantity,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(itemRows);

  if (itemsError) {
    await supabase.from("orders").delete().eq("id", order.id);
    return { error: "No se pudieron guardar las piezas del pedido." };
  }

  if (user && input.save_info) {
    await supabase
      .from("profiles")
      .update({
        full_name: `${input.first_name} ${input.last_name}`,
        phone: input.phone,
        default_address: shippingAddress,
      })
      .eq("id", user.id);
  }

  const origin = await getOrigin();
  const confirmUrl = `${origin}/pedido/${order.order_number}?t=${order.access_token}`;

  /* ----------------------------- Con Stripe ----------------------------- */
  if (stripe) {
    const lineItems = cart.items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: "usd",
        unit_amount: item.unit_price_cents,
        product_data: {
          name: item.product.name,
          description:
            item.details.map((d) => d.value_label).join(" · ") || undefined,
          // Stripe necesita URLs absolutas; las fotos locales vienen como "/…".
          images: item.product.hero_image
            ? [new URL(item.product.hero_image, origin).toString()]
            : undefined,
        },
      },
    }));

    if (shipping > 0) {
      const option = resolveShipping(input.shipping_method);
      lineItems.push({
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: shipping,
          product_data: {
            name: option.label,
            description: option.description,
            images: undefined,
          },
        },
      });
    }

    try {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: input.email,
        line_items: lineItems,
        success_url: confirmUrl,
        cancel_url: `${origin}/checkout?cancelado=1`,
        metadata: {
          order_id: order.id as string,
          order_number: order.order_number as string,
        },
      });

      await supabase
        .from("orders")
        .update({ stripe_session_id: session.id })
        .eq("id", order.id);

      if (!session.url) {
        return { error: "Stripe no devolvió una URL de pago." };
      }

      redirect(session.url);
    } catch (err) {
      // redirect() tira a propósito; no es un fallo.
      if (isRedirectError(err)) throw err;

      await supabase.from("orders").update({ status: "cancelled" }).eq("id", order.id);
      return {
        error:
          "No se pudo abrir la pasarela de pago. Revisa tus claves de Stripe.",
      };
    }
  }

  /* ------------------- Modo simulado o pago por fuera ------------------- */
  await supabase.from("cart_items").delete().eq("cart_id", cart.id);

  revalidatePath("/bolsa");
  revalidatePath("/", "layout");

  redirect(`/pedido/${order.order_number}?t=${order.access_token}`);
}

/* ------------------------------------------------------------------ */

function isRedirectError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "digest" in err &&
    typeof (err as { digest: unknown }).digest === "string" &&
    (err as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

async function getOrigin(): Promise<string> {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto =
    h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");

  return `${proto}://${host}`;
}
