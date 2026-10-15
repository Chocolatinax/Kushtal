import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/format";

type Variant = "primary" | "craft" | "outline" | "tertiary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-sans font-semibold " +
  "transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none " +
  "whitespace-nowrap select-none";

const variants: Record<Variant, string> = {
  // Añil sólido con micro-elevación al hover (DESIGN.md)
  primary:
    "bg-anil text-algodon rounded-sm hover:bg-anil-deep hover:-translate-y-px " +
    "hover:shadow-warm active:translate-y-0",
  craft:
    "bg-cafe text-algodon rounded-sm hover:brightness-110 hover:-translate-y-px " +
    "hover:shadow-warm active:translate-y-0",
  outline:
    "border-[1.5px] border-piedra/80 text-piedra rounded-sm bg-transparent " +
    "hover:bg-piedra hover:text-algodon",
  tertiary:
    "bg-torogoz/12 text-torogoz-ink rounded-sm hover:bg-torogoz/20",
  ghost:
    "text-piedra rounded-sm hover:text-anil link-underline px-0",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-8 text-sm",
};

interface SharedProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: SharedProps & ComponentPropsWithoutRef<"button">) {
  return (
    <button
      className={cn(
        base,
        variants[variant],
        variant === "ghost" ? sizes[size].replace(/px-\d+/, "px-0") : sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  ...props
}: SharedProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, "className" | "children">) {
  return (
    <Link
      href={href}
      className={cn(
        base,
        variants[variant],
        variant === "ghost" ? sizes[size].replace(/px-\d+/, "px-0") : sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
