import { AsciiTalk } from "@/components/footer/ascii-talk";
import { CopyEmail } from "@/components/footer/copy-email";
import { FooterReveal } from "@/components/footer/footer-reveal";
import { Magnetic } from "@/components/magnetic";
import { EMAIL, GITHUB, LINKEDIN, NEXT_STEPS } from "@/content/contact";

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
        className="gutter relative grid h-full grid-rows-[minmax(0,1fr)_auto_auto_auto] gap-5 pt-[calc(76px+env(safe-area-inset-top,0px))] pb-[calc(20px+env(safe-area-inset-bottom,0px))] sm:gap-8 sm:pt-[calc(88px+env(safe-area-inset-top,0px))]"
      >
        {/* Half the footer it once filled: wide enough for one line on desktop, centred in what's left.
            The canvas is placed, not laid out: Safari sized it from its drawing buffer and it spilled
            over the steps. Where nothing is left (a short phone) it has no height and stays out of the way. */}
        <div className="relative">
          <AsciiTalk className="absolute inset-x-0 top-1/2 h-full max-h-[24svh] -translate-y-1/2" />
        </div>

        {/* Phones stack the steps: three columns there wrapped a step title alone. */}
        <ol className="grid gap-x-4 sm:grid-cols-3 md:gap-x-8">
          {NEXT_STEPS.map((s, i) => (
            <li key={s.step} className="grid content-start gap-2 border-t border-loader-fg/25 py-2 sm:pt-3 sm:pb-0">
              <span className="label-mono text-loader-fg/60">
                {String(i + 1).padStart(2, "0")} · {s.step}
              </span>
              <p className="max-w-[34ch] text-[13px] leading-snug text-loader-fg/80 max-sm:hidden md:text-[15px]">{s.body}</p>
            </li>
          ))}
        </ol>

        {/* On phones the circle sits beside the GitHub link rather than on a row of its own,
            so the footer fits a phone's screen. From md it takes the right column. */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-x-8 gap-y-5 border-t border-loader-fg/20 pt-5 md:gap-y-6 md:pt-6">
          <h2 className="col-span-2 max-w-[16ch] font-display text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.92] tracking-[-0.04em] text-balance md:col-span-1">
            Want to work together?
          </h2>
          <div className="flex-wrap items-center gap-x-8 gap-y-4 max-md:contents md:col-start-1 md:flex">
            <div className="max-md:col-span-2">
              <CopyEmail email={EMAIL} />
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-3 max-md:self-center">
              <a href={GITHUB} target="_blank" rel="noopener" className="link-line">
                GitHub <span className="arrow">↗</span>
              </a>
              <a href={LINKEDIN} target="_blank" rel="noopener" className="link-line">
                LinkedIn <span className="arrow">↗</span>
              </a>
            </div>
          </div>
          <div className="md:col-start-2 md:row-span-2 md:row-start-1">
            <Magnetic>
              <a
                href={`mailto:${EMAIL}`}
                data-cursor="Write"
                className="grid size-28 place-items-center rounded-full bg-accent font-medium text-on-accent sm:size-36 md:size-44"
              >
                <span data-magnetic-inner>Write to me</span>
              </a>
            </Magnetic>
          </div>
        </div>

        <div className="label-mono flex flex-wrap justify-between gap-x-6 gap-y-2 text-loader-fg/60">
          <span>© 2026 Mohamed Saleh</span>
        </div>
      </div>
    </FooterReveal>
  );
}
