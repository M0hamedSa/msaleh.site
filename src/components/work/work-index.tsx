"use client";

import { useRef, useState } from "react";

import { ProjectLink, ProjectMorph } from "@/components/project-link";
import { ProjectVisual } from "@/components/project-visual";
import { FEATURED_PROJECTS } from "@/content/projects";
import { gsap, useGSAP } from "@/lib/gsap";
import { useFinePointer } from "@/lib/use-fine-pointer";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * A1: the Featured Projects as a typographic list. With a mouse, the hovered
 * project's image follows the pointer and tilts with its speed; on touch each
 * row carries a small thumbnail. Each image morphs into its Case Study (C40),
 * so only the version actually on screen carries the morph name.
 */
export function WorkIndex() {
  const root = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const shown = useRef<number | null>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const follow = fine && !reduced;

  // The floating image trails the pointer and leans into horizontal movement.
  useGSAP(
    () => {
      if (!follow) return;
      const float = root.current!.querySelector<HTMLElement>("[data-float]")!;
      gsap.set("[data-float-frame]", { yPercent: 100 });
      const x = gsap.quickTo(float, "x", { duration: 0.6, ease: "power3" });
      const y = gsap.quickTo(float, "y", { duration: 0.6, ease: "power3" });
      const tilt = gsap.quickTo(float, "rotation", { duration: 0.5, ease: "power3" });
      let lastX = 0;
      const onMove = (e: PointerEvent) => {
        // Above the pointer (below it near the top), over the faded rows rather than
        // the hovered name, and kept inside the window.
        const w = float.offsetWidth;
        const h = float.offsetHeight;
        const above = e.clientY - 72 - h;
        x(gsap.utils.clamp(16, window.innerWidth - w - 16, e.clientX - w / 2));
        y(above >= 16 ? above : e.clientY + 72);
        tilt(gsap.utils.clamp(-12, 12, (e.clientX - lastX) * 0.8));
        lastX = e.clientX;
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      return () => window.removeEventListener("pointermove", onMove);
    },
    { scope: root, dependencies: [follow] },
  );

  // Show or hide the float; swap images vertically in the direction of travel.
  useGSAP(
    () => {
      if (!follow) return;
      const from = shown.current;
      shown.current = hovered;
      gsap.to("[data-float]", { scale: hovered === null ? 0 : 1, duration: 0.4, ease: "power3.out" });
      if (hovered === null || from === hovered) return;
      const frames = gsap.utils.toArray<HTMLElement>("[data-float-frame]");
      const down = from === null || hovered > from;
      gsap.fromTo(frames[hovered], { yPercent: down ? 100 : -100 }, { yPercent: 0, duration: 0.6, ease: "expo.out" });
      if (from !== null) gsap.to(frames[from], { yPercent: down ? -100 : 100, duration: 0.6, ease: "expo.out" });
    },
    { scope: root, dependencies: [hovered, follow] },
  );

  return (
    <div ref={root}>
      <ol onPointerLeave={() => setHovered(null)} className="border-t border-fg">
        {FEATURED_PROJECTS.map((p, i) => (
          <li key={p.slug} className="border-b border-line">
            <ProjectLink
              slug={p.slug}
              data-cursor="View"
              data-dim={hovered !== null && hovered !== i}
              onPointerEnter={() => setHovered(i)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              // Without the float, each row carries its own thumbnail in a fifth column from tablet up.
              className={`group grid grid-cols-[3ch_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 py-4 transition-opacity duration-300 data-[dim=true]:opacity-25 md:py-5 ${
                follow ? "md:grid-cols-[4ch_minmax(0,1fr)_14rem_4ch]" : "md:grid-cols-[4ch_minmax(0,1fr)_14rem_4ch_8rem]"
              }`}
            >
              <span className="label-mono text-mute">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-display text-[clamp(34px,6.4vw,104px)] leading-none tracking-[-0.045em] transition-transform duration-500 ease-out-expo group-data-[dim=false]:group-hover:translate-x-[2vw]">
                {p.name}
              </span>
              {!follow && (
                <ProjectMorph slug={p.slug}>
                  <ProjectVisual project={p} tone="full" tagged={false} sizes="128px" className="row-span-2 aspect-[4/3] w-24 rounded-sm md:col-start-5 md:row-span-1 md:row-start-1 md:w-32" />
                </ProjectMorph>
              )}
              <span className="label-mono col-start-2 text-mute md:col-start-3 md:row-start-1">{p.sector}</span>
              <span className="label-mono hidden text-right text-mute md:col-start-4 md:row-start-1 md:block">{p.year}</span>
            </ProjectLink>
          </li>
        ))}
      </ol>

      {follow && (
        <div
          data-float
          aria-hidden="true"
          className="pointer-events-none fixed top-0 left-0 z-40 aspect-[4/3] w-[min(28vw,420px)] overflow-hidden rounded-sm"
          style={{ transform: "scale(0)" }}
        >
          {FEATURED_PROJECTS.map((p) => (
            <div key={p.slug} data-float-frame className="absolute inset-0">
              {/* The float only shows on hover, so it carries the full-colour treatment. */}
              <ProjectMorph slug={p.slug}>
                <ProjectVisual project={p} tone="full" sizes="min(28vw, 420px)" className="size-full" />
              </ProjectMorph>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
