import type { Configuration } from "./types";

/**
 * Páginas de categoría de la arquitectura web ("Kushtal - Arquitectura web.xlsx").
 *
 * Cada silo y subcategoría tiene su URL exacta, su keyword principal (la de más
 * volumen del Excel) y las secundarias que usa el FAQ. `filter` decide qué
 * modelos aparecen; `preset` preconfigura el configurador al entrar desde aquí
 * (p. ej. RFID activado en /billeteras-hombre/rfid/).
 */
export interface CatalogRoute {
  /** Segmentos de la URL: ["billeteras-hombre"] o ["billeteras-hombre", "rfid"]. */
  segments: string[];
  /** Nombre corto para menú, bolitas y migas de pan. */
  label: string;
  h1: string;
  title: string;
  description: string;
  intro: string;
  keyword: string;
  secondary: string[];
  filter: { tags?: string[]; categories?: string[]; slugs?: string[] };
  preset?: Configuration;
  /** Sección del configurador a la que se salta al entrar (id del fieldset). */
  anchor?: string;
  /** Foto para las bolitas. */
  image: string;
  faq: { q: string; a: string }[];
}

export const CATALOG_ROUTES: CatalogRoute[] = [
  /* ------------------------------------------------ Silo: hombre */
  {
    segments: ["billeteras-hombre"],
    label: "Billeteras hombre",
    h1: "Billeteras para hombre personalizadas",
    title: "Billeteras para hombre personalizadas en El Salvador",
    description:
      "Billeteras de cuero para hombre y caballero, personalizables desde $50: elige color, piel, forro y grabado. Envíos a todo El Salvador.",
    intro:
      "Billeteras para caballero hechas a mano y diseñadas por ti, empezando por la Bifold Signature. Elige el color, el tipo de cuero y graba tus iniciales.",
    keyword: "billetera hombre",
    secondary: ["billetera para caballero", "billetera caballero", "billetera hombre original"],
    // Arquitectura: /billeteras-hombre/ → Bifold Signature.
    filter: { slugs: ["bifold-signature-atelier"] },
    image: "/configurador/modelos/bifold-signature-atelier/caramelo.jpg",
    faq: [
      {
        q: "¿Cuánto cuesta una billetera para hombre personalizada?",
        a: "Todas parten de $50. El precio final depende de lo que elijas en el configurador (tipo de piel, herrajes, accesorios) y lo ves antes de comprar.",
      },
      {
        q: "¿Cuál es la mejor billetera de caballero para uso diario?",
        a: "La Bifold Signature: seis ranuras, doble compartimento para billetes y perfil delgado. Si prefieres algo más compacto, mira los tarjeteros slim.",
      },
    ],
  },
  {
    segments: ["billeteras-hombre", "rfid"],
    label: "Con bloqueo RFID",
    h1: "Billeteras con bloqueo RFID para hombre",
    title: "Billetera con bloqueo RFID para hombre",
    description:
      "Billeteras de cuero para hombre con bloqueo RFID y NFC que protegen tus tarjetas contactless. Personalizables desde $58 en El Salvador.",
    intro:
      "La versión con bloqueo RFID de nuestra billetera de caballero: un forro que impide la lectura sin contacto (RFID y NFC) de tus tarjetas. Viene incluido de fábrica en estos modelos.",
    keyword: "billetera con bloqueo rfid",
    secondary: ["billetera con bloqueo nfc", "billeteras para hombre con bloqueo rfid"],
    // El RFID no es un accesorio libre: solo existe en estos modelos y
    // únicamente al abrirlos desde esta página (viene incluido, no se quita).
    filter: { slugs: ["bifold-signature-atelier"] },
    preset: { rfid: "si" },
    image: "/configurador/materiales/rfid/si.jpg",
    faq: [
      {
        q: "¿Qué protege el bloqueo RFID?",
        a: "Impide que alguien lea tus tarjetas contactless a distancia con un lector. También bloquea NFC.",
      },
      {
        q: "¿Cuánto cuesta la versión con RFID?",
        a: "Suma $8 al precio de la billetera. El bloqueo viene incluido en los modelos de esta página y sigues eligiendo color, piel, forro y grabado.",
      },
    ],
  },
  {
    segments: ["billeteras-hombre", "minimalistas-slim"],
    label: "Minimalistas slim",
    h1: "Billeteras minimalistas y slim para hombre",
    title: "Billetera compacta para hombre, minimalista y slim",
    description:
      "Billeteras compactas para hombre: perfil delgado para el bolsillo delantero, en cuero personalizable desde $50. Envíos a todo El Salvador.",
    intro:
      "Para quien lleva solo lo esencial: modelos de perfil extraplano que caben en el bolsillo delantero sin abultar. Eliges el color, la piel y el grabado.",
    keyword: "billetera compacta",
    secondary: ["billetera hombre compacta"],
    // Arquitectura: /billeteras-hombre/minimalistas-slim/ → modelos slim para hombre.
    filter: { tags: ["hombre", "slim"] },
    image: "/categorias/minimalistas-slim.webp",
    faq: [
      {
        q: "¿Qué billetera compacta para hombre cabe en el bolsillo delantero?",
        a: "El Tarjetero No. 01: perfil extraplano de 4 ranuras con bolsillo central para billetes doblados. Si necesitas más espacio, el Plegable Slim guarda hasta 8 tarjetas.",
      },
    ],
  },
  {
    segments: ["billeteras-hombre", "cuero-personalizadas"],
    label: "Cuero personalizadas",
    h1: "Billeteras de cuero personalizadas para hombre",
    title: "Billetera para hombre personalizada y grabada en cuero",
    description:
      "Billeteras para hombre en cuero genuino, personalizadas y grabadas con tus iniciales desde $50. Hechas a mano en El Salvador.",
    intro:
      "Diseña tu billetera de cuero: elige entre vacuno liso, grano entero, curtido vegetal o Crazy Horse, y graba tus iniciales en golpe seco o lámina de oro.",
    keyword: "billetera para hombre personalizada",
    secondary: [
      "billetera hombre personalizada",
      "billetera hombre grabada",
      "billetera cuero genuino hombre",
      "billetera cuero vacuno hombre",
    ],
    filter: { slugs: ["bifold-signature-atelier"] },
    // Entra directo al monograma del configurador.
    anchor: "grupo-grabado",
    image: "/categorias/hombre-cuero-personalizadas.webp",
    faq: [
      {
        q: "¿La billetera es de cuero genuino?",
        a: "Sí. Todas son de cuero genuino: el vacuno liso va incluido y puedes cambiarlo por piel de grano entero, curtido vegetal o Crazy Horse.",
      },
      {
        q: "¿Cuánto cuesta grabar la billetera?",
        a: "El grabado de hasta 12 caracteres en golpe seco va incluido. La lámina de oro suma $8.",
      },
    ],
  },
  /* ------------------------------------------------ Silo: mujer */
  {
    segments: ["billeteras-mujer"],
    label: "Billeteras mujer",
    h1: "Billeteras para mujer personalizadas",
    title: "Billeteras para mujer y dama personalizadas en El Salvador",
    description:
      "Billeteras de cuero para mujer y dama, personalizables desde $50: largas, con cremallera y tarjeteros. Envíos a todo El Salvador.",
    intro:
      "Billeteras para dama hechas a mano: la Continental Roma y la Billetera con Cremallera de cinco divisiones. Tú eliges el color, la piel y el forro.",
    keyword: "billetera mujer",
    secondary: ["billetera para mujer", "billetera dama", "billetera para dama"],
    // Arquitectura: /billeteras-mujer/ → Continental Roma y Billetera con Cremallera.
    filter: { slugs: ["billetera-continental-roma", "billetera-zip-accordion"] },
    image: "/configurador/modelos/billetera-zip-accordion/salvia.jpg",
    faq: [
      {
        q: "¿Qué billetera para mujer tiene más espacio?",
        a: "La Billetera Continental Roma: doce ranuras, fuelle interior y espacio para billetes enteros o pasaporte.",
      },
      {
        q: "¿Puedo regalarla con su nombre grabado?",
        a: "Sí. Escribe el nombre o las iniciales en el configurador y elige la caja de regalo rígida (+$10).",
      },
    ],
  },
  {
    segments: ["billeteras-mujer", "cuero-personalizadas"],
    label: "Cuero personalizadas",
    h1: "Billeteras de cuero personalizadas para mujer",
    title: "Billetera para mujer personalizada en cuero",
    description:
      "Billeteras para mujer en cuero vacuno, personalizadas con su nombre o iniciales desde $50. Hechas a mano en El Salvador.",
    intro:
      "Billeteras para dama que diseñas a tu gusto: color, tipo de cuero, forro y un grabado con su nombre o iniciales.",
    keyword: "billetera mujer personalizada",
    secondary: ["billetera cuero vacuno mujer"],
    filter: { slugs: ["billetera-continental-roma", "billetera-zip-accordion"] },
    anchor: "grupo-grabado",
    image: "/categorias/mujer-cuero-personalizadas.webp",
    faq: [
      {
        q: "¿Puedo grabar un nombre completo?",
        a: "Sí, hasta 12 caracteres entre letras, números y los signos . & ' -. El grabado en golpe seco va incluido.",
      },
    ],
  },
  /* ------------------------------------------------ Silo: tarjeteros */
  {
    segments: ["tarjeteros"],
    label: "Tarjeteros",
    h1: "Tarjeteros de cuero personalizados",
    title: "Tarjeteros de cuero personalizados en El Salvador",
    description:
      "Tarjeteros de cuero originales y ejecutivos, personalizables desde $50. Para hombre y mujer, con grabado incluido.",
    intro:
      "Tarjeteros delgados para llevar solo lo esencial: el Tarjetero No. 01 de 4 ranuras y el Plegable Slim con cierre magnético.",
    keyword: "tarjetero",
    secondary: ["tarjetero original", "tarjetero ejecutivo", "tarjetero unisex"],
    // Arquitectura: /tarjeteros/ → Tarjetero No. 01 y Tarjetero Plegable Slim.
    filter: { slugs: ["tarjetero-atelier-no-01", "tarjetero-plegable-slim"] },
    image: "/configurador/modelos/tarjetero-atelier-no-01/indigo.jpg",
    faq: [
      {
        q: "¿Un tarjetero sirve para billetes?",
        a: "Sí. El Tarjetero No. 01 tiene un bolsillo central para billetes doblados y el Plegable Slim guarda recibos y billetes.",
      },
    ],
  },
  {
    segments: ["tarjeteros", "hombre"],
    label: "Para hombre",
    h1: "Tarjeteros para hombre",
    title: "Tarjetero para hombre y caballero",
    description:
      "Tarjeteros de cuero para hombre y caballero, delgados y personalizables desde $50.",
    intro:
      "Tarjeteros sobrios para el bolsillo delantero o el saco. Elige un tono clásico como negro azabache o azul añil.",
    keyword: "tarjetero hombre",
    secondary: ["tarjetero para hombre", "tarjetero caballero", "tarjetero para caballero"],
    filter: { categories: ["tarjetero"], tags: ["hombre"] },
    image: "/configurador/modelos/tarjetero-atelier-no-01/azabache.jpg",
    faq: [
      {
        q: "¿Qué colores tienen los tarjeteros para hombre?",
        a: "Negro azabache, azul añil, verde salvia y caramelo tostado, según el modelo.",
      },
    ],
  },
  {
    segments: ["tarjeteros", "mujer"],
    label: "Para mujer",
    h1: "Tarjeteros para mujer",
    title: "Tarjetero para mujer y dama",
    description:
      "Tarjeteros de cuero para mujer y dama, compactos y personalizables desde $50.",
    intro:
      "Tarjeteros compactos que caben en cualquier bolso. Combínalos con un forro de color y su nombre grabado.",
    keyword: "tarjetero mujer",
    secondary: ["tarjetero para mujer", "tarjetero dama", "tarjetero para dama"],
    filter: { categories: ["tarjetero"], tags: ["mujer"] },
    image: "/configurador/modelos/tarjetero-plegable-slim/salvia.jpg",
    faq: [
      {
        q: "¿Puedo elegir el color del forro?",
        a: "Sí: arena natural, algodón crudo, lona añil o verde tormenta.",
      },
    ],
  },
  {
    segments: ["tarjeteros", "rfid-anti-clonacion"],
    label: "RFID anticlonación",
    h1: "Tarjeteros con bloqueo RFID anticlonación",
    title: "Tarjetero con bloqueo RFID anticlonación",
    description:
      "Tarjeteros de cuero con bloqueo RFID y NFC para proteger tus tarjetas de la clonación. Desde $58.",
    intro:
      "Protege tus tarjetas contactless de la clonación. Estos tarjeteros vienen con el bloqueo RFID incluido de fábrica.",
    keyword: "tarjetero con bloqueo rfid",
    secondary: ["tarjetero mujer con bloqueo rfid", "tarjetero con bloqueo nfc"],
    filter: { slugs: ["tarjetero-atelier-no-01", "tarjetero-plegable-slim"] },
    preset: { rfid: "si" },
    image: "/configurador/materiales/rfid/si.jpg",
    faq: [
      {
        q: "¿El bloqueo RFID hace más grueso el tarjetero?",
        a: "No de forma notable: es una capa delgada dentro del forro.",
      },
    ],
  },
  {
    segments: ["tarjeteros", "cuero-grabados"],
    label: "Cuero grabados",
    h1: "Tarjeteros de cuero grabados y personalizables",
    title: "Tarjetero personalizable de cuero con grabado",
    description:
      "Tarjeteros de cuero personalizables con grabado de iniciales o nombre desde $50. Hechos a mano en El Salvador.",
    intro:
      "Elige tu tarjetero y grábalo con iniciales o un nombre: en golpe seco va incluido, o en lámina de oro para un acabado dorado.",
    keyword: "tarjetero personalizable",
    secondary: [],
    filter: { slugs: ["tarjetero-atelier-no-01", "tarjetero-plegable-slim"] },
    anchor: "grupo-grabado",
    image: "/categorias/tarjeteros-cuero-grabados.webp",
    faq: [
      {
        q: "¿Dónde va el grabado del tarjetero?",
        a: "En la cara interior, en versalitas. Puedes elegir golpe seco (incluido) o lámina de oro (+$8).",
      },
    ],
  },
];

