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
      const max = group.max_length ?? 24;
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
    if (!g.required) return false;
    const raw = config[g.code];
    return typeof raw !== "string" || raw.trim().length === 0;
  });
}

/** Preselecciona la primera opción de cada grupo obligatorio. */
export function defaultConfiguration(groups: OptionGroup[]): Configuration {
  const config: Configuration = {};
  for (const group of groups) {
    if (group.type === "engraving") continue;
    const first = group.values.find((v) => v.active);
    if (first && group.required) config[group.code] = first.code;
  }
  return config;
}

export function resolveShipping(code: string) {
  return (
    SHIPPING_OPTIONS.find((o) => o.code === code) ?? SHIPPING_OPTIONS[0]
  );
}

/**
 * Envío de cortesía sobre el umbral. El express siempre se cobra: la cortesía
 * cubre el estándar, no la prioridad en el banco de corte.
 */
export function shippingCostCents(
  subtotalCents: number,
  shippingCode: string,
): number {
  const option = resolveShipping(shippingCode);
  if (option.code === "standard") return 0;
  if (subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS) return option.price_cents;
  return option.price_cents;
}

export function qualifiesForFreeShipping(subtotalCents: number): boolean {
  return subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS;
}
