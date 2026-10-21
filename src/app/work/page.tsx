import type { Metadata } from "next";

import { TransitionLink } from "@/components/transition/transition-link";
import { WorkIndex } from "@/components/work/work-index";
import { featuredCount, featuredCountWord } from "@/content/projects";

export const metadata: Metadata = { title: "Work · Mohamed Saleh" };

export default function WorkPage() {
  return (
    <main className="gutter grid gap-10 pt-[calc(120px+env(safe-area-inset-top,0px))] pb-24">
      <div className="grid gap-4">
        <p className="label-mono text-mute">/work · Featured Projects ({featuredCount})</p>
        <h1 className="max-w-[16ch] font-display text-[clamp(2.75rem,7vw,7.5rem)] leading-[0.92] tracking-[-0.045em] text-balance">
          Systems running in {featuredCountWord} businesses.
        </h1>
      </div>
      <WorkIndex />
      <TransitionLink href="/archive" className="link-line justify-self-start">
        Everything else, in the Archive <span className="arrow">↗</span>
      </TransitionLink>
    </main>
  );
}
