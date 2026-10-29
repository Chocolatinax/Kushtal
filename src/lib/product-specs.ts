/**
 * Ficha técnica de cada modelo (sección "Detalles del producto").
 * Medidas aproximadas en cm: ajústalas con las piezas reales del taller.
 */
export interface ProductSpecs {
  dimensions: string;
  capacity: string;
  includes: string[];
  idealFor: string;
}

export const PRODUCT_SPECS: Record<string, ProductSpecs> = {
  "bifold-signature-atelier": {
    dimensions: "11 × 9 cm cerrada · 1.5 cm de grosor",
    capacity: "6 ranuras para tarjetas y 2 compartimentos para billetes",
    includes: ["Monograma en golpe seco", "Funda de lino"],
    idealFor: "Uso diario en el bolsillo trasero o el saco.",
  },
  "tarjetero-atelier-no-01": {
    dimensions: "10.5 × 7.5 cm · 0.5 cm de grosor",
    capacity: "4 ranuras y 1 bolsillo central para billetes doblados",
    includes: ["Monograma en golpe seco", "Funda de lino"],
    idealFor: "Bolsillo delantero; para llevar solo lo esencial.",
  },
  "billetera-continental-roma": {
    dimensions: "19 × 10 cm cerrada · 2 cm de grosor",
    capacity: "12 ranuras, fuelle interior y espacio para billetes enteros",
    includes: ["Monograma en golpe seco", "Funda de lino"],
    idealFor: "Bolso o cartera; cabe chequera o pasaporte.",
  },
  "portadocumentos-postal": {
    dimensions: "14 × 10.5 cm cerrado · 1.5 cm de grosor",
    capacity: "Pasaporte, pase de abordar, 4 tarjetas y billetes",
    includes: ["Monograma en golpe seco", "Funda de lino"],
    idealFor: "Viajes: todo el papeleo en un solo lugar.",
  },
  "tarjetero-plegable-slim": {
    dimensions: "10.5 × 8 cm cerrado · 1 cm de grosor",
    capacity: "Hasta 8 tarjetas, recibos y billetes doblados",
    includes: ["Cierre magnético", "Monograma en golpe seco", "Funda de lino"],
    idealFor: "Bolsillo delantero o bolso pequeño.",
  },
  "billetera-zip-accordion": {
    dimensions: "12 × 9.5 cm cerrada · 2.5 cm de grosor",
    capacity: "5 divisiones en abanico para tarjetas, monedas y efectivo",
    includes: ["Cremallera metálica", "Monograma en golpe seco", "Funda de lino"],
    idealFor: "Bolso; mantiene monedas y tarjetas bien cerradas.",
  },
};

/** Lo que es igual para toda la colección. */
export const COMMON_SPECS = [
  { label: "Confección", value: "A mano, de 3 a 5 días hábiles" },
  { label: "Costura", value: "A dos agujas con hilo de lino encerado" },
  { label: "Envío", value: "A los 14 departamentos; gratis desde $75" },
  { label: "Garantía", value: "1 año en costuras y herrajes" },
];
