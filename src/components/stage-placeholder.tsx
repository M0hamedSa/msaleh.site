import { TransitionLink } from "@/components/transition/transition-link";

/** A holding page for a route a later build stage fills in, so menu links and transitions have somewhere to land. */
export function StagePlaceholder({ title, route, stage, note }: { title: string; route: string; stage: number; note: string }) {
  return (
    <main className="gutter grid min-h-svh content-end gap-8 pt-[calc(84px+env(safe-area-inset-top,0px))] pb-16">
      <p className="label-mono text-mute">
        {route} · Stage {stage}
      </p>
      <h1 className="font-display text-[clamp(3.1rem,10.4vw,11.5rem)] leading-[0.9] tracking-[-0.045em]">{title}</h1>
      <p className="max-w-[48ch] text-lg">{note}</p>
      <TransitionLink href="/" className="link-line justify-self-start">
        <span className="arrow">←</span> Back home
      </TransitionLink>
    </main>
  );
}
