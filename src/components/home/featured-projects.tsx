"use client";

import { useRef } from "react";

import { ProjectLink } from "@/components/project-link";
import { ProjectStatus } from "@/components/project-thumb";
import { ScreenVisual } from "@/components/project-visual";
import { TransitionLink } from "@/components/transition/transition-link";
import { FEATURED_PROJECTS, featuredCount, type FeaturedProject, type Screen } from "@/content/projects";
import { gsap, useGSAP } from "@/lib/gsap";

const TILES = 3;

// Tiba Masr has two screens; the harvest photo from its home page fills the third tile.
const FILL: Record<string, Screen> = {
  "tiba-masr": {
    src: "/projects/tiba-masr/photo.jpg",
    width: 1800,
    height: 1004,
    alt: "A crate of fresh fruit and vegetables in a field at sunset",
    caption: "",
    focus: "left",
  },
};

const tilesOf = (p: FeaturedProject) => {
  const screens = p.screens.filter((s) => !s.phone);
  return [...screens, ...(FILL[p.slug] ? [FILL[p.slug]] : [])].slice(0, TILES);
};

const px = (v: string) => parseFloat(v) || 0;

/**
 * The Featured Projects as rows that fight for space (after Codegrid's
 * "Every Project Fights for More Space", from Ingamana). One project is open
 * at a time: a small "Case study" link in its name line (a button on touch
 * screens), its summary, stack and status on the left, one large screen and two smaller ones on the right,
 * all whole at 16:10. The others fold to a single line with their name. The
 * section pins and the scroll hands the space from one project to the next,
 * resting briefly on each; every move is scrubbed, so nothing snaps. Tabbing
 * to a project's name scrolls to it, so keyboard users open rows too.
 * Phones and reduced motion get a plain list with every project open.
 */
