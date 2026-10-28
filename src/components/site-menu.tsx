"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { useGoToContact } from "@/components/contact-link";
import { CloseIcon } from "@/components/header-icons";
import { LogoMark } from "@/components/logo-mark";
import { useLenis } from "@/components/providers/smooth-scroll";
import { TransitionLink } from "@/components/transition/transition-link";
import { ARCHIVE } from "@/content/archive";
import { EMAIL, GITHUB, LINKEDIN } from "@/content/contact";
import { featuredCount } from "@/content/projects";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const LINKS = [
  { href: "/work", label: "Work", count: featuredCount },
  { href: "/about", label: "About" },
  { href: "/archive", label: "Archive", count: String(ARCHIVE.length).padStart(2, "0") },
  { href: "#contact", label: "Contact" },
];

const OPEN_SHAPE = "polygon(0 0, 100% 0, 100% 100%, 0 100%)";
const CLOSED_TOP = "polygon(0 0, 100% 0, 100% 0, 0 0)";
const CLOSED_BOTTOM = "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)";

type Props = { open: boolean; onClose: () => void; returnFocus: React.RefObject<HTMLButtonElement | null> };

/**
 * E05 + C23: an ink panel wipes down over the page, then each link builds
 * itself letter by letter out of blocks. Escape or the X shuts it, focus is
 * kept inside while open and returns to the Menu button after.
 */
export function SiteMenu({ open, onClose, returnFocus }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const lenis = useLenis();
  const goToContact = useGoToContact();
  const wasOpen = useRef(false);

  useGSAP(
    () => {
      const el = root.current!;
      if (open && reduced) {
        // Reduced Motion Experience: the finished menu, at once.
        wasOpen.current = true;
        gsap.set(el, { visibility: "visible", clipPath: OPEN_SHAPE });
        gsap.set("[data-char], [data-fade]", { autoAlpha: 1 });
        gsap.set("[data-block]", { scaleY: 0 });
        closeButton.current?.focus();
      } else if (open) {
        wasOpen.current = true;
        gsap
          .timeline()
          .set(el, { visibility: "visible", clipPath: CLOSED_TOP })
          .set("[data-char]", { autoAlpha: 0 })
          .set("[data-block]", { scaleY: 1, transformOrigin: "bottom" })
          .set("[data-fade]", { autoAlpha: 0 })
          .to(el, { clipPath: OPEN_SHAPE, duration: 0.9, ease: "expo.inOut" })
          .addLabel("build", "-=0.3")
          .to("[data-char]", { autoAlpha: 1, duration: 0.01, stagger: 0.04 }, "build")
          .to("[data-block]", { scaleY: 0, duration: 0.25, ease: "power2.in", stagger: 0.04 }, "build+=0.15")
          .to("[data-fade]", { autoAlpha: 1, duration: 0.4, stagger: 0.05 }, "build")
          // Focus once Close is visible; a hidden button can't take focus.
          .call(() => closeButton.current?.focus(), undefined, "build+=0.01");
      } else if (wasOpen.current) {
        wasOpen.current = false;
        if (reduced) gsap.set(el, { visibility: "hidden", clipPath: CLOSED_TOP });
        else
          gsap
            .timeline()
            .to("[data-fade]", { autoAlpha: 0, duration: 0.2 })
            .to(el, { clipPath: CLOSED_BOTTOM, duration: 0.8, ease: "expo.inOut" }, 0.05)
            .set(el, { visibility: "hidden" });
        returnFocus.current?.focus();
      }
    },
    { scope: root, dependencies: [open] },
  );

  // While open: no page scroll behind, Escape closes, Tab stays inside.
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab") return;
      const items = root.current!.querySelectorAll<HTMLElement>("a[href], button");
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, lenis]);

  // Contact is the footer, at the bottom of every page: close and glide down to it.
  const closeToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    window.setTimeout(goToContact, reduced ? 0 : 600);
  };

  // Arriving on a new route (under the transition cover) closes the menu at once.
  const route = useRef(pathname);
  useEffect(() => {
    if (route.current === pathname) return;
    route.current = pathname;
    wasOpen.current = false;
    gsap.set(root.current, { visibility: "hidden", clipPath: CLOSED_TOP });
    onClose();
  }, [pathname, onClose]);

  return (
    <div
      ref={root}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      inert={!open}
      data-lenis-prevent
      className="gutter invisible fixed inset-0 z-[80] grid grid-rows-[auto_1fr_auto] overflow-y-auto bg-fg pt-[calc(14px+env(safe-area-inset-top,0px))] pb-[calc(24px+env(safe-area-inset-bottom,0px))] text-bg"
      style={{ clipPath: CLOSED_TOP }}
    >
      <div data-fade className="flex items-center justify-between">
        <span className="label-mono flex items-center gap-2">
          <LogoMark className="text-xl" /> / Index
        </span>
        <button
          ref={closeButton}
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="grid size-10 place-items-center rounded-full border border-bg/30 transition-colors hover:border-bg"
        >
          <CloseIcon />
        </button>
      </div>

      <nav aria-label="Main" className="grid content-center py-10">
        {LINKS.map(({ href, label, count }) => (
          <TransitionLink
            key={href}
            href={href}
            onClick={href === "#contact" ? closeToContact : undefined}
            aria-current={pathname === href ? "page" : undefined}
            // The letters are separate spans for the build animation; name the link as one word.
            aria-label={count ? `${label}, ${Number(count)} items` : label}
            className="group flex items-baseline gap-3.5 font-display text-[clamp(52px,11vw,150px)] leading-[0.92] tracking-[-0.045em]"
          >
            <span aria-hidden="true" className="flex transition-colors group-hover:text-accent group-aria-[current=page]:text-accent">
              {[...label].map((char, i) => (
                <span key={i} data-char className="relative inline-block">
                  {char}
                  <i data-block aria-hidden="true" className="absolute inset-0 bg-bg" />
                </span>
              ))}
            </span>
            {count && <sup className="label-mono text-bg/70">({count})</sup>}
          </TransitionLink>
        ))}
      </nav>

      <div data-fade className="label-mono flex flex-wrap justify-between gap-3 border-t border-bg/25 pt-3">
        <a href={`mailto:${EMAIL}`} className="link-line">
          {EMAIL}
        </a>
        <span className="flex gap-6">
          <a href={GITHUB} target="_blank" rel="noopener" className="link-line">
            GitHub <span className="arrow">↗</span>
          </a>
          <a href={LINKEDIN} target="_blank" rel="noopener" className="link-line">
            LinkedIn <span className="arrow">↗</span>
          </a>
        </span>
      </div>
    </div>
  );
}
