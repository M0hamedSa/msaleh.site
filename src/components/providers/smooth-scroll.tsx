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
    const lenis = new Lenis({ lerp: 0.1, syncTouch: /Android/i.test(navigator.userAgent) });
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
