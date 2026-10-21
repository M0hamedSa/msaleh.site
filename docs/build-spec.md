# Build spec: mohamedsa.xyz

Status: **draft for confirmation** (2026-10-21). Vocabulary follows `CONTEXT.md`.
Effect codes (E01, C16, …) refer to cards in the Motion Library:
https://claude.ai/artifact/GxGEV68JmyVPg2WBtdx9vr

## 1. Positioning

- **Who:** Mohamed Saleh, systems developer, Giza.
- **Line:** "I build the systems businesses run on."
- **Audience:** hiring managers and recruiters first, then prospective clients. A recruiter must find the work and the contact details within 10 seconds, with or without animation.
- **Style:** an Editorial base (Swiss grid, large type, quiet layout) with terminal accents only where they were picked: the boot log, the ASCII mark and footer, the CRT, mono labels and route labels.

## 2. Stack

| Concern | Choice |
|---|---|
| Framework | Next.js (App Router, TypeScript), deployed on Vercel at mohamedsa.xyz |
| Styling | Tailwind CSS v4 with CSS custom-property tokens |
| Animation | GSAP 3.15 (ScrollTrigger, SplitText, Flip, ScrambleText) via `@gsap/react` `useGSAP` |
| Scroll | Lenis, driven by the GSAP ticker |
| Signature Moment | Three.js, lazy-loaded only where the CRT appears |
| Shaders | Raw WebGL for C30 (fluted glass), dark theme only |
| Routing transitions | View Transitions API for C40 (React `<ViewTransition>`; Case Study routes set `instant = false` so the cover renders in the same commit and the morph pairs); a custom overlay layer for E11 |
| Content | Typed TS/MDX files in the repo (no CMS) |

## 3. Design tokens

**Light theme (P01):** bone `#ECEAE4` · ink `#111110` · card `#E2DFD7` · mute `#6B675F` · line `#CFCBC1` · accent **signal red `#E01E1E`**
**Dark theme (P03):** graphite `#121417` · panel `#1C2025` · readout `#E4E7EA` · dim `#7A828C` · line `#2A2F36` · accent **signal red `#FF3B30`** (brighter, for contrast on graphite)

The accent was orange/amber in the Motion Library picks; changed to red in both themes on 2026-10-21.

- The accent is for signals only: one word in the hero, active states, the burn edges and the CRT glow. Never body text.
- The theme follows the OS on first visit. The E12 circle reveal switches it, and the choice is remembered.

**Type:** Clash Display 600 (display) · General Sans 400/500 (body) · Geist Mono 400/500 (labels, routes, terminal accents). Fonts are self-hosted with `next/font/local`.

## 4. Global systems (every page)

| System | Effects | Notes |
|---|---|---|
| Smooth scroll | Lenis | Off under reduced motion |
| Header | Logo (MS + red status square that blinks like a block cursor; chosen in the MS Logo Lab: L3 shape, L2 motion), mono meta row, live Cairo time, theme toggle (E12), Menu | Hides while scrolling down; comes back with a solid background on the way up |
| Menu | **E05** clip-path overlay + **C23** each link builds letter by letter | Escape closes; focus is trapped and restored |
| Cursor | **E06c** labelled cursor ("View", "Open", "Drag") | Fine pointer only. The red disc appears only over `data-cursor` zones; the normal pointer stays everywhere else |
| Buttons and links | **E06b** fill and underline hovers; **E06** magnetic on main calls to action | Magnetic on desktop only |
| Headings | **C16** block reveal, once, on entering the screen | |
| Route change | One of five at random, never the same twice running: **E11** ink columns, **C43** four panels, **C41** block grid, **C42** curved wave, and the red curtain with the page name | The mono route label scrambles in, except on the curtain |
| Opening a Case Study | The same random transition as every other link | C40 (card morph) was replaced on 2026-10-21 |
| Footer | **F1** page lifts away → **C6** ASCII "LET'S TALK" scatters from the cursor → **E13** contact block (question, magnetic "Write to me", copy-email with a scramble confirmation) | C30 fluted glass behind it in dark theme only. The footer is dark in both themes, sits under every page, and the menu's Contact glides down to it. LinkedIn and the Playground link join it once they exist |

## 5. Pages

### `/` Home
1. **E01 boot preloader.** It logs postgres, powersync, odoo bridge, barcode scanner and telegram agent, counts to 100, and the columns lift. First visit per session only.
2. **Hero (E02 statement).** Meta row (name, role, Giza coordinates, live time) · "I build the **systems** businesses run on." with C16 reveal · **C5 reactive ASCII logo mark** on the right · status line "Open to select projects".
3. **E07 velocity marquee** of the stack.
4. **Featured Projects (C10).** One pinned scene: five titles on the left, and the image swaps on the right. Clicking a title triggers C40 into the Case Study.
5. **About teaser.** Two lines and a link to `/about`.
6. Footer.

### `/work` Work index
- **A1** typographic list of the five Featured Projects (number, name, sector, year). The project image follows the cursor and tilts with its speed. On touch screens, each row shows a small thumbnail instead.
- A link to the Archive.

