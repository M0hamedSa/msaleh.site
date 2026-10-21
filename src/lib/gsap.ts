import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

// Register once, client side only. Import gsap and plugins from here, never from "gsap" directly.
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, Flip, ScrambleTextPlugin);
}

export { gsap, Flip, ScrambleTextPlugin, ScrollTrigger, SplitText, useGSAP };
