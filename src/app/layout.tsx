import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Kushtal — Atelier de Marroquinería",
    template: "%s · Kushtal",
  },
  description:
    "Billeteras y tarjeteros de piel curtida al vegetal, personalizados pieza por pieza en nuestro taller. Grabado incluido y garantía de por vida.",
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Kushtal",
    title: "Kushtal — Atelier de Marroquinería",
    description:
      "El arte del cuero hecho a tu medida. Configurá tu pieza: tono, textura, pespunte y monograma.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="flex min-h-dvh flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
