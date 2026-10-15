import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { OptionGroup, Product, ProductWithOptions } from "@/lib/types";

/**
 * Los `select` van escritos como literales en cada llamada a propósito:
 * Supabase infiere el tipo de la fila parseando esa cadena, y si la armamos
 * por concatenación pierde la inferencia y todo cae a `any`.
 */

export type CatalogSort = "popular" | "price-asc" | "price-desc" | "new";

export interface CatalogFilters {
  category?: string;
  tone?: string;
  texture?: string;
  sort?: CatalogSort;
}

/** Todo el catálogo activo, con filtros opcionales. */
export async function getCatalog(
  filters: CatalogFilters = {},
): Promise<Product[]> {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select(
      "id, slug, name, tagline, description, category, base_price_cents, badge, capacity_label, leather_label, hero_image, images, tones, texture, featured, active, created_at",
    )
    .eq("active", true);

  if (filters.category && filters.category !== "todas") {
    query = query.eq("category", filters.category);
  }
  if (filters.tone && filters.tone !== "all") {
    query = query.contains("tones", [filters.tone]);
  }
  if (filters.texture && filters.texture !== "all") {
    query = query.eq("texture", filters.texture);
  }

  switch (filters.sort) {
    case "price-asc":
      query = query.order("base_price_cents", { ascending: true });
      break;
    case "price-desc":
      query = query.order("base_price_cents", { ascending: false });
      break;
    case "new":
      query = query.order("created_at", { ascending: false });
      break;
    default:
      query = query
        .order("featured", { ascending: false })
        .order("base_price_cents", { ascending: true });
  }

  const { data, error } = await query;
  if (error) throw new Error(`No se pudo cargar el catálogo: ${error.message}`);

  return (data ?? []) as Product[];
}

export async function getFeaturedProducts(limit = 3): Promise<Product[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, slug, name, tagline, description, category, base_price_cents, badge, capacity_label, leather_label, hero_image, images, tones, texture, featured, active, created_at",
    )
    .eq("active", true)
    .eq("featured", true)
    .order("base_price_cents", { ascending: true })
    .limit(limit);

  if (error) throw new Error(`No se pudo cargar lo destacado: ${error.message}`);
  return (data ?? []) as Product[];
}

/** Un producto con todos sus grupos de personalización, ordenados. */
export async function getProductWithOptions(
  slug: string,
): Promise<ProductWithOptions | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `id, slug, name, tagline, description, category, base_price_cents, badge,
       capacity_label, leather_label, hero_image, images, tones, texture,
       featured, active, created_at,
       option_groups (
         id, product_id, code, label, helper, type, required, max_length,
         price_delta_cents, position,
         values:option_values (
           id, group_id, code, label, description, hex, price_delta_cents,
           image_url, position, active
         )
       )`,
    )
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (error) throw new Error(`No se pudo cargar el producto: ${error.message}`);
  if (!data) return null;

  return normalizeProduct(data);
}

/** Igual que el anterior pero por id, para resolver el carrito. */
export async function getProductsWithOptionsByIds(
  ids: string[],
): Promise<Map<string, ProductWithOptions>> {
  if (ids.length === 0) return new Map();

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `id, slug, name, tagline, description, category, base_price_cents, badge,
       capacity_label, leather_label, hero_image, images, tones, texture,
       featured, active, created_at,
       option_groups (
         id, product_id, code, label, helper, type, required, max_length,
         price_delta_cents, position,
         values:option_values (
           id, group_id, code, label, description, hex, price_delta_cents,
           image_url, position, active
         )
       )`,
    )
    .in("id", ids);

  if (error) throw new Error(`No se pudieron cargar productos: ${error.message}`);

  const map = new Map<string, ProductWithOptions>();
  for (const row of data ?? []) {
    const product = normalizeProduct(row);
    map.set(product.id, product);
  }
  return map;
}

export async function getCategories(): Promise<
  { code: string; label: string; count: number }[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("category")
    .eq("active", true);

  if (error) return [];

  const labels: Record<string, string> = {
    tarjetero: "Tarjeteros",
    bifold: "Bifold Clásicas",
    larga: "Billeteras Largas",
    cremallera: "Con Cremallera",
  };

  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    const c = row.category;
    counts.set(c, (counts.get(c) ?? 0) + 1);
  }

  return [...counts.entries()].map(([code, count]) => ({
    code,
    label: labels[code] ?? code,
    count,
  }));
}

/* ------------------------------------------------------------------ */

type RawProduct = Product & {
  option_groups?: (Omit<OptionGroup, "values"> & {
    values?: OptionGroup["values"];
  })[];
};

/** Ordena grupos y valores, y descarta valores dados de baja. */
function normalizeProduct(row: unknown): ProductWithOptions {
  const raw = row as RawProduct;

  const groups = (raw.option_groups ?? [])
    .map((g) => ({
      ...g,
      values: (g.values ?? [])
        .filter((v) => v.active)
        .sort((a, b) => a.position - b.position),
    }))
    .sort((a, b) => a.position - b.position);

  return {
    ...raw,
    images: raw.images ?? [],
    tones: raw.tones ?? [],
    option_groups: groups as OptionGroup[],
  };
}
