"use client";

import { useEffect, useRef } from "react";

import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const COLS = 96;
const ROWS = 22;
const GLYPHS = "01<>/_#%&*+=";
// A mono cell is about 0.6em wide and 1em tall; distances use that ratio.
const CELL_W = 6;
const CELL_H = 10;
const RADIUS = 5;
const FRAME_MS = 50;
// The characters are always set at a readable size and the whole mark is scaled down to
// its box. Set directly at 4-5px, phones with a minimum text size (a browser or
// accessibility setting) blew it up past its box: cropped, and wider than the screen.
const SET_PX = 10;

const randomGlyph = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];

// Cell kinds in a sampled mark.
const EMPTY = 0;
const INK = 1;
const CURSOR = 2;
const BLINK_MS = 1060;

/**
 * The logo (MS plus its status square) per character cell: "#" ink, "C" the square.
 * Baked from the display face once, so the mark is in the page's HTML and needs no
 * font load or canvas sampling (both failed on some Android browsers, leaving it blank).
 */
const ART = [
  "                                                                                                ",
  "      ##########                     ##########           ############                          ",
  "      ###########                   ###########       ####################                      ",
  "      ############                  ###########     ########################                    ",
  "      ############                 ############   ###########################                   ",
  "      #############               #############   ########           #########                  ",
  "      ##############             ##############  ########              #######                  ",
  "      ###############            ##############  ########              ########                 ",
  "      ####### ########          ####### #######  ##########                                     ",
  "      ####### ########         ######## #######   ##################                            ",
  "      #######  ########       ########  #######    #######################                      ",
  "      #######   ########      #######   #######      ########################                   ",
  "      #######    #######     ########   #######           ####################                  ",
  "      #######    ########   ########    #######                      ##########                 ",
  "      #######     ########  #######     #######  ########               #######                 ",
  "      #######      ###############      #######   #######               #######   CCCCCCCCCC    ",
  "      #######       #############       #######   ########             ########   CCCCCCCCCC    ",
  "      #######       #############       #######    ###########################    CCCCCCCCCC    ",
  "      #######        ###########        #######     #########################     CCCCCCCCCC    ",
  "      #######         #########         #######       #####################       CCCCCCCCCC    ",
  "      #######                           #######          ###############          CCCCCCCCCC    ",
  "                                                                                                ",
];
const MAP = ART.map((row) => [...row].map((c) => (c === "C" ? CURSOR : c === "#" ? INK : EMPTY)));

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

const STILL = staticFrame(MAP);

/** Start time of the header logo's blink, so the ASCII cursor blinks in step with it. */
function blinkOrigin() {
  const start = document.querySelector(".logo-cursor")?.getAnimations()[0]?.startTime;
  return typeof start === "number" ? start : 0;
}

/**
 * C5: the logo drawn in characters, its square blinking in step with the header's.
 * Characters scramble around the pointer or a finger; left alone, the disturbance wanders on its own.
 * `className` sizes the box (its width; the height follows) and sets the colour.
 */
export function AsciiMark({ className = "" }: { className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const pre = useRef<HTMLPreElement>(null);
  const reduced = useReducedMotion();

  // Scale the mark to its box, and the box's height to the mark.
  useEffect(() => {
    const outer = box.current!;
    const el = pre.current!;
    const fit = () => {
      const scale = outer.clientWidth / el.offsetWidth;
      el.style.transform = `scale(${scale})`;
      outer.style.height = `${el.offsetHeight * scale}px`;
    };
    const ro = new ResizeObserver(fit);
    ro.observe(outer);
    document.fonts.ready.then(fit);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    // The server already rendered the still mark; reduced motion keeps it.
    if (reduced) return;
    const el = pre.current!;
    const map = MAP;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let pointer: { x: number; y: number } | null = null;
    let visible = false;
    let elapsed = 0;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      pointer = { x: ((e.clientX - r.left) / r.width) * COLS, y: ((e.clientY - r.top) / r.height) * ROWS };
    };
    const onLeave = () => (pointer = null);
    // A finger anywhere on the page steers it too, then lets it drift again shortly after.
    let release = 0;
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      const r = el.getBoundingClientRect();
      pointer = { x: ((t.clientX - r.left) / r.width) * COLS, y: ((t.clientY - r.top) / r.height) * ROWS };
      window.clearTimeout(release);
    };
    const onTouchEnd = () => {
      window.clearTimeout(release);
      release = window.setTimeout(onLeave, 600);
    };
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
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    const origin = blinkOrigin();
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchend", onTouchEnd);
      window.clearTimeout(release);
    };
  }, [reduced]);

  return (
    // Until measured, the box assumes a mono cell of 0.6em by 1em, and clips the full-size
    // mark so it can never widen the page before the script scales it.
    <div ref={box} className={`relative max-w-full overflow-hidden ${className}`} style={{ aspectRatio: `${COLS * 0.6} / ${ROWS}` }}>
      <pre
        ref={pre}
        aria-hidden="true"
        className="absolute top-0 left-0 m-0 origin-top-left overflow-hidden font-mono leading-none whitespace-pre select-none"
        style={{ width: `${COLS}ch`, height: `${ROWS}em`, fontSize: SET_PX }}
        // In the HTML from the start, so the mark shows before (and without) any script.
        dangerouslySetInnerHTML={{ __html: STILL }}
      />
    </div>
  );
}
