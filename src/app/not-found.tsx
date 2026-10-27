import type { Metadata } from "next";

import { Magnetic } from "@/components/magnetic";
import { MissingPath } from "@/components/missing-path";
import { ProjectLink } from "@/components/project-link";
import { TransitionLink } from "@/components/transition/transition-link";
import { FEATURED_PROJECTS } from "@/content/projects";

export const metadata: Metadata = {
  title: "Not found · Mohamed Saleh",
};

/**
 * Any address that doesn't exist, and a Case Study slug that doesn't. Inside the
 * normal header and footer, with the way home and every Case Study one click away.
 */
export default function NotFound() {
  return (
    <main className="gutter grid min-h-[80svh] content-center gap-14 pt-[calc(120px+env(safe-area-inset-top,0px))] pb-28">
      <div className="grid gap-6">
        <MissingPath />
        <h1 className="max-w-[14ch] font-display text-[clamp(2.75rem,7vw,7.5rem)] leading-[0.9] tracking-[-0.045em] text-balance">
          This page isn’t here.
        </h1>
        <p className="max-w-[44ch] text-[clamp(17px,1.4vw,20px)]">
          The link may be old, or the page has moved. Everything I’ve built is still one click away.
        </p>
        <div className="flex flex-wrap items-center gap-x-10 gap-y-6 pt-2">
          <Magnetic>
            <TransitionLink href="/" data-cursor="Home" className="btn-fill">
              <span data-magnetic-inner>Back to home</span>
            </TransitionLink>
          </Magnetic>
          <TransitionLink href="/work" className="link-line">
            All work <span className="arrow">↗</span>
          </TransitionLink>
          <TransitionLink href="/archive" className="link-line">
            Archive <span className="arrow">↗</span>
          </TransitionLink>
        </div>
      </div>

      <nav aria-labelledby="nf-projects" className="grid gap-3 border-t border-fg pt-3">
        <h2 id="nf-projects" className="label-mono text-mute">
          Or open a case study
        </h2>
        <ul className="grid">
          {FEATURED_PROJECTS.map((p) => (
            <li key={p.slug} className="border-b border-line">
              <ProjectLink
                slug={p.slug}
                data-cursor="View"
                className="group flex items-baseline justify-between gap-6 py-3"
              >
                <span className="font-display text-[clamp(1.6rem,2.8vw,2.6rem)] leading-none tracking-[-0.035em] transition-colors group-hover:text-accent">
                  {p.name}
                </span>
                <span className="label-mono text-right text-mute">
                  {p.sector} · {p.year}
                </span>
              </ProjectLink>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
