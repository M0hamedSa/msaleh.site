"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { ProjectLink, ProjectMorph } from "@/components/project-link";
import { ProjectVisual } from "@/components/project-visual";
import { featuredCount, type FeaturedProject } from "@/content/projects";
import { createBlockReveal } from "@/lib/block-reveal";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { onPageShown } from "@/lib/intro";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * The end of a Case Study: the next project, opened by a click. When it comes
 * into view it plays once, on a clock rather than the scroll: the name
 * block-reveals (C16) and the image wipes up. Hover shows the image in full
 * colour; opening it morphs the image into the next cover (C40).
 */
export function NextCaseStudy({ project, number }: { project: FeaturedProject; number: string }) {
  const root = useRef<HTMLElement>(null);
  const router = useRouter();
  const reduced = useReducedMotion();
  const href = `/work/${project.slug}`;

  // Fetch the next page ahead of time (production only), so opening it is instant.
  useEffect(() => router.prefetch(href), [router, href]);

  useGSAP(
    () => {
      if (reduced) return;
      const q = gsap.utils.selector(root);
      const reveal = createBlockReveal(q("[data-name]")[0] as HTMLElement);
      gsap.set(q("[data-fade]"), { autoAlpha: 0, y: 16 });
      gsap.set(q("[data-image]"), { clipPath: "inset(100% 0 0 0)" });

      let cancel = () => {};
      const play = () => {
        cancel = onPageShown(() => {
          reveal.play();
          gsap.to(q("[data-fade]"), { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08 });
          gsap.to(q("[data-image]"), { clipPath: "inset(0% 0 0 0)", duration: 1.2, ease: "expo.out", delay: 0.2 });
        });
      };
      const trigger = ScrollTrigger.create({ trigger: root.current, start: "top 75%", once: true, onEnter: play });
      // Already past it (a restored position): show it now.
      if (window.scrollY > trigger.start) play();
      return () => {
        cancel();
        reveal.revert();
      };
    },
    { scope: root, dependencies: [reduced, href] },
  );

  return (
    <section ref={root} aria-label={`Next project: ${project.name}`} className="border-t border-fg pt-3">
      <ProjectLink slug={project.slug} data-cursor="Open" className="group grid gap-8">
        <span data-fade className="label-mono flex justify-between text-mute">
          <span>Next project</span>
          <span>
            {number} / {featuredCount}
          </span>
        </span>
        <span className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <span
            data-name
            className="font-display text-[clamp(2.75rem,8vw,8rem)] leading-[0.9] tracking-[-0.045em] transition-colors duration-300 group-hover:text-accent"
          >
            {project.name}
          </span>
          <span data-fade className="max-w-[36ch] text-[clamp(16px,1.4vw,19px)]">
            {project.summary}
          </span>
        </span>
        <span data-image className="block overflow-hidden rounded-sm">
          <ProjectMorph slug={project.slug}>
            <ProjectVisual
              project={project}
              tone="hover"
              className="aspect-[16/9] w-full transition-transform duration-700 ease-out-expo group-hover:scale-[1.02]"
            />
          </ProjectMorph>
        </span>
      </ProjectLink>
    </section>
  );
}
