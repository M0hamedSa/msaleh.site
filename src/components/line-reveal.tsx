"use client";

import { useRef } from "react";

import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { onPageShown } from "@/lib/intro";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type Props = {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "p";
  id?: string;
  className?: string;
  /** Seconds to wait after the text comes into view, to queue it behind another reveal. */
  delay?: number;
};

/**
 * The award-site line reveal (after Codegrid's "I Spotted This Text Reveal
 * Animation On Almost EVERY Award-Winning Site"): each line rises out of its
 * own mask, one after another, the first time the text scrolls into view, and
 * never under a page-transition cover. The text stays hidden from the first
 * paint (`data-intro`, with the CSS failsafe) so it never flashes before the
 * reveal. Lines re-split on resize. Reduced motion shows the text as it is.
 */
export function LineReveal({ children, as: Tag = "p", id, className = "", delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const el = ref.current!;
      let played = false;
      let tween: gsap.core.Tween | null = null;
      const split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          if (played) return;
          tween = gsap.from(self.lines, { yPercent: 105, duration: 1.1, ease: "power4.out", stagger: 0.09, delay, paused: true });
          return tween;
        },
      });
      // Lines are hidden in their masks now, so the text itself can show.
      gsap.set(el, { visibility: "visible" });
      let cancel = () => {};
      const trigger = ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: () => {
          cancel = onPageShown(() => {
            played = true;
            tween?.play();
          });
        },
      });
      return () => {
        cancel();
        trigger.kill();
        split.revert();
      };
    },
    { dependencies: [reduced] },
  );

  return (
    <Tag ref={ref as React.Ref<never>} id={id} data-intro className={className}>
      {children}
    </Tag>
  );
}
