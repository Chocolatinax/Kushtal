import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCatalog } from "@/lib/db/products";

export const metadata: Metadata = {
  title: "Configurador Atelier",
};

/**
 * /personalizar sin silueta: mandamos a la colección, que es donde se elige.
 * El primer paso del ritual es escoger el patrón base.
 */
export default async function PersonalizarIndex() {
  await getCatalog().catch(() => []);
  redirect("/coleccion");
}
