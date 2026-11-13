import { NextResponse, type NextRequest } from "next/server";

/**
 * Antes era la vuelta del login con Google. La demo ya no tiene inicio de
 * sesión: cualquier visita aquí va a "Mis pedidos".
 */
export function GET(request: NextRequest) {
  return NextResponse.redirect(new URL("/cuenta", request.nextUrl.origin));
}
