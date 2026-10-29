/** URL pública del sitio, sin barra final. La usan metadata, sitemap y JSON-LD. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

/** Correo de contacto que aparece en las páginas de ayuda. */
export const CONTACT_EMAIL = "hola@kushtal.com";

/** WhatsApp de atención, formato internacional sin signos. */
export const WHATSAPP_NUMBER = "50370000000";

/** Redes sociales del footer. Reemplazar por las cuentas reales de Kushtal. */
export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/kushtal.sv",
  tiktok: "https://www.tiktok.com/@kushtal.sv",
  facebook: "https://www.facebook.com/kushtal.sv",
};
