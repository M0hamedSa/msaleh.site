// Line icons for the header's three buttons, one stroke weight to match the thin rules.
// Their motion lives in globals.css (.ic-*): it keys off the theme and aria-expanded, so it
// works before hydration and stays still under reduced motion.

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** A speech bubble with three typing dots: someone already writing. Loops. */
export function TypingIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="ic-typing size-5 overflow-visible" {...STROKE}>
      <path d="M4 5.5h16v10H10l-4.5 3.5V15.5H4z" />
      <circle cx="8.5" cy="10.5" r=".9" fill="currentColor" />
      <circle cx="12" cy="10.5" r=".9" fill="currentColor" />
      <circle cx="15.5" cy="10.5" r=".9" fill="currentColor" />
    </svg>
  );
}

/** The sun in the light theme; its rays fold away into a crescent in the dark one. */
export function ThemeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="ic-theme size-5 overflow-visible" {...STROKE}>
      <g data-sun>
        <circle cx="12" cy="12" r="4.5" />
        <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
      </g>
      <path data-moon d="M19.5 14.2A7.8 7.8 0 1 1 9.8 4.5a6.2 6.2 0 0 0 9.7 9.7z" />
    </svg>
  );
}

/** Four dots that turn a quarter when the menu opens. */
export function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="ic-menu size-5 overflow-visible" fill="currentColor">
      <circle cx="8" cy="8" r="1.7" />
      <circle cx="16" cy="8" r="1.7" />
      <circle cx="8" cy="16" r="1.7" />
      <circle cx="16" cy="16" r="1.7" />
    </svg>
  );
}

/** A cross that closes the menu, in the same place and stroke as the Menu icon. */
export function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="ic-close size-5 overflow-visible" {...STROKE}>
      <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
    </svg>
  );
}
