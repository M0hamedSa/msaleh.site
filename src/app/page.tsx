import { BootPreloader } from "@/components/home/boot-preloader";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { Hero } from "@/components/home/hero";
import { StackMarquee } from "@/components/home/stack-marquee";
import { Magnetic } from "@/components/magnetic";
import { TransitionLink } from "@/components/transition/transition-link";

export default function Home() {
  return (
    <>
      <BootPreloader />
      <main>
        <div className="gutter">
          <Hero />
        </div>
        <StackMarquee />

        <FeaturedProjects />

        {/* Stage 7 builds the About teaser; until then, the way to the full list. */}
        <section className="gutter flex flex-wrap items-center gap-x-10 gap-y-6 py-24">
          <Magnetic>
            <TransitionLink href="/work" data-cursor="Open" className="btn-fill">
              <span data-magnetic-inner>See all work</span>
            </TransitionLink>
          </Magnetic>
          <TransitionLink href="/archive" className="link-line">
            Archive <span className="arrow">↗</span>
          </TransitionLink>
        </section>
      </main>
    </>
  );
}
