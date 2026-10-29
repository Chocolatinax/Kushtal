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
  filter: { tags?: string[]; categories?: string[] };
  preset?: Configuration;
  /** Sección del configurador a la que se salta al entrar (id del fieldset). */
  anchor?: string;
  /** Foto para las bolitas. */
  image: string;
  faq: { q: string; a: string }[];
}

const BILLETERAS = ["bifold", "larga", "cremallera"];

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
      "Billeteras para caballero hechas a mano y diseñadas por ti: bifold clásica, tarjeteros slim y porta pasaporte. Elige el color, el tipo de cuero y graba tus iniciales.",
    keyword: "billetera hombre",
    secondary: ["billetera para caballero", "billetera caballero", "billetera hombre original"],
    filter: { tags: ["hombre"] },
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
      "Billeteras de cuero para hombre con bloqueo RFID y NFC que protegen tus tarjetas contactless. Personalizables desde $50 en El Salvador.",
    intro:
      "Agrega a tu billetera un forro que bloquea la lectura sin contacto (RFID y NFC) de tus tarjetas. Al abrir cualquier modelo desde aquí, el bloqueo ya viene activado.",
    keyword: "billetera con bloqueo rfid",
    secondary: ["billetera con bloqueo nfc", "billeteras para hombre con bloqueo rfid"],
    filter: { tags: ["hombre"] },
    preset: { rfid: "si" },
    image: "/configurador/materiales/rfid/si.jpg",
    faq: [
      {
        q: "¿Qué protege el bloqueo RFID?",
        a: "Impide que alguien lea tus tarjetas contactless a distancia con un lector. También bloquea NFC.",
      },
      {
        q: "¿Cuánto cuesta agregar RFID?",
        a: "Suma $8 al precio de tu billetera. Lo puedes agregar a cualquier modelo desde el configurador.",
      },
    ],
  },
  {
    segments: ["billeteras-hombre", "minimalistas-slim"],
    label: "Minimalistas slim",
    h1: "Billeteras minimalistas y slim para hombre",
    title: "Billetera compacta y slim para hombre",
    description:
      "Billeteras compactas y slim para hombre: tarjeteros de cuero delgados para el bolsillo delantero. Personalizables desde $50.",
    intro:
      "Para quien quiere llevar solo lo esencial: tarjeteros de 5 mm de grosor y plegables con cierre magnético, cómodos en el bolsillo delantero.",
    keyword: "billetera compacta",
    secondary: ["billetera hombre compacta"],
    filter: { tags: ["hombre", "slim"] },
    image: "/configurador/modelos/tarjetero-plegable-slim/azabache.jpg",
    faq: [
      {
        q: "¿Cuántas tarjetas caben en una billetera slim?",
        a: "El Tarjetero No. 01 lleva 4 ranuras y un bolsillo central; el Tarjetero Plegable Slim, hasta 8 tarjetas.",
      },
    ],
  },
  {
    segments: ["billeteras-hombre", "cuero-personalizadas"],
    label: "De cuero personalizadas",
    h1: "Billeteras de cuero personalizadas para hombre",
    title: "Billetera de cuero personalizada para hombre",
    description:
      "Billeteras de cuero genuino para hombre, personalizadas con tu nombre o iniciales grabadas. Cuero vacuno, grano entero o Crazy Horse.",
    intro:
      "Cuero vacuno genuino, grano entero, curtido vegetal o Crazy Horse, con tu monograma grabado en golpe seco (incluido) o lámina de oro.",
    keyword: "billetera para hombre personalizada",
    secondary: [
      "billetera hombre personalizada",
      "billetera hombre grabada",
      "billetera cuero genuino hombre",
      "billetera cuero vacuno hombre",
    ],
    filter: { tags: ["hombre"], categories: BILLETERAS },
    anchor: "grupo-grabado",
    image: "/configurador/materiales/textura/vacuna-lisa.jpg",
    faq: [
      {
        q: "¿El grabado tiene costo?",
        a: "No. El monograma de hasta 12 caracteres en golpe seco va incluido. La lámina de oro suma $8.",
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
      "Billeteras para dama hechas a mano: la continental larga, la de cremallera con cinco divisiones y tarjeteros compactos. Tú eliges el color, la piel y el forro.",
    keyword: "billetera mujer",
    secondary: ["billetera para mujer", "billetera dama", "billetera para dama"],
    filter: { tags: ["mujer"] },
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
    label: "De cuero personalizadas",
    h1: "Billeteras de cuero personalizadas para mujer",
    title: "Billetera de cuero personalizada para mujer",
    description:
      "Billeteras de cuero vacuno para mujer, personalizadas con su nombre o iniciales. Diseña la tuya desde $50.",
    intro:
      "Elige el cuero, el forro y el color, y graba su nombre o iniciales. Ideal como regalo.",
    keyword: "billetera mujer personalizada",
    secondary: ["billetera cuero vacuno mujer"],
    filter: { tags: ["mujer"], categories: BILLETERAS },
    anchor: "grupo-grabado",
    image: "/configurador/modelos/billetera-continental-roma/caramelo.jpg",
    faq: [
      {
        q: "¿Cuánto tarda una billetera personalizada?",
        a: "De 3 a 5 días hábiles de confección más 1 a 3 días de entrega en El Salvador.",
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
    filter: { categories: ["tarjetero"] },
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
      "Tarjeteros de cuero con bloqueo RFID y NFC para proteger tus tarjetas de la clonación. Desde $50.",
    intro:
      "Protege tus tarjetas contactless de la clonación. Al abrir un modelo desde aquí, el bloqueo RFID ya viene activado.",
    keyword: "tarjetero con bloqueo rfid",
    secondary: ["tarjetero mujer con bloqueo rfid", "tarjetero con bloqueo nfc"],
    filter: { categories: ["tarjetero"] },
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
    label: "De cuero grabados",
    h1: "Tarjeteros de cuero grabados",
    title: "Tarjetero personalizable de cuero grabado",
    description:
      "Tarjeteros de cuero personalizables con tus iniciales o nombre grabado en golpe seco o lámina de oro.",
    intro:
      "Graba hasta 12 caracteres en la cara interior: iniciales, un nombre o una fecha. El golpe seco va incluido.",
    keyword: "tarjetero personalizable",
    secondary: [],
    filter: { categories: ["tarjetero"] },
    anchor: "grupo-grabado",
    image: "/configurador/modelos/tarjetero-atelier-no-01/caramelo.jpg",
    faq: [
      {
        q: "¿Puedo grabar el logo de mi empresa?",
        a: "Para logos y pedidos corporativos desde 10 unidades, escríbenos desde la página de contacto.",
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

/** Enlace al configurador con el preset y el ancla de la subcategoría. */
export function configuratorHref(slug: string, route?: CatalogRoute): string {
  const qs = new URLSearchParams(route?.preset ?? {}).toString();
  return `/personalizar/${slug}${qs ? `?${qs}` : ""}${route?.anchor ? `#${route.anchor}` : ""}`;
}
