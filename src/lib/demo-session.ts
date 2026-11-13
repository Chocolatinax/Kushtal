import "server-only";

import { cookies } from "next/headers";

import type { ShippingAddress } from "@/lib/types";

/**
 * Demo sin inicio de sesión (ni Google ni Supabase Auth).
 *
 * Los pedidos confirmados en este navegador y los datos de envío se recuerdan
 * en cookies, así "Mis pedidos" (/cuenta) puede listarlos y el checkout
 * precargar la dirección.
 */

const ORDERS_COOKIE = "kushtal_orders";
const ADDRESS_COOKIE = "kushtal_address";

const ONE_YEAR = 60 * 60 * 24 * 365;
const MAX_ORDERS = 20;

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: ONE_YEAR,
};

export interface RememberedOrder {
  number: string;
  token: string;
}

/* ------------------------------------------------------------ Pedidos */

export async function getRememberedOrders(): Promise<RememberedOrder[]> {
  const store = await cookies();
  return readJson<RememberedOrder[]>(store.get(ORDERS_COOKIE)?.value) ?? [];
}

/** Guarda número + token del pedido (el más reciente primero). */
export async function rememberOrder(number: string, token: string): Promise<void> {
  const current = await getRememberedOrders();
  const next = [
    { number, token },
    ...current.filter((o) => o.number !== number),
  ].slice(0, MAX_ORDERS);

  const store = await cookies();
  store.set(ORDERS_COOKIE, JSON.stringify(next), cookieOptions);
}

/* ------------------------------------------------- Datos de envío */

export async function getSavedAddress(): Promise<ShippingAddress | null> {
  const store = await cookies();
  return readJson<ShippingAddress>(store.get(ADDRESS_COOKIE)?.value);
}

export async function saveAddress(address: ShippingAddress): Promise<void> {
  const store = await cookies();
  store.set(ADDRESS_COOKIE, JSON.stringify(address), cookieOptions);
}

/* ------------------------------------------------------------------ */

function readJson<T>(raw: string | undefined): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
