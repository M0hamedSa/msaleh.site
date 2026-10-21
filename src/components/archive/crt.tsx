"use client";

import { useEffect, useRef } from "react";

import { drawScreen, readScreenColors, SCREEN } from "@/components/archive/screen";
import type { ArchiveProject } from "@/content/archive";
import { gsap } from "@/lib/gsap";

const SCREEN_FRAGMENT = `
uniform sampler2D map; uniform float time; uniform float noise; varying vec2 vUv;
float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233)) + time * 43.0) * 43758.5453); }
void main(){
  // Barrel curve: the picture bows like real CRT glass.
  vec2 c = vUv - .5; float r2 = dot(c, c);
  vec2 uv = .5 + c * (1. + .12 * r2);
  if (uv.x < 0. || uv.x > 1. || uv.y < 0. || uv.y > 1.) { gl_FragColor = vec4(0., 0., 0., 1.); return; }
  vec3 col = texture2D(map, uv).rgb;
  float scan = .82 + .18 * sin(uv.y * 480. * 3.14159);
  float flicker = .97 + .03 * sin(time * 60.);
  col *= scan * flicker;
  col = mix(col, vec3(hash(uv * 400.)), noise);
  col *= 1. - r2 * 1.6; // vignette
  gl_FragColor = vec4(col, 1.);
}`;

const SCREEN_VERTEX = "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }";

/**
 * C4, the Signature Moment: a vintage CRT in 3D that plays the hovered Archive
 * project on its screen, with a burst of static on every switch. It leans
 * toward the pointer. Three.js is loaded here only, on demand.
 */
export function Crt({ project, onReady }: { project: ArchiveProject; onReady: () => void }) {
  const host = useRef<HTMLDivElement>(null);
  const current = useRef(project);
  const switched = useRef<() => void>(() => {});

  useEffect(() => {
    current.current = project;
    switched.current();
  }, [project]);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      const { RoundedBoxGeometry } = await import("three/addons/geometries/RoundedBoxGeometry.js");
      if (disposed) return;
      const el = host.current!;
      const css = getComputedStyle(el);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      el.appendChild(renderer.domElement);
      renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%";

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
      camera.position.set(0, 0.1, 5.4);

      scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.6));
      const key = new THREE.DirectionalLight(0xffffff, 2.2);
      key.position.set(-2.5, 3, 4);
      scene.add(key);

      // The set: a rounded body, a deeper back, a dark bezel, two knobs and the glass.
      const set = new THREE.Group();
      const shell = new THREE.MeshStandardMaterial({ color: css.getPropertyValue("--card").trim() || "#e2dfd7", roughness: 0.55 });
      const dark = new THREE.MeshStandardMaterial({ color: "#111110", roughness: 0.7 });
      const body = new THREE.Mesh(new RoundedBoxGeometry(2.1, 1.75, 1.4, 6, 0.14), shell);
      const back = new THREE.Mesh(new RoundedBoxGeometry(1.5, 1.25, 1.2, 6, 0.2), shell);
      back.position.z = -0.95;
      const bezel = new THREE.Mesh(new RoundedBoxGeometry(1.62, 1.26, 0.1, 4, 0.06), dark);
      bezel.position.set(-0.14, 0.04, 0.68);
      set.add(body, back, bezel);
      [0.25, -0.1].forEach((y) => {
        const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.08, 24), dark);
        knob.rotation.x = Math.PI / 2;
        knob.position.set(0.86, y, 0.72);
        set.add(knob);
      });

      const canvas = document.createElement("canvas");
      canvas.width = SCREEN.width;
      canvas.height = SCREEN.height;
      const ctx = canvas.getContext("2d")!;
      const texture = new THREE.CanvasTexture(canvas);
      // Passed through as drawn: the screen shader writes these values straight out,
      // so decoding them to linear here would only darken the picture.
      texture.colorSpace = THREE.NoColorSpace;
      const uniforms = { map: { value: texture }, time: { value: 0 }, noise: { value: 0 } };
      const glassGeometry = new THREE.PlaneGeometry(1.48, 1.11, 24, 24);
      // Bow the glass outwards a little.
      const pos = glassGeometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i) / 0.74;
        const y = pos.getY(i) / 0.555;
        pos.setZ(i, 0.05 * (1 - (x * x + y * y) / 2));
      }
      const glass = new THREE.Mesh(
        glassGeometry,
        new THREE.ShaderMaterial({ uniforms, vertexShader: SCREEN_VERTEX, fragmentShader: SCREEN_FRAGMENT }),
      );
      glass.position.set(-0.14, 0.04, 0.735);
      set.add(glass);
      scene.add(set);

      // The casing follows the theme, live.
      const recolor = () => shell.color.set(getComputedStyle(el).getPropertyValue("--card").trim() || "#e2dfd7");
      const themeWatch = new MutationObserver(recolor);
      themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
      const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
      darkQuery.addEventListener("change", recolor);

      const colors = readScreenColors();
      let shownAt = performance.now();
      switched.current = () => {
        shownAt = performance.now();
        gsap.fromTo(uniforms.noise, { value: 0.85 }, { value: 0, duration: 0.45, ease: "power2.out" });
      };

      const resize = () => {
        const { clientWidth: w, clientHeight: h } = el;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(el);

      // Lean toward the pointer anywhere on the page.
      const lean = { x: 0, y: 0 };
      const onMove = (e: PointerEvent) => {
        gsap.to(lean, {
          x: (e.clientX / window.innerWidth - 0.5) * 0.5,
          y: (e.clientY / window.innerHeight - 0.5) * 0.25,
          duration: 1,
          ease: "power3.out",
          overwrite: true,
        });
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      let visible = true;
      const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
      io.observe(el);
      const tick = (time: number) => {
        if (!visible || document.hidden) return;
        drawScreen(ctx, current.current, (performance.now() - shownAt) / 1000, colors);
        texture.needsUpdate = true;
        uniforms.time.value = time;
        set.rotation.y = -0.35 + lean.x;
        set.rotation.x = 0.06 + lean.y;
        set.position.y = Math.sin(time * 0.8) * 0.03;
        renderer.render(scene, camera);
      };
      gsap.ticker.add(tick);
      onReady();

      cleanup = () => {
        gsap.ticker.remove(tick);
        themeWatch.disconnect();
        darkQuery.removeEventListener("change", recolor);
        io.disconnect();
        ro.disconnect();
        window.removeEventListener("pointermove", onMove);
        scene.traverse((o) => {
          if (o instanceof THREE.Mesh) {
            o.geometry.dispose();
            (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
          }
        });
        texture.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [onReady]);

  return <div ref={host} className="absolute inset-0" aria-hidden="true" />;
}
