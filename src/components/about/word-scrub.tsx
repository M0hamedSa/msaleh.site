"use client";

import { useRef } from "react";

import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * E03b: a paragraph whose words light up one by one as you scroll through it,
 * and dim again scrolling back. Used once, for the About introduction.
 * Reduced motion shows it fully lit.
 */
export function WordScrub({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      SplitText.create(ref.current, {
        type: "words",
        autoSplit: true,
        onSplit: (self) =>
          gsap.fromTo(
            self.words,
            { opacity: 0.14 },
            {
              opacity: 1,
              ease: "none",
              stagger: 0.1,
              scrollTrigger: { trigger: ref.current, start: "top 75%", end: "bottom 40%", scrub: true },
            },
          ),
      });
    },
    { scope: ref, dependencies: [reduced] },
  );

  return (
    <p ref={ref} className={className}>
      {text}
    </p>
  );
}
