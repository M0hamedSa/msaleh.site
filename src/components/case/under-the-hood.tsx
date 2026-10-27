"use client";

import { useRef, useState } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { useFinePointer } from "@/lib/use-fine-pointer";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type Props = { intro: string; excerpts: { file: string; text: string }[] };

function Excerpts({ intro, excerpts }: Props) {
  return (
    <div className="grid gap-8 p-6 md:p-10">
      <p className="max-w-[48ch] text-[clamp(18px,1.8vw,24px)] leading-snug">{intro}</p>
      <div className="grid gap-6">
        {excerpts.map((x) => (
          <div key={x.file} className="grid min-w-0 content-start gap-2 md:grid-cols-[16rem_minmax(0,1fr)] md:gap-8">
            <p className="label-mono text-loader-accent">{x.file}</p>
            <pre className="overflow-x-auto font-mono text-[12.5px] leading-relaxed whitespace-pre opacity-80">{x.text}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * C26: the real config and code sit in the dark; a light follows the pointer
 * and shows what's under it. "Lights on" shows it all, and keyboard focus or
 * touch screens get the plain lit panel. Always dark, in either theme.
 */
export function UnderTheHood(props: Props) {
  const root = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const [lightsOn, setLightsOn] = useState(false);
  const dark = fine && !reduced && !lightsOn;

  useGSAP(
    () => {
      if (!dark) return;
      const el = root.current!;
      const lit = el.querySelector<HTMLElement>("[data-lit]")!;
      const setX = gsap.quickSetter(lit, "--x", "px");
      const setY = gsap.quickSetter(lit, "--y", "px");
      // Until the pointer arrives, the light drifts on its own so the idea reads.
      const drift = { a: 0 };
      const wander = gsap.to(drift, {
        a: Math.PI * 2,
        duration: 9,
        ease: "none",
        repeat: -1,
        onUpdate: () => {
          const r = el.getBoundingClientRect();
          setX(r.width * (0.5 + Math.cos(drift.a) * 0.32));
          setY(r.height * (0.5 + Math.sin(drift.a * 2) * 0.28));
        },
      });
      const onMove = (e: PointerEvent) => {
        wander.pause();
        const r = el.getBoundingClientRect();
        setX(e.clientX - r.left);
        setY(e.clientY - r.top);
      };
      const onLeave = () => wander.resume();
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: root, dependencies: [dark] },
  );

  return (
    <div
      ref={root}
      className="group/hood relative overflow-hidden rounded-sm bg-loader-bg text-loader-fg"
      data-dark={dark}
    >
      {/* The real content: dim in the dark, full once lit or focused. */}
      <div className="transition-opacity duration-500 group-focus-within/hood:opacity-100 group-data-[dark=true]/hood:opacity-[0.12]">
        <Excerpts {...props} />
      </div>
      {dark && (
        <div
          data-lit
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 group-focus-within/hood:hidden"
          style={{
            maskImage: "radial-gradient(circle 190px at var(--x, 50%) var(--y, 50%), #000 35%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(circle 190px at var(--x, 50%) var(--y, 50%), #000 35%, transparent 100%)",
          }}
        >
          <Excerpts {...props} />
        </div>
      )}
      {fine && !reduced && (
        <button
          type="button"
          onClick={() => setLightsOn((on) => !on)}
          aria-pressed={lightsOn}
          className="label-mono absolute top-4 right-4 rounded-full border border-loader-fg/30 px-3 py-1.5 transition-colors hover:border-loader-fg"
        >
          {lightsOn ? "Lights off" : "Lights on"}
        </button>
      )}
    </div>
  );
}
