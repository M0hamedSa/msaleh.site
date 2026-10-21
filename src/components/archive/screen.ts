import type { ArchiveProject } from "@/content/archive";

// What the CRT shows for a project: a terminal that types out the project, in
// the accent as phosphor. One drawing serves the 3D CRT (as a texture) and the
// framed still for touch screens and reduced motion. Stage 10 swaps in real
// recordings.

export const SCREEN = { width: 640, height: 480 };

export type ScreenColors = { phosphor: string; glass: string; dim: string; display: string; mono: string };

export function readScreenColors(): ScreenColors {
  const css = getComputedStyle(document.documentElement);
  const v = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback;
  return {
    phosphor: v("--accent", "#e01e1e"),
    glass: "#0d0f0e",
    dim: "#6b675f",
    display: v("--font-clash", "sans-serif"),
    mono: v("--font-geist-mono", "monospace"),
  };
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

/**
 * Draws the project at `elapsed` seconds into its screen time: the command
 * types out, then the name, the line and the details appear, with a cursor.
 * `elapsed = Infinity` draws the finished screen.
 */
export function drawScreen(ctx: CanvasRenderingContext2D, project: ArchiveProject, elapsed: number, colors: ScreenColors) {
  const { width: w, height: h } = SCREEN;
  const pad = 44;
  const typed = (text: string, start: number, cps = 38) =>
    text.slice(0, Math.max(0, Math.min(text.length, Math.floor((elapsed - start) * cps))));

  ctx.fillStyle = colors.glass;
  ctx.fillRect(0, 0, w, h);
  ctx.shadowColor = colors.phosphor;
  ctx.shadowBlur = 12;
  ctx.fillStyle = colors.phosphor;
  ctx.textBaseline = "alphabetic";

  ctx.font = `500 18px ${colors.mono}`;
  const command = `> open archive/${project.slug}`;
  ctx.fillText(typed(command, 0), pad, pad + 14);
  const commandDone = command.length / 38;

  if (elapsed > commandDone + 0.15) {
    ctx.font = `600 58px ${colors.display}`;
    const nameLines = wrap(ctx, project.name, w - pad * 2).slice(0, 2);
    nameLines.forEach((line, i) => ctx.fillText(line, pad, pad + 96 + i * 58));
    const afterName = pad + 96 + (nameLines.length - 1) * 58;

    ctx.font = `400 19px ${colors.mono}`;
    const body = wrap(ctx, project.line, w - pad * 2).slice(0, 5);
    const bodyStart = commandDone + 0.35;
    let shown = typed(body.join("\n"), bodyStart, 90).split("\n");
    shown = shown.slice(0, body.length);
    shown.forEach((line, i) => ctx.fillText(line, pad, afterName + 54 + i * 27));

    const metaStart = bodyStart + project.line.length / 90 + 0.2;
    if (elapsed > metaStart) {
      ctx.shadowBlur = 0;
      ctx.font = `500 15px ${colors.mono}`;
      ctx.fillStyle = colors.dim;
      const meta = [project.kind, project.year, ...project.stack].join("  ·  ").toUpperCase();
      ctx.fillText(meta, pad, h - pad);
    }
  }

  // A block cursor, blinking at the end of whatever is being typed.
  if (Math.floor(elapsed * 2) % 2 === 0 || !Number.isFinite(elapsed)) {
    ctx.shadowBlur = 12;
    ctx.fillStyle = colors.phosphor;
    ctx.fillRect(w - pad - 14, h - pad - 18, 14, 22);
  }
  ctx.shadowBlur = 0;
}
