import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Configurador",
};

/**
 * /personalizar sin modelo: mandamos a la colección, que es donde se elige.
 * El primer paso es escoger el modelo base.
 */
export default function PersonalizarIndex() {
  redirect("/coleccion");
}
