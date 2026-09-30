import { type ComponentPropsWithoutRef, useCallback, useId, useMemo, useState } from "react";
import { TabsContext, type TabsVariant } from "./TabsContext";
import "./Tabs.scss";

/** The parent owns the state: `value` must be kept up to date in `onValueChange`. */
type ControlledProps = {
  /** Value of the selected tab. Makes the component controlled. */
  value: string;
  /** Called with the value of the tab the user activated. */
  onValueChange: (value: string) => void;
  defaultValue?: never;
};

/** `Tabs` owns the state; `onValueChange` is only a notification. */
type UncontrolledProps = {
  /** Value of the tab selected on mount. Makes the component uncontrolled. */
  defaultValue: string;
  /** Called with the value of the tab the user activated. */
  onValueChange?: (value: string) => void;
  value?: never;
};

export type TabsProps = Omit<ComponentPropsWithoutRef<"div">, "className" | "defaultValue"> & {
  /** Visual style shared by every tab in the group. Defaults to `"pill"`. */
  variant?: TabsVariant;
} & (ControlledProps | UncontrolledProps);

/**
 * Root of the compound component: owns the selected value and shares it with
 * `TabList`, `Tab` and `TabPanel` through context.
 *
 * Pass `defaultValue` to let `Tabs` own the state, or `value` + `onValueChange`
 * to own it yourself. Exactly one of the two is required, so "no tab selected"
 * is not a reachable state.
 */
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
