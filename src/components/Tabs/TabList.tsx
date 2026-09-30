import type { ComponentPropsWithoutRef } from "react";
import { useTabsContext } from "./TabsContext";
import { useRovingFocus } from "./useRovingFocus";

/** A tablist always needs an accessible name (WAI-ARIA Tabs pattern). */
type TabListLabelProps =
  | { "aria-label": string; "aria-labelledby"?: never }
  | { "aria-labelledby": string; "aria-label"?: never };

export type TabListProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "className" | "role" | "aria-label" | "aria-labelledby"
> &
  TabListLabelProps;

export function TabList({ children, onKeyDown, ...rest }: TabListProps) {
  const { variant, selectTab } = useTabsContext("TabList");
  const handleKeyDown = useRovingFocus(selectTab);

  return (
    <div
      role="tablist"
      className={`ds-tab-list ds-tab-list--${variant}`}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        // The consumer handler runs first and can opt out of our navigation.
        if (!event.defaultPrevented) {
          handleKeyDown(event);
        }
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
