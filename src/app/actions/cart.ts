"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getOrCreateCartId } from "@/lib/db/cart";
import { getProductWithOptions } from "@/lib/db/products";
import { ConfigurationError, priceConfiguration } from "@/lib/pricing";
import { createAdminClient } from "@/lib/supabase/admin";

export interface ActionResult {
  ok: boolean;
  error?: string;
  /** Code del grupo que falló, para resaltarlo en el configurador. */
  field?: string;
}

const addSchema = z.object({
  slug: z.string().min(1),
  quantity: z.coerce.number().int().min(1).max(10).default(1),
  config: z.record(z.string(), z.string()),
});

/**
 * Agrega una pieza configurada al carrito.
 *
 * El precio NO viene del cliente: se recalcula acá contra la base de datos.
 * Si alguien manda un payload tocado, priceConfiguration tira y no se guarda nada.
 */
export async function addToCart(input: unknown): Promise<ActionResult> {
  const parsed = addSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Datos de personalización inválidos" };
  }

  const { slug, quantity, config } = parsed.data;

  const product = await getProductWithOptions(slug);
  if (!product) return { ok: false, error: "Esa pieza ya no está disponible" };

  let unitPriceCents: number;
  try {
    ({ unitPriceCents } = priceConfiguration(product, config));
  } catch (err) {
    if (err instanceof ConfigurationError) {
      return { ok: false, error: err.message, field: err.groupCode };
    }
    throw err;
  }

  const cartId = await getOrCreateCartId(true);
  if (!cartId) return { ok: false, error: "No se pudo abrir tu bolsa" };

  const supabase = createAdminClient();

  // Si ya existe una línea idéntica (mismo producto, misma config), sumamos.
  const { data: rows } = await supabase
    .from("cart_items")
    .select("id, quantity, config")
    .eq("cart_id", cartId)
    .eq("product_id", product.id);

  const match = (rows ?? []).find(
    (r) => stableStringify(r.config) === stableStringify(config),
  );

  if (match) {
    const nextQty = Math.min(10, (match.quantity as number) + quantity);
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: nextQty, unit_price_cents: unitPriceCents })
      .eq("id", match.id);

    if (error) return { ok: false, error: "No se pudo actualizar tu bolsa" };
  } else {
    const { error } = await supabase.from("cart_items").insert({
      cart_id: cartId,
      product_id: product.id,
      quantity,
      config,
      unit_price_cents: unitPriceCents,
    });

    if (error) return { ok: false, error: "No se pudo agregar a tu bolsa" };
  }

  await supabase
    .from("carts")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", cartId);

  revalidatePath("/bolsa");
  revalidatePath("/", "layout");

  return { ok: true };
}

export async function addToCartAndGo(input: unknown) {
  const result = await addToCart(input);
  if (!result.ok) return result;
  redirect("/bolsa");
}

const qtySchema = z.object({
  itemId: z.string().uuid(),
  quantity: z.coerce.number().int().min(0).max(10),
});

export async function updateCartItemQuantity(
  input: unknown,
): Promise<ActionResult> {
  const parsed = qtySchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Cantidad inválida" };

  const { itemId, quantity } = parsed.data;

  const cartId = await getOrCreateCartId(false);
  if (!cartId) return { ok: false, error: "Tu bolsa está vacía" };

  const supabase = createAdminClient();

  // El filtro por cart_id es lo que impide tocar la bolsa de otro.
  if (quantity === 0) {
    await supabase.from("cart_items").delete().eq("id", itemId).eq("cart_id", cartId);
  } else {
    await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", itemId)
      .eq("cart_id", cartId);
  }

  revalidatePath("/bolsa");
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function removeCartItem(itemId: string): Promise<ActionResult> {
  return updateCartItemQuantity({ itemId, quantity: 0 });
}

export async function clearCart(): Promise<ActionResult> {
  const cartId = await getOrCreateCartId(false);
  if (!cartId) return { ok: true };

  const supabase = createAdminClient();
  await supabase.from("cart_items").delete().eq("cart_id", cartId);

  revalidatePath("/bolsa");
  revalidatePath("/", "layout");
  return { ok: true };
}

/* ------------------------------------------------------------------ */

/** JSON con claves ordenadas, para comparar configuraciones de forma estable. */
function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;

  const entries = Object.entries(value as Record<string, unknown>).sort(
    ([a], [b]) => a.localeCompare(b),
  );

  return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${stableStringify(v)}`).join(",")}}`;
}
