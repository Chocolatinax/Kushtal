import manifest from "./variant-images.manifest.json";

/**
 * Fotos reales del configurador, en public/configurador/:
 *
 *   modelos/<slug>/<tono>.jpg        foto del modelo en ese color exterior
 *   materiales/<grupo>/<valor>.jpg   foto de detalle: textura, interior,
 *                                    herrajes, rfid, airtag, clip…
 *
 * La lista sale de variant-images.manifest.json, que genera
 * scripts/build-image-manifest.mjs antes de `dev` y `build`. No se lee la
 * carpeta en tiempo de ejecución porque en Netlify el servidor no tiene
 * acceso a public/. Para agregar una foto: suéltala con ese nombre y vuelve a
 * correr dev o el deploy. Si falta, se muestra la foto principal del modelo.
 */
export interface VariantImages {
  /** tono → URL pública. */
  tones: Record<string, string>;
  /** grupo → valor → URL pública. */
  details: Record<string, Record<string, string>>;
}

const MODELOS: Record<string, Record<string, string>> = manifest.modelos;
const MATERIALES: Record<string, Record<string, string>> = manifest.materiales;

export function getVariantImages(slug: string): VariantImages {
  return { tones: MODELOS[slug] ?? {}, details: MATERIALES };
}
