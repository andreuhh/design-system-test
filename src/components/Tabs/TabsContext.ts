import { createContext, useContext } from "react";

export type TabsVariant = "pill" | "underline";

export interface TabsContextValue {
  baseId: string;
  variant: TabsVariant;
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

/** `aria-controls` and `aria-labelledby` are space separated id lists. */
function toIdPart(value: string): string {
  return value.replace(/\s+/g, "-");
}

export function tabId(baseId: string, value: string): string {
  return `${baseId}-tab-${toIdPart(value)}`;
}

export function panelId(baseId: string, value: string): string {
  return `${baseId}-panel-${toIdPart(value)}`;
}
