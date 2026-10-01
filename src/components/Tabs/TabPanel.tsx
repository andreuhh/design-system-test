import type { ComponentPropsWithoutRef } from "react";
import { panelId, tabId, useTabsContext } from "./TabsContext";

export type TabPanelProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "className" | "role" | "id" | "hidden" | "aria-labelledby" | "tabIndex"
> & {
  value: string;
};

export function TabPanel({ value, children, ...rest }: TabPanelProps) {
  const { baseId, value: activeValue } = useTabsContext("TabPanel");
  const isSelected = value === activeValue;

  return (
    <div
      {...rest}
      role="tabpanel"
      id={panelId(baseId, value)}
      aria-labelledby={tabId(baseId, value)}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: required by the WAI-ARIA Tabs pattern
      tabIndex={0}
      // Never unmounted: aria-controls must always resolve to an element.
      hidden={!isSelected}
      className="ds-tab-panel"
    >
      {children}
    </div>
  );
}
