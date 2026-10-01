import { type ComponentPropsWithRef, useCallback, useId, useMemo, useState } from "react";
import { TabsContext, type TabsVariant } from "./TabsContext";
import "./Tabs.scss";

type ControlledProps = {
  value: string;
  onValueChange: (value: string) => void;
  defaultValue?: never;
};

type UncontrolledProps = {
  defaultValue: string;
  onValueChange?: (value: string) => void;
  value?: never;
};

export type TabsProps = Omit<ComponentPropsWithRef<"div">, "className" | "defaultValue"> & {
  variant?: TabsVariant;
} & (ControlledProps | UncontrolledProps);

/** Root of the compound component: owns the selected value and shares it by context. */
export function Tabs({
  variant = "pill",
  value,
  defaultValue,
  onValueChange,
  children,
  ...rest
}: TabsProps) {
  const baseId = useId();
  // Unreachable fallback: the props union requires one of the two values.
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? "");
  const isControlled = value !== undefined;
  const activeValue = isControlled ? value : uncontrolledValue;

  const selectTab = useCallback(
    (nextValue: string) => {
      if (nextValue === activeValue) {
        return;
      }

      if (!isControlled) {
        setUncontrolledValue(nextValue);
      }

      onValueChange?.(nextValue);
    },
    [activeValue, isControlled, onValueChange],
  );

  const context = useMemo(
    () => ({ baseId, variant, value: activeValue, selectTab }),
    [baseId, variant, activeValue, selectTab],
  );

  return (
    <TabsContext.Provider value={context}>
      <div {...rest} className="ds-tabs">
        {children}
      </div>
    </TabsContext.Provider>
  );
}
