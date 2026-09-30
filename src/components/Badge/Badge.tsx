import type { ComponentPropsWithoutRef } from "react";
import "./Badge.scss";

export type BadgeVariant = "neutral" | "positive" | "negative";

export interface BadgeProps extends Omit<ComponentPropsWithoutRef<"span">, "className"> {
  /** Colour of the badge. Defaults to `"neutral"`. */
  variant?: BadgeVariant;
}

/**
 * A short label highlighting a piece of information, such as a count or a status.
 *
 * The text carries the meaning: the variant only adds colour on top of it.
 */
export function Badge({ variant = "neutral", children, ...rest }: BadgeProps) {
  return (
    <span className={`ds-badge ds-badge--${variant}`} {...rest}>
      {children}
    </span>
  );
}
