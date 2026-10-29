import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { OptionGroup, Product, ProductWithOptions } from "@/lib/types";

/**
 * Los `select` van escritos como literales en cada llamada a propósito:
 * Supabase infiere el tipo de la fila parseando esa cadena, y si la armamos
 * por concatenación pierde la inferencia y todo cae a `any`.
 */

export type CatalogSort = "popular" | "name" | "new";

export interface CatalogFilters {
  category?: string;
  /** Varias categorías a la vez (p. ej. una página de la arquitectura). */
  categories?: string[];
  /** El producto debe tener todas estas etiquetas (hombre, mujer, slim…). */
  tags?: string[];
  texture?: string;
  /** Texto libre del buscador: nombre, subtítulo o descripción. */
  q?: string;
  sort?: CatalogSort;
}

/** Orden fijo de las categorías en el filtro, con su nombre visible. */
export const CATEGORY_LABELS: Record<string, string> = {
  bifold: "Bifold clásicas",
  tarjetero: "Tarjeteros",
  larga: "Billeteras largas",
  cremallera: "Con cremallera",
};

/** Quita lo que rompería el filtro `or` de PostgREST. */
function searchTerm(q: string | undefined): string | null {
  const clean = (q ?? "").replace(/[,()*%\\]/g, " ").trim().slice(0, 60);
  return clean.length >= 2 ? clean : null;
}

/** Todo el catálogo activo, con filtros opcionales. */
export async function getCatalog(
  filters: CatalogFilters = {},
): Promise<Product[]> {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select(
      "id, slug, name, tagline, description, category, base_price_cents, badge, capacity_label, leather_label, hero_image, images, tones, tags, texture, featured, active, created_at",
    )
    .eq("active", true);

  if (filters.category && filters.category !== "todas") {
    query = query.eq("category", filters.category);
  }
  if (filters.categories && filters.categories.length > 0) {
    query = query.in("category", filters.categories);
  }
  if (filters.tags && filters.tags.length > 0) {
    query = query.contains("tags", filters.tags);
  }
  if (filters.texture && filters.texture !== "all") {
    query = query.eq("texture", filters.texture);
  }
  const term = searchTerm(filters.q);
  if (term) {
    query = query.or(
      `name.ilike.%${term}%,tagline.ilike.%${term}%,description.ilike.%${term}%`,
    );
  }

  // Todos los modelos parten del mismo precio base, así que no se ordena por
  // precio: el precio final depende de la personalización.
  switch (filters.sort) {
    case "name":
      query = query.order("name", { ascending: true });
      break;
    case "new":
      query = query.order("created_at", { ascending: false });
      break;
    default:
      query = query
        .order("featured", { ascending: false })
        .order("name", { ascending: true });
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
      "id, slug, name, tagline, description, category, base_price_cents, badge, capacity_label, leather_label, hero_image, images, tones, tags, texture, featured, active, created_at",
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
       capacity_label, leather_label, hero_image, images, tones, tags, texture,
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
       capacity_label, leather_label, hero_image, images, tones, tags, texture,
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

/**
 * Categorías con cuántas piezas quedan en cada una aplicando los demás
 * filtros (piel, búsqueda). Así los números del chip coinciden con
 * lo que aparece al tocarlo.
 */
export async function getCategories(
  filters: Omit<CatalogFilters, "category" | "sort"> = {},
): Promise<{ code: string; label: string; count: number }[]> {
  const products = await getCatalog({ ...filters, category: undefined }).catch(
    () => [] as Product[],
  );

  const counts = new Map<string, number>();
  for (const p of products) {
    counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  }

  return Object.entries(CATEGORY_LABELS).map(([code, label]) => ({
    code,
    label,
    count: counts.get(code) ?? 0,
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
