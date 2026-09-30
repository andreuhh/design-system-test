import { type ComponentPropsWithoutRef, useCallback, useId, useMemo, useState } from "react";
import { TabsContext, type TabsVariant } from "./TabsContext";

/** The parent owns the state: `value` must be kept up to date in `onValueChange`. */
type ControlledProps = {
  value: string;
  onValueChange: (value: string) => void;
  defaultValue?: never;
};

/** `Tabs` owns the state; `onValueChange` is only a notification. */
type UncontrolledProps = {
  defaultValue: string;
  onValueChange?: (value: string) => void;
  value?: never;
};

export type TabsProps = Omit<ComponentPropsWithoutRef<"div">, "className" | "defaultValue"> & {
  variant?: TabsVariant;
} & (ControlledProps | UncontrolledProps);

export function Tabs({
  variant = "pill",
  value,
  defaultValue,
  onValueChange,
  children,
  ...rest
}: TabsProps) {
  const baseId = useId();
  // The props union guarantees that exactly one of the two is defined, so a
  // "no tab selected" state cannot happen.
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
      <div className="ds-tabs" {...rest}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}
