import type { KeyboardEvent } from "react";

const NAVIGATION_KEYS = ["ArrowRight", "ArrowLeft", "Home", "End"] as const;

type NavigationKey = (typeof NAVIGATION_KEYS)[number];

function isNavigationKey(key: string): key is NavigationKey {
  return NAVIGATION_KEYS.some((navigationKey) => navigationKey === key);
}

function nextIndex(key: NavigationKey, currentIndex: number, count: number): number {
  switch (key) {
    // Arrows wrap around, as required by the WAI-ARIA Tabs pattern.
    case "ArrowRight":
      return (currentIndex + 1) % count;
    case "ArrowLeft":
      return (currentIndex - 1 + count) % count;
    case "Home":
      return 0;
    case "End":
      return count - 1;
  }
}

/**
 * Keyboard navigation for the tablist: arrows (with wrap), Home and End.
 *
 * Activation is automatic: moving the focus also selects the tab.
 * The tab order is read from the DOM (`[role="tab"]` inside the tablist), so
 * there is no registration system to keep in sync with the rendered order.
 */
export function useRovingFocus(onActivate: (value: string) => void) {
  return (event: KeyboardEvent<HTMLElement>) => {
    if (!isNavigationKey(event.key)) {
      return;
    }

    const activeElement = document.activeElement;

    if (!(activeElement instanceof HTMLElement)) {
      return;
    }

    const tabs = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]'));
    const currentIndex = tabs.indexOf(activeElement);

    if (currentIndex === -1) {
      return;
    }

    // Only once we know we are handling the key: Home/End must still work in a
    // scrollable page, and the arrows must not scroll the tablist themselves.
    event.preventDefault();

    const target = tabs[nextIndex(event.key, currentIndex, tabs.length)];
    target.focus();
    // On mobile the tablist scrolls horizontally: keep the focused tab visible.
    // Optional call because jsdom does not implement scrollIntoView.
    target.scrollIntoView?.({ block: "nearest", inline: "nearest" });

    const value = target.dataset.value;
    if (value !== undefined) {
      onActivate(value);
    }
  };
}
