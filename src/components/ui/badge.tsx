import type { ReactNode } from "react";

import { cn } from "@/lib/format";

type Tone = "neutral" | "craft" | "eco" | "anil";

const tones: Record<Tone, string> = {
  // Tags de estado: ceniza con texto piedra
  neutral: "bg-ceniza text-piedra border-transparent",
  // Insignias de herencia: borde café fino
  craft: "bg-transparent text-cafe border-cafe/60",
  // Etiqueta eco/origen: torogoz al 15%
  eco: "bg-torogoz/15 text-torogoz-ink border-transparent",
  anil: "bg-anil text-algodon border-transparent",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 label-pill",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("eyebrow text-cafe", className)}>{children}</p>
  );
}
