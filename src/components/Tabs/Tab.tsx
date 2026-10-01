import type { ComponentPropsWithRef } from "react";
import { Badge, type BadgeVariant } from "../Badge";
import { panelId, tabId, useTabsContext } from "./TabsContext";

export interface TabBadge {
  label: string;
  variant?: BadgeVariant;
}

export type TabProps = Omit<
  ComponentPropsWithRef<"button">,
  | "className"
  | "role"
  | "id"
  | "type"
  | "value"
  | "aria-selected"
  | "aria-controls"
  | "tabIndex"
  | "disabled"
> & {
  value: string;
  badge?: TabBadge;
};
export function Tab({ value, badge, children, onClick, ...rest }: TabProps) {
  const { baseId, variant, value: activeValue, selectTab } = useTabsContext("Tab");
  const isSelected = value === activeValue;

  return (
    <button
      // Spread first: internal attributes below must win over consumer props.
      {...rest}
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
