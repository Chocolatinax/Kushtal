import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

/** 16500 -> "$165.00" */
export function formatPrice(cents: number): string {
  return usd.format(cents / 100);
}

/** Igual que formatPrice pero con el sufijo que usa el diseño. */
export function formatPriceUSD(cents: number): string {
  return `${usd.format(cents / 100)} USD`;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("es-SV", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

/** KSH-7F3A2B — corto, legible por teléfono, sin ambigüedad O/0 ni I/1. */
export function generateOrderNumber(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `KSH-${suffix}`;
}
