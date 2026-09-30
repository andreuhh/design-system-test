import { createContext, useContext } from "react";

export type TabsVariant = "pill" | "underline";

export interface TabsContextValue {
  /** Base for the generated ids, so tab and panel can reference each other. */
  baseId: string;
  variant: TabsVariant;
  /** Value of the currently selected tab. */
  value: string;
  selectTab: (value: string) => void;
}

export const TabsContext = createContext<TabsContextValue | null>(null);

export function useTabsContext(componentName: string): TabsContextValue {
  const context = useContext(TabsContext);

  if (context === null) {
    throw new Error(`<${componentName}> must be rendered inside a <Tabs>.`);
  }

  return context;
}

/**
 * `aria-controls` and `aria-labelledby` hold space separated id lists, so a
 * value like "my files" would break the link between tab and panel.
 */
function toIdPart(value: string): string {
  return value.replace(/\s+/g, "-");
}

export function tabId(baseId: string, value: string): string {
  return `${baseId}-tab-${toIdPart(value)}`;
}

export function panelId(baseId: string, value: string): string {
  return `${baseId}-panel-${toIdPart(value)}`;
}
