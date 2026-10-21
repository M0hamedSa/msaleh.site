"use client";

import { useEffect, useRef } from "react";

import { gsap } from "@/lib/gsap";
import { useDarkTheme } from "@/lib/use-dark-theme";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const VERTEX = "attribute vec2 p; varying vec2 uv; void main(){ uv = p * .5 + .5; gl_Position = vec4(p, 0., 1.); }";

// Soft red light seen through vertical glass flutes: each band shifts what's
// behind it sideways, and the pointer (or a slow drift) moves the light.
const FRAGMENT = `precision mediump float;
uniform float t; uniform vec2 m; uniform vec2 r; uniform vec3 bg; uniform vec3 glow; varying vec2 uv;
void main(){
  float bands = 18.;
  float f = fract(uv.x * bands);
  vec2 q = uv + vec2((f - .5) * .12, 0.) + (m - .5) * .05;
  vec2 p = q * vec2(r.x / r.y, 1.);
  float t2 = t * .2;
  float aspect = r.x / r.y;
  float g = exp(-length(p - vec2(aspect * (.55 + .25 * sin(t2)), .35)) * 2.4)
          + .7 * exp(-length(p - vec2(aspect * .85, .7 + .15 * cos(t2))) * 3.);
  vec3 c = mix(bg, glow, smoothstep(.12, .95, g) * .55);
  c *= .9 + .1 * smoothstep(0., .5, f);
  gl_FragColor = vec4(c, 1.);
}`;

const rgb = (color: string) => {
  const ctx = document.createElement("canvas").getContext("2d")!;
  ctx.fillStyle = color;
  const hex = ctx.fillStyle as string;
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
};

/**
 * C30: fluted glass behind the footer, dark theme only. One WebGL context,
 * drawn only while the footer is on screen; without WebGL it simply isn't there.
 */
export function FlutedGlass() {
  const dark = useDarkTheme();
  const reduced = useReducedMotion();
  if (!dark || reduced) return null;
  return <GlassCanvas />;
}

function GlassCanvas() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current!;
    const gl = el.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return;

    const shader = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, shader(gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(program, shader(gl.FRAGMENT_SHADER, FRAGMENT));
    gl.bindAttribLocation(program, 0, "p");
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const u = (name: string) => gl.getUniformLocation(program, name);

    const css = getComputedStyle(el);
    gl.uniform3fv(u("bg"), rgb(css.getPropertyValue("--loader-bg").trim()));
    gl.uniform3fv(u("glow"), rgb(css.getPropertyValue("--accent").trim()));

    const resize = () => {
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      el.width = Math.round(el.clientWidth * dpr);
      el.height = Math.round(el.clientHeight * dpr);
      gl.viewport(0, 0, el.width, el.height);
      gl.uniform2f(u("r"), el.width, el.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const mouse = { x: 0.5, y: 0.5 };
    let pointed = false;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      pointed = true;
      gsap.to(mouse, { x: (e.clientX - r.left) / r.width, y: 1 - (e.clientY - r.top) / r.height, duration: 1.2, ease: "power3.out", overwrite: true });
    };
    const onLeave = () => (pointed = false);
    const host = el.parentElement!;
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    let visible = false;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(el);
    const tick = (time: number) => {
      if (!visible || document.hidden) return;
      if (!pointed) mouse.x = 0.5 + 0.35 * Math.sin(time * 0.4);
      gl.uniform1f(u("t"), time);
      gl.uniform2f(u("m"), mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      // The context isn't force-released: an effect re-run reuses this canvas and
      // would get a dead context back. The browser frees it with the canvas.
    };
  }, []);

  return <canvas ref={canvas} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />;
}
