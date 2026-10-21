"use client";

import { useRef, useState } from "react";

import { ProjectLink, ProjectMorph } from "@/components/project-link";
import { ProjectVisual } from "@/components/project-visual";
import { TransitionLink } from "@/components/transition/transition-link";
import { FEATURED_PROJECTS, featuredCount } from "@/content/projects";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/use-reduced-motion";

// Scroll distance per project while the scene is pinned, as a share of the viewport.
const STEP = 0.7;

/**
 * C10: one pinned scene. Scrolling walks through the Featured Projects;
 * the titles sit on the left, the image wipes to the current one on the right.
 * Hovering or focusing a title shows it at once; opening it morphs the image
 * into the Case Study (C40). Reduced motion keeps the scene unpinned.
 */
export function FeaturedProjects() {
  const root = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(0);
  const [pointed, setPointed] = useState<number | null>(null);
  const active = pointed ?? scrolled;
  const shown = useRef(0);
  const reduced = useReducedMotion();

  // Pin the scene and map scroll progress to a project.
  useGSAP(
    () => {
      if (reduced) return;
      ScrollTrigger.create({
        trigger: "[data-scene]",
        start: "top top",
        end: () => `+=${window.innerHeight * STEP * (FEATURED_PROJECTS.length - 1)}`,
        pin: true,
        onUpdate: (self) => setScrolled(Math.round(self.progress * (FEATURED_PROJECTS.length - 1))),
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  // Wipe the new image up over the old one, in the direction of travel.
  useGSAP(
    () => {
      const from = shown.current;
      if (from === active) return;
      shown.current = active;
      const frames = gsap.utils.toArray<HTMLElement>("[data-frame]");
      const down = active > from;
      frames.forEach((f, i) => gsap.set(f, { zIndex: i === active ? 2 : i === from ? 1 : 0 }));
      gsap.fromTo(
        frames[active],
        { clipPath: down ? "inset(100% 0 0 0)" : "inset(0 0 100% 0)" },
        { clipPath: "inset(0% 0 0% 0)", duration: reduced ? 0 : 0.8, ease: "expo.out", overwrite: true },
      );
    },
    { scope: root, dependencies: [active] },
  );

  const current = FEATURED_PROJECTS[active];

  return (
    <section ref={root} aria-labelledby="featured-heading" className="gutter">
      <div data-scene className="grid min-h-svh content-center gap-8 py-[calc(72px+env(safe-area-inset-top,0px))]">
        <div className="flex items-baseline justify-between gap-4 border-t border-fg pt-3">
          <h2 id="featured-heading" className="label-mono">
            Featured Projects <span className="text-mute">({featuredCount})</span>
          </h2>
          <TransitionLink href="/work" className="link-line label-mono">
            All work <span className="arrow">↗</span>
          </TransitionLink>
        </div>

        <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] md:gap-12">
          <ol className="order-2 grid md:order-1" onPointerLeave={() => setPointed(null)}>
            {FEATURED_PROJECTS.map((p, i) => (
              <li key={p.slug} className="border-b border-line first:border-t">
                <ProjectLink
                  slug={p.slug}
                  data-cursor="View"
                  data-active={i === active}
                  aria-current={i === active ? "true" : undefined}
                  onPointerEnter={() => setPointed(i)}
                  onFocus={() => setPointed(i)}
                  onBlur={() => setPointed(null)}
                  className="group grid grid-cols-[3ch_minmax(0,1fr)] items-baseline gap-3 py-2.5 text-mute transition-colors duration-300 data-[active=true]:text-fg md:py-3"
                >
                  <span className="label-mono">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-[clamp(28px,3.6vw,56px)] leading-none tracking-[-0.035em]">
                    {p.name}
                  </span>
                </ProjectLink>
              </li>
            ))}
          </ol>

          <div className="order-1 grid gap-3 md:order-2">
            <div className="group relative aspect-[4/3] overflow-hidden rounded-sm">
              {FEATURED_PROJECTS.map((p, i) => (
                <div
                  key={p.slug}
                  data-frame
                  className="absolute inset-0"
                  style={{ zIndex: i === 0 ? 2 : 0, clipPath: i === 0 ? "inset(0% 0 0% 0)" : "inset(100% 0 0 0)" }}
                >
                  <ProjectMorph slug={p.slug}>
                    <ProjectVisual project={p} tone="hover" sizes="(min-width: 768px) 50vw, 100vw" className="size-full" />
                  </ProjectMorph>
                </div>
              ))}
            </div>
            <div className="label-mono flex flex-wrap justify-between gap-x-6 gap-y-1" aria-live="polite">
              <span>
                {current.sector} · {current.year}
              </span>
              <span className="text-mute">{current.stack.join(" · ")}</span>
            </div>
            <p className="max-w-[46ch] text-[clamp(16px,1.3vw,18px)]">{current.summary}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
