"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";

import type { FeaturedProject, PlaceholderVisual, Screen } from "@/content/projects";

// A project's image: muted toward the page by default, full colour on hover
// and inside the Case Study. Projects with real screens show their cover,
// desaturated and tinted (and dimmed in dark mode) so it sits in the theme;
// the others show a drawing that hints at their subject, marked as a
// placeholder and dithered in the theme's ink.
const W = 200;
const H = 150;
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const hash = (n: number) => {
  const s = Math.sin(n * 12.9898) * 43758.5453;
  return s - Math.floor(s);
};

const FIELDS: Record<PlaceholderVisual, (x: number, y: number) => number> = {
  // True Visor: an inspection lens.
  lens: (x, y) => {
    const r = Math.hypot((x - 0.62) * 1.4, y - 0.5);
    return Math.max(0, 1 - r * 1.5) * (0.55 + 0.45 * Math.cos(r * 46));
  },
  // Aqsat: installment steps.
  steps: (x, y) => {
    const h = (Math.floor(x * 12) + 1) / 13;
    return y > 1 - h ? 0.85 - (y - (1 - h)) * 0.6 : 0.05 + x * 0.08;
  },
  // True Legal: ledger rows.
  ledger: (x, y) => {
    const r = Math.floor(y * 22);
    return (r % 2 ? 0.12 : 0.22) + (x > 0.06 && x < 0.12 + hash(r) * 0.78 ? 0.6 : 0);
  },
  // Kidzenia: soft fabric shapes.
  blobs: (x, y) => {
    const g = (a: number, b: number, s: number) => Math.exp(-(((x - a) * 1.4) ** 2 + (y - b) ** 2) / s);
    return Math.min(1, g(0.35, 0.45, 0.05) + g(0.7, 0.6, 0.07) * 0.8 + g(0.55, 0.2, 0.02) * 0.7);
  },
  // KTC Scanner Hub: a barcode and its scan line.
  barcode: (x, y) => {
    if (Math.abs(y - 0.62) < 0.006) return 1;
    return y > 0.18 && y < 0.82 ? (hash(Math.floor(x * 70) + 3) > 0.45 ? 0.92 : 0.04) : 0.03;
  },
};

function rgb(color: string) {
  const ctx = document.createElement("canvas").getContext("2d")!;
  ctx.fillStyle = color;
  const hex = ctx.fillStyle as string; // normalised to #rrggbb
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
}

function themeColors() {
  const css = getComputedStyle(document.documentElement);
  return {
    ink: rgb(css.getPropertyValue("--fg").trim()),
    paper: rgb(css.getPropertyValue("--card").trim()),
    accent: rgb(css.getPropertyValue("--accent").trim()),
  };
}

function paint(canvas: HTMLCanvasElement, visual: PlaceholderVisual, tone: "dither" | "full") {
  const { ink, paper, accent } = themeColors();
  const field = FIELDS[visual];
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(W, H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const v = field(x / W, y / H);
      let c: number[];
      if (tone === "dither") c = v > (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16 ? ink : paper;
      else {
        // Full tone: paper → accent → ink as the value rises.
        const t = Math.min(1, Math.max(0, v));
        const [a, b, k] = t < 0.5 ? [paper, accent, t * 2] : [accent, ink, (t - 0.5) * 2];
        c = a.map((ch, i) => ch + (b[i] - ch) * k);
      }
      const i = (y * W + x) * 4;
      img.data[i] = c[0];
      img.data[i + 1] = c[1];
      img.data[i + 2] = c[2];
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

/** Redraws when the theme changes, since the drawing uses the theme's colours. */
function useThemeRepaint(repaint: () => void) {
  useEffect(() => {
    repaint();
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const mo = new MutationObserver(repaint);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    mq.addEventListener("change", repaint);
    return () => {
      mo.disconnect();
      mq.removeEventListener("change", repaint);
    };
  }, [repaint]);
}

type Props = {
  project: FeaturedProject;
  /**
   * "dither" by default (muted, for a screen); "full" inside a Case Study;
   * "hover" stays muted until its `group` is hovered.
   */
  tone?: "dither" | "full" | "hover";
  /** The visible "Placeholder" tag; off for thumbnails too small to carry it. */
  tagged?: boolean;
  /** The image's rendered width, for picking a source: as `<Image sizes>`. */
  sizes?: string;
  /** Load the full image straight away (the Case Study cover). */
  eager?: boolean;
  className?: string;
};

/** A project image: its cover screen, or a marked placeholder drawing until it has one. */
export function ProjectVisual({ project, tone = "dither", tagged = true, sizes = "100vw", eager = false, className = "" }: Props) {
  const cover = project.screens[0];
  return cover ? (
    <ScreenVisual screen={cover} tone={tone} sizes={sizes} eager={eager} className={className} />
  ) : (
    <PlaceholderArt visual={project.visual} name={project.name} tone={tone} tagged={tagged} className={className} />
  );
}

const fullToneClass = (tone: NonNullable<Props["tone"]>) =>
  tone === "hover" ? "opacity-0 transition-opacity duration-500 group-hover:opacity-100" : "";

/**
 * A real screen: the captured pixels on a card-coloured mat with a hairline rule,
 * so pale apps don't float on the page. Grayscale unless the tone is "full".
 */
export function ScreenVisual({ screen, tone, sizes, eager, className }: { screen: Screen; tone: NonNullable<Props["tone"]>; sizes: string; eager: boolean; className: string }) {
  const muted = tone !== "full";
  const reveal = tone === "hover";
  return (
    <div className={`relative overflow-hidden border border-line bg-card p-[3px] ${className}`}>
      <div className="relative size-full overflow-hidden rounded-[2px]">
        <Image
          src={screen.src}
          alt={screen.alt}
          fill
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          className={`object-cover ${screen.focus === "left" ? "object-left-top" : "object-right-top"} ${
            muted ? `screen-muted ${reveal ? "group-hover:[filter:brightness(var(--screen-dim))]" : ""}` : "screen-lit"
          }`}
        />
      </div>
    </div>
  );
}

function PlaceholderArt({ visual, name, tone, tagged, className }: { visual: PlaceholderVisual; name: string; tone: NonNullable<Props["tone"]>; tagged: boolean; className: string }) {
  const dither = useRef<HTMLCanvasElement>(null);
  const full = useRef<HTMLCanvasElement>(null);

  useThemeRepaint(
    useCallback(() => {
      if (dither.current) paint(dither.current, visual, "dither");
      if (full.current) paint(full.current, visual, "full");
    }, [visual]),
  );

  const canvasClass = "absolute inset-0 size-full [image-rendering:pixelated]";
  return (
    <div role="img" aria-label={`${name}, placeholder image`} className={`relative overflow-hidden bg-card ${className}`}>
      {tone !== "full" && <canvas ref={dither} width={W} height={H} className={canvasClass} />}
      {tone !== "dither" && (
        <canvas ref={full} data-tone="full" width={W} height={H} className={`${canvasClass} ${fullToneClass(tone)}`} />
      )}
      {tagged && (
        <span className="label-mono absolute bottom-2 left-2 rounded-sm bg-bg/80 px-1.5 py-0.5 text-[10px] text-mute">
          Placeholder · {name}
        </span>
      )}
    </div>
  );
}
