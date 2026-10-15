import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";

import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";

/**
 * Webhook de Stripe: acá es donde un pedido pasa a "pagado".
 *
 * El success_url no sirve como confirmación de pago (el usuario puede cerrar
 * la pestaña, o abrir esa URL a mano). Solo este evento firmado lo confirma.
 *
 * En local:
 *   stripe listen --forward-to localhost:3000/api/stripe/webhook
 */
export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !secret) {
    return NextResponse.json(
      { error: "Stripe no está configurado" },
      { status: 503 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Falta la firma" }, { status: 400 });
  }

  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "firma inválida";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const supabase = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const orderId = session.metadata?.order_id;
      if (!orderId) break;

      await supabase
        .from("orders")
        .update({ status: "paid" })
        .eq("id", orderId)
        .eq("status", "pending");

      // El pago se confirmó: vaciamos la bolsa de ese comprador.
      const { data: order } = await supabase
        .from("orders")
        .select("user_id")
        .eq("id", orderId)
        .maybeSingle();

      if (order?.user_id) {
        const { data: cart } = await supabase
          .from("carts")
          .select("id")
          .eq("user_id", order.user_id)
          .maybeSingle();

        if (cart) {
          await supabase.from("cart_items").delete().eq("cart_id", cart.id);
        }
      }
      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object;
      const orderId = session.metadata?.order_id;
      if (!orderId) break;

      await supabase
        .from("orders")
        .update({ status: "cancelled" })
        .eq("id", orderId)
        .eq("status", "pending");
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
