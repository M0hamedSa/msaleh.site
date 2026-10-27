"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { ContactLink } from "@/components/contact-link";
import { MenuIcon, TypingIcon } from "@/components/header-icons";
import { LogoMark } from "@/components/logo-mark";
import { SiteMenu } from "@/components/site-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { TransitionLink } from "@/components/transition/transition-link";

// Below this, the header always shows; past it, scrolling down tucks it away.
const HIDE_AFTER = 160;

/**
 * Logo, meta line and three icon buttons: theme, Write to me (to the contact block, its
 * typing dots looping) and Menu. Hides while reading down the page, returns on the way up.
 */
export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  // The Playground's desktop is dark in both themes, so the header keeps its own
  // background there, like an OS menu bar.
  const onDesktop = usePathname() === "/playground";

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 8);
      if (Math.abs(y - last) < 4) return;
      setHidden(y > last && y > HIDE_AFTER);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        data-hidden={hidden && !menuOpen}
        data-solid={solid || onDesktop}
        data-menu-open={menuOpen}
        className="gutter fixed inset-x-0 top-0 z-50 grid grid-cols-2 items-center gap-4 border-b border-transparent pt-[calc(14px+env(safe-area-inset-top,0px))] pb-3.5 transition-[transform,background-color,border-color] duration-500 ease-out-expo data-[hidden=true]:-translate-y-full data-[solid=true]:border-line data-[solid=true]:bg-bg md:grid-cols-3"
      >
        <TransitionLink href="/" className="justify-self-start text-xl" aria-label="Mohamed Saleh, home">
          <LogoMark />
        </TransitionLink>
        <p className="label-mono hidden justify-self-center text-mute md:block">
          Systems developer · Giza
        </p>
        <div className="flex items-center gap-2 justify-self-end">
          <ThemeToggle />
          <ContactLink
            aria-label="Write to me"
            data-cursor="Write"
            className="grid size-10 place-items-center rounded-full border border-accent bg-accent text-on-accent"
          >
            <TypingIcon />
          </ContactLink>
          <button
            ref={menuButton}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen(true)}
            aria-label="Menu"
            className="grid size-10 place-items-center rounded-full border border-line bg-bg transition-colors hover:border-fg"
          >
            <MenuIcon />
          </button>
        </div>
      </header>
      <SiteMenu open={menuOpen} onClose={closeMenu} returnFocus={menuButton} />
    </>
  );
}
