import { AsciiTalk } from "@/components/footer/ascii-talk";
import { CopyEmail } from "@/components/footer/copy-email";
import { FooterReveal } from "@/components/footer/footer-reveal";
import { Magnetic } from "@/components/magnetic";
import { TransitionLink } from "@/components/transition/transition-link";
import { EMAIL, NEXT_STEPS } from "@/content/contact";

/**
 * The footer on every page: it waits under the page and is revealed as the page
 * lifts away (F1). "LET'S TALK" in scattering characters (C6), what happens after
 * someone writes, then the contact block (E13). Always dark, and the same in either theme.
 */
export function SiteFooter() {
  return (
    <FooterReveal>
      <div
        data-footer-inner
        className="gutter relative grid h-full grid-rows-[minmax(0,1fr)_auto_auto_auto] gap-8 pt-[calc(88px+env(safe-area-inset-top,0px))] pb-[calc(20px+env(safe-area-inset-bottom,0px))]"
      >
        {/* Half the footer it once filled: wide enough for one line on desktop. */}
        <div className="grid min-h-0 items-end">
          <AsciiTalk className="h-full max-h-[24svh] min-h-[90px]" />
        </div>

        <ol className="grid grid-cols-3 gap-x-4 gap-y-6 md:gap-x-8">
          {NEXT_STEPS.map((s, i) => (
            <li key={s.step} className="grid content-start gap-2 border-t border-loader-fg/25 pt-3">
              <span className="label-mono text-loader-fg/60">
                {String(i + 1).padStart(2, "0")} · {s.step}
              </span>
              <p className="max-w-[34ch] text-[13px] leading-snug text-loader-fg/80 max-sm:hidden md:text-[15px]">{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="grid items-end gap-8 border-t border-loader-fg/20 pt-6 md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="grid gap-6">
            <h2 className="max-w-[16ch] font-display text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.92] tracking-[-0.04em] text-balance">
              Have a system in mind?
            </h2>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <CopyEmail email={EMAIL} />
              <a href="https://github.com/M0hamedSa" target="_blank" rel="noopener" className="link-line">
                GitHub <span className="arrow">↗</span>
              </a>
            </div>
          </div>
          <Magnetic>
            <a
              href={`mailto:${EMAIL}`}
              data-cursor="Write"
              className="grid size-36 place-items-center rounded-full bg-accent font-medium text-on-accent md:size-44"
            >
              <span data-magnetic-inner>Write to me</span>
            </a>
          </Magnetic>
        </div>

        <div className="label-mono flex flex-wrap justify-between gap-x-6 gap-y-2 text-loader-fg/60">
          <span>© 2026 Mohamed Saleh</span>
          <TransitionLink href="/playground" className="link-line">
            Playground <span className="arrow">↗</span>
          </TransitionLink>
        </div>
      </div>
    </FooterReveal>
  );
}
