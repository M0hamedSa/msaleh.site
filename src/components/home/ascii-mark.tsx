"use client";

import { useEffect, useRef } from "react";

import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const COLS = 96;
const ROWS = 22;
const GLYPHS = "01<>/_#%&*+=";
// A mono cell is about 0.6em wide and 1em tall; sampling and distances use that ratio.
const CELL_W = 6;
const CELL_H = 10;
const RADIUS = 5;
const FRAME_MS = 50;

const randomGlyph = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];

// Cell kinds in a sampled mark.
const EMPTY = 0;
const INK = 1;
const CURSOR = 2;
const BLINK_MS = 1060;

/** The logo (MS plus its status square) sampled per character cell: EMPTY, INK or CURSOR. */
function sampleMark(family: string) {
  const canvas = document.createElement("canvas");
  canvas.width = COLS * CELL_W;
  canvas.height = ROWS * CELL_H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  const fit = (size: number) => {
    ctx.font = `600 ${size}px ${family}`;
    ctx.letterSpacing = `${-0.02 * size}px`;
    const box = ctx.measureText("MS");
    return { box, width: box.width + 0.26 * size };
  };

  let size = canvas.height * 1.4;
  let m: ReturnType<typeof fit>;
  do {
    size -= 2;
    m = fit(size);
  } while (size > 8 && (m.width > canvas.width * 0.94 || m.box.actualBoundingBoxAscent > canvas.height * 0.9));

  const left = (canvas.width - m.width) / 2;
  const base = (canvas.height + m.box.actualBoundingBoxAscent) / 2;
  const square = 0.2 * size;
  const squareX = left + m.box.width + 0.06 * size;
  ctx.fillStyle = "#000";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("MS", left, base);
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);

  return Array.from({ length: ROWS }, (_, row) =>
    Array.from({ length: COLS }, (_, col) => {
      const x = col * CELL_W + CELL_W / 2;
      const y = row * CELL_H + CELL_H / 2;
      if (x >= squareX && x <= squareX + square && y >= base - square && y <= base) return CURSOR;
      return data[(y * canvas.width + x) * 4 + 3] > 100 ? INK : EMPTY;
    }),
  );
}

function staticFrame(map: number[][]) {
  return map
    .map((row) => row.map((v) => (v === CURSOR ? '<span class="text-accent">#</span>' : v === INK ? "#" : " ")).join(""))
    .join("\n");
}

function liveFrame(map: number[][], px: number, py: number, cursorOn: boolean) {
  let out = "";
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const near = Math.hypot((col - px) * (CELL_W / CELL_H), row - py) < RADIUS;
      const cell = map[row][col];
      if (cell === CURSOR) {
        out += cursorOn || near ? `<span class="text-accent">${near ? randomGlyph() : "#"}</span>` : " ";
      } else if (cell === INK) {
        if (near) out += `<span class="text-accent">${randomGlyph()}</span>`;
        else out += Math.random() < 0.03 ? randomGlyph() : "#";
      } else {
        out += near && Math.random() < 0.3 ? '<span class="text-mute">·</span>' : " ";
      }
    }
    out += "\n";
  }
  return out;
}

/** Start time of the header logo's blink, so the ASCII cursor blinks in step with it. */
function blinkOrigin() {
  const start = document.querySelector(".logo-cursor")?.getAnimations()[0]?.startTime;
  return typeof start === "number" ? start : 0;
}

/**
 * C5: the logo drawn in characters, its square blinking in step with the header's.
 * Characters scramble around the pointer; on touch the disturbance wanders on its own.
 */
export function AsciiMark({ className = "" }: { className?: string }) {
  const pre = useRef<HTMLPreElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = pre.current!;
    let disposed = false;
    let stop = () => {};

    const family = getComputedStyle(document.documentElement).getPropertyValue("--font-clash").trim() || "sans-serif";
    document.fonts.load(`600 40px ${family}`).then(() => {
      if (disposed) return;
      const map = sampleMark(family);
      if (reduced) {
        el.innerHTML = staticFrame(map);
        return;
      }

      const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      let pointer: { x: number; y: number } | null = null;
      let visible = false;
      let elapsed = 0;

      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        pointer = { x: ((e.clientX - r.left) / r.width) * COLS, y: ((e.clientY - r.top) / r.height) * ROWS };
      };
      const onLeave = () => (pointer = null);
      const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
      io.observe(el);

      const tick = (time: number, delta: number) => {
        elapsed += delta;
        if (!visible || document.hidden || elapsed < FRAME_MS) return;
        elapsed = 0;
        // Without a pointer over the page, the disturbance drifts in a slow loop.
        const p = pointer ?? {
          x: COLS / 2 + Math.cos(time * 0.9) * COLS * 0.35,
          y: ROWS / 2 + Math.sin(time * 1.3) * ROWS * 0.3,
        };
        const cursorOn = (performance.now() - origin) % BLINK_MS < BLINK_MS / 2;
        el.innerHTML = liveFrame(map, p.x, p.y, cursorOn);
      };

      if (fine) {
        window.addEventListener("pointermove", onMove, { passive: true });
        document.documentElement.addEventListener("pointerleave", onLeave);
      }
      const origin = blinkOrigin();
      el.innerHTML = staticFrame(map);
      gsap.ticker.add(tick);

      stop = () => {
        gsap.ticker.remove(tick);
        io.disconnect();
        window.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("pointerleave", onLeave);
      };
    });

    return () => {
      disposed = true;
      stop();
    };
  }, [reduced]);

  return (
    <pre
      ref={pre}
      aria-hidden="true"
      className={`m-0 overflow-hidden font-mono leading-none whitespace-pre select-none ${className}`}
      style={{ width: `${COLS}ch`, height: `${ROWS}em` }}
    />
  );
}
