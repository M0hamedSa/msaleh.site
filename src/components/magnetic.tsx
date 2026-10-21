"use client";

import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { useFinePointer } from "@/lib/use-fine-pointer";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * E06: the wrapped call to action leans toward the pointer and its label
 * follows a little further, then springs back. Desktop only.
 */
export function Magnetic({ children, strength = 0.35 }: { children: React.ReactNode; strength?: number }) {
  const root = useRef<HTMLSpanElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!fine || reduced) return;
      const el = root.current!;
      const target = el.firstElementChild as HTMLElement | null;
      const inner = target?.querySelector<HTMLElement>("[data-magnetic-inner]") ?? null;
      const move = (node: HTMLElement | null) =>
        node && {
          x: gsap.quickTo(node, "x", { duration: 0.6, ease: "power3.out" }),
          y: gsap.quickTo(node, "y", { duration: 0.6, ease: "power3.out" }),
        };
      const outer = move(el);
      const label = move(inner);

      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        outer!.x(dx * strength);
        outer!.y(dy * strength);
        label?.x(dx * strength * 0.55);
        label?.y(dy * strength * 0.55);
      };
      const onLeave = () => {
        gsap.to([el, inner].filter(Boolean), { x: 0, y: 0, duration: 1.1, ease: "elastic.out(1, 0.35)" });
      };
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: root, dependencies: [fine, reduced, strength] },
  );

  return (
    <span ref={root} className="inline-block">
      {children}
    </span>
  );
}
