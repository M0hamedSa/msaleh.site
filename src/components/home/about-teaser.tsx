import { ContactLink } from "@/components/contact-link";
import { LineReveal } from "@/components/line-reveal";
import { Magnetic } from "@/components/magnetic";
import { TransitionLink } from "@/components/transition/transition-link";
import { ABOUT_HEADING, HOW_I_WORK, INTRO, TRACK_RECORD } from "@/content/about";

// The track record's measured results (the marks that are numbers, not years).
const RESULTS = TRACK_RECORD.filter((m) => m.mark.endsWith("%"));

/**
 * The end of the home page. A big "About me. / Who builds them." rises line by
 * line (answering the hero's "I build them."), then who you are in one sentence
 * with the same reveal, the two results that can be measured, the method, and
 * the way in: "Start a project" (to the contact block), with About, all work and
 * Archive as plain links.
 */
export function AboutTeaser() {
  return (
    <section aria-labelledby="about-teaser-heading" className="gutter pt-28 pb-28">
      <LineReveal
        as="h2"
        id="about-teaser-heading"
        className="mb-14 font-display text-[clamp(3rem,9vw,9rem)] leading-[0.9] tracking-[-0.045em]"
      >
        {ABOUT_HEADING[0]}
        <br />
        <span className="text-accent">{ABOUT_HEADING[1]}</span>
      </LineReveal>

      <div className="grid gap-12 border-t border-fg pt-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-16">
        <LineReveal
          delay={0.25}
          className="max-w-[22ch] font-display text-[clamp(2rem,3.6vw,3.5rem)] leading-[0.98] tracking-[-0.035em] text-balance"
        >
          {INTRO}
        </LineReveal>

        <div className="grid content-start gap-10">
          <ul className="grid gap-6 sm:grid-cols-2">
            {RESULTS.map((m) => (
              <li key={m.title} className="grid content-start gap-2 border-t border-line pt-3">
                <span className="font-display text-[clamp(2.75rem,4.4vw,4rem)] leading-none tracking-[-0.04em]">{m.mark}</span>
                <h3 className="font-medium">{m.title}</h3>
                <p className="text-mute">{m.body}</p>
              </li>
            ))}
          </ul>

          <div className="grid gap-3 border-t border-line pt-3">
            <h3 className="label-mono text-mute">How I work</h3>
            <ol className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-display text-[clamp(1.4rem,2vw,1.75rem)] leading-tight tracking-[-0.02em]">
              {HOW_I_WORK.map((s, i) => (
                <li key={s.step} className="flex items-baseline gap-3">
                  {i > 0 && (
                    <span aria-hidden="true" className="text-mute">
                      →
                    </span>
                  )}
                  {s.step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <div className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-6">
        <Magnetic>
          <ContactLink data-cursor="Write" className="btn-fill">
            <span data-magnetic-inner>Start a project</span>
          </ContactLink>
        </Magnetic>
        <TransitionLink href="/about" className="link-line">
          More about me <span className="arrow">↗</span>
        </TransitionLink>
        <TransitionLink href="/work" className="link-line">
          All work <span className="arrow">↗</span>
        </TransitionLink>
        <TransitionLink href="/archive" className="link-line">
          Archive <span className="arrow">↗</span>
        </TransitionLink>
      </div>
    </section>
  );
}
