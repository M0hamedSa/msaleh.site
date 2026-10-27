import { AboutTeaser } from "@/components/home/about-teaser";
import { BootPreloader } from "@/components/home/boot-preloader";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { Hero } from "@/components/home/hero";
import { StackMarquee } from "@/components/home/stack-marquee";

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

        <AboutTeaser />
      </main>
    </>
  );
}
