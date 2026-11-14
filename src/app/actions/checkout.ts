"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCart } from "@/lib/db/cart";
import { rememberOrder, saveAddress } from "@/lib/demo-session";
import { generateOrderNumber } from "@/lib/format";
import { shippingCostCents } from "@/lib/pricing";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/lib/supabase/database.types";
import { getCurrentUser } from "@/lib/supabase/server";
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
    .enum(["card", "paypal"])
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

  // Pago simulado: con tarjeta el pedido queda pagado al confirmar. PayPal se
  // cobra fuera de la web: el pedido queda pendiente y se le escribe al cliente.
  const paysOffline = input.payment_method === "paypal";

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: generateOrderNumber(),
      user_id: user?.id ?? null,
      email: input.email,
      status: paysOffline ? "pending" : "paid",
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

  // Demo: los datos de envío y el pedido se recuerdan en este navegador
  // para precargar el próximo checkout y listarlo en "Mi cuenta".
  if (input.save_info) {
    await saveAddress(shippingAddress);
  }
  await rememberOrder(order.order_number, order.access_token);

  await supabase.from("cart_items").delete().eq("cart_id", cart.id);

  revalidatePath("/bolsa");
  revalidatePath("/", "layout");

  redirect(`/pedido/${order.order_number}?t=${order.access_token}`);
}
