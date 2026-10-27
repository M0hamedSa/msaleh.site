"use client";

import { useRef } from "react";

import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * F1: the footer waits underneath the page (sticky to the bottom, behind it).
 * Reaching the end, the page shrinks a little and rounds its bottom corners,
 * like a sheet lifted away, while the footer's contents rise into place.
 *
 * The page only carries a transform while the footer is showing: any transform
 * on it would otherwise break pinned sections higher up (C10).
 */
export function FooterReveal({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const page = document.querySelector<HTMLElement>("[data-page]");
      if (reduced || !page) return;
      const inner = root.current!.querySelector("[data-footer-inner]");
      const clear = () => {
        gsap.set(page, { clearProps: "transform,borderRadius" });
        gsap.set(inner, { clearProps: "transform,opacity" });
      };

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "none" },
      });
      tl.to(page, { scale: 0.94, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, transformOrigin: "50% 100%" }, 0).fromTo(
        inner,
        { yPercent: -18, opacity: 0.35 },
        { yPercent: 0, opacity: 1 },
        0,
      );

      // Measured from the page's layout height (which a transform can't change), and
      // after every other trigger, so pinned sections above have added their length.
      const pageEnd = () => page.offsetTop + page.offsetHeight;
      const trigger = ScrollTrigger.create({
        start: () => pageEnd() - window.innerHeight,
        end: () => pageEnd(),
        refreshPriority: -1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (self.progress === 0) {
            tl.progress(0).pause();
            clear();
          } else tl.progress(self.progress);
        },
        onLeaveBack: () => {
          tl.progress(0).pause();
          clear();
        },
      });
      // The page can grow or shrink after the last refresh (late images, filters), which
      // left the reveal stuck short of the end on short pages; measure again when it does.
      let height = page.offsetHeight;
      const ro = new ResizeObserver(() => {
        if (page.offsetHeight === height) return;
        height = page.offsetHeight;
        ScrollTrigger.refresh();
      });
      ro.observe(page);
      return () => {
        ro.disconnect();
        trigger.kill();
        clear();
      };
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <footer
      ref={root}
      id="contact"
      className="sticky bottom-0 z-0 h-svh overflow-hidden bg-loader-bg text-loader-fg"
    >
      {children}
    </footer>
  );
}
