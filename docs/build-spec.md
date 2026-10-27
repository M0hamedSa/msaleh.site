# Build spec: msaleh.site

Status: **draft for confirmation** (2026-10-21). Vocabulary follows `CONTEXT.md`.
Effect codes (E01, C16, …) refer to cards in the Motion Library:
https://claude.ai/artifact/GxGEV68JmyVPg2WBtdx9vr

## 1. Positioning

- **Who:** Mohamed Saleh, systems developer, Giza.
- **Line:** "Business runs on systems. I build them." (chosen 2026-10-27 over "I build the systems businesses run on.")
- **Audience:** hiring managers and recruiters first, then prospective clients. A recruiter must find the work and the contact details within 10 seconds, with or without animation.
- **Style:** an Editorial base (Swiss grid, large type, quiet layout) with terminal accents only where they were picked: the boot log, the ASCII mark and footer, the CRT, mono labels and route labels.

## 2. Stack

| Concern | Choice |
|---|---|
| Framework | Next.js (App Router, TypeScript), deployed on Vercel at www.msaleh.site (mohamedsa.xyz retired 2026-10-27) |
| Styling | Tailwind CSS v4 with CSS custom-property tokens |
| Animation | GSAP 3.15 (ScrollTrigger, SplitText, Flip, ScrambleText) via `@gsap/react` `useGSAP` |
| Scroll | Lenis, driven by the GSAP ticker |
| Signature Moment | Three.js, lazy-loaded only where the CRT appears |
| Routing transitions | View Transitions API for C40 (React `<ViewTransition>`; Case Study routes set `instant = false` so the cover renders in the same commit and the morph pairs); a custom overlay layer for E11 |
| Content | Typed TS/MDX files in the repo (no CMS) |

## 3. Design tokens

**Light theme (P01):** bone `#ECEAE4` · ink `#111110` · card `#E2DFD7` · mute `#625E56` · line `#CFCBC1` · accent **signal red `#E01E1E`** · small red text `#BC1919` · live `#1F8A4C`
**Dark theme (warm graphite, the night version of bone):** `#141311` · card `#1E1C19` · text `#EBE8E1` · mute `#8C877D` · line `#2C2A26` · accent **`#FF4B3A`** · live `#3DDC84`
**Always-dark surfaces** (footer, preloader, Under the Hood): `--loader-bg` / `--loader-fg`, with red text in `--loader-accent #FF4B3A`.

The accent was orange/amber in the Motion Library picks; changed to red in both themes on 2026-10-21. On 2026-10-27, after the Impeccable critique (snapshot in `.impeccable/critique/`), the dark theme moved from cold blue graphite (`#121417`, iOS red `#FF3B30`) to warm graphite so both themes are one material, and small text, labels on cards and the live dot were brought to WCAG AA.

- Red is a signal, kept to a few places: "I build them." in the hero, the logo square, the marquee slashes, the "Write to me" disc, active and hover states, focus and selection. Small red text uses `--accent-ink`. Never body text.
- Status: live work and the hero's "Now building for new clients" get a steady `--live` dot; work not live yet (pilot, launching) gets a hollow grey ring, never red, so it never reads as broken. Project numbers are grey.
- The theme follows the OS on first visit. The E12 circle reveal switches it, and the choice is remembered.

**Type:** Clash Display 600 (display) · General Sans 400/500 (body) · Geist Mono 400/500 (labels, routes, terminal accents). Fonts are self-hosted with `next/font/local`.

## 4. Global systems (every page)

