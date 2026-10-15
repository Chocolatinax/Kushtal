import "server-only";

import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";

import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/supabase/server";
import { getProductsWithOptionsByIds } from "@/lib/db/products";
import { priceConfiguration } from "@/lib/pricing";
import {
  FREE_SHIPPING_THRESHOLD_CENTS,
  type Cart,
  type CartItem,
  type Configuration,
  type Product,
} from "@/lib/types";

const CART_COOKIE = "kushtal_cart";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 60; // 60 días

/**
 * Devuelve el carrito del usuario logueado o, si es invitado, el que cuelga de
 * la cookie. `create` en false evita crear filas vacías en cada visita.
 */
export async function getOrCreateCartId(create = true): Promise<string | null> {
  const supabase = createAdminClient();
  const user = await getCurrentUser();
  const cookieStore = await cookies();

  if (user) {
    const { data: existing } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) return existing.id as string;
    if (!create) return null;

    const { data, error } = await supabase
      .from("carts")
      .insert({ user_id: user.id })
      .select("id")
      .single();

    if (error) throw new Error(`No se pudo crear el carrito: ${error.message}`);
    return data.id as string;
  }

  const token = cookieStore.get(CART_COOKIE)?.value;

  if (token) {
    const { data: existing } = await supabase
      .from("carts")
      .select("id")
      .eq("session_token", token)
      .maybeSingle();

    if (existing) return existing.id as string;
  }

  if (!create) return null;

  const newToken = token ?? randomUUID();
  const { data, error } = await supabase
    .from("carts")
    .insert({ session_token: newToken })
    .select("id")
    .single();

  if (error) throw new Error(`No se pudo crear el carrito: ${error.message}`);

  cookieStore.set(CART_COOKIE, newToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });

  return data.id as string;
}

const EMPTY_CART: Cart = {
  id: "",
  items: [],
  subtotal_cents: 0,
  shipping_cents: 0,
  total_cents: 0,
  item_count: 0,
  free_shipping_threshold_cents: FREE_SHIPPING_THRESHOLD_CENTS,
};

/**
 * Lee el carrito y resuelve cada configuración contra el catálogo vigente.
 * El precio guardado se respeta (es el que el cliente vio al agregar), pero el
 * desglose legible se recalcula para que siempre muestre etiquetas al día.
 */
export async function getCart(): Promise<Cart> {
  const cartId = await getOrCreateCartId(false);
  if (!cartId) return EMPTY_CART;

  const supabase = createAdminClient();
  const { data: rows, error } = await supabase
    .from("cart_items")
    .select(
      `id, cart_id, product_id, quantity, config, unit_price_cents, created_at,
       product:products (
         id, slug, name, tagline, description, category, base_price_cents,
         badge, capacity_label, leather_label, hero_image, images, tones,
         texture, featured, active, created_at
       )`,
    )
    .eq("cart_id", cartId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(`No se pudo leer el carrito: ${error.message}`);
  if (!rows || rows.length === 0) return { ...EMPTY_CART, id: cartId };

  const productIds = [...new Set(rows.map((r) => r.product_id as string))];
  const catalog = await getProductsWithOptionsByIds(productIds);

  const items: CartItem[] = [];

  for (const row of rows) {
    const product = row.product as unknown as Product | null;
    if (!product) continue;

    const full = catalog.get(row.product_id as string);
    let details: CartItem["details"] = [];

    if (full) {
      try {
        details = priceConfiguration(full, row.config as Configuration).details;
      } catch {
        // El catálogo cambió y esta configuración ya no es válida.
        // No rompemos el carrito: la mostramos sin desglose.
        details = [];
      }
    }

    items.push({
      id: row.id as string,
      cart_id: row.cart_id as string,
      product_id: row.product_id as string,
      quantity: row.quantity as number,
      config: row.config as Configuration,
      unit_price_cents: row.unit_price_cents as number,
      created_at: row.created_at as string,
      product,
      details,
    });
  }

  const subtotal = items.reduce(
    (sum, i) => sum + i.unit_price_cents * i.quantity,
    0,
  );

  return {
    id: cartId,
    items,
    subtotal_cents: subtotal,
    shipping_cents: 0,
    total_cents: subtotal,
    item_count: items.reduce((n, i) => n + i.quantity, 0),
    free_shipping_threshold_cents: FREE_SHIPPING_THRESHOLD_CENTS,
  };
}

/** Solo el contador, para el badge del header. Evita traer todo el carrito. */
export async function getCartCount(): Promise<number> {
  const cartId = await getOrCreateCartId(false);
  if (!cartId) return 0;

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("cart_items")
    .select("quantity")
    .eq("cart_id", cartId);

  return (data ?? []).reduce((n, r) => n + (r.quantity as number), 0);
}

/**
 * Al entrar con Google, el carrito de invitado pasa al usuario.
 * Si ya tenía uno, se fusionan los ítems y se descarta el de invitado.
 */
export async function mergeGuestCartIntoUser(userId: string): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CART_COOKIE)?.value;
  if (!token) return;

  const supabase = createAdminClient();

  const { data: guestCart } = await supabase
    .from("carts")
    .select("id")
    .eq("session_token", token)
    .maybeSingle();

  if (!guestCart) return;

  const { data: userCart } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (!userCart) {
    // No tenía carrito: adoptamos el de invitado tal cual.
    await supabase
      .from("carts")
      .update({ user_id: userId, session_token: null })
      .eq("id", guestCart.id);
  } else {
    await supabase
      .from("cart_items")
      .update({ cart_id: userCart.id })
      .eq("cart_id", guestCart.id);

    await supabase.from("carts").delete().eq("id", guestCart.id);
  }

  cookieStore.delete(CART_COOKIE);
}
