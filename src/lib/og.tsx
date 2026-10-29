import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import type { FeaturedProject } from "@/content/projects";

// Link previews (Link Preview Options: O1 for the site, C for each case study). A preview
// image has no theme, so it is always the light paper look. The renderer reads TTF only,
// so the faces are kept as TTF copies in src/assets/og, with each cover screen in grey.

export const OG_SIZE = { width: 1200, height: 630 };

const PAPER = "#eceae4";
const RAISE = "#e4e1da";
const INK = "#111110";
const MUTE = "#625e56";
const LINE = "#cfcbc1";
const RED = "#e01e1e";

const asset = (file: string) => readFile(join(process.cwd(), "src/assets/og", file));
const fonts = Promise.all([asset("ClashDisplay-Semibold.ttf"), asset("GeneralSans-Regular.ttf"), asset("GeistMono-Medium.ttf")]).then(
  ([clash, general, mono]) => [
    { name: "Clash", data: clash, weight: 600 as const, style: "normal" as const },
    { name: "General Sans", data: general, weight: 400 as const, style: "normal" as const },
    { name: "Geist Mono", data: mono, weight: 500 as const, style: "normal" as const },
  ],
);

const label = { fontFamily: "Geist Mono", fontSize: 22, letterSpacing: 0.9, textTransform: "uppercase", color: MUTE } as const;

/** MSALEH and its red block, as in the header. */
function Logo({ size }: { size: number }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", fontFamily: "Clash", fontSize: size, lineHeight: 1, letterSpacing: -0.02 * size, color: INK }}>
      MSALEH
      <div style={{ width: size * 0.2, height: size * 0.2, marginLeft: size * 0.06, marginBottom: size * 0.04, background: RED }} />
    </div>
  );
}

/** The site's image: the home page's first screen. */
export async function siteImage() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: "56px 64px", background: PAPER, color: INK }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `2px solid ${LINE}`, paddingBottom: 22 }}>
          <Logo size={38} />
          <div style={label}>msaleh.site</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontFamily: "Clash", fontSize: 112, lineHeight: 0.9, letterSpacing: -5 }}>
          <div>Business runs</div>
          <div>on systems.</div>
          <div style={{ color: RED }}>I build them.</div>
        </div>
        <div style={{ ...label, display: "flex", justifyContent: "space-between" }}>
          <div>Mohamed Saleh</div>
          <div>Full-stack developer · Giza</div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await fonts },
  );
}

/** A case study's image: its name and tagline beside its cover screen. */
export async function projectImage(project: FeaturedProject) {
  const cover = `data:image/jpeg;base64,${(await asset(`${project.slug}.jpg`)).toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: PAPER, color: INK }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 520, padding: "56px 48px 56px 64px" }}>
          <div style={label}>{`Case study · ${project.sector}`}</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "Clash", fontSize: 96, lineHeight: 0.92, letterSpacing: -4 }}>{project.name}</div>
            <div style={{ fontFamily: "General Sans", fontSize: 30, marginTop: 18 }}>{project.tagline}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Logo size={30} />
            <div style={label}>msaleh.site</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", flex: 1, padding: "48px 0 48px 40px", background: RAISE, overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- the image renderer takes a plain img */}
          <img src={cover} alt="" width={720} height={450} style={{ border: `1px solid ${LINE}` }} />
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await fonts },
  );
}
