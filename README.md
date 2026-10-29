# [msaleh.site](https://www.msaleh.site)

Portfolio of Mohamed Saleh, full-stack developer in Giza. It shows five client projects, four of them with a full Case Study so far, plus an Archive of earlier work.

Live at **https://www.msaleh.site**.

The app screens were captured from the real apps running against invented demo data; Tiba Masr's are its public website.

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
