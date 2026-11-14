"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { WhatsAppIcon } from "@/components/ui/social-icons";
import { cn } from "@/lib/format";
import { WHATSAPP_NUMBER } from "@/lib/site";

const MESSAGE = "Hola, Kushtal. Tengo una duda sobre mi billetera.";
const HREF = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGE)}`;

/** Franja inferior de la pantalla que ocupa el botón (alto + margen). */
const ZONE_PX = 96;

/**
 * Botón flotante de WhatsApp, abajo a la derecha en todo el sitio.
 *
 * En celular no debe tapar los botones principales (Añadir a la bolsa,
 * Confirmar pedido): esos llevan `data-whatsapp-avoid` y, mientras uno pasa
 * por la franja inferior de la pantalla, el botón se aparta.
 */
export function WhatsAppButton() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 1023px)");
    let frame = 0;

    const check = () => {
      frame = 0;
      if (!mobile.matches) {
        setHidden(false);
        return;
      }
      const limit = window.innerHeight - ZONE_PX;
      const overlaps = Array.from(
        document.querySelectorAll<HTMLElement>("[data-whatsapp-avoid]"),
      ).some((el) => {
        const r = el.getBoundingClientRect();
        return r.bottom > limit && r.top < window.innerHeight;
      });
      setHidden(overlaps);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    mobile.addEventListener("change", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      mobile.removeEventListener("change", schedule);
    };
  }, [pathname]);

  return (
    <a
      href={HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      className={cn(
        "fixed right-4 bottom-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-torogoz text-algodon shadow-lg transition-all duration-300 hover:bg-torogoz-ink focus-visible:outline-offset-4 lg:right-6 lg:bottom-6",
        hidden && "pointer-events-none translate-y-6 opacity-0",
      )}
    >
      <WhatsAppIcon size={26} />
    </a>
  );
}
