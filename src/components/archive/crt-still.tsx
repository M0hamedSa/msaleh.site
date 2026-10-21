"use client";

import { useEffect, useRef } from "react";

import { drawScreen, readScreenColors, SCREEN } from "@/components/archive/screen";
import type { ArchiveProject } from "@/content/archive";

/**
 * The CRT as a still: the project's finished screen in a drawn frame, with
 * scanlines and a vignette. Shown on touch screens, under reduced motion, and
 * while the 3D set loads.
 */
export function CrtStill({ project, className = "" }: { project: ArchiveProject; className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const draw = () => drawScreen(canvas.current!.getContext("2d")!, project, Infinity, readScreenColors());
    document.fonts.ready.then(draw);
    draw();
  }, [project]);

  return (
    <div className={`rounded-[22px] border border-line bg-card p-[5%] pr-[12%] shadow-[0_24px_60px_-30px_rgba(0,0,0,0.5)] ${className}`}>
      <div className="relative overflow-hidden rounded-[14px] bg-[#111110] p-[3%]">
        <div className="relative overflow-hidden rounded-[10px]">
          <canvas
            ref={canvas}
            width={SCREEN.width}
            height={SCREEN.height}
            role="img"
            aria-label={`${project.name}: ${project.line}`}
            className="block h-auto w-full"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "repeating-linear-gradient(to bottom, rgba(0,0,0,0.22) 0 1px, transparent 1px 3px), radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
