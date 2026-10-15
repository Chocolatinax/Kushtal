import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/format";

const control =
  "w-full rounded-sm border border-outline-variant bg-surface-container " +
  "px-4 py-3 text-[15px] text-ink placeholder:text-ink-muted/60 " +
  "transition-[border-color,box-shadow] duration-200 " +
  "focus:border-anil focus:border-[1.5px] focus:outline-none " +
  "focus:shadow-[0_0_0_3px_rgb(30_43_79_/_0.08)] " +
  "aria-[invalid=true]:border-danger";

export function Field({
  label,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="label-pill text-ink">{label}</label>
      {children}
      {error ? (
        <p className="text-[13px] text-danger-ink">{error}</p>
      ) : hint ? (
        <p className="text-[13px] text-ink-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function Input({
  className,
  ...props
}: ComponentPropsWithoutRef<"input">) {
  return <input className={cn(control, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: ComponentPropsWithoutRef<"textarea">) {
  return <textarea className={cn(control, "resize-y", className)} {...props} />;
}

export function Select({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"select">) {
  return (
    <select className={cn(control, "cursor-pointer pr-10", className)} {...props}>
      {children}
    </select>
  );
}
