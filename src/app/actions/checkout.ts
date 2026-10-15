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

export interface CheckoutState {
  error?: string;
  field?: string;
}

const checkoutSchema = z.object({
  email: z.string().trim().email("Revisá el correo electrónico"),
  first_name: z.string().trim().min(2, "Falta el nombre"),
  last_name: z.string().trim().min(2, "Faltan los apellidos"),
  address: z.string().trim().min(5, "Falta la dirección"),
  city: z.string().trim().min(2, "Falta la ciudad"),
  postal_code: z.string().trim().min(3, "Falta el código postal"),
  phone: z.string().trim().min(6, "Falta el teléfono"),
  country: z.string().trim().min(2).default("ES"),
  shipping_method: z.enum(["standard", "express"]).default("standard"),
  save_info: z.coerce.boolean().default(false),
});

export async function placeOrder(
  _prev: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
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

  // Los totales se recalculan acá; nunca llegan desde el formulario.
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
    postal_code: input.postal_code,
    phone: input.phone,
    country: input.country,
  };

  const stripe = getStripe();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: generateOrderNumber(),
      user_id: user?.id ?? null,
      email: input.email,
      // Sin Stripe el pedido queda pagado en modo simulado.
      status: stripe ? "pending" : "paid",
      subtotal_cents: subtotal,
      shipping_cents: shipping,
      total_cents: total,
      shipping_method: input.shipping_method,
      shipping_address: shippingAddress,
    })
    .select("id, order_number, access_token")
    .single();

  if (orderError || !order) {
    return { error: "No se pudo registrar el pedido. Intentá de nuevo." };
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
          images: item.product.hero_image ? [item.product.hero_image] : undefined,
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
          "No se pudo abrir la pasarela de pago. Revisá tus claves de Stripe.",
      };
    }
  }

  /* --------------------------- Modo simulado --------------------------- */
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
