import { gsap, SplitText } from "@/lib/gsap";

/**
 * C16: an accent bar wipes across each line, the line appears under it, then
 * the bar wipes off. Lines re-split on resize; a reveal already played stays
 * played, one in progress keeps its place.
 */
export function createBlockReveal(target: HTMLElement, { stagger = 0.12, duration = 0.5 } = {}) {
  let played = false;
  let done = false;
  let tl: gsap.core.Timeline | null = null;

  const split = SplitText.create(target, {
    type: "lines",
    linesClass: "block-line",
    autoSplit: true,
    onSplit(self) {
      tl = gsap.timeline({ paused: true, onComplete: () => void (done = true) });
      self.lines.forEach((line, i) => {
        const text = document.createElement("span");
        text.className = "block-text";
        text.append(...line.childNodes);
        const bar = document.createElement("span");
        bar.className = "block-bar";
        line.append(text, bar);
        if (done) return;

        const at = i * stagger;
        gsap.set(text, { autoAlpha: 0 });
        tl!
          .fromTo(bar, { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, duration, ease: "expo.inOut" }, at)
          .set(text, { autoAlpha: 1 }, at + duration)
          .set(bar, { transformOrigin: "right" }, at + duration)
          .to(bar, { scaleX: 0, duration, ease: "expo.inOut" }, at + duration);
      });
      if (done) return;
      if (played) tl.play();
      // Returned so SplitText carries the current progress over to the new lines.
      return tl;
    },
  });

  return {
    play() {
      played = true;
      return tl?.play();
    },
    revert() {
      tl?.kill();
      split.revert();
    },
  };
}
