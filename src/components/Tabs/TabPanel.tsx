import type { ComponentPropsWithoutRef } from "react";
import { panelId, tabId, useTabsContext } from "./TabsContext";

export type TabPanelProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "className" | "role" | "id" | "hidden" | "aria-labelledby" | "tabIndex"
> & {
  /** Must match the `value` of the `Tab` this panel belongs to. */
  value: string;
};

/**
 * Content of one tab. Unselected panels stay mounted and are hidden with the
 * `hidden` attribute, so `aria-controls` always resolves.
 */
export function TabPanel({ value, children, ...rest }: TabPanelProps) {
  const { baseId, value: activeValue } = useTabsContext("TabPanel");
  const isSelected = value === activeValue;

  return (
    <div
      role="tabpanel"
      id={panelId(baseId, value)}
      aria-labelledby={tabId(baseId, value)}
      // The panel is a tab stop, so Tab moves the focus from the tablist into it.
      // biome-ignore lint/a11y/noNoninteractiveTabindex: required by the WAI-ARIA Tabs pattern
      tabIndex={0}
      // Hidden, never unmounted: aria-controls must always resolve to an element.
      hidden={!isSelected}
      className="ds-tab-panel"
      {...rest}
    >
      {children}
    </div>
  );
}
