import "server-only";

import { createClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";

/**
 * Cliente con service role: omite RLS.
 *
 * Se usa solo para lo que el servidor debe poder hacer en nombre del usuario:
 * mover el carrito de un invitado, escribir pedidos, marcar un pago como
 * confirmado desde el webhook de Stripe.
 *
 * Nunca lo importes desde un componente del navegador. El "server-only" de
 * arriba hace que el build falle si alguien lo intenta.
 */
let cached: ReturnType<typeof createClient<Database>> | null = null;

export function createAdminClient() {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local",
    );
  }

  cached = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return cached;
}
