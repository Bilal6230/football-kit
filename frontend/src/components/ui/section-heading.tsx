import type { ReactNode } from "react";

export interface SectionHeadingProps {
  id?: string;
  eyebrow?: string;
  children: ReactNode;
  description?: string;
  as?: "h2" | "h3";
}

export function SectionHeading({ id, eyebrow, children, description, as: Heading = "h2" }: SectionHeadingProps) {
  return <div className="space-y-3">
    {eyebrow ? <p className="eyebrow text-muted">{eyebrow}</p> : null}
    <Heading id={id} className="font-display text-heading leading-tight tracking-tight">{children}</Heading>
    {description ? <p className="max-w-prose text-muted leading-relaxed">{description}</p> : null}
  </div>;
}
