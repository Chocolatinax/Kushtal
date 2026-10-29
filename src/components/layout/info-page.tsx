import type { ReactNode } from "react";

import { Eyebrow } from "@/components/ui/badge";

/**
 * Plantilla de las páginas de ayuda y legales: encabezado y secciones de
 * texto con el mismo ritmo tipográfico que el resto del sitio.
 */
export function InfoPage({
  eyebrow,
  title,
  intro,
  sections,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections?: { title: string; body: ReactNode }[];
  children?: ReactNode;
}) {
  return (
    <div className="canvas py-12 lg:py-16">
      <div className="max-w-2xl">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-3 font-display text-[30px] leading-[38px] font-semibold text-piedra md:text-[40px] md:leading-[48px]">
          {title}
        </h1>
        <p className="mt-4 text-[15px] leading-6 text-ink-muted">{intro}</p>
      </div>

      {sections && (
        <div className="mt-10 grid max-w-3xl gap-5">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-xl border border-outline-variant/70 bg-surface-lowest p-6"
            >
              <h2 className="font-display text-[20px] leading-7 font-semibold text-piedra">
                {section.title}
              </h2>
              <div className="mt-2 flex flex-col gap-2 text-[14px] leading-6 text-ink-muted">
                {section.body}
              </div>
            </section>
          ))}
        </div>
      )}

      {children}
    </div>
  );
}
