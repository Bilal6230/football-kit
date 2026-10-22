import type { ComponentPropsWithoutRef } from "react";

export interface BadgeProps extends ComponentPropsWithoutRef<"span"> {
  tone?: "neutral" | "olive" | "dark";
}

export function Badge({ tone = "neutral", className = "", ...props }: BadgeProps) {
  return <span className={`badge badge--${tone} ${className}`} {...props} />;
}
