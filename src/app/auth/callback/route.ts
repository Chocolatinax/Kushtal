import { NextResponse, type NextRequest } from "next/server";

import { mergeGuestCartIntoUser } from "@/lib/db/cart";
import { createClient } from "@/lib/supabase/server";

/**
 * Vuelta de Google. Cambiamos el code por una sesión y, si el usuario tenía
 * piezas en la bolsa como invitado, se las pasamos a su cuenta.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/cuenta";
  const oauthError = searchParams.get("error_description") ?? searchParams.get("error");

  if (oauthError) {
    return NextResponse.redirect(
      `${origin}/ingresar?error=${encodeURIComponent(oauthError)}`,
    );
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/ingresar?error=missing_code`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `${origin}/ingresar?error=${encodeURIComponent(error.message)}`,
    );
  }

  if (data.user) {
    try {
      await mergeGuestCartIntoUser(data.user.id);
    } catch {
      // Que falle la fusión del carrito no debe impedirle entrar.
    }
  }

  // Solo rutas internas, para que nadie use ?next= como redirección abierta.
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/cuenta";

  const forwardedHost = request.headers.get("x-forwarded-host");
  const base =
    process.env.NODE_ENV === "production" && forwardedHost
      ? `https://${forwardedHost}`
      : origin;

  return NextResponse.redirect(`${base}${safeNext}`);
}
