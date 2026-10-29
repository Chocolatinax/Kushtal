/**
 * Genera src/lib/variant-images.manifest.json: la lista de fotos reales del
 * configurador que hay en public/configurador/.
 *
 *   modelos/<slug>/<tono>.jpg        foto del modelo en ese color
 *   materiales/<grupo>/<valor>.jpg   foto de detalle (textura, interior…)
 *
 * Corre solo antes de `npm run dev` y `npm run build` (ver package.json).
 * Hace falta porque en Netlify/Vercel el servidor no puede leer la carpeta
 * public/ en tiempo de ejecución: se sirve aparte, como archivos estáticos.
 */
import { readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE = path.join(ROOT, "public", "configurador");
const OUT = path.join(ROOT, "src", "lib", "variant-images.manifest.json");
const IMAGE = /\.(webp|jpe?g|png|avif)$/i;

function dirs(dir) {
  try {
    return readdirSync(dir).filter((d) => statSync(path.join(dir, d)).isDirectory());
  } catch {
    return [];
  }
}

/** { nombreSinExtensión: "/configurador/…/archivo.ext" } de una carpeta. */
function images(dir, urlPrefix) {
  const out = {};
  let files = [];
  try {
    files = readdirSync(dir);
  } catch {
    return out;
  }
  for (const file of files.sort()) {
    if (!IMAGE.test(file)) continue;
    out[file.replace(IMAGE, "")] = `${urlPrefix}/${encodeURIComponent(file)}`;
  }
  return out;
}

const manifest = { modelos: {}, materiales: {} };

for (const slug of dirs(path.join(BASE, "modelos")).sort()) {
  manifest.modelos[slug] = images(
    path.join(BASE, "modelos", slug),
    `/configurador/modelos/${slug}`,
  );
}
for (const group of dirs(path.join(BASE, "materiales")).sort()) {
  manifest.materiales[group] = images(
    path.join(BASE, "materiales", group),
    `/configurador/materiales/${group}`,
  );
}

writeFileSync(OUT, JSON.stringify(manifest, null, 2) + "\n");

const count = (obj) =>
  Object.values(obj).reduce((n, files) => n + Object.keys(files).length, 0);
console.log(
  `variant-images.manifest.json: ${count(manifest.modelos)} fotos de modelos, ${count(manifest.materiales)} de materiales`,
);
