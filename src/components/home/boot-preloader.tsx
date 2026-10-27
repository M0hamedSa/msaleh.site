"use client";

import { useEffect, useRef, useState } from "react";

import { useLenis } from "@/components/providers/smooth-scroll";
import { featuredCount } from "@/content/projects";
import { gsap, useGSAP } from "@/lib/gsap";
import { BOOT_SEEN_KEY } from "@/lib/init-script";
import { markIntroReady } from "@/lib/intro";

const BOOT_LOG = [
  ["postgres", "ok"],
  ["sql server", "ok"],
  ["odoo", "ok"],
  ["barcode scanner", "ok"],
  ["mount /work", `${featuredCount} projects`],
] as const;

const COUNT_STOPS = [18, 34, 57, 72, 91, 100];

// Decided once per page load, so a second effect run (Strict Mode, remounts)
// doesn't read the "seen" flag the first run just wrote.
let skipDecision: boolean | null = null;

function shouldSkip() {
  if (document.documentElement.dataset.boot === "skip") return true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  try {
    return sessionStorage.getItem(BOOT_SEEN_KEY) !== null;
  } catch {
    return false;
  }
}

/** E01: a boot log checks off the systems, the counter reaches 100, five columns lift away. Once per session. */
export function BootPreloader() {
  const root = useRef<HTMLDivElement>(null);
  const [running, setRunning] = useState(true);
  const lenis = useLenis();

  useEffect(() => {
    if (!running) return;
    lenis?.stop();
    const html = document.documentElement;
    html.style.overflow = "hidden";
    return () => {
      lenis?.start();
      html.style.overflow = "";
    };
  }, [lenis, running]);

  useGSAP(
    () => {
      skipDecision ??= shouldSkip();
      // Also skips when Next shows this page again from its cache: the boot already ran.
      if (skipDecision || !root.current) {
        setRunning(false);
        markIntroReady();
        return;
      }
      try {
        sessionStorage.setItem(BOOT_SEEN_KEY, "1");
      } catch {
        // Private mode: the boot may run again on the next load.
      }
      window.scrollTo(0, 0);

      const count = root.current!.querySelector<HTMLElement>("[data-count]")!;
      const counter = { value: 0 };
      // The CSS failsafe hides the cover if this script never arrives; from here on JS owns it.
      root.current!.style.animation = "none";

      const tl = gsap.timeline();
      tl.to("[data-log] li", { autoAlpha: 1, duration: 0.01, stagger: 0.26 }, 0);
      COUNT_STOPS.forEach((stop, i) => {
        tl.to(
          counter,
          {
            value: stop,
            duration: 0.26,
            ease: "power2.out",
            onUpdate: () => {
              count.textContent = String(Math.round(counter.value)).padStart(3, "0");
            },
          },
          i * 0.3,
        );
        tl.to("[data-bar]", { scaleX: stop / 100, duration: 0.26, ease: "power2.out" }, i * 0.3);
      });
      tl.to("[data-inner]", { autoAlpha: 0, duration: 0.3 }, "+=0.15")
        .to("[data-col]", { yPercent: -100, duration: 0.9, ease: "expo.inOut", stagger: 0.06 }, "-=0.05")
        .add(markIntroReady, "-=0.55")
        .add(() => setRunning(false));
    },
    { scope: root },
  );

  if (!running) return null;

  return (
    <div ref={root} className="boot-loader fixed inset-0 z-[100] text-loader-fg" aria-hidden="true">
      <div className="absolute inset-0 grid grid-cols-5">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} data-col className="-mr-px bg-loader-bg" />
        ))}
      </div>
      <div
        data-inner
        className="gutter absolute inset-0 grid grid-rows-[1fr_auto_auto] gap-[18px] pt-[calc(72px+env(safe-area-inset-top,0px))] pb-[calc(28px+env(safe-area-inset-bottom,0px))]"
      >
        <ol data-log className="label-mono grid w-full max-w-[460px] content-start gap-1.5">
          {BOOT_LOG.map(([name, status]) => (
            <li key={name} className="invisible flex items-baseline gap-2.5">
              <span>{name}</span>
              <i className="flex-1 -translate-y-[3px] border-b border-dotted border-current opacity-35" />
              <b className="font-medium text-loader-accent">{status}</b>
            </li>
          ))}
        </ol>
        <p
          data-count
          className="justify-self-end font-display text-[clamp(5rem,22vw,18rem)] leading-[0.8] tracking-[-0.04em] tabular-nums"
        >
          000
        </p>
        <div className="h-px bg-loader-fg/20">
          <i data-bar className="block h-full origin-left scale-x-0 bg-loader-fg" />
        </div>
      </div>
    </div>
  );
}
