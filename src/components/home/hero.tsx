"use client";

import { useRef } from "react";

import { AsciiMark } from "@/components/home/ascii-mark";
import { LiveClock } from "@/components/live-clock";
import { createBlockReveal } from "@/lib/block-reveal";
import { gsap, useGSAP } from "@/lib/gsap";
import { onIntroReady } from "@/lib/intro";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/** E02 statement hero: meta row, the line with a C16 reveal, the C5 mark and the status line. */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    (_, contextSafe) => {
      if (reduced) return;
      const title = root.current!.querySelector<HTMLElement>("[data-title]")!;
      const reveal = createBlockReveal(title);
      gsap.set("[data-intro]", { visibility: "visible" });
      gsap.set("[data-meta] > *, [data-sub] > *", { autoAlpha: 0, y: 16 });
      gsap.set("[data-mark]", { autoAlpha: 0 });

      // contextSafe keeps the selectors scoped to the hero, whoever triggers the intro.
      const cancel = onIntroReady(
        contextSafe!(() => {
          gsap
            .timeline()
            .add(() => void reveal.play(), 0.1)
            .to("[data-meta] > *", { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.06 }, 0.2)
            .to("[data-mark]", { autoAlpha: 1, duration: 1.2, ease: "power2.out" }, 0.3)
            .to("[data-sub] > *", { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08 }, 0.55);
        }),
      );

      return () => {
        cancel();
        reveal.revert();
      };
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section
      ref={root}
      className="grid min-h-svh grid-rows-[auto_1fr_auto] gap-8 pt-[calc(84px+env(safe-area-inset-top,0px))] pb-7"
    >
      <dl data-meta data-intro className="label-mono grid grid-cols-2 gap-4 border-t border-line pt-3 md:grid-cols-4">
        <div>
          <dt className="text-mute">Name</dt>
          <dd>Mohamed Saleh</dd>
        </div>
        <div>
          <dt className="text-mute">Role</dt>
          <dd>Systems developer</dd>
        </div>
        <div>
          <dt className="text-mute">Based</dt>
          <dd>Giza · 30.01°N 31.21°E</dd>
        </div>
        <div>
          <dt className="text-mute">Local</dt>
          <dd>
            <LiveClock />
          </dd>
        </div>
      </dl>

      <div data-mark data-intro className="min-h-0 self-center justify-self-end">
        <AsciiMark className="text-[clamp(4px,calc((100vw-32px)/58),10px)] text-fg" />
      </div>

      <div className="self-end">
        <h1
          data-title
          data-intro
          className="font-display text-[clamp(3.1rem,7.6vw,9.5rem)] leading-[0.9] tracking-[-0.045em] text-balance"
        >
          {/* Two beats, two lines from tablet up: the truth, then the answer in red. */}
          Business runs on systems. <br className="max-md:hidden" />
          <span className="text-accent">I build them.</span>
        </h1>
        <div data-sub data-intro className="mt-7 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <p className="max-w-[36ch] text-[clamp(16px,1.4vw,19px)]">
            ERP, ledgers, factory-floor tools and offline apps for textile mills, law firms and compliance teams.
          </p>
          <p className="label-mono">
            <span className="mr-1.5 inline-block size-[7px] rounded-full bg-live align-[1px]" />
            Open to select projects · 2026
          </p>
        </div>
      </div>
    </section>
  );
}
