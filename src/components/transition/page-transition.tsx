"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef } from "react";

import { useLenis } from "@/components/providers/smooth-scroll";
import { BLOCKS, COLUMNS, CURVE, PANELS, pickTransition, type Transition } from "@/components/transition/transitions";
import { FEATURED_PROJECTS } from "@/content/projects";
import { gsap } from "@/lib/gsap";
import { setPageCovered } from "@/lib/intro";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const GLYPHS = "01<>/_#%&*+=";
// If the new route never arrives (a failed fetch), lift the cover anyway.
const ARRIVAL_TIMEOUT_MS = 6000;

const PAGE_TITLES: Record<string, string> = {
  "/": "Home",
  "/work": "Work",
  "/about": "About",
  "/archive": "Archive",
  "/playground": "Playground",
};

/** What the curtain shows: a project's name, or the page's. */
function pageTitle(path: string) {
  const project = FEATURED_PROJECTS.find((p) => path === `/work/${p.slug}`);
  return project?.name ?? PAGE_TITLES[path] ?? path;
}

type Navigate = (href: string) => void;
const TransitionContext = createContext<Navigate | null>(null);

/** The transition-aware navigate, or null outside the provider. */
export function useTransitionNavigate() {
  return useContext(TransitionContext);
}

/**
 * Page transitions. Each navigation picks one of five at random (never the
 * same twice running): ink columns (E11), four panels (C43), a block grid
 * (C41), a curved wave (C42) or a red curtain carrying the page's name. The
 * screen is covered, the new route renders underneath, then it's revealed.
 * Reduced motion navigates straight away.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const lenis = useLenis();
  const overlay = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLParagraphElement>(null);
  const curtainTitle = useRef<HTMLSpanElement>(null);
  const heading = useRef<string | null>(null);
  const active = useRef<Transition | null>(null);
  const cover = useRef<gsap.core.Timeline | null>(null);
  const timeout = useRef<number>(0);

  const reveal = useCallback(() => {
    window.clearTimeout(timeout.current);
    heading.current = null;
    lenis?.start();
    const transition = active.current;
    if (!transition) {
      setPageCovered(false);
      return;
    }
    gsap
      .timeline()
      .to(label.current, { autoAlpha: 0, duration: 0.2 })
      .add(transition.reveal(overlay.current!))
      // Entrance animations on the new page start once the cover is partly lifted, so they are seen.
      .add(() => setPageCovered(false), "<0.3")
      .set(overlay.current, { visibility: "hidden" });
  }, [lenis]);

  const navigate = useCallback(
    (href: string) => {
      const target = new URL(href, window.location.href).pathname;
      if (reduced || target === pathname || heading.current) {
        router.push(href);
        return;
      }
      heading.current = target;
      setPageCovered(true);
      lenis?.stop();
      const transition = pickTransition();
      active.current = transition;
      overlay.current!.dataset.transition = transition.name;
      curtainTitle.current!.textContent = pageTitle(target);

      const tl = gsap.timeline().set(overlay.current, { visibility: "visible" }).add(transition.cover(overlay.current!));
      if (transition.label) {
        tl.add(() => void (label.current!.textContent = ""), "-=0.3")
          .set(label.current, { autoAlpha: 1 }, "<")
          .to(label.current, { duration: 0.6, scrambleText: { text: target, chars: GLYPHS } }, "<");
      }
      cover.current = tl.add(() => {
        router.push(href);
        timeout.current = window.setTimeout(reveal, ARRIVAL_TIMEOUT_MS);
      });
    },
    [reduced, pathname, lenis, router, reveal],
  );

  // The new route has rendered under the cover: lift it once the cover has finished rising.
  useEffect(() => {
    if (!heading.current) return;
    const rising = cover.current;
    if (rising?.isActive()) rising.eventCallback("onComplete", reveal);
    else reveal();
  }, [pathname, reveal]);

  // Every layer rests hidden; a transition only ever moves its own.
  return (
    <TransitionContext value={navigate}>
      {children}
      <div ref={overlay} aria-hidden="true" className="pointer-events-none invisible fixed inset-0 z-[95] overflow-hidden">
        <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${COLUMNS}, 1fr)` }}>
          {Array.from({ length: COLUMNS }, (_, i) => (
            <span key={i} data-col className="-mr-px bg-fg" style={{ transform: "scaleY(0)" }} />
          ))}
        </div>

        <div className="absolute inset-0 grid" style={{ gridTemplateRows: `repeat(${PANELS}, 1fr)` }}>
          {Array.from({ length: PANELS }, (_, i) => (
            <span
              key={i}
              data-panel
              className="-mb-px bg-fg"
              style={{ transform: `translateX(${i % 2 ? 101 : -101}%)` }}
            />
          ))}
        </div>

        <div
          className="absolute inset-0 grid"
          style={{ gridTemplateColumns: `repeat(${BLOCKS.cols}, 1fr)`, gridTemplateRows: `repeat(${BLOCKS.rows}, 1fr)` }}
        >
          {Array.from({ length: BLOCKS.cols * BLOCKS.rows }, (_, i) => (
            <span key={i} data-block className="-mr-px -mb-px bg-fg opacity-0" />
          ))}
        </div>

        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
          <path data-curve d={CURVE.below} className="fill-fg" />
        </svg>

        <div data-curtain className="absolute inset-0 grid items-end bg-accent" style={{ clipPath: "inset(100% 0% 0% 0%)" }}>
          <p className="gutter overflow-hidden pb-[calc(28px+env(safe-area-inset-bottom,0px))]">
            <span
              ref={curtainTitle}
              data-curtain-title
              className="block font-display text-[clamp(3rem,11vw,11rem)] leading-[0.9] tracking-[-0.045em] text-on-accent"
            />
          </p>
        </div>

        <p
          ref={label}
          className="label-mono gutter invisible absolute inset-x-0 bottom-[calc(28px+env(safe-area-inset-bottom,0px))] text-bg"
        />
      </div>
    </TransitionContext>
  );
}
