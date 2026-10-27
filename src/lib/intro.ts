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

// While a page transition covers the screen, entrance animations wait for it to
// lift, so they play where the Visitor can see them rather than under the cover.
let covered = false;
const afterCover = new Set<() => void>();

/** Called by the page transition: true as the cover comes down, false as it starts to lift. */
export function setPageCovered(value: boolean) {
  covered = value;
  if (value) return;
  afterCover.forEach((run) => run());
  afterCover.clear();
}

/** Runs `run` once the page is on screen (immediately if no transition is covering it). Returns a cancel function. */
export function onPageShown(run: () => void) {
  if (!covered) {
    run();
    return () => {};
  }
  afterCover.add(run);
  return () => {
    afterCover.delete(run);
  };
}
