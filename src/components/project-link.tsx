"use client";

import Link from "next/link";
import { ViewTransition } from "react";

import { useTransitionNavigate } from "@/components/transition/page-transition";

/**
 * C40: wraps a project image so it morphs into the Case Study cover with the
 * same name. One name per project, so only one instance may be on screen.
 */
export function ProjectMorph({ slug, children }: { slug: string; children: React.ReactNode }) {
  return (
    <ViewTransition name={`project-${slug}`} share="morph" default="none">
      {children}
    </ViewTransition>
  );
}

type Props = Omit<React.ComponentProps<typeof Link>, "href"> & { slug: string };

/** Opens a Case Study with one of the random page transitions, like every other link. */
export function ProjectLink({ slug, ...props }: Props) {
  const navigate = useTransitionNavigate();
  const href = `/work/${slug}`;
  return (
    <Link
      href={href}
      // Fetch the whole Case Study ahead of the click (production only), so it opens at once.
      prefetch
      onNavigate={(event) => {
        if (!navigate) return;
        event.preventDefault();
        navigate(href);
      }}
      {...props}
    />
  );
}
