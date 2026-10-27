import Image from "next/image";

import { RevealHeading } from "@/components/reveal-heading";
import type { Screen } from "@/content/projects";

/**
 * The Case Study's screens, after the cover, in full colour. Every frame keeps
 * the same 16:10 box so the grid stays even; phone captures sit inside it whole.
 * Client apps are shown with invented data, and say so; public websites don't need to.
 */
export function ScreenGallery({ screens, demo = true }: { screens: Screen[]; demo?: boolean }) {
  if (screens.length === 0) return null;
  return (
    <section aria-labelledby="screens" className="mt-14 grid gap-8 border-t border-fg pt-3">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
        <RevealHeading id="screens" className="font-display text-[clamp(2rem,3.6vw,3.5rem)] leading-[0.95] tracking-[-0.035em]">
          Screens
        </RevealHeading>
        {demo && <p className="label-mono text-mute">Demo data, invented for this page</p>}
      </div>
      <ul className="grid gap-x-6 gap-y-10 md:grid-cols-2">
        {screens.map((s, i) => (
          <li key={s.src}>
            <figure className="grid gap-3">
              <div className="aspect-[16/10] rounded-sm border border-line bg-card p-[3px]">
                <div className="relative size-full overflow-hidden rounded-[2px]">
                  <Image
                    src={s.src}
                    alt={s.alt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className={`screen-lit ${s.phone ? "object-contain py-[4%]" : `object-cover ${s.focus === "left" ? "object-left-top" : "object-right-top"}`}`}
                  />
                </div>
              </div>
              <figcaption className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 text-mute">
                <span className="label-mono text-fg">{String(i + 1).padStart(2, "0")}</span>
                {s.caption}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
