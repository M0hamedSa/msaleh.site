import type { Metadata } from "next";

import { TrackRecord } from "@/components/about/track-record";
import { LineReveal } from "@/components/line-reveal";
import { Magnetic } from "@/components/magnetic";
import { RevealHeading } from "@/components/reveal-heading";
import { ABOUT_HEADING, CV, HOW_I_WORK, INTRO, TRACK_RECORD } from "@/content/about";

export const metadata: Metadata = {
  title: "About · Mohamed Saleh",
  description: "Full-stack developer in Giza: the web systems businesses run on, and the ERP behind them.",
};

const sectionHeading = "font-display text-[clamp(2rem,3.6vw,3.5rem)] leading-[0.95] tracking-[-0.035em]";

export default function AboutPage() {
  return (
    <main className="grid gap-28 pt-[calc(120px+env(safe-area-inset-top,0px))] pb-28">
      <section className="gutter grid gap-10">
        <p className="label-mono text-mute">/about</p>
        <LineReveal as="h1" className="font-display text-[clamp(3.1rem,10vw,10rem)] leading-[0.9] tracking-[-0.045em]">
          {ABOUT_HEADING[0]}
          <br />
          <span className="text-accent">{ABOUT_HEADING[1]}</span>
        </LineReveal>
        <LineReveal
          delay={0.3}
          className="max-w-[24ch] font-display text-[clamp(1.9rem,4.4vw,4.25rem)] leading-[1.02] tracking-[-0.03em] text-balance"
        >
          {INTRO}
        </LineReveal>
      </section>

      <section aria-labelledby="track-heading" className="grid gap-8">
        <div className="gutter grid gap-3 border-t border-fg pt-3">
          <p className="label-mono text-mute">Track record</p>
          <RevealHeading id="track-heading" className={sectionHeading}>
            From a CS degree to systems in production.
          </RevealHeading>
        </div>
        {/* min-w-0: the row is wider than the screen and must overflow here, not widen the page. */}
        <div className="gutter min-w-0">
          <TrackRecord milestones={TRACK_RECORD} />
        </div>
      </section>

      <section aria-labelledby="how-heading" className="gutter grid gap-10 border-t border-fg pt-3">
        <div className="grid gap-3">
          <p className="label-mono text-mute">Method</p>
          <RevealHeading id="how-heading" className={sectionHeading}>
            How I work
          </RevealHeading>
        </div>
        <ol className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_I_WORK.map((s, i) => (
            <li key={s.step} className="grid content-start gap-3 border-t border-line pt-3">
              <span className="label-mono text-mute">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="font-display text-[clamp(1.6rem,2.4vw,2.25rem)] leading-none tracking-[-0.03em]">{s.step}</h3>
              <p className="text-mute">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {CV && (
        <section className="gutter flex flex-wrap items-center justify-between gap-6 border-t border-fg pt-6">
          <p className="max-w-[36ch] text-[clamp(17px,1.4vw,20px)]">
            The full story on one page: experience, projects, skills and education.
          </p>
          <Magnetic>
            <a href={CV.href} download data-cursor="Get" className="btn-fill">
              <span data-magnetic-inner>
                {CV.label} <span className="label-mono ml-2 opacity-70">{CV.meta}</span>
              </span>
            </a>
          </Magnetic>
        </section>
      )}
    </main>
  );
}
