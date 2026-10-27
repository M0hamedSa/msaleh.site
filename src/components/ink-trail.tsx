"use client";

import { useEffect, useRef } from "react";

import { useReducedMotion } from "@/lib/use-reduced-motion";

// Liquid ink cursor trail (C27, after Codegrid's "Most Satisfying Cursor Trail on
// the Web", from Cappen). A stable-fluids simulation on the GPU: the pointer pushes
// the fluid and drops ink into it; the ink is drawn in difference blend over the
// page, so it inverts whatever it flows across, dark ink on bone and pale ink on
// graphite, and fades within a second or so. On touch screens the finger draws it.

const SIM_RES = 128; // velocity and pressure grid (short side)
const DYE_RES = 768; // ink grid (short side)
const DYE_RES_TOUCH = 512; // phones: a lighter ink grid, the screen is small anyway
const PRESSURE_ITERATIONS = 20;
const CURL = 14; // swirl kept in the flow
const VELOCITY_DISSIPATION = 1.6; // per second
const INK_DISSIPATION = 2.8; // per second
const SPLAT_RADIUS = 0.0007; // as a share of the screen
// A phone screen is narrow and tall, so the same share draws a blob a third of its width;
// a finger also crosses more of the screen per stroke. Both are scaled down on touch.
const TOUCH_RADIUS = 0.35;
const TOUCH_FORCE = 0.6;
const SPLAT_FORCE = 3000;
const IDLE_STOP_MS = 4000; // stop drawing once the ink has gone

const VERT = `#version 300 es
precision highp float;
in vec2 aPos;
uniform vec2 texel;
out vec2 vUv, vL, vR, vT, vB;
void main() {
  vUv = aPos * .5 + .5;
  vL = vUv - vec2(texel.x, 0.); vR = vUv + vec2(texel.x, 0.);
  vT = vUv + vec2(0., texel.y); vB = vUv - vec2(0., texel.y);
  gl_Position = vec4(aPos, 0., 1.);
}`;

const head = `#version 300 es
precision highp float;
in vec2 vUv, vL, vR, vT, vB;
out vec4 o;
`;

const FRAG = {
  splat: `${head}uniform sampler2D uTarget; uniform float aspect, radius; uniform vec3 color; uniform vec2 point;
void main() { vec2 p = vUv - point; p.x *= aspect; o = vec4(texture(uTarget, vUv).xyz + exp(-dot(p, p) / radius) * color, 1.); }`,
  advect: `${head}uniform sampler2D uVelocity, uSource; uniform vec2 simTexel; uniform float dt, dissipation;
void main() { vec2 c = vUv - dt * texture(uVelocity, vUv).xy * simTexel; o = texture(uSource, c) / (1. + dissipation * dt); }`,
  divergence: `${head}uniform sampler2D uVelocity;
void main() {
  float L = texture(uVelocity, vL).x, R = texture(uVelocity, vR).x, T = texture(uVelocity, vT).y, B = texture(uVelocity, vB).y;
  vec2 C = texture(uVelocity, vUv).xy;
  if (vL.x < 0.) L = -C.x; if (vR.x > 1.) R = -C.x; if (vT.y > 1.) T = -C.y; if (vB.y < 0.) B = -C.y;
  o = vec4(.5 * (R - L + T - B), 0., 0., 1.);
}`,
  curl: `${head}uniform sampler2D uVelocity;
void main() { o = vec4(.5 * (texture(uVelocity, vR).y - texture(uVelocity, vL).y - texture(uVelocity, vT).x + texture(uVelocity, vB).x), 0., 0., 1.); }`,
  vorticity: `${head}uniform sampler2D uVelocity, uCurl; uniform float curl, dt;
void main() {
  float L = texture(uCurl, vL).x, R = texture(uCurl, vR).x, T = texture(uCurl, vT).x, B = texture(uCurl, vB).x, C = texture(uCurl, vUv).x;
  vec2 f = .5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  f = f / (length(f) + .0001) * curl * C; f.y *= -1.;
  o = vec4(clamp(texture(uVelocity, vUv).xy + f * dt, -1000., 1000.), 0., 1.);
}`,
  pressure: `${head}uniform sampler2D uPressure, uDivergence;
void main() {
  float L = texture(uPressure, vL).x, R = texture(uPressure, vR).x, T = texture(uPressure, vT).x, B = texture(uPressure, vB).x;
  o = vec4((L + R + B + T - texture(uDivergence, vUv).x) * .25, 0., 0., 1.);
}`,
  gradient: `${head}uniform sampler2D uPressure, uVelocity;
void main() {
  float L = texture(uPressure, vL).x, R = texture(uPressure, vR).x, T = texture(uPressure, vT).x, B = texture(uPressure, vB).x;
  o = vec4(texture(uVelocity, vUv).xy - vec2(R - L, T - B), 0., 1.);
}`,
  clear: `${head}uniform sampler2D uTexture; uniform float value;
void main() { o = value * texture(uTexture, vUv); }`,
  // Crisp ink edges, like poured ink rather than smoke; white so the difference blend inverts.
  display: `${head}uniform sampler2D uDye;
void main() { float a = smoothstep(.2, .4, texture(uDye, vUv).r); o = vec4(vec3(a), a); }`,
};

