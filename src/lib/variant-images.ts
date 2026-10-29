import "server-only";

import { readdirSync } from "node:fs";
import path from "node:path";

/**
 * Fotos reales del configurador, leídas de public/configurador/:
 *
 *   modelos/<slug>/<tono>.webp        foto del modelo en ese color exterior
 *   materiales/<grupo>/<valor>.webp   foto de detalle: textura, interior,
 *                                     herrajes, rfid, airtag, clip…
 *
 * Basta con soltar el archivo con ese nombre (webp, jpg o png) para que el
 * configurador lo use; si falta, se muestra la foto original del modelo.
 */
export interface VariantImages {
  /** tono → URL pública. */
  tones: Record<string, string>;
  /** grupo → valor → URL pública. */
  details: Record<string, Record<string, string>>;
}

const ROOT = path.join(process.cwd(), "public", "configurador");
const IMAGE = /\.(webp|jpe?g|png|avif)$/i;

/** Archivos de imagen de una carpeta, como { nombreSinExtensión: url }. */
function imagesIn(dir: string, urlPrefix: string): Record<string, string> {
  const out: Record<string, string> = {};
  let files: string[] = [];
  try {
    files = readdirSync(dir);
  } catch {
    return out;
  }
  for (const file of files) {
    if (!IMAGE.test(file)) continue;
    out[file.replace(IMAGE, "")] = `${urlPrefix}/${encodeURIComponent(file)}`;
  }
  return out;
}

export function getVariantImages(slug: string): VariantImages {
  const tones = imagesIn(
    path.join(ROOT, "modelos", slug),
    `/configurador/modelos/${slug}`,
  );

  const details: VariantImages["details"] = {};
  let groups: string[] = [];
  try {
    groups = readdirSync(path.join(ROOT, "materiales"));
  } catch {
    groups = [];
  }
  for (const group of groups) {
    details[group] = imagesIn(
      path.join(ROOT, "materiales", group),
      `/configurador/materiales/${group}`,
    );
  }

  return { tones, details };
}
