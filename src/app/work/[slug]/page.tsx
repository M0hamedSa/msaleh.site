import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CaseAsk } from "@/components/case/case-ask";
import { CaseStudyHeader } from "@/components/case/case-study-header";
import { NextCaseStudy } from "@/components/case/next-case-study";
import { ScreenGallery } from "@/components/case/screen-gallery";
import { ProjectMorph } from "@/components/project-link";
import { ProjectVisual } from "@/components/project-visual";
import { RevealHeading } from "@/components/reveal-heading";
import { CASE_STUDIES, type CaseStudy } from "@/content/case-studies";
import { FEATURED_PROJECTS, featuredCount, getProject, nextProject, projectNumber } from "@/content/projects";

export function generateStaticParams() {
  return FEATURED_PROJECTS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const project = getProject((await params).slug);
  return project ? { title: `${project.name} · Mohamed Saleh`, description: project.summary } : {};
}

// The C40 morph needs the whole Case Study in the same commit as the click, so
// this route may block briefly instead of showing a fallback first. Its content
// is static (generateStaticParams), so the wait is one cached payload.
export const instant = false;

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const next = nextProject(slug);
  const study = CASE_STUDIES[slug];

  return (
    <main className="gutter grid gap-10 pt-[calc(120px+env(safe-area-inset-top,0px))] pb-24">
      <CaseStudyHeader
        project={project}
        number={projectNumber(slug)}
        count={featuredCount}
        draft={study?.draft}
      />

      <ProjectMorph slug={slug}>
        <ProjectVisual project={project} tone="full" eager className="aspect-[16/9] w-full rounded-sm" />
      </ProjectMorph>

      {study ? (
        <CaseStudyBody study={study} />
      ) : (
        <section className="grid gap-3 border-t border-fg pt-3">
          <p className="label-mono text-mute">In progress</p>
          <p className="max-w-[56ch] text-lg">
            The full Case Study, with the problem and the decisions behind the system, is being written.
          </p>
        </section>
      )}

      <CaseAsk name={project.name} />

      <ScreenGallery screens={project.screens.slice(1)} demo={!project.publicScreens} />

      <NextCaseStudy project={next} number={projectNumber(next.slug)} />
    </main>
  );
}

/** One numbered part of a Case Study: label and heading on the left, content on the right (stacked on phones). */
function Part({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  const id = `part-${n}`;
  return (
    <section aria-labelledby={id} className="grid gap-x-12 gap-y-6 border-t border-fg pt-3 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
      <div className="grid content-start gap-3">
        <p className="label-mono text-mute">{n}</p>
        <RevealHeading id={id} className="font-display text-[clamp(2rem,3.6vw,3.5rem)] leading-[0.95] tracking-[-0.035em] text-balance">
          {title}
        </RevealHeading>
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

function CaseStudyBody({ study }: { study: CaseStudy }) {
  return (
    <div className="grid gap-24 pt-8">
      <Part n="01" title="The problem">
        <div className="grid max-w-[62ch] gap-5 text-[clamp(17px,1.4vw,20px)] leading-relaxed">
          {study.problem.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
      </Part>

      <Part n="02" title="Constraints">
        <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {study.constraints.map((c) => (
            <li key={c.title} className="grid content-start gap-2 border-t border-line pt-3">
              <h3 className="label-mono">{c.title}</h3>
              <p className="text-mute">{c.body}</p>
            </li>
          ))}
        </ul>
      </Part>

      <Part n="03" title="Three key decisions">
        <ol className="grid gap-12">
          {study.decisions.map((d, i) => (
            <li key={d.title} className="grid gap-3 border-t border-line pt-3">
              <div className="label-mono flex flex-wrap justify-between gap-3 text-mute">
                <span>Decision {i + 1}</span>
                <span>{d.source}</span>
              </div>
              <h3 className="font-display text-[clamp(1.5rem,2.4vw,2.25rem)] leading-tight tracking-[-0.025em]">{d.title}</h3>
              <p className="max-w-[62ch] leading-relaxed">{d.choice}</p>
              <p className="max-w-[62ch] leading-relaxed text-mute">
                <span className="label-mono mr-2 text-accent-ink">Trade-off</span>
                {d.tradeoff}
              </p>
            </li>
          ))}
        </ol>
      </Part>

      <Part n="04" title="Outcome">
        <div className="grid gap-6">
          <ul className="grid gap-4">
            {study.outcome.points.map((p) => (
              <li key={p} className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-2 text-[clamp(17px,1.4vw,20px)] leading-relaxed">
                <span aria-hidden="true" className="mt-[0.55em] size-2 bg-accent" />
                {p}
              </li>
            ))}
          </ul>
          <p className="label-mono text-mute">{study.outcome.note}</p>
        </div>
      </Part>
    </div>
  );
}
