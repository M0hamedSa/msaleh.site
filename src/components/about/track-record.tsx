"use client";

import { useRef } from "react";

import type { Milestone } from "@/content/about";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * E09: the track record as a row of panels. The section pins and scrolling
 * down moves the row sideways, with a bar showing how far along you are.
 * Reduced motion leaves it as a row you can swipe or scroll sideways.
 */
export function TrackRecord({ milestones }: { milestones: Milestone[] }) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const track = root.current!.querySelector<HTMLElement>("[data-track]")!;
      const distance = () => Math.max(0, track.scrollWidth - root.current!.clientWidth);
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "center center",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => gsap.set("[data-progress]", { scaleX: self.progress }),
        },
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <div ref={root} className="min-w-0 overflow-hidden motion-reduce:overflow-x-auto">
      <ol data-track className="flex w-max gap-4 pr-4">
        {milestones.map((m, i) => (
          <li
            key={m.title}
            className={`grid min-h-[min(62vh,520px)] w-[min(78vw,540px)] grid-rows-[auto_1fr_auto] gap-5 rounded-md border p-6 ${
              m.current ? "border-loader-bg bg-loader-bg text-loader-fg" : "border-line bg-bg"
            }`}
          >
            <span className={`label-mono ${m.current ? "" : "text-mute"}`}>
              {String(i + 1).padStart(2, "0")} · {m.label}
            </span>
            <span className={`font-display text-[clamp(4rem,9vw,8.75rem)] leading-[0.85] tracking-[-0.05em] ${m.current ? "text-loader-accent" : ""}`}>{m.mark}</span>
            <div className="grid gap-2">
              <h3 className="font-display text-[clamp(1.4rem,2vw,1.75rem)] leading-tight tracking-[-0.02em]">{m.title}</h3>
              <p className={`max-w-[42ch] ${m.current ? "text-loader-fg/80" : "text-mute"}`}>{m.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-5 h-0.5 bg-line motion-reduce:hidden">
        <i data-progress className="block h-full origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
      </div>
    </div>
  );
}
