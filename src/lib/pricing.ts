import { z } from "zod";
import type {
  ConfigLineDetail,
  Configuration,
  OptionGroup,
  ProductWithOptions,
} from "./types";
import { FREE_SHIPPING_THRESHOLD_CENTS, SHIPPING_OPTIONS } from "./types";

/**
 * Regla de negocio de Kushtal:
 *   precio = base del producto + suma de los deltas de cada opción elegida.
 *
 * Esto SIEMPRE se evalúa en el servidor contra la configuración de la base de
 * datos. El cliente calcula lo mismo para mostrar el precio en vivo, pero su
 * número nunca se guarda: si alguien manipula el payload, el servidor recalcula
 * y gana.
 */

export class ConfigurationError extends Error {
  constructor(
    message: string,
    public readonly groupCode?: string,
  ) {
    super(message);
    this.name = "ConfigurationError";
  }
}

export const engravingSchema = z
  .string()
  .trim()
  .max(24)
  .regex(
    /^[A-Za-zÁÉÍÓÚÑÜáéíóúñü0-9 .&'-]*$/,
    "El grabado solo admite letras, números y . & ' -",
  );

/** Normaliza el grabado igual que lo hace el taller: versalitas, sin dobles espacios. */
export function normalizeEngraving(raw: string): string {
  return raw.trim().replace(/\s+/g, " ").toUpperCase();
}

interface PriceResult {
  unitPriceCents: number;
  details: ConfigLineDetail[];
}

/**
 * Grupos que solo existen si otro tiene valor: el acabado del grabado no
 * tiene sentido sin monograma. Si el grupo del que depende está vacío, se
 * oculta en el configurador y no se cobra aunque llegue en el payload.
 */
export const GROUP_DEPENDS_ON: Record<string, string> = {
  grabado_acabado: "grabado",
};

/** ¿Este grupo aplica con la configuración actual? */
export function isGroupActive(
  group: Pick<OptionGroup, "code">,
  config: Configuration,
): boolean {
  const parent = GROUP_DEPENDS_ON[group.code];
  if (!parent) return true;
  const raw = config[parent];
  return typeof raw === "string" && normalizeEngraving(raw).length > 0;
}

/**
 * Valida la configuración y devuelve el precio unitario + el desglose legible.
 * Lanza ConfigurationError si falta un grupo obligatorio o si un código no
 * existe para ese producto.
 */
export function priceConfiguration(
  product: ProductWithOptions,
  config: Configuration,
): PriceResult {
  let total = product.base_price_cents;
  const details: ConfigLineDetail[] = [];

  for (const group of product.option_groups) {
    if (!isGroupActive(group, config)) continue;

    const raw = config[group.code];
    const provided = typeof raw === "string" && raw.trim().length > 0;

    if (!provided) {
      if (group.required) {
        throw new ConfigurationError(
          `Falta elegir: ${group.label}`,
          group.code,
        );
      }
      continue;
    }

    if (group.type === "engraving") {
      const parsed = engravingSchema.safeParse(raw);
      if (!parsed.success) {
        throw new ConfigurationError(
          parsed.error.issues[0]?.message ?? "Grabado inválido",
          group.code,
        );
      }
      const text = normalizeEngraving(parsed.data);
      const max = group.max_length ?? 12;
      if (text.length > max) {
        throw new ConfigurationError(
          `El grabado admite máximo ${max} caracteres`,
          group.code,
        );
      }
      if (text.length === 0) {
        if (group.required) {
          throw new ConfigurationError(`Falta elegir: ${group.label}`, group.code);
        }
        continue;
      }

      total += group.price_delta_cents;
      details.push({
        group_code: group.code,
        group_label: group.label,
        value_code: text,
        value_label: text,
        hex: null,
        price_delta_cents: group.price_delta_cents,
      });
      continue;
    }

    const value = group.values.find((v) => v.code === raw && v.active);
    if (!value) {
      throw new ConfigurationError(
        `Opción no disponible en ${group.label}`,
        group.code,
      );
    }

    total += value.price_delta_cents;
    details.push({
      group_code: group.code,
      group_label: group.label,
      value_code: value.code,
      value_label: value.label,
      hex: value.hex,
      price_delta_cents: value.price_delta_cents,
    });
  }

  if (total < 0) {
    throw new ConfigurationError("Configuración inválida");
  }

  return { unitPriceCents: total, details };
}

/**
 * Versión para el cliente: no lanza, devuelve el mejor precio posible con lo
 * que haya elegido hasta ahora. Se usa para el contador en vivo del
 * configurador.
 */
export function previewPrice(
  groups: OptionGroup[],
  basePriceCents: number,
  config: Configuration,
): number {
  let total = basePriceCents;

  for (const group of groups) {
    if (!isGroupActive(group, config)) continue;

    const raw = config[group.code];
    if (typeof raw !== "string" || raw.trim().length === 0) continue;

    if (group.type === "engraving") {
      total += group.price_delta_cents;
      continue;
    }

    const value = group.values.find((v) => v.code === raw);
    if (value) total += value.price_delta_cents;
  }

  return total;
}

/** Los grupos obligatorios que todavía no tienen elección. */
export function missingRequiredGroups(
  groups: OptionGroup[],
  config: Configuration,
): OptionGroup[] {
  return groups.filter((g) => {
    if (!g.required || !isGroupActive(g, config)) return false;
    const raw = config[g.code];
    return typeof raw !== "string" || raw.trim().length === 0;
  });
}

/**
 * Preselecciona la primera opción de cada grupo obligatorio, o la que venga en
 * `preferred` si existe (p. ej. la piel con la que se fotografió el modelo, o
 * `rfid: "si"` al entrar desde /billeteras-hombre/rfid/). En los grupos
 * opcionales solo se aplica `preferred`, y solo si el valor existe.
 */
export function defaultConfiguration(
  groups: OptionGroup[],
  preferred: Configuration = {},
): Configuration {
  const config: Configuration = {};
  for (const group of groups) {
    if (group.type === "engraving") continue;
    const wanted = group.values.find(
      (v) => v.active && v.code === preferred[group.code],
    );
    if (!group.required) {
      if (wanted) config[group.code] = wanted.code;
      continue;
    }
    const first = wanted ?? group.values.find((v) => v.active);
    if (first) config[group.code] = first.code;
  }
  return config;
}

export function resolveShipping(code: string) {
  return (
    SHIPPING_OPTIONS.find((o) => o.code === code) ?? SHIPPING_OPTIONS[0]
  );
}

/**
 * Envío estándar gratis sobre el umbral. El express siempre se cobra: la
 * cortesía cubre el estándar, no la prioridad en el taller.
 */
export function shippingCostCents(
  subtotalCents: number,
  shippingCode: string,
): number {
  const option = resolveShipping(shippingCode);
  if (option.code === "standard" && qualifiesForFreeShipping(subtotalCents)) {
    return 0;
  }
  return option.price_cents;
}

export function qualifiesForFreeShipping(subtotalCents: number): boolean {
  return subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS;
}
