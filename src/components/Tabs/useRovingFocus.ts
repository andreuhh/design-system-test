import type { KeyboardEvent } from "react";

const NAVIGATION_KEYS = ["ArrowRight", "ArrowLeft", "Home", "End"] as const;

type NavigationKey = (typeof NAVIGATION_KEYS)[number];

function isNavigationKey(key: string): key is NavigationKey {
  return NAVIGATION_KEYS.some((navigationKey) => navigationKey === key);
}

function nextIndex(key: NavigationKey, currentIndex: number, count: number): number {
  switch (key) {
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
    event.preventDefault();

    const target = tabs[nextIndex(event.key, currentIndex, tabs.length)];
    target.focus();
    target.scrollIntoView?.({ block: "nearest", inline: "nearest" });

    const value = target.dataset.value;
    if (value !== undefined) {
      onActivate(value);
    }
  };
}
