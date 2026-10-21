"use client";

import { useRef } from "react";

import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const STACK = ["Next.js", "PostgreSQL", "Odoo", "PowerSync", "SQL Server", "n8n", "Telegram bots", "Payload", "Drizzle", "PowerBuilder"];
const ROWS = [STACK, [...STACK].reverse()];

/** E07: two rows of the stack drift in opposite directions; scrolling speeds them up, scrolling back reverses them. */
export function StackMarquee() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const tracks = gsap.utils.toArray<HTMLElement>("[data-track]", root.current);
      const loops = tracks.map((track, i) =>
        gsap.fromTo(
          track,
          { xPercent: i % 2 ? -50 : 0 },
          { xPercent: i % 2 ? 0 : -50, duration: 38, ease: "none", repeat: -1 },
        ),
      );

      const speed = { value: 1 };
      const apply = () => loops.forEach((loop) => loop.timeScale(speed.value));
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate(self) {
          const boost = gsap.utils.clamp(-8, 8, self.direction * (1 + Math.abs(self.getVelocity() / 220)));
          gsap.to(speed, { value: boost, duration: 0.25, overwrite: true, onUpdate: apply });
          // Settle back to cruising speed, keeping the direction of the last scroll.
          gsap.to(speed, { value: self.direction, duration: 1.2, delay: 0.25, ease: "power2.out", onUpdate: apply });
        },
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <div ref={root} className="overflow-hidden">
      <p className="sr-only">Stack: {STACK.join(", ")}.</p>
      {ROWS.map((words, i) => (
        <div key={i} aria-hidden="true" className={`border-b border-line py-3.5 ${i === 0 ? "border-t" : ""}`}>
          <div data-track className="flex w-max">
            {[...words, ...words].map((word, j) => (
              <span
                key={j}
                className="marquee-word pr-[0.35em] font-display text-[clamp(40px,7vw,104px)] leading-none tracking-[-0.035em] whitespace-nowrap"
              >
                {word}
                <span className="marquee-sep">/</span>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
