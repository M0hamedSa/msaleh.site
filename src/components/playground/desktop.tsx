"use client";

import { useRef, useState } from "react";

import { LiveClock } from "@/components/live-clock";
import { LogoMark } from "@/components/logo-mark";
import { ProjectLink } from "@/components/project-link";
import { TransitionLink } from "@/components/transition/transition-link";
import { ARCHIVE } from "@/content/archive";
import { README, SCHEMA } from "@/content/playground";
import { FEATURED_PROJECTS } from "@/content/projects";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type WindowId = "projects" | "readme" | "schema";

const WINDOWS: { id: WindowId; title: string; icon: string; x: number; y: number; w: string }[] = [
  { id: "projects", title: "projects/", icon: "▤", x: 0.06, y: 0.1, w: "min(440px, 86vw)" },
  { id: "readme", title: "README.md", icon: "¶", x: 0.38, y: 0.2, w: "min(420px, 86vw)" },
  { id: "schema", title: "schema.sql", icon: "⌗", x: 0.22, y: 0.3, w: "min(620px, 92vw)" },
];

const STEP = 24; // px an arrow key moves a focused window
const HEADER_CLEARANCE = 88; // px kept free at the top for the site header

/**
 * C12: a desktop to play with. Windows for the projects, the README and a real
 * schema can be dragged by their title bars (or moved with the arrow keys when
 * the bar has focus), raised by clicking, closed and reopened from the dock.
 * Small screens stack the windows instead; reduced motion skips the pop-in.
 */
