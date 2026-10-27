import Image from "next/image";

import type { FeaturedProject } from "@/content/projects";

// A project's thumbnail: key art built from the client's own brand, their real
// photography where they have it, and a motif for the idea, never a dashboard.
// Everything is sized in container units (cqw), so it scales to any frame.

const TV_MARK = [
  { d: "M130 25H705L606 131Q596 142 578 142H22Z", opacity: 1 },
  { d: "M255 158H330Q382 160 408 206V618L268 462Q255 447 255 428Z", opacity: 0.55 },
  {
    d: "M330 158H372Q472 160 516 246L598 410L842 38Q850 25 870 25H1040L682 586Q660 628 615 624Q590 620 578 600L408 330V206Q382 160 330 158Z",
    opacity: 1,
  },
];

const KIDZENIA_PHOTOS = ["18", "11", "14"];

function Art({ project: p }: { project: FeaturedProject }) {
  const { accent, ink, from } = p.brand;
  switch (p.slug) {
    case "kidzenia":
      return (
        <div className="absolute top-[7cqw] right-[5cqw] flex h-[56cqw] items-center">
          {KIDZENIA_PHOTOS.map((n, i) => (
            <div
              key={n}
              className="thumb-float relative -ml-[6cqw] h-[44cqw] w-[24cqw] overflow-hidden rounded-[1.6cqw] border-[0.6cqw] border-white shadow-[0_3cqw_6cqw_-1cqw_rgba(0,0,0,0.5)]"
              style={{ rotate: `${(i - 1) * 7}deg`, translate: `0 ${i === 1 ? -3 : 2}cqw`, animationDelay: `${i * 0.6}s`, zIndex: i === 1 ? 2 : 1 }}
            >
              <Image src={`/projects/kidzenia/photos/${n}.jpg`} alt="" fill sizes="20vw" className="object-cover" />
            </div>
          ))}
        </div>
      );
    case "tiba-masr":
      return (
        <>
          <Image src="/projects/tiba-masr/photo.jpg" alt="" fill sizes="70vw" className="thumb-zoom object-cover" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(75deg, ${from} 18%, ${from}cc 40%, transparent 75%)` }} />
        </>
      );
    case "true-visor":
      return (
        <div className="absolute top-[8cqw] right-[5cqw] grid w-[48cqw] justify-items-end gap-[3cqw]">
          <svg viewBox="22 25 1018 603" className="w-[44cqw]" aria-hidden>
            {TV_MARK.map((m) => (
              <path key={m.d} d={m.d} fill={accent} fillOpacity={m.opacity} />
            ))}
          </svg>
          <div className="grid w-[40cqw] gap-[1.4cqw] rounded-[1.6cqw] border bg-white/5 p-[2cqw]" style={{ borderColor: `${accent}55` }}>
            <span className="flex items-center gap-[1cqw] font-mono text-[1.7cqw] tracking-wider uppercase" style={{ color: accent }}>
              <svg viewBox="0 0 24 24" className="size-[2.4cqw]" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M2 8.8a15 15 0 0 1 20 0M5 12.6a10 10 0 0 1 9-2.4M8.5 16.4a5 5 0 0 1 4.6-1.2M12 20h.01M3 3l18 18" />
              </svg>
              Offline · saved on device
            </span>
            {[1, 1, 0.7, 0.45].map((w, i) => (
              <span key={i} className="flex items-center gap-[1.2cqw]">
                <span
                  className="grid size-[2.4cqw] place-items-center rounded-full text-[1.5cqw]"
                  style={{ background: i < 2 ? accent : "transparent", border: `0.3cqw solid ${accent}`, color: from }}
                >
                  {i < 2 ? "✓" : ""}
                </span>
                <span className="h-[1.2cqw] rounded-full bg-white/25" style={{ width: `${w * 30}cqw` }} />
              </span>
            ))}
          </div>
        </div>
      );
    case "aqsat":
      return (
        <div className="absolute top-[8cqw] right-[5cqw] grid justify-items-end gap-[3cqw]">
          <span className="font-display text-[22cqw] leading-[0.8]" style={{ color: accent }} lang="ar">
            {p.wordmark}
          </span>
          {/* Twelve monthly installments: seven paid, one due now, four to come. */}
          <div className="grid grid-cols-6 gap-[1.4cqw]" aria-hidden>
            {Array.from({ length: 12 }, (_, i) => (
              <span
                key={i}
                className={`size-[4.2cqw] rounded-full ${i === 7 ? "thumb-blink" : ""}`}
                style={{ background: i < 7 ? ink : i === 7 ? accent : "transparent", border: `0.35cqw solid ${i === 7 ? accent : ink}` }}
              />
            ))}
          </div>
        </div>
      );
    case "true-legal":
      return (
        <div className="absolute top-[7cqw] right-[5cqw] grid w-[46cqw] rotate-3 gap-[1.2cqw] rounded-[2cqw] bg-[#fbeee6] p-[3cqw] text-[#2a120a] shadow-[0_4cqw_8cqw_-2cqw_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between">
            {p.logo && <Image src={p.logo.src} alt="" width={p.logo.width} height={p.logo.height} className="size-[8cqw]" />}
            <span className="font-mono text-[1.6cqw] tracking-wider uppercase opacity-60">Client ledger</span>
          </div>
          {(
            [
              ["+", 0.8, "#1f8a5b"],
              ["−", 0.55, "#c2410c"],
              ["+", 0.65, "#1f8a5b"],
              ["−", 0.4, "#c2410c"],
              ["−", 0.5, "#c2410c"],
            ] as const
          ).map(([sign, w, c], i) => (
            <span key={i} className="flex items-center gap-[1.4cqw] border-b border-[#2a120a1a] pb-[1.2cqw]">
              <span className="w-[2cqw] font-mono text-[2.2cqw]" style={{ color: c }}>
                {sign}
              </span>
              <span className="h-[1.2cqw] rounded-full bg-[#2a120a26]" style={{ width: `${w * 34}cqw` }} />
            </span>
          ))}
          <span className="font-display text-[2.6cqw]">Who owes whom, in plain words.</span>
        </div>
      );
    default:
      return null;
  }
}

/** The client's logo on a white plate, or the project's wordmark when it has no logo. */
function Mark({ project: p }: { project: FeaturedProject }) {
  if (!p.logo) return null;
  return (
    <span className="inline-flex items-center rounded-[1.2cqw] bg-white px-[1.6cqw] py-[1cqw]">
      <Image src={p.logo.src} alt={`${p.name} logo`} width={p.logo.width} height={p.logo.height} className="h-[4.4cqw] w-auto" />
    </span>
  );
}

/** Live work gets a steady green dot; anything not live yet (pilot, launching) a hollow ring, never red. */
export function ProjectStatus({ project: p, className = "" }: { project: FeaturedProject; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className={`size-[7px] rounded-full ${p.live ? "bg-live" : "border-[1.5px] border-mute"}`} />
      {p.status}
    </span>
  );
}

type Props = {
  project: FeaturedProject;
  /** Name and tagline on the art; "tagline" where the layout already names the project. */
  caption?: "full" | "tagline" | "none";
  className?: string;
};

/** The project's key art, filling its parent. */
export function ProjectThumb({ project: p, caption = "full", className = "" }: Props) {
  const { from, to, ink } = p.brand;
  // The art already carries the True Visor mark and the Aqsat wordmark.
  const plate = p.slug !== "true-visor" && p.slug !== "aqsat";
  return (
    <div
      className={`relative overflow-hidden [container-type:inline-size] ${className}`}
      style={{ background: `radial-gradient(130% 110% at 100% 0%, ${to} 0%, ${from} 70%)`, color: ink }}
    >
      <Art project={p} />
      <div className="absolute bottom-[5cqw] left-[5cqw] grid max-w-[52cqw] justify-items-start gap-[1.6cqw]">
        {plate && <Mark project={p} />}
        {caption === "full" && <p className="font-display text-[8cqw] leading-[0.88] tracking-[-0.04em]">{p.name}</p>}
        {caption === "full" && <p className="text-[2.5cqw] leading-snug opacity-80">{p.tagline}</p>}
        {caption === "tagline" && <p className="max-w-[40cqw] font-display text-[5cqw] leading-[1] tracking-[-0.02em]">{p.tagline}</p>}
      </div>
    </div>
  );
}
