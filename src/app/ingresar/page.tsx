import { redirect } from "next/navigation";

/**
 * La demo ya no tiene inicio de sesión: los pedidos de este navegador se ven
 * directo en /cuenta. Se mantiene la ruta para que los enlaces viejos no den 404.
 */
export default function LoginPage() {
  redirect("/cuenta");
}
