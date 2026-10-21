/**
 * The MS mark: the initials and a red status square that blinks like a block
 * cursor (L3 shape, L2 motion). Sized by the parent's font-size; the square
 * holds steady under reduced motion.
 */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline font-display leading-none tracking-[-0.02em] ${className}`}>
      MS
      <i aria-hidden="true" className="logo-cursor ml-[0.06em] inline-block size-[0.2em] bg-accent" />
    </span>
  );
}