export function Desktop() {
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<Record<WindowId, boolean>>({ projects: true, readme: true, schema: true });
  const [order, setOrder] = useState<WindowId[]>(["projects", "readme", "schema"]);
  const reduced = useReducedMotion();

  const raise = (id: WindowId) => setOrder((o) => [...o.filter((w) => w !== id), id]);
  const show = (id: WindowId) => {
    setOpen((o) => ({ ...o, [id]: true }));
    raise(id);
  };

  // Windows pop in the first time they appear (and when reopened).
  const shown = useRef(new Set<WindowId>());
  useGSAP(
    () => {
      const fresh = gsap.utils
        .toArray<HTMLElement>("[data-window]")
        .filter((el) => !shown.current.has(el.dataset.window as WindowId));
      fresh.forEach((el) => shown.current.add(el.dataset.window as WindowId));
      if (!reduced && fresh.length) {
        gsap.from(fresh, { scale: 0.85, autoAlpha: 0, duration: 0.55, ease: "back.out(1.8)", stagger: 0.12, delay: 0.15 });
      }
    },
    { scope: root, dependencies: [reduced, open] },
  );

  // Dragging by the title bar, kept inside the desktop.
  const startDrag = (id: WindowId, e: React.PointerEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
    raise(id);
    const el = e.currentTarget.closest<HTMLElement>("[data-window]")!;
    const area = root.current!.querySelector<HTMLElement>("[data-area]")!;
    e.currentTarget.setPointerCapture(e.pointerId);
    const start = { x: e.clientX, y: e.clientY, ox: gsap.getProperty(el, "x") as number, oy: gsap.getProperty(el, "y") as number };
    // The window sits at its CSS spot; dragging offsets it from there, keeping at
    // least its title bar on the desktop and below the site header.
    const bounds = {
      minX: -el.offsetLeft - el.offsetWidth + 80,
      maxX: area.clientWidth - el.offsetLeft - 80,
      minY: HEADER_CLEARANCE - el.offsetTop,
      maxY: area.clientHeight - el.offsetTop - 40,
    };
    const move = (ev: PointerEvent) => {
      gsap.set(el, {
        x: gsap.utils.clamp(bounds.minX, bounds.maxX, start.ox + ev.clientX - start.x),
        y: gsap.utils.clamp(bounds.minY, bounds.maxY, start.oy + ev.clientY - start.y),
      });
    };
    const end = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
  };

  const nudge = (id: WindowId, e: React.KeyboardEvent<HTMLElement>) => {
    const d = { ArrowLeft: [-STEP, 0], ArrowRight: [STEP, 0], ArrowUp: [0, -STEP], ArrowDown: [0, STEP] }[e.key];
    if (!d) return;
    e.preventDefault();
    raise(id);
    const el = e.currentTarget.closest<HTMLElement>("[data-window]")!;
    gsap.to(el, { x: `+=${d[0]}`, y: `+=${d[1]}`, duration: reduced ? 0 : 0.2, ease: "power2.out" });
  };

  const body: Record<WindowId, React.ReactNode> = {
    projects: (
      <ul className="grid">
        {FEATURED_PROJECTS.map((p) => (
          <li key={p.slug} className="border-b border-loader-bg/10 last:border-0">
            <ProjectLink slug={p.slug} className="flex justify-between gap-4 px-4 py-2.5 hover:bg-loader-bg/5">
              <span>{p.slug}/</span>
              <span className="text-loader-bg/70">{p.year}</span>
            </ProjectLink>
          </li>
        ))}
        <li>
          <TransitionLink href="/archive" className="flex justify-between gap-4 px-4 py-2.5 hover:bg-loader-bg/5">
            <span>archive/</span>
            <span className="text-loader-bg/70">{ARCHIVE.length} items</span>
          </TransitionLink>
        </li>
      </ul>
    ),
    readme: <pre className="px-4 py-3 whitespace-pre-wrap">{README}</pre>,
    schema: <pre className="max-h-[46vh] overflow-auto px-4 py-3 whitespace-pre">{SCHEMA}</pre>,
  };

  return (
    <div ref={root} className="relative grid min-h-svh grid-rows-[1fr_auto] bg-loader-bg text-loader-fg">
      <div
        data-area
        className="relative overflow-hidden pt-[calc(96px+env(safe-area-inset-top,0px))] max-md:grid max-md:gap-4 max-md:px-4 max-md:pb-6"
        style={{ backgroundImage: "radial-gradient(color-mix(in srgb, var(--loader-fg) 14%, transparent) 1px, transparent 1px)", backgroundSize: "22px 22px" }}
      >
        <div className="gutter pointer-events-none absolute inset-x-0 top-[calc(76px+env(safe-area-inset-top,0px))] flex justify-between gap-4 max-md:static max-md:px-0">
          <p className="label-mono opacity-60">/playground</p>
          <p className="label-mono opacity-60 max-md:hidden">Drag the windows by their title bars</p>
        </div>

        {WINDOWS.map((w) =>
          open[w.id] ? (
            <section
              key={w.id}
              data-window={w.id}
              aria-label={w.title}
              onPointerDown={() => raise(w.id)}
              className="overflow-hidden rounded-lg bg-loader-fg font-mono text-[13px] leading-relaxed text-loader-bg shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)] md:absolute max-md:!static max-md:!transform-none"
              style={{
                width: w.w,
                left: `${w.x * 100}%`,
                top: `calc(${HEADER_CLEARANCE + 8}px + ${w.y} * (100% - ${HEADER_CLEARANCE + 8}px))`,
                zIndex: 10 + order.indexOf(w.id),
              }}
            >
              <div
                role="button"
                tabIndex={0}
                aria-label={`Move ${w.title} (arrow keys)`}
                onPointerDown={(e) => startDrag(w.id, e)}
                onKeyDown={(e) => nudge(w.id, e)}
                className="flex cursor-grab touch-none items-center gap-2 bg-loader-bg px-3 py-2 text-loader-fg select-none active:cursor-grabbing max-md:cursor-default"
              >
                <button
                  type="button"
                  aria-label={`Close ${w.title}`}
                  onClick={() => setOpen((o) => ({ ...o, [w.id]: false }))}
                  className="size-3 rounded-full bg-accent"
                />
                <span className="label-mono normal-case">{w.title}</span>
              </div>
              {body[w.id]}
            </section>
          ) : null,
        )}
      </div>

      {/* The dock: reopen or raise a window, and the time in Giza. */}
      <nav aria-label="Windows" className="gutter flex flex-wrap items-center justify-between gap-3 border-t border-loader-fg/15 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <LogoMark className="mr-2 text-lg" />
          {WINDOWS.map((w) => (
            <button
              key={w.id}
              type="button"
              onClick={() => show(w.id)}
              aria-pressed={open[w.id]}
              className="label-mono flex items-center gap-2 rounded-md border border-loader-fg/20 px-2.5 py-1.5 normal-case transition-colors hover:border-loader-fg aria-pressed:bg-loader-fg/10"
            >
              <span aria-hidden="true">{w.icon}</span>
              {w.title}
            </button>
          ))}
        </div>
        <span className="label-mono opacity-60">
          Giza <LiveClock seconds={false} />
        </span>
      </nav>
    </div>
  );
}
