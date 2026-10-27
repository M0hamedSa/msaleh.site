"use client";

import { useRef } from "react";

import { createBlockReveal } from "@/lib/block-reveal";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { onPageShown } from "@/lib/intro";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type Props = { children: React.ReactNode; id?: string; className?: string; as?: "h2" | "h3" };

/** C16 on scroll: a heading's lines block-reveal once, the first time it comes into view. */
export function RevealHeading({ children, id, className = "", as: Tag = "h2" }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const reveal = createBlockReveal(ref.current!);
      // Never under a page-transition cover: wait until the page is on screen.
      let cancel = () => {};
      const play = () => {
        cancel = onPageShown(() => void reveal.play());
      };
      const trigger = ScrollTrigger.create({ trigger: ref.current, start: "top 88%", once: true, onEnter: play });
      // Already scrolled past it (a restored position): show it now.
      if (window.scrollY > trigger.start) play();
      return () => {
        cancel();
        reveal.revert();
      };
    },
    { dependencies: [reduced] },
  );

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}
