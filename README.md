# Kushtal — Atelier de Marroquinería

E-commerce de billeteras y tarjeteros personalizables. Next.js 16 (App Router)
+ TypeScript + Tailwind v4 + Supabase + Stripe.

---

## Levantarlo en 5 pasos

### 1. Instalar

```bash
npm install
cp .env.example .env.local
```

### 2. Crear el proyecto de Supabase

En [supabase.com](https://supabase.com) creá un proyecto nuevo. Después, en
**Project Settings → API**, copiá a tu `.env.local`:

| Variable | Dónde sale |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon / publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key (secreta, solo servidor) |

### 3. Correr el esquema y los datos

En el **SQL Editor** de Supabase, pegá y ejecutá en este orden:

1. `supabase/migrations/0001_init.sql` — tablas, índices, RLS y el trigger que
   crea el perfil al entrar con Google.
2. `supabase/seed.sql` — los 6 productos con sus 7 grupos de personalización.

El seed es idempotente: lo podés volver a correr cuando quieras.

### 4. Activar Google como proveedor

En Supabase: **Authentication → Providers → Google**, activalo y pegá el Client
ID y Client Secret de tu proyecto en
[Google Cloud Console](https://console.cloud.google.com/apis/credentials).

En Google Cloud, el **Authorized redirect URI** es el que te muestra Supabase:

```
https://TU_PROYECTO.supabase.co/auth/v1/callback
```

En Supabase, **Authentication → URL Configuration**:

- Site URL: `http://localhost:3000`
- Redirect URLs: `http://localhost:3000/**`

Cuando despliegues, agregá ahí también tu dominio de producción.

### 5. Arrancar

```bash
npm run dev
```

Abrí `http://localhost:3000`.

---

## Stripe (opcional)

**El checkout funciona sin Stripe.** Sin claves, el pedido se registra y se
marca como pagado en modo simulado, y ves la confirmación completa. Eso alcanza
para demostrar el flujo entero.

Para cobrar de verdad en modo prueba, agregá a `.env.local`:

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Y en otra terminal:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Tarjeta de prueba: `4242 4242 4242 4242`, cualquier fecha futura, CVC `123`.

> El pedido pasa a `paid` **solo** desde el webhook firmado, nunca desde el
> `success_url`. Si confiaras en la URL de retorno, cualquiera podría marcar un
> pedido como pagado abriéndola a mano.

---

## Cómo funciona el precio

Esta es la parte que sostiene el negocio, así que vale entenderla.

```
precio = base del producto + Σ (delta de cada opción elegida)
```

- Un Bifold arranca en $125. Con piel índigo (+$15), pátina toscana (+$25),
  hilo oro viejo (+$9), cantos pintados a mano (+$12) y grabado en lámina de
  oro (+$18) queda en $204.
- El grabado y el estuche de lino van **incluidos**, que es lo que promete la
  barra superior del sitio.

El cálculo vive en `src/lib/pricing.ts` y corre **siempre en el servidor**
(`priceConfiguration`). El cliente usa `previewPrice` solo para mostrar el
número en vivo mientras configurás: ese número nunca se guarda. Si alguien
manipula el payload del formulario, el servidor recalcula contra la base de
datos y el precio tocado se descarta.

---

## Estructura

```
src/
  app/
    page.tsx                   Home
    coleccion/                 Catálogo con filtros por categoría, tono y textura
    personalizar/[slug]/       Configurador  ← la pantalla que faltaba en el diseño
    bolsa/                     Carrito
    checkout/                  Pago
    pedido/[number]/           Confirmación  ← la otra que faltaba
    cuenta/                    Mis encargos (protegida)
    ingresar/                  Login con Google
    auth/callback/             Vuelta del OAuth + fusión del carrito de invitado
    api/stripe/webhook/        Confirmación de pago firmada
    actions/                   Server actions: carrito, checkout, auth
  components/
    configurator/              Lienzo de vista previa y grupos de opciones
    product/  cart/  checkout/  layout/  ui/
  lib/
    pricing.ts                 Motor de precios y validación
    db/                        Consultas a Supabase
    supabase/                  Clientes browser / server / admin + tipos
  proxy.ts                     Refresco de sesión y guardia de /cuenta
supabase/
  migrations/0001_init.sql
  seed.sql
scripts/build-seed.py          Regenera el seed desde las imágenes del diseño
```

---

## Decisiones que conviene conocer

**Carrito de invitado.** Si no entraste, el carrito cuelga de una cookie
httpOnly (`kushtal_cart`). Al entrar con Google se fusiona con tu carrito de
usuario y la cookie se borra. Nadie pierde lo que configuró por loguearse tarde.

**Pedidos de invitado.** Cada pedido lleva un `access_token`. El enlace de
confirmación lo incluye, así que un invitado ve su pedido sin cuenta, pero
cambiar el número en la URL no te deja ver el de otro.

**Snapshot del pedido.** `order_items` guarda nombre, imagen y desglose de la
configuración al momento de comprar. Si mañana cambiás el catálogo o los
precios, los pedidos viejos no se alteran.

**RLS activo en todas las tablas.** El catálogo es de lectura pública; carritos
y pedidos los maneja el servidor con `service_role` y chequeos de pertenencia
explícitos en el código.

**Las imágenes son temporales.** Vienen del CDN del export de Stitch y pueden
caerse. Cuando tengas las fotos reales, subilas a Supabase Storage y actualizá
`hero_image` e `images` en la tabla `products`: el host de Supabase ya está
permitido en `next.config.ts`.

---

## Comandos

```bash
npm run dev     # desarrollo
npm run build   # build de producción
npm run lint    # eslint
npx tsc --noEmit  # typecheck
```

## Desplegar en Vercel

1. Subí el repo a GitHub e importalo en Vercel.
2. Pegá las mismas variables de `.env.local` en Vercel, con
   `NEXT_PUBLIC_SITE_URL` apuntando a tu dominio.
3. En Supabase agregá ese dominio a las Redirect URLs.
4. En Stripe, creá el webhook apuntando a
   `https://tu-dominio.com/api/stripe/webhook` y pegá su signing secret.
