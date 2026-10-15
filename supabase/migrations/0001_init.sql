-- ============================================================================
-- Kushtal — esquema inicial
-- Catálogo público, carritos por sesión o usuario, pedidos privados.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Perfiles (espejo de auth.users)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  avatar_url  text,
  phone       text,
  default_address jsonb,
  created_at  timestamptz not null default now()
);

-- El perfil se crea solo cuando alguien entra con Google.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Catálogo
-- ---------------------------------------------------------------------------
create table public.products (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique,
  name              text not null,
  tagline           text,
  description       text,
  category          text not null,
  base_price_cents  integer not null check (base_price_cents >= 0),
  badge             text,
  capacity_label    text,
  leather_label     text,
  hero_image        text,
  images            text[] not null default '{}',
  tones             text[] not null default '{}',
  texture           text,
  featured          boolean not null default false,
  active            boolean not null default true,
  created_at        timestamptz not null default now()
);

create index products_category_idx on public.products (category) where active;
create index products_featured_idx on public.products (featured) where active;

create table public.option_groups (
  id                 uuid primary key default gen_random_uuid(),
  product_id         uuid not null references public.products (id) on delete cascade,
  code               text not null,
  label              text not null,
  helper             text,
  type               text not null check (type in ('color', 'select', 'engraving', 'toggle')),
  required           boolean not null default true,
  max_length         integer,
  -- Solo aplica a type = 'engraving'; el resto cobra por valor elegido.
  price_delta_cents  integer not null default 0,
  position           integer not null default 0,
  unique (product_id, code)
);

create index option_groups_product_idx on public.option_groups (product_id, position);

create table public.option_values (
  id                 uuid primary key default gen_random_uuid(),
  group_id           uuid not null references public.option_groups (id) on delete cascade,
  code               text not null,
  label              text not null,
  description        text,
  hex                text,
  price_delta_cents  integer not null default 0,
  image_url          text,
  position           integer not null default 0,
  active             boolean not null default true,
  unique (group_id, code)
);

create index option_values_group_idx on public.option_values (group_id, position);

-- ---------------------------------------------------------------------------
-- Carrito
-- Un carrito pertenece a un usuario o, si todavía no entró, a un token de
-- sesión que guardamos en una cookie httpOnly.
-- ---------------------------------------------------------------------------
create table public.carts (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references auth.users (id) on delete cascade,
  session_token  text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint carts_owner_present check (user_id is not null or session_token is not null)
);

create unique index carts_user_idx on public.carts (user_id) where user_id is not null;
create unique index carts_session_idx on public.carts (session_token) where session_token is not null;

create table public.cart_items (
  id                uuid primary key default gen_random_uuid(),
  cart_id           uuid not null references public.carts (id) on delete cascade,
  product_id        uuid not null references public.products (id) on delete restrict,
  quantity          integer not null default 1 check (quantity > 0 and quantity <= 10),
  config            jsonb not null default '{}'::jsonb,
  -- Precio congelado al agregar. Calculado en servidor, nunca viene del cliente.
  unit_price_cents  integer not null check (unit_price_cents >= 0),
  created_at        timestamptz not null default now()
);

create index cart_items_cart_idx on public.cart_items (cart_id, created_at);

-- ---------------------------------------------------------------------------
-- Pedidos
-- ---------------------------------------------------------------------------
create table public.orders (
  id                 uuid primary key default gen_random_uuid(),
  order_number       text not null unique,
  user_id            uuid references auth.users (id) on delete set null,
  email              text not null,
  status             text not null default 'pending'
                     check (status in ('pending','paid','in_atelier','shipped','delivered','cancelled')),
  subtotal_cents     integer not null check (subtotal_cents >= 0),
  shipping_cents     integer not null default 0 check (shipping_cents >= 0),
  total_cents        integer not null check (total_cents >= 0),
  shipping_method    text not null default 'standard',
  shipping_address   jsonb not null,
  stripe_session_id  text,
  -- Token para que un invitado pueda ver su propio pedido sin cuenta.
  access_token       text not null default encode(gen_random_bytes(24), 'hex'),
  created_at         timestamptz not null default now()
);

create index orders_user_idx on public.orders (user_id, created_at desc);
create index orders_stripe_idx on public.orders (stripe_session_id);

create table public.order_items (
  id                uuid primary key default gen_random_uuid(),
  order_id          uuid not null references public.orders (id) on delete cascade,
  product_id        uuid references public.products (id) on delete set null,
  -- Snapshot: si mañana cambia el catálogo, el pedido histórico no se altera.
  product_name      text not null,
  product_slug      text not null,
  product_image     text,
  config            jsonb not null default '{}'::jsonb,
  details           jsonb not null default '[]'::jsonb,
  unit_price_cents  integer not null check (unit_price_cents >= 0),
  quantity          integer not null check (quantity > 0)
);

create index order_items_order_idx on public.order_items (order_id);

-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table public.profiles     enable row level security;
alter table public.products     enable row level security;
alter table public.option_groups enable row level security;
alter table public.option_values enable row level security;
alter table public.carts        enable row level security;
alter table public.cart_items   enable row level security;
alter table public.orders       enable row level security;
alter table public.order_items  enable row level security;

-- Catálogo: lectura pública de lo activo. Escritura solo con service role
-- (que omite RLS), así que no hace falta policy de escritura.
-- Nota: auth.uid() va envuelto en (select ...) a propósito. Así Postgres lo
-- evalúa una vez por consulta en vez de una vez por fila, que es la diferencia
-- entre una tabla de pedidos rápida y una que se arrastra cuando crece.

create policy "catalogo publico" on public.products
  for select using (active);

create policy "grupos de opciones publicos" on public.option_groups
  for select using (
    exists (select 1 from public.products p where p.id = product_id and p.active)
  );

create policy "valores de opciones publicos" on public.option_values
  for select using (
    active and exists (
      select 1 from public.option_groups g
      join public.products p on p.id = g.product_id
      where g.id = group_id and p.active
    )
  );

-- Perfil: cada quien el suyo.
create policy "perfil propio leer" on public.profiles
  for select using ((select auth.uid()) = id);

create policy "perfil propio actualizar" on public.profiles
  for update using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Carritos y pedidos: el servidor los maneja con service role.
-- Estas policies permiten que un usuario logueado lea lo suyo si algún día
-- querés consultarlo directo desde el cliente.
create policy "carrito propio" on public.carts
  for select using ((select auth.uid()) = user_id);

create policy "items del carrito propio" on public.cart_items
  for select using (
    exists (
      select 1 from public.carts c
      where c.id = cart_id and c.user_id = (select auth.uid())
    )
  );

create policy "pedidos propios" on public.orders
  for select using ((select auth.uid()) = user_id);

create policy "items de pedidos propios" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = (select auth.uid())
    )
  );
