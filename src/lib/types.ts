/**
 * Tipos del dominio de Kushtal.
 * Espejo de las tablas en supabase/migrations/0001_init.sql
 */

export type OptionGroupType = "color" | "select" | "engraving" | "toggle";

export interface OptionValue {
  id: string;
  group_id: string;
  code: string;
  label: string;
  description: string | null;
  /** Hex del swatch, solo para grupos tipo "color". */
  hex: string | null;
  /** Lo que suma al precio base, en centavos. Puede ser 0. */
  price_delta_cents: number;
  image_url: string | null;
  position: number;
  active: boolean;
}

export interface OptionGroup {
  id: string;
  product_id: string;
  code: string;
  label: string;
  helper: string | null;
  type: OptionGroupType;
  required: boolean;
  /** Solo para type = "engraving": cuánto cuesta y cuántos caracteres admite. */
  max_length: number | null;
  price_delta_cents: number;
  position: number;
  values: OptionValue[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  category: string;
  /** Precio de arranque en centavos, antes de personalización. */
  base_price_cents: number;
  badge: string | null;
  capacity_label: string | null;
  leather_label: string | null;
  hero_image: string | null;
  images: string[];
  tones: string[];
  /** Intención de búsqueda: hombre, mujer, slim, viaje… */
  tags: string[];
  texture: string | null;
  featured: boolean;
  active: boolean;
  created_at: string;
}

export interface ProductWithOptions extends Product {
  option_groups: OptionGroup[];
}

/**
 * Lo que el usuario eligió en el configurador.
 * Clave = code del grupo, valor = code de la opción (o el texto del grabado).
 */
export type Configuration = Record<string, string>;

export interface ConfigLineDetail {
  group_code: string;
  group_label: string;
  value_code: string;
  value_label: string;
  hex: string | null;
  price_delta_cents: number;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  config: Configuration;
  /** Precio unitario congelado al momento de agregar, calculado en servidor. */
  unit_price_cents: number;
  created_at: string;
  product: Product;
  /** Desglose legible de la configuración, resuelto al leer el carrito. */
  details: ConfigLineDetail[];
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal_cents: number;
  shipping_cents: number;
  total_cents: number;
  item_count: number;
  /** Envío de cortesía a partir de este monto. */
  free_shipping_threshold_cents: number;
}

export type OrderStatus =
  | "pending"
  | "paid"
  | "in_atelier"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  /** Municipio o distrito. */
  city: string;
  /** Departamento de El Salvador. Opcional en pedidos anteriores. */
  department?: string;
  /** Opcional: en El Salvador casi no se usa. */
  postal_code: string;
  phone: string;
  country: string;
}

/** Los 14 departamentos de El Salvador, para el formulario de envío. */
export const SV_DEPARTMENTS = [
  "Ahuachapán",
  "Cabañas",
  "Chalatenango",
  "Cuscatlán",
  "La Libertad",
  "La Paz",
  "La Unión",
  "Morazán",
  "San Miguel",
  "San Salvador",
  "San Vicente",
  "Santa Ana",
  "Sonsonate",
  "Usulután",
] as const;

export interface OrderItem {
  id: string;
  order_id: string;
  product_name: string;
  product_slug: string;
  product_image: string | null;
  config: Configuration;
  details: ConfigLineDetail[];
  unit_price_cents: number;
  quantity: number;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  email: string;
  status: OrderStatus;
  subtotal_cents: number;
  shipping_cents: number;
  total_cents: number;
  shipping_method: string;
  shipping_address: ShippingAddress;
  stripe_session_id: string | null;
  created_at: string;
  items: OrderItem[];
}

export interface ShippingOption {
  code: string;
  label: string;
  description: string;
  price_cents: number;
  badge: string;
}

export const SHIPPING_OPTIONS: ShippingOption[] = [
  {
    code: "standard",
    label: "Envío estándar a todo El Salvador",
    description: "3–5 días de confección + 1–3 días hábiles de entrega a domicilio.",
    price_cents: 400,
    badge: "Gratis desde $75",
  },
  {
    code: "express",
    label: "Envío express",
    description: "Tu pieza pasa primero al taller y se entrega por courier en 24–48 horas.",
    price_cents: 900,
    badge: "Más rápido",
  },
];

/** Envío estándar gratis desde $75 (está en la barra superior). */
export const FREE_SHIPPING_THRESHOLD_CENTS = 7500;
