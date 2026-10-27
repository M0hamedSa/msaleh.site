"use client";

import { usePathname } from "next/navigation";

/** The address that wasn't found, written as the request a terminal would show. */
export function MissingPath() {
  const path = usePathname();
  return (
    <p className="label-mono text-mute normal-case">
      GET <span className="text-fg">{path}</span> <span aria-hidden="true">→</span> <span className="text-accent-ink">404</span> Not found
    </p>
  );
}
