"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

const matches = () => window.matchMedia(QUERY).matches;

/**
 * True when the Visitor asked for less motion. Components then render the
 * Reduced Motion Experience: final states, no smooth scroll, no pinning.
 *
 * The hydration render already reads the real preference (the server assumes
 * full motion), so effects that start animations never run once with the
 * wrong value. In exchange, markup must never depend on this value: use it
 * in effects and handlers only, or the server and client HTML would differ.
 */
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, matches, () => typeof window !== "undefined" && matches());
}
