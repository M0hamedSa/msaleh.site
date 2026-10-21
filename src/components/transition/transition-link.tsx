"use client";

import Link from "next/link";

import { useTransitionNavigate } from "@/components/transition/page-transition";

type Props = Omit<React.ComponentProps<typeof Link>, "href"> & { href: string };

/** A Link that plays the E11 route transition. New-tab clicks and external URLs behave as normal links. */
export function TransitionLink({ href, onNavigate, ...props }: Props) {
  const navigate = useTransitionNavigate();
  return (
    <Link
      href={href}
      onNavigate={(event) => {
        onNavigate?.(event);
        if (!navigate || href.includes("#")) return;
        event.preventDefault();
        navigate(href);
      }}
      {...props}
    />
  );
}
