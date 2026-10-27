"use client";

import { useCallback } from "react";

import { useLenis } from "@/components/providers/smooth-scroll";

/** Scrolls to the contact block, which is the footer at the very end of every page. */
export function useGoToContact() {
  const lenis = useLenis();
  return useCallback(() => {
    if (lenis) lenis.scrollTo(lenis.limit, { duration: 1.4 });
    else window.scrollTo(0, document.documentElement.scrollHeight);
  }, [lenis]);
}

/** A link to #contact that glides there with the page's smooth scroll. */
export function ContactLink(props: React.ComponentProps<"a">) {
  const goToContact = useGoToContact();
  return (
    <a
      href="#contact"
      {...props}
      onClick={(e) => {
        e.preventDefault();
        goToContact();
      }}
    />
  );
}
