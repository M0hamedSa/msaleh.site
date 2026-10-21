"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-color-scheme: dark)";

function isDark() {
  const chosen = document.documentElement.dataset.theme;
  if (chosen === "dark" || chosen === "light") return chosen === "dark";
  return window.matchMedia(QUERY).matches;
}

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  mq.addEventListener("change", onChange);
  return () => {
    mo.disconnect();
    mq.removeEventListener("change", onChange);
  };
}

/** True while the dark theme shows, whether chosen or from the OS. False on the server and during hydration. */
export function useDarkTheme() {
  return useSyncExternalStore(subscribe, isDark, () => false);
}
