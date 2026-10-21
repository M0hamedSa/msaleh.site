"use client";

import { useEffect, useRef } from "react";

import { gsap } from "@/lib/gsap";
import { useFinePointer } from "@/lib/use-fine-pointer";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const SIZE = 84;

/**
 * E06c: over anything marked `data-cursor="View"`, the pointer becomes a red
 * disc carrying that word. Everywhere else the normal cursor stays. Fine
 * pointers only, and off under reduced motion.
 */
export function Cursor() {
  const disc = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLSpanElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const active = fine && !reduced;

  useEffect(() => {
    if (!active) return;
    const el = disc.current!;
    const html = document.documentElement;
    html.classList.add("has-cursor");
    const x = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });
    let current: Element | null = null;

    const show = (zone: Element | null) => {
      if (zone === current) return;
      current = zone;
      if (zone) text.current!.textContent = zone.getAttribute("data-cursor");
      gsap.to(el, { scale: zone ? 1 : 0, duration: 0.45, ease: "power3.out", overwrite: "auto" });
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x(e.clientX);
      y(e.clientY);
      show((e.target as Element).closest?.("[data-cursor]") ?? null);
    };
    const onLeave = () => show(null);

    window.addEventListener("pointermove", onMove, { passive: true });
    html.addEventListener("pointerleave", onLeave);
    return () => {
      html.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      html.removeEventListener("pointerleave", onLeave);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={disc}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[90] grid place-items-center rounded-full bg-accent text-on-accent"
      style={{ width: SIZE, height: SIZE, margin: -SIZE / 2, transform: "scale(0)" }}
    >
      <span ref={text} className="label-mono whitespace-nowrap" />
    </div>
  );
}
