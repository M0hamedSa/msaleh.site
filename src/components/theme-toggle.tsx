"use client";

import { ThemeIcon } from "@/components/header-icons";
import { THEME_KEY } from "@/lib/init-script";
import { useReducedMotion } from "@/lib/use-reduced-motion";

function currentTheme(): "light" | "dark" {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** E12: switches theme; the new one grows out of the button as a circle. A sun or a moon icon. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();

  function toggle(event: React.MouseEvent<HTMLButtonElement>) {
    const next = currentTheme() === "dark" ? "light" : "dark";
    const apply = () => {
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        // Private mode: the choice lasts for this page only.
      }
    };

    if (reduced || !document.startViewTransition) {
      apply();
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    const root = document.documentElement;
    root.dataset.themeSwitching = "";
    const transition = document.startViewTransition(apply);
    transition.finished.finally(() => delete root.dataset.themeSwitching);
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 800, easing: "cubic-bezier(0.7, 0, 0.3, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`grid size-10 place-items-center rounded-full border border-line bg-bg transition-colors hover:border-fg ${className}`}
    >
      <ThemeIcon />
      <span className="sr-only">
        Switch to <span className="theme-when-light">dark</span>
        <span className="theme-when-dark">light</span> theme
      </span>
    </button>
  );
}
