import type { FeaturedProject } from "@/content/projects";

type Props = {
  project: FeaturedProject;
  number: string;
  count: string;
  draft?: boolean;
  /** The page's own header is the h1; the next-project scene repeats it as plain text. */
  as?: "h1" | "p";
};

/**
 * A Case Study's opening: number, name, summary and facts. The next-project
 * scene (C15) renders the same header, so the hand-off to the next page shows
 * nothing changing.
 */
export function CaseStudyHeader({ project, number, count, draft = false, as: Title = "h1" }: Props) {
  const facts = [
    ["Sector", project.sector],
    ["Role", project.role],
    ["Year", project.year],
    ["Stack", project.stack.join(" · ")],
  ];

  return (
    <header className="grid gap-6">
      <p data-rise className="label-mono flex flex-wrap items-center gap-3 text-mute">
        {number} / {count} · Case Study
        {draft && <span className="rounded-full border border-accent px-2 py-0.5 text-accent">Draft · to confirm</span>}
      </p>
      <Title
        data-rise
        className="font-display text-[clamp(3.1rem,10.4vw,11.5rem)] leading-[0.9] tracking-[-0.045em] text-balance"
      >
        {project.name}
      </Title>
      <p data-rise className="max-w-[40ch] text-[clamp(18px,1.8vw,24px)] leading-snug">
        {project.summary}
      </p>
      <dl data-rise className="label-mono grid grid-cols-2 gap-4 border-t border-line pt-3 md:grid-cols-4">
        {facts.map(([term, value]) => (
          <div key={term}>
            <dt className="text-mute">{term}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </header>
  );
}
