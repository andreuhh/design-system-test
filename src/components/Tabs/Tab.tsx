import type { ComponentPropsWithoutRef } from "react";
import { Badge, type BadgeVariant } from "../Badge";
import { panelId, tabId, useTabsContext } from "./TabsContext";

export interface TabBadge {
  /** Badge text. It becomes part of the accessible name of the tab. */
  label: string;
  /** Badge colour. Defaults to `"neutral"`. */
  variant?: BadgeVariant;
}

export type TabProps = Omit<
  ComponentPropsWithoutRef<"button">,
  | "className"
  | "role"
  | "id"
  | "type"
  | "value"
  | "aria-selected"
  | "aria-controls"
  | "tabIndex"
  // Out of scope: there is no disabled state in the design, and automatic
  // activation would select a disabled tab while the focus stays behind.
  | "disabled"
> & {
  /** Identifies the tab and links it to the `TabPanel` with the same value. */
  value: string;
  /** Renders a `Badge` after the label. */
  badge?: TabBadge;
};

/**
 * A single tab. Selecting it shows the `TabPanel` with the same `value`.
 *
 * A consumer `onClick` runs before the selection and can cancel it by calling
 * `event.preventDefault()`.
 */
export function Tab({ value, badge, children, onClick, ...rest }: TabProps) {
  const { baseId, variant, value: activeValue, selectTab } = useTabsContext("Tab");
  const isSelected = value === activeValue;

  return (
    <button
      type="button"
      role="tab"
      id={tabId(baseId, value)}
      aria-controls={panelId(baseId, value)}
      aria-selected={isSelected}
      // Roving tabindex: the tablist is a single tab stop.
      tabIndex={isSelected ? 0 : -1}
      // Read by useRovingFocus, which walks the DOM instead of a registry.
      data-value={value}
      className={`ds-tab ds-tab--${variant}`}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          selectTab(value);
        }
      }}
      {...rest}
    >
      <span className="ds-tab__label">{children}</span>
      {badge ? (
        <>
          {/* Real space: without it the accessible name would be "FilesWarning". */}{" "}
          <Badge variant={badge.variant}>{badge.label}</Badge>
        </>
      ) : null}
    </button>
  );
}
