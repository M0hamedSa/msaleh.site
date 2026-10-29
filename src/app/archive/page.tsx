import type { Metadata } from "next";

import { ArchiveIndex } from "@/components/archive/archive-index";
import { ARCHIVE } from "@/content/archive";

export const metadata: Metadata = {
  title: "Archive · Mohamed Saleh",
  description: "Every other project: production systems at a textile manufacturer, tools and early work.",
};

export default function ArchivePage() {
  return (
    <main className="gutter grid gap-10 pt-[calc(120px+env(safe-area-inset-top,0px))] pb-28">
      <div className="grid gap-4">
        <p className="label-mono text-mute">/archive · {String(ARCHIVE.length).padStart(2, "0")} projects</p>
        <h1 className="max-w-[18ch] font-display text-[clamp(2.75rem,7vw,7.5rem)] leading-[0.92] tracking-[-0.045em] text-balance">
          Everything else, one line each.
        </h1>
      </div>
      <ArchiveIndex />
    </main>
  );
}
