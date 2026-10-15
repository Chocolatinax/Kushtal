import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/supabase/server";
import type { Order, OrderItem } from "@/lib/types";

/**
 * Trae un pedido por su número.
 *
 * Lo ve su dueño si está logueado, o cualquiera que traiga el access_token
 * del enlace de confirmación. Así un invitado puede ver su pedido sin cuenta
 * y nadie puede adivinar el de otro cambiando el número en la URL.
 */
export async function getOrderByNumber(
  orderNumber: string,
  accessToken?: string,
): Promise<Order | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("orders")
    .select(
      `id, order_number, user_id, email, status, subtotal_cents, shipping_cents,
       total_cents, shipping_method, shipping_address, stripe_session_id,
       access_token, created_at`,
    )
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (error || !data) return null;

  const user = await getCurrentUser();
  const isOwner = Boolean(user && data.user_id === user.id);
  const hasToken = Boolean(accessToken && accessToken === data.access_token);

  if (!isOwner && !hasToken) return null;

  const { data: items } = await supabase
    .from("order_items")
    .select(
      `id, order_id, product_name, product_slug, product_image, config, details,
       unit_price_cents, quantity`,
    )
    .eq("order_id", data.id);

  return {
    ...(data as unknown as Order),
    items: (items ?? []) as unknown as OrderItem[],
  };
}

/** Los pedidos del usuario logueado, más recientes primero. */
export async function getMyOrders(): Promise<Order[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("orders")
    .select(
      `id, order_number, user_id, email, status, subtotal_cents, shipping_cents,
       total_cents, shipping_method, shipping_address, stripe_session_id,
       access_token, created_at,
       order_items (
         id, order_id, product_name, product_slug, product_image, config,
         details, unit_price_cents, quantity
       )`,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => {
    const { order_items, ...order } = row as unknown as Order & {
      order_items: OrderItem[];
    };
    return { ...order, items: order_items ?? [] };
  });
}

export const STATUS_LABELS: Record<string, { label: string; note: string }> = {
  pending: {
    label: "Pago pendiente",
    note: "Estamos esperando la confirmación de tu pago.",
  },
  paid: {
    label: "Pago confirmado",
    note: "Tu encargo entró al banco de corte del taller.",
  },
  in_atelier: {
    label: "En el atelier",
    note: "Tu pieza se está cortando y cosiendo a mano.",
  },
  shipped: {
    label: "En tránsito",
    note: "Tu pedido salió del taller rumbo a tu dirección.",
  },
  delivered: {
    label: "Entregado",
    note: "Tu pieza llegó. Que la disfrutes muchos años.",
  },
  cancelled: {
    label: "Cancelado",
    note: "Este pedido fue cancelado.",
  },
};
