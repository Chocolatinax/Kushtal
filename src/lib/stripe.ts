import "server-only";

import Stripe from "stripe";

/**
 * Stripe es opcional a propósito.
 *
 * Sin STRIPE_SECRET_KEY la tienda sigue funcionando: el checkout crea el
 * pedido y lo marca como pagado en modo simulado, que es lo que necesitás para
 * demostrar el flujo completo. Cuando pongas tus claves de test, el mismo
 * código empieza a cobrar de verdad sin tocar nada más.
 */
let cached: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;

  if (!cached) {
    // Sin apiVersion: usa la que trae pineada el SDK instalado.
    cached = new Stripe(key);
  }
  return cached;
}

export function isStripeEnabled(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}
