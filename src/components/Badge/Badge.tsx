import type { ComponentPropsWithoutRef } from "react";
import "./Badge.scss";

export type BadgeVariant = "neutral" | "positive" | "negative";

export interface BadgeProps extends Omit<ComponentPropsWithoutRef<"span">, "className"> {
  variant?: BadgeVariant;
}

export function Badge({ variant = "neutral", children, ...rest }: BadgeProps) {
  return (
    <span {...rest} className={`ds-badge ds-badge--${variant}`}>
      {children}
    </span>
  );
}
