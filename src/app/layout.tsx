import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { SITE_URL } from "@/lib/site";
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Kushtal · Billeteras personalizadas en El Salvador",
    template: "%s · Kushtal",
  },
  description:
    "Billeteras y tarjeteros de cuero personalizables desde $50. Diseña la tuya con nuestro configurador y mírala en tiempo real antes de comprar.",
  openGraph: {
    type: "website",
    locale: "es_SV",
    siteName: "Kushtal",
    title: "Kushtal · Billeteras personalizadas en El Salvador",
    description:
      "Diseña tu billetera: color, tipo de piel, forro, accesorios y monograma. Desde $50.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kushtal · Billeteras personalizadas en El Salvador",
    description:
      "Diseña tu billetera: color, tipo de piel, forro, accesorios y monograma. Desde $50.",
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
