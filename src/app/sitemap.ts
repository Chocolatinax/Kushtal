import type { MetadataRoute } from "next";

import { CATALOG_ROUTES, routePath } from "@/lib/catalog-routes";
import { getCatalog } from "@/lib/db/products";
import { SITE_URL } from "@/lib/site";

const STATIC_PATHS = [
  { path: "/", priority: 1 },
  { path: "/coleccion", priority: 0.9 },
  { path: "/sobre-kushtal", priority: 0.5 },
  { path: "/artesania", priority: 0.5 },
  { path: "/envios", priority: 0.4 },
  { path: "/garantia", priority: 0.4 },
  { path: "/contacto", priority: 0.4 },
  { path: "/terminos", priority: 0.2 },
  { path: "/privacidad", priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getCatalog().catch(() => []);

  return [
    ...STATIC_PATHS.map(({ path, priority }) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency: "weekly" as const,
      priority,
    })),
    // Páginas de la arquitectura web: silos 0.85, subcategorías 0.75.
    ...CATALOG_ROUTES.map((r) => ({
      url: `${SITE_URL}${routePath(r)}`,
      changeFrequency: "weekly" as const,
      priority: r.segments.length === 1 ? 0.85 : 0.75,
    })),
    ...products.map((p) => ({
      url: `${SITE_URL}/personalizar/${p.slug}`,
      lastModified: p.created_at,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: p.hero_image ? [new URL(p.hero_image, SITE_URL).toString()] : undefined,
    })),
  ];
}
