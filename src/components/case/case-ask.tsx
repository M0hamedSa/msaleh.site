import { Magnetic } from "@/components/magnetic";
import { EMAIL } from "@/content/contact";

/** The end of a Case Study: one line that names the project, the email and a way to write. */
export function CaseAsk({ name }: { name: string }) {
  return (
    <section
      aria-labelledby="case-ask"
      className="grid items-end gap-8 border-t border-fg pt-6 md:grid-cols-[minmax(0,1fr)_auto]"
    >
      <h2
        id="case-ask"
        className="max-w-[20ch] font-display text-[clamp(2rem,4vw,3.75rem)] leading-[0.95] tracking-[-0.035em] text-balance"
      >
        Need something like {name} for your business?
      </h2>
      <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
        <a href={`mailto:${EMAIL}`} className="label-mono link-line normal-case">
          {EMAIL}
        </a>
        <Magnetic>
          <a href={`mailto:${EMAIL}`} data-cursor="Write" className="btn-fill">
            <span data-magnetic-inner>Write to me</span>
          </a>
        </Magnetic>
      </div>
    </section>
  );
}
