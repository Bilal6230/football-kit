import type { ComponentPropsWithoutRef } from "react";

export function Divider({ className = "", ...props }: ComponentPropsWithoutRef<"hr">) {
  return <hr className={`border-0 border-t border-line ${className}`} {...props} />;
}
