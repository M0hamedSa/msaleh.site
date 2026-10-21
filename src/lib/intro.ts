// The moment the page is ready for its entrance animations: when the boot
// preloader starts lifting, or right away when it is skipped. Lasts for the
// whole visit, so soft navigations back to a page play their intros at once.
let ready = false;
const waiting = new Set<() => void>();

export function markIntroReady() {
  if (ready) return;
  ready = true;
  waiting.forEach((run) => run());
  waiting.clear();
}

/** Runs `run` once the intro is ready (immediately if it already is). Returns a cancel function. */
export function onIntroReady(run: () => void) {
  if (ready) {
    run();
    return () => {};
  }
  waiting.add(run);
  return () => {
    waiting.delete(run);
  };
}
