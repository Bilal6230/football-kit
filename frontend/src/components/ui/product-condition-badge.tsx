import { Badge, type BadgeProps } from "./badge";

const conditions = {
  excellent: { label: "Excellent", tone: "olive" },
  good: { label: "Good", tone: "neutral" },
  fair: { label: "Fair", tone: "neutral" },
  new: { label: "Brand new", tone: "dark" },
} as const;

export interface ProductConditionBadgeProps extends Omit<BadgeProps, "tone" | "children"> {
  condition: keyof typeof conditions;
}

export function ProductConditionBadge({ condition, ...props }: ProductConditionBadgeProps) {
  const { label, tone } = conditions[condition];
  return <Badge tone={tone} {...props}><span className="sr-only">Condition: </span>{label}</Badge>;
}