type Fbo = { tex: WebGLTexture; fb: WebGLFramebuffer; w: number; h: number };
type DoubleFbo = { read: Fbo; write: Fbo; swap: () => void; w: number; h: number };

function start(canvas: HTMLCanvasElement) {
  const touch = window.matchMedia("(pointer: coarse)").matches;
  const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false });
  // Half-float targets are all the simulation needs. Many phone GPUs (iPhones among
  // them) only offer the half-float extension; requiring the full one left phones without ink.
  if (!gl || !(gl.getExtension("EXT_color_buffer_float") || gl.getExtension("EXT_color_buffer_half_float"))) return null;

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const vert = compile(gl.VERTEX_SHADER, VERT);
  const programs = Object.fromEntries(
    Object.entries(FRAG).map(([name, src]) => {
      const p = gl.createProgram()!;
      gl.attachShader(p, vert);
      gl.attachShader(p, compile(gl.FRAGMENT_SHADER, src));
      gl.bindAttribLocation(p, 0, "aPos");
      gl.linkProgram(p);
      const uniforms: Record<string, WebGLUniformLocation | null> = {};
      const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS) as number;
      for (let i = 0; i < n; i++) {
        const u = gl.getActiveUniform(p, i)!.name;
        uniforms[u] = gl.getUniformLocation(p, u);
      }
      return [name, { p, u: uniforms }];
    }),
  ) as Record<keyof typeof FRAG, { p: WebGLProgram; u: Record<string, WebGLUniformLocation | null> }>;
  if (Object.values(programs).some(({ p }) => !gl.getProgramParameter(p, gl.LINK_STATUS))) return null;

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);

  let renderable = true;
  const fbo = (w: number, h: number, internal: number, format: number): Fbo => {
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, gl.HALF_FLOAT, null);
    const fb = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) renderable = false;
    gl.viewport(0, 0, w, h);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return { tex, fb, w, h };
  };
  const double = (w: number, h: number, internal: number, format: number): DoubleFbo => {
    const d = { read: fbo(w, h, internal, format), write: fbo(w, h, internal, format), w, h, swap: () => {} };
    d.swap = () => ([d.read, d.write] = [d.write, d.read]);
    return d;
  };
  const size = (res: number) => {
    const aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
    const short = Math.round(res), long = Math.round(res * Math.max(aspect, 1 / aspect));
    return aspect > 1 ? [long, short] : [short, long];
  };

  let velocity: DoubleFbo, dye: DoubleFbo, pressure: DoubleFbo, divergence: Fbo, curl: Fbo;
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    const [sw, sh] = size(SIM_RES);
    const [dw, dh] = size(touch ? DYE_RES_TOUCH : DYE_RES);
    velocity = double(sw, sh, gl.RG16F, gl.RG);
    pressure = double(sw, sh, gl.R16F, gl.RED);
    divergence = fbo(sw, sh, gl.R16F, gl.RED);
    curl = fbo(sw, sh, gl.R16F, gl.RED);
    dye = double(dw, dh, gl.R16F, gl.RED);
  };
  resize();
  if (!renderable) return null;

  const run = (prog: { p: WebGLProgram; u: Record<string, WebGLUniformLocation | null> }, target: Fbo | null, set: (u: Record<string, WebGLUniformLocation | null>) => void, texel: [number, number]) => {
    gl.useProgram(prog.p);
    gl.uniform2f(prog.u.texel, ...texel);
    set(prog.u);
    if (target) {
      gl.disable(gl.BLEND);
      gl.viewport(0, 0, target.w, target.h);
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fb);
    } else {
      // The screen: start clean each frame and lay the ink over it.
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    }
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  };
  const bind = (unit: number, tex: WebGLTexture) => {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    return unit;
  };

  const radius = SPLAT_RADIUS * (touch ? TOUCH_RADIUS : 1);
  const splat = (x: number, y: number, dx: number, dy: number) => {
    const aspect = canvas.width / canvas.height;
    const simTexel: [number, number] = [1 / velocity.w, 1 / velocity.h];
    run(programs.splat, velocity.write, (u) => {
      gl.uniform1i(u.uTarget, bind(0, velocity.read.tex));
      gl.uniform1f(u.aspect, aspect);
      gl.uniform2f(u.point, x, y);
      gl.uniform3f(u.color, dx, dy, 0);
      gl.uniform1f(u.radius, radius * Math.max(aspect, 1));
    }, simTexel);
    velocity.swap();
    run(programs.splat, dye.write, (u) => {
      gl.uniform1i(u.uTarget, bind(0, dye.read.tex));
      gl.uniform1f(u.aspect, aspect);
      gl.uniform2f(u.point, x, y);
      gl.uniform3f(u.color, 0.9, 0, 0);
      gl.uniform1f(u.radius, radius * Math.max(aspect, 1));
    }, [1 / dye.w, 1 / dye.h]);
    dye.swap();
  };

  const step = (dt: number) => {
    const t: [number, number] = [1 / velocity.w, 1 / velocity.h];
    run(programs.curl, curl, (u) => gl.uniform1i(u.uVelocity, bind(0, velocity.read.tex)), t);
    run(programs.vorticity, velocity.write, (u) => {
      gl.uniform1i(u.uVelocity, bind(0, velocity.read.tex));
      gl.uniform1i(u.uCurl, bind(1, curl.tex));
      gl.uniform1f(u.curl, CURL);
      gl.uniform1f(u.dt, dt);
    }, t);
    velocity.swap();
    run(programs.divergence, divergence, (u) => gl.uniform1i(u.uVelocity, bind(0, velocity.read.tex)), t);
    run(programs.clear, pressure.write, (u) => {
      gl.uniform1i(u.uTexture, bind(0, pressure.read.tex));
      gl.uniform1f(u.value, 0.8);
    }, t);
    pressure.swap();
    for (let i = 0; i < PRESSURE_ITERATIONS; i++) {
      run(programs.pressure, pressure.write, (u) => {
        gl.uniform1i(u.uPressure, bind(0, pressure.read.tex));
        gl.uniform1i(u.uDivergence, bind(1, divergence.tex));
      }, t);
      pressure.swap();
    }
    run(programs.gradient, velocity.write, (u) => {
      gl.uniform1i(u.uPressure, bind(0, pressure.read.tex));
      gl.uniform1i(u.uVelocity, bind(1, velocity.read.tex));
    }, t);
    velocity.swap();
    run(programs.advect, velocity.write, (u) => {
      gl.uniform1i(u.uVelocity, bind(0, velocity.read.tex));
      gl.uniform1i(u.uSource, bind(0, velocity.read.tex));
      gl.uniform2f(u.simTexel, ...t);
      gl.uniform1f(u.dt, dt);
      gl.uniform1f(u.dissipation, VELOCITY_DISSIPATION);
    }, t);
    velocity.swap();
    run(programs.advect, dye.write, (u) => {
      gl.uniform1i(u.uVelocity, bind(0, velocity.read.tex));
      gl.uniform1i(u.uSource, bind(1, dye.read.tex));
      gl.uniform2f(u.simTexel, ...t);
      gl.uniform1f(u.dt, dt);
      gl.uniform1f(u.dissipation, INK_DISSIPATION);
    }, [1 / dye.w, 1 / dye.h]);
    dye.swap();
    run(programs.display, null, (u) => gl.uniform1i(u.uDye, bind(0, dye.read.tex)), [1 / canvas.width, 1 / canvas.height]);
  };

  return { step, splat, resize, lose: () => gl.getExtension("WEBGL_lose_context")?.loseContext() };
}

