"use client";

import { useRef } from "react";

import { gsap, SplitText, useGSAP } from "@/lib/gsap";
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
 * own mask, one after another, the first time the text scrolls into view.
 * Lines re-split on resize. Reduced motion shows the text as it is.
 */
export function LineReveal({ children, as: Tag = "p", id, className = "", delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      let played = false;
      const split = SplitText.create(ref.current!, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          if (played) return;
          return gsap.from(self.lines, {
            yPercent: 105,
            duration: 1.1,
            ease: "power4.out",
            stagger: 0.09,
            delay,
            scrollTrigger: { trigger: ref.current, start: "top 85%", once: true, onEnter: () => void (played = true) },
          });
        },
      });
      return () => split.revert();
    },
    { dependencies: [reduced] },
  );

  return (
    <Tag ref={ref as React.Ref<never>} id={id} className={className}>
      {children}
    </Tag>
  );
}
