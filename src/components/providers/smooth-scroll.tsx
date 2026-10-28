"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useSyncExternalStore } from "react";

import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/use-reduced-motion";

// The live Lenis instance, shared through a tiny store so any component can
// stop/start or scrollTo without prop drilling.
let instance: Lenis | null = null;
const listeners = new Set<() => void>();
function setInstance(next: Lenis | null) {
  instance = next;
  listeners.forEach((l) => l());
}

// A flick: the finger's speed over its last moments, and Android's fling curve for it
// (android.widget.OverScroller), so it travels and slows as it does on other sites.
const FLING_WINDOW_MS = 100;
const FLING_HELD_MS = 50; // a finger that stopped this long before lifting doesn't fling
const FLING_MIN_SPEED = 0.15; // CSS px per ms
const INFLEXION = 0.35;
const DECELERATION = Math.log(0.78) / Math.log(0.9);
const FRICTION = 0.015;
// The curve's start speed is this multiple of its average speed.
const FLING_SHAPE = 1 / INFLEXION;
const flingEasing = (t: number) => 1 - (1 - t) ** FLING_SHAPE;

function flingFor(moves: [number, number][], end: number) {
  if (moves.length < 2 || end - moves[moves.length - 1][0] > FLING_HELD_MS) return null;
  const [[t0, y0], [t1, y1]] = [moves[0], moves[moves.length - 1]];
  if (t1 - t0 < 8) return null;
  const speed = (y0 - y1) / (t1 - t0); // page px per ms, down the page is positive
  if (Math.abs(speed) < FLING_MIN_SPEED) return null;
  // OverScroller works in device pixels per second on a screen of 160 dpi per density.
  const density = window.devicePixelRatio || 1;
  const coef = FRICTION * 9.80665 * 39.37 * density * 160 * 0.84;
  const l = Math.log((INFLEXION * Math.abs(speed) * 1000 * density) / coef);
  const distance = (coef * Math.exp((DECELERATION / (DECELERATION - 1)) * l)) / density;
  return { distance: Math.sign(speed) * distance, duration: Math.exp(l / (DECELERATION - 1)) };
}

export function useLenis() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => instance,
    () => null,
  );
}

/** Lenis driven by the GSAP ticker so ScrollTrigger and smooth scroll share one clock. */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    // While Android's Chrome scrolls the page itself it sends a touchmove only every
    // 200ms, so the ink trail can't keep up with the finger. Lenis scrolling a finger's
    // swipe itself keeps the touchmoves coming every frame. iOS sends them every frame
    // anyway, so it keeps its native scrolling.
    const android = /Android/i.test(navigator.userAgent);
    // Lenis sizes a flick from how far the page moved in the last frame, so a flick on
    // a fast screen barely moved and a slow frame made it lurch. The finger's own speed
    // over its last moments sizes it instead, on Android's fling curve.
    const moves: [number, number][] = [];
    const lenis: Lenis = new Lenis({
      lerp: 0.1,
      syncTouch: android,
      virtualScroll: ({ event }) => {
        if (!android || !("touches" in event)) return true;
        if (event.type === "touchstart") moves.length = 0;
        else if (event.type === "touchmove") {
          moves.push([event.timeStamp, event.touches[0].clientY]);
          while (event.timeStamp - moves[0][0] > FLING_WINDOW_MS) moves.shift();
        } else if (event.type === "touchend" && !event.touches.length) {
          const target = event.target as Element | null;
          if (lenis.isStopped || lenis.isLocked || target?.closest?.("[data-lenis-prevent], [data-lenis-prevent-touch]")) return true;
          const from = lenis.targetScroll;
          const fling = flingFor(moves, event.timeStamp);
          // After Lenis's own flick, which this replaces.
          queueMicrotask(() =>
            fling
              ? lenis.scrollTo(from + fling.distance, { programmatic: false, duration: fling.duration, easing: flingEasing })
              : lenis.scrollTo(from, { programmatic: false, lerp: 1 }),
          );
        }
        return true;
      },
    });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setInstance(lenis);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setInstance(null);
    };
  }, [reduced]);

  // A new route starts at the top. Next resets the window, but Lenis keeps its own
  // position, so it is reset too; links to an anchor keep their target.
  const pathname = usePathname();
  const previous = useRef(pathname);
  useEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;
    if (window.location.hash) {
      ScrollTrigger.refresh();
      return;
    }
    // Whatever paused scrolling on the last page (the menu, a transition) is gone now.
    instance?.start();
    const toTop = () => {
      if (instance) instance.scrollTo(0, { immediate: true, force: true });
      else window.scrollTo(0, 0);
    };
    toTop();
    // A view transition swaps the old page out a frame later; settle at the top after it.
    const frame = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      toTop();
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return children;
}
