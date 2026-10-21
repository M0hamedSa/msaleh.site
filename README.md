# mohamedsa.xyz

Portfolio of Mohamed Saleh, systems developer in Giza. It shows four systems running in real businesses, each with a Case Study, plus an Archive of earlier work.

Every screen on the site was captured from the real app running against invented demo data.

## Stack

- Next.js 16 (App Router, Cache Components), React 19, TypeScript
- Tailwind CSS v4
- GSAP (ScrollTrigger, SplitText, Flip) with Lenis smooth scrolling
- Three.js for the Archive's CRT, loaded only on that page

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Where things live

- `src/content/`: all copy and project data (projects, case studies, archive, about)
- `src/components/`: UI, grouped by page
- `public/projects/<slug>/`: the captured screens
- `docs/build-spec.md`: the design and build spec the site follows