| System | Effects | Notes |
|---|---|---|
| Smooth scroll | Lenis | Off under reduced motion |
| Header | Logo (MS + red status square that blinks like a block cursor; chosen in the MS Logo Lab: L3 shape, L2 motion), mono meta row ("Systems developer · Giza"), then three round icon buttons (Header Icon Picks, 2026-10-27; `header-icons.tsx`): theme (E12; a sun that folds into a moon), **Write to me** (red; a speech bubble whose typing dots loop, paused while the menu is open; glides down to the contact block) and Menu (four dots that turn a quarter while open). Screen readers hear "Switch to dark theme", "Write to me" and "Menu" | Hides while scrolling down; comes back with a solid background on the way up. The clock lives only in the hero (removed from the header, menu and footer on 2026-10-27) |
| Menu | **E05** clip-path overlay + **C23** each link builds letter by letter | Escape closes; focus is trapped and restored |
| Cursor | **E06c** labelled cursor ("View", "Open", "Drag") + **C27** liquid ink trail (added 2026-10-27, after Codegrid's "Most Satisfying Cursor Trail on the Web", from Cappen) | Fine pointer only, off under reduced motion. The ink is a GPU fluid simulation (`ink-trail.tsx`) drawn in difference blend, so it inverts what it flows over in both themes (red turns cyan inside it, as inversion does) and fades in about a second; it stops drawing when the pointer rests. The red disc appears only over `data-cursor` zones, above the ink; the normal pointer stays everywhere else |
| Buttons and links | **E06b** fill and underline hovers; **E06** magnetic on main calls to action | Magnetic on desktop only |
| Headings | **C16** block reveal, once, on entering the screen | |
| Route change | One of five at random, never the same twice running: **E11** ink columns, **C43** four panels, **C41** block grid, **C42** curved wave, and the red curtain with the page name | The mono route label scrambles in, except on the curtain |
| Opening a Case Study | The same random transition as every other link | C40 (card morph) was replaced on 2026-10-21 |
| Footer | **F1** page lifts away → **C6** ASCII "LET'S TALK" scatters from the cursor (half height since 2026-10-27, one line on desktop) → three steps, "01 You write · 02 We talk · 03 I send a plan" (`NEXT_STEPS` in `content/contact.ts`; phones show the step names only) → **E13** contact block (question, magnetic "Write to me", copy-email with a scramble confirmation) | The footer is dark and the same in both themes (C30 fluted glass was removed on 2026-10-27: its red glow in dark felt odd); sits under every page, and the menu's Contact glides down to it. LinkedIn and the Playground link join it once they exist |

## 5. Pages

### `/` Home
1. **E01 boot preloader.** It logs postgres, sql server, odoo and barcode scanner, counts to 100, and the columns lift. First visit per session only.
2. **Hero (E02 statement).** Meta row (name, role, Giza coordinates, live time) · "Business runs on systems. **I build them.**" with C16 reveal · **C5 reactive ASCII logo mark** on the right (smaller on phones so the headline comes first, still readable as MS) · status line "Now building for new clients · **Let's build ↗**" (the link glides to the contact block).
3. **E07 velocity marquee** of the stack: the core of the CV's Skills section (TypeScript, Next.js, React, Node.js, PostgreSQL, SQL Server, Drizzle, Payload, Astro, Odoo, PowerBuilder, n8n, Docker, Playwright). One-project tools such as PowerSync stay in that project's stack.
4. **Featured Projects: rows that fight for space** (W09 in the Work Showcase Library, after Codegrid's "A Next JS Scroll Animation Where Every Project Fights for More Space", from Ingamana; replaced the stacking cards on 2026-10-27). One project is open at a time: summary, stack, status and case-study button on the left; one large screen and two stacked beside it on the right, all whole at 16:10 (Tiba Masr's harvest photo fills its third tile). The others fold to one line: index, name, sector · year. The open project takes its full height (screens sized from the column's width; on short screens they narrow rather than crop), and the folded lines scroll out of the way, fading at the edges. The section pins; each project rests open only briefly and the scroll keeps moving the hand-over, about 0.6 of a screen per project (the closing row covers its screens like a blind, never squashing them; "empty" scroll between projects felt odd). Scrubbed (`scrub: 0.6`), no snapping. Phones and reduced motion get a plain list with every project open. Tabbing to a project's name scrolls to where it rests open, so keyboard users open rows too. Revised 2026-10-27 after testing: the brand key art tile was dropped and the rows were compacted, because several half-open projects at once felt complex.
5. **About teaser** (built 2026-10-27, replacing two orphan links after the critique flagged a weak ending; header and text picked in the About Section Picks the same day). A big "About me. / **Who builds them.**" (answering the hero) rises line by line out of masks (A1, after Codegrid's award-site line reveal, `line-reveal.tsx`), then the description with the same reveal: "I'm a systems developer in Giza. I learn how a business really works, then build the software its people use every day." (T1, `SUMMARY` in `content/about.ts`). Then the two measured results from the track record (−40% downtime incidents, −60% reporting time), the method as one line (Discover → Map → Build → Train), and the way in: **"Start a project"** as the one filled button (to the contact block), with "More about me", All work and Archive as plain links (Contact Path Preview, 2026-10-27).
   - **404** (`app/not-found.tsx`): inside the normal header and footer. The missing address as a terminal line (`GET /path → 404 Not found`), "This page isn't here.", the way home, and every Case Study one click away.
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
7. **Outcome:** numbers or qualitative results, plus screens. Then the ask (`case-ask.tsx`, 2026-10-27): "Need something like {Project} for your business?" with the email and a "Write to me" button, on every Case Study, the unwritten ones too.
8. **Next project:** the next Case Study as a large link at the end of the page. It plays once on entering view (C16 name reveal, image wipe) and opens by click with the C40 morph. Replaced C15 on 2026-10-21: scroll-driven opening proved unreliable (pinning felt stuck, the hand-off popped).

Featured Projects: True Legal · Kidzenia · Tiba Masr · Aqsat · True Visor (live work first; Tiba Masr joined on 2026-10-26 and its Case Study is still to write). KTC Scanner Hub is paused (2026-10-21) until its Case Study is written; its data waits in `PAUSED_PROJECTS`.

### `/archive` Archive
- A filterable list (Production · Client · Tool · Early work) of every other Project: KTC Scanner Hub (while paused from Featured Projects), Odoo implementation, SQL troubleshooting agent, QR complaint system, Wanloo Sales Order, WakeUp, Help Desk / IT Ticketing, Tick Hub, MovieApi. Lines come from each repo's README or the CV; live demos are linked where they exist.
- **Signature Moment, C4:** hovering an Archive row plays that project inside a 3D vintage CRT (Three.js, lazy-loaded). On touch screens and under reduced motion, a static framed screenshot replaces it.

### `/about` About
- **Header** (2026-10-27, replacing the E03b word-scrub paragraph): "About me. / **Who builds them.**" rises line by line out of masks, then the intro with the same reveal: "I'm a systems developer in Giza. I learn how a business really works, then build the software its people use every day." (`ABOUT_HEADING`, `INTRO` in `content/about.ts`; `line-reveal.tsx`).
- **E09** pinned horizontal track record: 2016 CS degree → 2023 Semi-Code → 2024 Kazareen ERP & Odoo → −40% SQL agent → −60% QR system → 2026 independent.
- A short "How I work" block (discover → map → build → train). Static text, no extra effect.
- CV download.

### `/playground` Playground
- **C12** draggable desktop-style interface with windows for projects, the README and the schema. Linked from the footer only.

## 6. Images

- **Sources:** Playwright captures from live deploys and local seed-data runs, plus your own files (apps that need Docker or private data, and factory-floor photos). **Demo data only. No client company names unless approved.**
- **Home (revised 2026-10-27):** Featured Projects shows three real screens per project and no brand key art, muted until the row is open or hovered (full colour on touch screens). The key art (`project-thumb.tsx`) is no longer used on Home.
- **Treatment (C, revised 2026-10-27):** every real screen sits on a card-coloured mat with a hairline border. At rest it is plain grayscale (the old page tint turned screens sepia), then full colour when open, on hover and inside the Case Study. In the dark theme every screen, lit or not, is dimmed to 85% (`--screen-dim`) so a pale app never glares. Touch thumbnails on /work are full colour, since there is no hover. Placeholder drawings still dither.
- Every Case Study gets a cover and 3–6 screens (a "Screens" gallery after the Outcome, marked as demo data), and, if possible, one short recording. The architecture diagram was dropped.
- **Captured (Stage 10):** each app ran locally against its own separate demo database. The developers' databases were never written to, and True Legal's production copy was never read. Screens live in `public/projects/<slug>/` at 2880×1800 (phones 1170×2532) and are listed in `src/content/projects.ts`, first one the cover. Each has a crop `focus`: left for English screens, right for Arabic.

## 7. Motion rules

- **No animation plays under another (2026-10-27).** Entrance animations wait until their page is on screen: the home hero waits for the boot preloader's columns to clear and for any page-transition cover (`onIntroReady` + `onPageShown` in `lib/intro.ts`); section headings, the About line reveal, the next-case-study block and the Playground windows wait for `onPageShown`. The page transition lowers the flag as its cover comes down and raises it 0.3s into the lift. Any new entrance animation must use the same gate.
- **`prefers-reduced-motion`:** no Lenis, no preloader, no pinning or scrubbing. Text is shown immediately and the CRT is static. It's a complete Reduced Motion Experience, not a broken page.
- **Touch:** no custom cursor, no ink trail, no magnetic buttons, no flashlight, no CRT and no ASCII scatter. Everything else runs.
- **One WebGL context at a time.** Three.js loads only on `/archive`.
- **Budgets:** Lighthouse Performance ≥ 90 on mobile for `/` and a Case Study · LCP < 2.5 s · JS for the home route < 200 KB gzip, excluding fonts.

## 8. Build stages (each reviewed in the browser before moving on)

1. Scaffold: Next.js, tokens, fonts, Lenis + GSAP setup, theme toggle (E12), header, Reduced Motion Experience switch
2. E01 preloader → hero (E02, C16, C5) → E07 marquee
3. Menu (E05 + C23), cursor and buttons (E06 set), E11 route transition
4. Featured Projects (C10) → `/work` (A1) → C40 transition
5. Case Study template (C26, C15) with True Visor as the first full Case Study
6. Footer (F1 + C6 + E13)
7. `/about` (line-reveal header, E09)
8. `/archive` + CRT Signature Moment (C4)
9. `/playground` (C12)
10. Screenshot capture and treatment, then the remaining four Case Studies
11. Accessibility and performance pass, then deploy (now www.msaleh.site) and archive the old portfolio repos

## 9. Open items (not blocking)

- **Outcome numbers** for the five Featured Projects. If none are provided, the Case Study shows a qualitative outcome.
- **LinkedIn URL.**
- **Updated CV** (the current one predates the 2026 projects). Planned for after v1.
- **Client names:** permission per Featured Project. The default is product names only.