/** The ink layer: a fixed canvas over the page, drawn by the mouse or a finger; off under reduced motion. */
export function InkTrail() {
  const layer = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const active = !reduced;

  useEffect(() => {
    if (!active) return;
    const el = layer.current!;
    // A fresh canvas each run: a context lost in cleanup can't be used again, which
    // left the ink off whenever the effect ran twice (React's dev mode does).
    const canvas = document.createElement("canvas");
    canvas.className = "block h-full w-full";
    el.append(canvas);
    const fluid = start(canvas);
    if (!fluid) {
      canvas.remove();
      return;
    }
    let raf = 0, last = performance.now(), lastInput = 0, px = -1, py = -1;
    const pending: [number, number, number, number][] = [];

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      for (const s of pending.splice(0)) fluid.splat(...s);
      fluid.step(dt);
      raf = now - lastInput < IDLE_STOP_MS ? requestAnimationFrame(frame) : 0;
      // Once the ink is gone the layer leaves the screen, so an idle page scrolls
      // without blending a full-screen canvas every frame (it matters on phones).
      if (!raf) el.style.visibility = "hidden";
    };
    const draw = (clientX: number, clientY: number, fromTouch = false) => {
      const x = clientX / window.innerWidth, y = 1 - clientY / window.innerHeight;
      if (px >= 0) {
        const force = SPLAT_FORCE * (fromTouch ? TOUCH_FORCE : 1);
        const dx = (x - px) * force, dy = (y - py) * force;
        if (dx || dy) pending.push([x, y, dx, dy]);
      }
      px = x;
      py = y;
      lastInput = performance.now();
      if (!raf) {
        el.style.visibility = "";
        last = lastInput;
        raf = requestAnimationFrame(frame);
      }
    };
    const onMove = (e: PointerEvent) => e.pointerType === "mouse" && draw(e.clientX, e.clientY);
    const onLeave = () => { px = py = -1; };
    // Pointer events stop once the finger scrolls the page. iOS keeps sending touchmoves,
    // but Android's Chrome sends few or none; it does fire scroll every frame, and a
    // finger scrolling the page moves with it, so its position follows from the scroll.
    let touching = false, tx = 0, ty = 0, sx = 0, sy = 0;
    const onTouch = (e: TouchEvent) => {
      tx = e.touches[0].clientX;
      ty = e.touches[0].clientY;
      sx = window.scrollX;
      sy = window.scrollY;
      draw(tx, ty, true);
    };
    const onTouchStart = (e: TouchEvent) => {
      touching = true;
      onLeave();
      onTouch(e);
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length) return;
      touching = false;
      onLeave();
    };
    const onScroll = () => touching && draw(tx - (window.scrollX - sx), ty - (window.scrollY - sy), true);
    // Phones resize the window as their address bar slides in and out while scrolling;
    // only a real change (rotation, a new width) rebuilds the grids and drops the ink.
    let width = window.innerWidth, height = window.innerHeight;
    const onResize = () => {
      if (window.innerWidth === width && Math.abs(window.innerHeight - height) < 160) return;
      width = window.innerWidth;
      height = window.innerHeight;
      fluid.resize();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      fluid.lose();
      canvas.remove();
    };
  }, [active]);

  if (!active) return null;
  return (
    <div
      ref={layer}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[85] mix-blend-difference"
      style={{ visibility: "hidden" }}
    />
  );
}