export function FeaturedProjects() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const stage = root.current!.querySelector<HTMLElement>("[data-stage]")!;
        const view = stage.querySelector<HTMLElement>("[data-view]")!;
        const list = view.querySelector<HTMLElement>("[data-list]")!;
        const rows = gsap.utils.toArray<HTMLElement>("[data-row]", list);
        const last = rows.length - 1;
        stage.dataset.pinned = "";

        // Measured once per refresh: a folded row is its name line; an open one adds the body.
        let closed = 0;
        let open = 0;
        const measure = () => {
          const row = rows[0];
          const head = row.querySelector<HTMLElement>("[data-head]")!;
          const body = row.querySelector<HTMLElement>("[data-body]")!;
          const tiles = row.querySelector<HTMLElement>("[data-tiles]")!;
          const rs = getComputedStyle(row);
          const bodyPad = px(getComputedStyle(body).paddingTop);
          closed = px(rs.paddingTop) + px(rs.paddingBottom) + px(rs.borderTopWidth) + head.offsetHeight;
          // One large screen and two stacked beside it, all whole at 16:10: the column's width sets the height.
          stage.style.removeProperty("--tiles-w");
          const gap = px(getComputedStyle(tiles).columnGap);
          const side = (tiles.clientWidth - gap) / 3;
          const natural = side * 0.625 * 2 + gap;
          // The open project may take the whole screen, the folded ones scrolling out of the way;
          // on a short screen the screens narrow instead of being cropped.
          const tilesH = Math.min(natural, view.clientHeight - closed - bodyPad);
          if (tilesH < natural) stage.style.setProperty("--tiles-w", `${((tilesH - gap) / 2 / 0.625) * 3 + gap}px`);
          stage.style.setProperty("--tiles-h", `${tilesH}px`);
          open = closed + bodyPad + tilesH;
        };

        // Each project rests open for a short beat at the end of its stretch; the rest of the
        // scroll always moves something, easing in and out so two half-open rows pass quickly.
        const settle = (f: number) => {
          const i = Math.floor(f);
          const t = gsap.utils.clamp(0, 1, (f - i - 0.08) / 0.84);
          return i + t * t * (3 - 2 * t);
        };

        const layout = (f: number) => {
          const focus = settle(f);
          const vh = view.clientHeight;
          const shares = rows.map((_, i) => gsap.utils.clamp(0, 1, 1 - Math.abs(i - focus)));
          const heights = shares.map((w) => closed + (open - closed) * w);
          const total = heights.reduce((a, b) => a + b, 0);
          const tops: number[] = [];
          heights.reduce((y, h, i) => ((tops[i] = y), y + h), 0);
          // Everything usually fits; on short screens, keep the open row in view.
          const lo = Math.floor(focus);
          const hi = Math.min(lo + 1, last);
          const centre = (i: number) => tops[i] + heights[i] / 2;
          const offset = gsap.utils.clamp(0, Math.max(0, total - vh), gsap.utils.interpolate(centre(lo), centre(hi), focus - lo) - vh / 2);
          gsap.set(list, { y: -offset });
          view.style.setProperty("--fade-top", `${Math.min(offset, 32)}px`);
          view.style.setProperty("--fade-bottom", `${gsap.utils.clamp(0, 32, total - vh - offset)}px`);
          rows.forEach((row, i) => {
            gsap.set(row, { height: heights[i], "--open": shares[i] });
            row.toggleAttribute("data-active", i === Math.round(focus));
          });
        };

        const state = { f: 0 };
        measure();
        layout(0);
        const tween = gsap.to(state, {
          f: last,
          ease: "none",
          onUpdate: () => layout(state.f),
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: () => `+=${last * window.innerHeight * 0.6}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onRefresh: () => {
              measure();
              layout(state.f);
            },
          },
        });

        // Tabbing to a folded project scrolls to where it rests open. The browser would
        // otherwise scroll the clipped view itself to reveal the link, so that is undone.
        const onFocus = (e: FocusEvent) => {
          const i = rows.findIndex((row) => row.contains(e.target as Node));
          const st = tween.scrollTrigger;
          view.scrollTop = 0;
          if (i < 0 || !st) return;
          const rest = i < last ? i + 0.04 : i;
          window.scrollTo(0, st.start + ((st.end - st.start) * rest) / last);
        };
        list.addEventListener("focusin", onFocus);

        return () => {
          list.removeEventListener("focusin", onFocus);
          delete stage.dataset.pinned;
          stage.style.removeProperty("--tiles-h");
          stage.style.removeProperty("--tiles-w");
          view.style.removeProperty("--fade-top");
          view.style.removeProperty("--fade-bottom");
          rows.forEach((row) => row.removeAttribute("data-active"));
        };
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="featured-heading">
      <div data-stage className="feat-stage gutter flex flex-col pt-24 pb-6">
        <div className="flex items-baseline justify-between gap-4 border-t border-fg pt-3 pb-6">
          <h2 id="featured-heading" className="label-mono">
            Featured Projects <span className="text-mute">({featuredCount})</span>
          </h2>
          <TransitionLink href="/work" className="link-line label-mono">
            All work <span className="arrow">↗</span>
          </TransitionLink>
        </div>

        <div data-view className="feat-view min-h-0">
          <ol data-list className="grid gap-10 md:block md:will-change-transform">
            {FEATURED_PROJECTS.map((p, i) => {
              const tiles = tilesOf(p);
              return (
                <li key={p.slug} data-row className="feat-row border-t border-line py-3 md:overflow-hidden md:last:border-b">
                  <div data-head className="flex items-baseline gap-4">
                    <span className="label-mono w-[3ch] shrink-0 text-mute">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="font-display text-[clamp(28px,2.8vw,48px)] leading-none tracking-[-0.04em]">
                      <ProjectLink slug={p.slug} data-cursor="View" className="outline-offset-4">
                        {p.name}
                      </ProjectLink>
                    </h3>
                    <span className="label-mono ml-auto flex items-baseline gap-6">
                      {/* A visible way in for mouse users, on the open row only; keyboards use the name link. */}
                      <ProjectLink
                        slug={p.slug}
                        data-cursor="View"
                        tabIndex={-1}
                        aria-hidden="true"
                        className="link-line hidden text-accent-ink [opacity:var(--open,1)] pointer-fine:inline"
                      >
                        Case study <span className="arrow">↗</span>
                      </ProjectLink>
                      <span className="hidden text-mute sm:inline">
                        {p.sector} · {p.year}
                      </span>
                    </span>
                  </div>

                  <div data-body className="feat-body grid gap-5 pt-5 md:grid-cols-[minmax(0,0.22fr)_minmax(0,1fr)] md:gap-6">
                    <div className="flex min-w-0 flex-col gap-4">
                      <p className="max-w-[32ch] text-[clamp(15px,1.15vw,19px)]">{p.summary}</p>
                      <p className="label-mono text-mute">{p.stack.join(" · ")}</p>
                      <div className="grid justify-items-start gap-4 md:mt-auto">
                        <ProjectStatus project={p} className="label-mono" />
                        {/* With a mouse the "View" cursor already says the row opens; touch screens keep the button. */}
                        <span className="pointer-fine:hidden">
                          <ProjectLink slug={p.slug} className="btn-fill">
                            <span>Read the case study</span>
                          </ProjectLink>
                        </span>
                      </div>
                    </div>

                    <ProjectLink
                      slug={p.slug}
                      data-cursor="View"
                      tabIndex={-1}
                      aria-hidden="true"
                      data-tiles
                      className="feat-tiles grid min-h-0 grid-cols-2 gap-2 md:grid-cols-[2fr_1fr] md:grid-rows-2"
                    >
                      {tiles.map((s, k) => (
                        <ScreenVisual
                          key={s.src}
                          screen={s}
                          tone="dither"
                          sizes={k === 0 ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
                          eager={false}
                          // The first screen leads: full width on phones, two rows tall beside the others on wider screens.
                          className={`feat-tile aspect-[16/10] rounded-sm ${k === 0 ? "col-span-2 md:col-span-1 md:row-span-2 md:aspect-auto" : ""}`}
                        />
                      ))}
                    </ProjectLink>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
