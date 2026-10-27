"use client";

import { useRef } from "react";

import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const GLYPHS = "01<>/_#%&*+=";

/** The email address with a Copy button whose label scrambles to "Copied" and back. */
export function CopyEmail({ email }: { email: string }) {
  const address = useRef<HTMLSpanElement>(null);
  const state = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  const say = (text: string, delay = 0) => {
    if (reduced) {
      window.setTimeout(() => void (state.current!.textContent = text), delay * 1000);
      return;
    }
    gsap.to(state.current, { delay, duration: 0.6, scrambleText: { text, chars: GLYPHS }, overwrite: "auto" });
  };

  async function copy() {
    let copied = true;
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // No clipboard access: select the address so the Visitor can copy it.
      copied = false;
      const range = document.createRange();
      range.selectNodeContents(address.current!);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
    }
    say(copied ? "Copied" : "Selected");
    say("Copy", 2.2);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="label-mono inline-flex items-center gap-3 rounded-md border border-dashed border-loader-fg/40 px-4 py-3 text-[13px] normal-case transition-colors hover:border-loader-fg"
    >
      <span ref={address} className="select-all">
        {email}
      </span>
      <span ref={state} aria-live="polite" className="min-w-[8ch] text-left font-medium text-loader-accent uppercase">
        Copy
      </span>
    </button>
  );
}