### `/work/[slug]` Case Study (×5)
1. **Header:** name, one-line summary, sector, role, year, stack, cover image (the C40 landing point).
2. **The problem:** the business situation before the system existed.
3. **Constraints:** for example, offline factory floors, Arabic/English, a legacy SQL Server.
4. *(Removed 2026-10-21.)* The C1 architecture diagram, then a build-log strip, were tried here and dropped: a drawn diagram couldn't be kept accurate.
5. **Under the Hood (C26):** a flashlight reveals the real stack and config. On touch, it's a plain visible block.
6. **Three key decisions:** each with its trade-off, taken from the repo's ADRs and `CONTEXT.md`.
7. **Outcome:** numbers or qualitative results, plus screens.
8. **Next project:** the next Case Study as a large link at the end of the page. It plays once on entering view (C16 name reveal, image wipe) and opens by click with the C40 morph. Replaced C15 on 2026-10-21: scroll-driven opening proved unreliable (pinning felt stuck, the hand-off popped).

Featured Projects: True Visor · Aqsat · True Legal · Kidzenia. KTC Scanner Hub is paused (2026-10-21) until its Case Study is written; its data waits in `PAUSED_PROJECTS`.

### `/archive` Archive
- A filterable list (Production · Client · Tool · Early work) of every other Project: KTC Scanner Hub (while paused from Featured Projects), Odoo implementation, SQL troubleshooting agent, QR complaint system, Wanloo Sales Order, Tiba Masr, WakeUp, Help Desk / IT Ticketing, Tick Hub, MovieApi. Lines come from each repo's README or the CV; live demos are linked where they exist.
- **Signature Moment, C4:** hovering an Archive row plays that project inside a 3D vintage CRT (Three.js, lazy-loaded). On touch screens and under reduced motion, a static framed screenshot replaces it.

### `/about` About
- **E03b** word-scrub paragraph (the only place it's used).
- **E09** pinned horizontal track record: 2016 CS degree → 2023 Semi-Code → 2024 Kazareen ERP & Odoo → −40% SQL agent → −60% QR system → 2026 independent.
- A short "How I work" block (discover → map → build → train). Static text, no extra effect.
- CV download.

### `/playground` Playground
- **C12** draggable desktop-style interface with windows for projects, the README and the schema. Linked from the footer only.

## 6. Images

- **Sources:** Playwright captures from live deploys and local seed-data runs, plus your own files (apps that need Docker or private data, and factory-floor photos). **Demo data only. No client company names unless approved.**
- **Treatment (C, picked over dithering):** real screens are muted toward the page by default (colour pulled to a quarter, a tint of the page over it, dimmed in the dark theme), then full colour on hover and inside the Case Study. Touch thumbnails on /work are full colour, since there is no hover. Placeholder drawings still dither.
- Every Case Study gets a cover and 3–6 screens (a "Screens" gallery after the Outcome, marked as demo data), and, if possible, one short recording. The architecture diagram was dropped.
- **Captured (Stage 10):** each app ran locally against its own separate demo database. The developers' databases were never written to, and True Legal's production copy was never read. Screens live in `public/projects/<slug>/` at 2880×1800 (phones 1170×2532) and are listed in `src/content/projects.ts`, first one the cover. Each has a crop `focus`: left for English screens, right for Arabic.

## 7. Motion rules

- **`prefers-reduced-motion`:** no Lenis, no preloader, no pinning or scrubbing. Text is shown immediately and the CRT is static. It's a complete Reduced Motion Experience, not a broken page.
- **Touch:** no custom cursor, no magnetic buttons, no flashlight, no CRT and no ASCII scatter. Everything else runs.
- **One WebGL context at a time.** Three.js loads only on `/archive`, and C30 only in dark theme on the footer.
- **Budgets:** Lighthouse Performance ≥ 90 on mobile for `/` and a Case Study · LCP < 2.5 s · JS for the home route < 200 KB gzip, excluding fonts.

## 8. Build stages (each reviewed in the browser before moving on)

1. Scaffold: Next.js, tokens, fonts, Lenis + GSAP setup, theme toggle (E12), header, Reduced Motion Experience switch
2. E01 preloader → hero (E02, C16, C5) → E07 marquee
3. Menu (E05 + C23), cursor and buttons (E06 set), E11 route transition
4. Featured Projects (C10) → `/work` (A1) → C40 transition
5. Case Study template (C26, C15) with True Visor as the first full Case Study
6. Footer (F1 + C6 + E13 + C30 dark)
7. `/about` (E03b, E09)
8. `/archive` + CRT Signature Moment (C4)
9. `/playground` (C12)
10. Screenshot capture and treatment, then the remaining four Case Studies
11. Accessibility and performance pass, then deploy to mohamedsa.xyz and archive the old portfolio repos

## 9. Open items (not blocking)

- **Outcome numbers** for the five Featured Projects. If none are provided, the Case Study shows a qualitative outcome.
- **LinkedIn URL.**
- **Updated CV** (the current one predates the 2026 projects). Planned for after v1.
- **Client names:** permission per Featured Project. The default is product names only.