export function routePath(route: CatalogRoute): string {
  return `/${route.segments.join("/")}`;
}

export function findRoute(segments: string[]): CatalogRoute | undefined {
  return CATALOG_ROUTES.find(
    (r) => r.segments.join("/") === segments.join("/"),
  );
}

/** Los tres silos de primer nivel, en el orden del menú. */
export const SILOS = CATALOG_ROUTES.filter((r) => r.segments.length === 1);

export function childrenOf(silo: CatalogRoute): CatalogRoute[] {
  return CATALOG_ROUTES.filter(
    (r) => r.segments.length === 2 && r.segments[0] === silo.segments[0],
  );
}

/**
 * El RFID no se ofrece como accesorio en el configurador: solo viene
 * incluido en los modelos de las páginas RFID de la arquitectura, y solo
 * cuando se abren desde ahí (?rfid=si).
 */
export const RFID_MODELS: string[] = [
  ...new Set(
    CATALOG_ROUTES.filter((r) => r.preset?.rfid === "si").flatMap(
      (r) => r.filter.slugs ?? [],
    ),
  ),
];

export function includesRfid(slug: string, rfid: string | undefined): boolean {
  return rfid === "si" && RFID_MODELS.includes(slug);
}

/** Enlace al configurador con el preset y el ancla de la subcategoría. */
export function configuratorHref(slug: string, route?: CatalogRoute): string {
  const qs = new URLSearchParams(route?.preset ?? {}).toString();
  return `/personalizar/${slug}${qs ? `?${qs}` : ""}${route?.anchor ? `#${route.anchor}` : ""}`;
}
