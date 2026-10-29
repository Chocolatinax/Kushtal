-- ============================================================================
-- Kushtal — etiquetas de producto
-- Las páginas de la arquitectura web (/billeteras-hombre/, /tarjeteros/mujer/…)
-- filtran el catálogo por intención de búsqueda: público (hombre, mujer) y
-- formato (slim, viaje). Se guardan como etiquetas libres en cada producto.
-- ============================================================================

alter table public.products
  add column if not exists tags text[] not null default '{}';

create index if not exists products_tags_idx
  on public.products using gin (tags)
  where active;
