"use client";

import { useCallback, useState } from "react";

import { Crt } from "@/components/archive/crt";
import { CrtStill } from "@/components/archive/crt-still";
import { ARCHIVE, ARCHIVE_KINDS, type ArchiveKind } from "@/content/archive";
import { useFinePointer } from "@/lib/use-fine-pointer";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * The Archive: every other Project, one line each, filterable by kind. Hovering
 * or selecting a row shows it on the CRT beside the list (C4). Wide screens
 * with a mouse get the 3D set; everything else gets the framed still, inside
 * the selected row on narrow screens.
 */
export function ArchiveIndex() {
  const [kind, setKind] = useState<ArchiveKind | "All">("All");
  const [selected, setSelected] = useState(ARCHIVE[0].slug);
  const [ready3d, setReady3d] = useState(false);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const use3d = fine && !reduced;
  const onReady = useCallback(() => setReady3d(true), []);

  const shown = kind === "All" ? ARCHIVE : ARCHIVE.filter((p) => p.kind === kind);
  const active = shown.find((p) => p.slug === selected) ?? shown[0];
  const filters: (ArchiveKind | "All")[] = ["All", ...ARCHIVE_KINDS];

  return (
    <div className="grid gap-10">
      <div role="group" aria-label="Filter by kind" className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const count = f === "All" ? ARCHIVE.length : ARCHIVE.filter((p) => p.kind === f).length;
          return (
            <button
              key={f}
              type="button"
              aria-pressed={kind === f}
              onClick={() => setKind(f)}
              className="label-mono rounded-full border border-line px-3 py-1.5 transition-colors hover:border-fg aria-pressed:border-fg aria-pressed:bg-fg aria-pressed:text-bg"
            >
              {f} <span className="opacity-60">({String(count).padStart(2, "0")})</span>
            </button>
          );
        })}
      </div>

      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <ol className="min-w-0 border-t border-fg">
          {shown.map((p) => {
            const isActive = p.slug === active.slug;
            return (
              <li key={p.slug} className="border-b border-line">
                <button
                  type="button"
                  aria-pressed={isActive}
                  aria-controls="archive-screen"
                  onPointerEnter={(e) => e.pointerType === "mouse" && setSelected(p.slug)}
                  onFocus={() => setSelected(p.slug)}
                  onClick={() => setSelected(p.slug)}
                  className="group grid w-full grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-2 py-5 text-left"
                >
                  <span className="font-display text-[clamp(1.6rem,2.8vw,2.6rem)] leading-none tracking-[-0.035em] transition-colors group-hover:text-accent group-aria-pressed:text-accent">
                    {p.name}
                  </span>
                  <span className="label-mono text-mute">
                    {p.kind} · {p.year}
                  </span>
                  <span className="col-span-2 max-w-[60ch] text-mute">{p.line}</span>
                </button>
                {(p.url || p.stack.length > 0) && (
                  <div className="label-mono -mt-2 flex flex-wrap items-center justify-between gap-3 pb-5 text-mute">
                    <span>{p.stack.join(" · ")}</span>
                    {p.url && (
                      <a href={p.url} target="_blank" rel="noopener" className="link-line text-fg">
                        Live demo <span className="arrow">↗</span>
                      </a>
                    )}
                  </div>
                )}
                {isActive && (
                  <div className="pb-6 lg:hidden">
                    <CrtStill project={p} className="max-w-[460px]" />
                  </div>
                )}
              </li>
            );
          })}
        </ol>

        <div
          id="archive-screen"
          aria-live="polite"
          className="sticky top-[calc(96px+env(safe-area-inset-top,0px))] hidden aspect-[1.05] w-full lg:block"
        >
          <div className={`absolute inset-[6%] transition-opacity duration-500 ${use3d && ready3d ? "opacity-0" : "opacity-100"}`}>
            <CrtStill project={active} />
          </div>
          {use3d && <Crt project={active} onReady={onReady} />}
        </div>
      </div>
    </div>
  );
}
