"use client";

import { useEffect, useRef } from "react";

import { gsap } from "@/lib/gsap";
import { useFinePointer } from "@/lib/use-fine-pointer";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const TEXT = "LET'S TALK";
const GLYPHS = "01<>/_#%&*+=";
const RADIUS = 70; // px around the pointer that pushes characters away
const PUSH = 2.4;
const SPRING = 0.045;
const DAMPING = 0.86;

type Particle = { hx: number; hy: number; x: number; y: number; vx: number; vy: number; ch: string };

/**
 * Home positions of characters filling TEXT in the display face, sized to the
 * canvas. Wide areas get one line; anything squarer stacks "LET'S" over "TALK",
 * so the letters come out large enough to read.
 */
function layout(width: number, height: number, display: string) {
  // A phone gets finer cells: at 6px a letter was only some eight rows tall, too few
  // for the strokes of an S or the apostrophe to read.
  const cellW = Math.max(4, Math.min(10, width / 150));
  const cellH = cellW * 1.55;
  const cols = Math.floor(width / cellW);
  const rows = Math.floor(height / cellH);
  const lines = width / height > 4 ? [TEXT] : TEXT.split(" ");

  // Draw at one canvas pixel per column; rows are taller, so the canvas is too.
  const c = document.createElement("canvas");
  c.width = cols;
  c.height = Math.round(rows * (cellH / cellW));
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  // Letters are set one by one: Safari can ignore the canvas's letterSpacing. On a phone
  // the gap a letter brings with it comes to under a column, so letters ran together;
  // there they are set two columns apart.
  const measure = (size: number) => {
    ctx.font = `600 ${size}px ${display}`;
    const track = cellW === 4 ? 2 : -0.03 * size;
    const sets = lines.map((line) => {
      const glyphs = [...line].map((ch) => ({ ch, w: ctx.measureText(ch).width }));
      const width = glyphs.reduce((sum, g) => sum + g.w, 0) + track * (glyphs.length - 1);
      return { glyphs, width, ascent: ctx.measureText(line).actualBoundingBoxAscent };
    });
    const lineH = Math.max(...sets.map((s) => s.ascent)) * 1.18;
    return { sets, track, lineH, width: Math.max(...sets.map((s) => s.width)), height: lineH * lines.length };
  };
  let size = c.height;
  let m = measure(size);
  while (size > 6 && (m.width > c.width * 0.96 || m.height > c.height * 0.92)) m = measure(--size);
  ctx.textBaseline = "alphabetic";
  const top = (c.height - m.height) / 2;
  m.sets.forEach((set, i) => {
    let x = (c.width - set.width) / 2;
    const y = top + m.lineH * i + set.ascent + (m.lineH - set.ascent) / 2;
    for (const g of set.glyphs) {
      ctx.fillText(g.ch, x, y);
      x += g.w + m.track;
    }
  });
  const { data } = ctx.getImageData(0, 0, c.width, c.height);

  const particles: Particle[] = [];
  const offsetX = (width - cols * cellW) / 2;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const sx = col;
      const sy = Math.floor((row + 0.5) * (cellH / cellW));
      if (data[(sy * c.width + sx) * 4 + 3] < 120) continue;
      const hx = offsetX + col * cellW;
      const hy = row * cellH + cellH * 0.8;
      particles.push({ hx, hy, x: hx, y: hy, vx: 0, vy: 0, ch: GLYPHS[(Math.random() * GLYPHS.length) | 0] });
    }
  }
  return { particles, fontPx: cellH * 0.82 };
}

/**
 * C6: "LET'S TALK" drawn in characters. They scatter away from the pointer,
 * turn red while displaced, and spring back home. A finger on the lettering does
 * the same on touch screens. Reduced motion gets the still lettering.
 */
export function AsciiTalk({ className = "" }: { className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const live = !reduced;

  useEffect(() => {
    const el = canvas.current!;
    const ctx = el.getContext("2d")!;
    const css = getComputedStyle(document.documentElement);
    const display = css.getPropertyValue("--font-clash").trim() || "sans-serif";
    const mono = css.getPropertyValue("--font-geist-mono").trim() || "monospace";
    let particles: Particle[] = [];
    let fontPx = 12;
    let width = 0;
    let height = 0;
    let pointer: { x: number; y: number } | null = null;
    let visible = false;
    let disposed = false;

    const draw = () => {
      const styles = getComputedStyle(el);
      const ink = styles.color;
      const accent = styles.getPropertyValue("--accent").trim();
      ctx.clearRect(0, 0, width, height);
      ctx.font = `500 ${fontPx}px ${mono}`;
      for (const p of particles) {
        ctx.fillStyle = Math.abs(p.x - p.hx) + Math.abs(p.y - p.hy) > 6 ? accent : ink;
        ctx.fillText(p.ch, p.x, p.y);
      }
    };

    const build = () => {
      const r = el.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = r.width;
      height = r.height;
      el.width = Math.round(width * dpr);
      el.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ({ particles, fontPx } = layout(width, height, display));
      draw();
    };

    const step = () => {
      if (!visible || document.hidden) return;
      for (const p of particles) {
        if (pointer) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < RADIUS && d > 0.01) {
            p.vx += (dx / d) * PUSH;
            p.vy += (dy / d) * PUSH;
          }
        }
        p.vx = (p.vx + (p.hx - p.x) * SPRING) * DAMPING;
        p.vy = (p.vy + (p.hy - p.y) * SPRING) * DAMPING;
        p.x += p.vx;
        p.y += p.vy;
      }
      draw();
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => (pointer = null);
    const onTouch = (e: TouchEvent) => {
      const r = el.getBoundingClientRect();
      pointer = { x: e.touches[0].clientX - r.left, y: e.touches[0].clientY - r.top };
    };

    document.fonts.load(`600 40px ${display}`).then(() => {
      if (disposed) return;
      build();
    });
    const ro = new ResizeObserver(() => build());
    ro.observe(el);
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(el);
    if (live) {
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      el.addEventListener("touchstart", onTouch, { passive: true });
      el.addEventListener("touchmove", onTouch, { passive: true });
      el.addEventListener("touchend", onLeave, { passive: true });
      gsap.ticker.add(step);
    }

    return () => {
      disposed = true;
      ro.disconnect();
      io.disconnect();
      gsap.ticker.remove(step);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("touchstart", onTouch);
      el.removeEventListener("touchmove", onTouch);
      el.removeEventListener("touchend", onLeave);
    };
  }, [live]);

  return (
    <canvas
      ref={canvas}
      role="img"
      aria-label="Let's talk"
      className={`block size-full ${live && fine ? "cursor-crosshair" : ""} ${className}`}
    />
  );
}
