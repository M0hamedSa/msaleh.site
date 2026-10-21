import { gsap } from "@/lib/gsap";

// The page transitions, one picked at random for each navigation. Each covers
// the screen, holds while the new route renders, then reveals it. They all
// draw into layers inside the PageTransition overlay; every layer's resting
// state is hidden, and each reveal returns its layer there.

export const COLUMNS = 6;
export const PANELS = 4;
export const BLOCKS = { cols: 12, rows: 8 };

// The curved wipe's path, in a 0–100 box stretched to the screen. Every shape
// shares one command list so GSAP can tween between them.
export const CURVE = {
  below: "M0 100 L0 100 Q50 100 100 100 L100 100 Z",
  rising: "M0 100 L0 55 Q50 5 100 55 L100 100 Z",
  covering: "M0 100 L0 0 Q50 0 100 0 L100 100 Z",
  // Leaving upwards: the same box, anchored at the top.
  full: "M0 0 L0 100 Q50 100 100 100 L100 0 Z",
  lifting: "M0 0 L0 45 Q50 95 100 45 L100 0 Z",
  above: "M0 0 L0 0 Q50 0 100 0 L100 0 Z",
};

export type Transition = {
  name: string;
  /** Shows the scrambled route label; the curtain shows the page's title instead. */
  label: boolean;
  cover: (overlay: HTMLElement) => gsap.core.Timeline;
  reveal: (overlay: HTMLElement) => gsap.core.Timeline;
};

const all = (overlay: HTMLElement, selector: string) => overlay.querySelectorAll<HTMLElement>(selector);

/** E11: ink columns sweep up, then lift away. */
const columns: Transition = {
  name: "columns",
  label: true,
  cover: (o) =>
    gsap
      .timeline()
      .set(all(o, "[data-col]"), { transformOrigin: "bottom" })
      .fromTo(all(o, "[data-col]"), { scaleY: 0 }, { scaleY: 1, duration: 0.7, ease: "expo.inOut", stagger: 0.05 }),
  reveal: (o) =>
    gsap
      .timeline()
      .set(all(o, "[data-col]"), { transformOrigin: "top" })
      .to(all(o, "[data-col]"), { scaleY: 0, duration: 0.7, ease: "expo.inOut", stagger: 0.05 }),
};

/** C43: four bands slide in from alternating sides, then carry on out. */
const panels: Transition = {
  name: "panels",
  label: true,
  cover: (o) =>
    gsap
      .timeline()
      .fromTo(
        all(o, "[data-panel]"),
        // x: 0 clears the pixel offset GSAP reads from the resting inline transform.
        { x: 0, xPercent: (i) => (i % 2 ? 101 : -101) },
        { x: 0, xPercent: 0, duration: 0.75, ease: "expo.inOut", stagger: 0.07 },
      ),
  reveal: (o) =>
    gsap
      .timeline()
      .to(all(o, "[data-panel]"), { x: 0, xPercent: (i) => (i % 2 ? -101 : 101), duration: 0.75, ease: "expo.inOut", stagger: 0.07 }),
};

/** C41: a grid of blocks flickers on in random order, then off. */
const blocks: Transition = {
  name: "blocks",
  label: true,
  cover: (o) =>
    gsap
      .timeline()
      .fromTo(all(o, "[data-block]"), { opacity: 0 }, { opacity: 1, duration: 0.01, stagger: { each: 0.007, from: "random" } }),
  reveal: (o) =>
    gsap.timeline().to(all(o, "[data-block]"), { opacity: 0, duration: 0.01, stagger: { each: 0.007, from: "random" } }),
};

/** C42: an ink wave swells up from below, then rolls off the top. */
const curve: Transition = {
  name: "curve",
  label: true,
  cover: (o) =>
    gsap
      .timeline()
      .set(o.querySelector("[data-curve]"), { attr: { d: CURVE.below } })
      .to(o.querySelector("[data-curve]"), { attr: { d: CURVE.rising }, duration: 0.4, ease: "power2.in" })
      .to(o.querySelector("[data-curve]"), { attr: { d: CURVE.covering }, duration: 0.4, ease: "power2.out" }),
  reveal: (o) =>
    gsap
      .timeline()
      .set(o.querySelector("[data-curve]"), { attr: { d: CURVE.full } })
      .to(o.querySelector("[data-curve]"), { attr: { d: CURVE.lifting }, duration: 0.4, ease: "power2.in" })
      .to(o.querySelector("[data-curve]"), { attr: { d: CURVE.above }, duration: 0.4, ease: "power2.out" })
      .set(o.querySelector("[data-curve]"), { attr: { d: CURVE.below } }),
};

/** E11 B: a red curtain rises with the page's name, then lifts off the top. */
const curtain: Transition = {
  name: "curtain",
  label: false,
  cover: (o) =>
    gsap
      .timeline()
      .fromTo(o.querySelector("[data-curtain]"), { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "expo.inOut" })
      .fromTo(o.querySelector("[data-curtain-title]"), { yPercent: 110 }, { yPercent: 0, duration: 0.7, ease: "expo.out" }, "-=0.25"),
  reveal: (o) =>
    gsap
      .timeline()
      .to(o.querySelector("[data-curtain-title]"), { yPercent: -110, duration: 0.4, ease: "power3.in" })
      .to(o.querySelector("[data-curtain]"), { clipPath: "inset(0% 0% 100% 0%)", duration: 0.8, ease: "expo.inOut" }, "-=0.1")
      .set(o.querySelector("[data-curtain]"), { clipPath: "inset(100% 0% 0% 0%)" }),
};

export const TRANSITIONS = [columns, panels, blocks, curve, curtain];

let last = -1;

/** A random transition, never the same one twice in a row. */
export function pickTransition() {
  let i = Math.floor(Math.random() * TRANSITIONS.length);
  if (i === last) i = (i + 1 + Math.floor(Math.random() * (TRANSITIONS.length - 1))) % TRANSITIONS.length;
  last = i;
  return TRANSITIONS[i];
}
