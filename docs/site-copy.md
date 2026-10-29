# Portfolio copy: every piece of text on the site

Generated from the code on 2026-10-28. Edit any text in place, keep the `source` tags and the `Lnn:` line numbers as they are, and send the file back (or point me at it); I apply each change to the file it came from.

It is set out by page: 1 every page (header, menu, footer, 404), 2 home, 3 projects, 4 case studies, 5 about, 6 archive, 7 small UI text left over. Text from the content files (`src/content/*.ts`) appears as labelled fields under a `source` tag; text written straight into a page or component appears as `- Lnn:` lines under its file name. Lines starting `aria-label:` are read out by screen readers, and `data-cursor:` is the word on the red cursor disc.

## Part 1 · Every page

**`src/app/layout.tsx`**

- L42: Mohamed Saleh · Full-stack developer
- L44: Mohamed Saleh builds the systems businesses run on: ERP, ledgers, factory-floor tools and offline apps, from Giza.
- L68: Skip to content

**`src/components/site-header.tsx`**

- L49: aria-label: Mohamed Saleh, home
- L53: Full-stack developer · Giza
- L58: aria-label: Write to me
- L59: data-cursor: Write
- L70: aria-label: Menu

**`src/components/site-menu.tsx`**

- L18: Work
- L19: About
- L20: Archive
- L21: Contact
- L132: aria-label: Site menu
- L140: / Index
- L146: aria-label: Close menu
- L153: aria-label: Main
- L183: GitHub
- L186: LinkedIn

**`src/components/site-footer.tsx`**

- L42: Have a system in mind?
- L50: GitHub
- L53: LinkedIn
- L61: data-cursor: Write
- L64: Write to me
- L71: © 2026 Mohamed Saleh

**`src/components/footer/copy-email.tsx`**

- L36: Copied
- L36: Selected
- L37: Copy
- L50: Copy

**`src/components/footer/ascii-talk.tsx`**

- L9: LET'S TALK
- L194: aria-label: Let's talk

**`src/app/not-found.tsx`**

- L10: Not found · Mohamed Saleh
- L23: This page isn’t here.
- L26: The link may be old, or the page has moved. Everything I’ve built is still one click away.
- L30: data-cursor: Home
- L31: Back to home
- L35: All work
- L38: Archive
- L45: Or open a case study
- L52: data-cursor: View

**`src/components/missing-path.tsx`**

- L10: GET
- L10: Not found

## Part 2 · Home

### Boot preloader, hero, stack marquee

**`src/components/home/boot-preloader.tsx`**

- L12: postgres
- L13: sql server
- L14: odoo
- L15: barcode scanner
- L16: mount /work

**`src/components/home/hero.tsx`**

- L57: Name
- L58: Mohamed Saleh
- L61: Role
- L62: Full-stack developer
- L65: Based
- L66: Giza · 30.01°N 31.21°E
- L69: Local
- L88: Business runs on systems.
- L89: I build them.
- L93: ERP, ledgers, factory-floor tools and offline apps for textile mills, law firms and compliance teams.
- L97: Now building for new clients ·
- L99: Let&apos;s build

**`src/components/home/stack-marquee.tsx`**

- L10: TypeScript
- L10: Next.js
- L10: React
- L10: Node.js
- L10: PostgreSQL
- L10: SQL Server
- L10: Drizzle
- L10: Payload
- L10: Astro
- L10: Odoo
- L10: PowerBuilder
- L10: n8n
- L10: Docker
- L10: Playwright
- L49: Stack:

### Featured Projects (text comes from the projects, Part 3)

**`src/components/home/featured-projects.tsx`**

- L20: A crate of fresh fruit and vegetables in a field at sunset
- L164: Featured Projects
- L167: All work
- L180: data-cursor: View
- L188: data-cursor: View
- L193: Case study
- L210: Read the case study
- L218: data-cursor: View

### About section

<sub>source: `src/content/about.ts → ABOUT_HEADING, INTRO (shared with the About page)`</sub>

**Heading:** About me. / Who builds them.

**Text:** I'm a full-stack developer in Giza. I learn how a business really works, then build the software its people use every day.

*Results and method below come from the About page (Part 5).*

**`src/components/home/about-teaser.tsx`**

- L50: How I work
- L69: data-cursor: Write
- L70: Start a project
- L74: More about me
- L77: All work
- L80: Archive

## Part 3 · Projects (home rows, /work, case-study headers)

<sub>source: `src/content/projects.ts → FEATURED_PROJECTS, PAUSED_PROJECTS`</sub>

### True Legal

**Summary:** A financial system for a law firm: client payments, case expenses, fees and staff advances in one place.

**Tagline:** Client money, accounted for.

**Status:** In production

**Sector:** Legal

**Role:** Sole engineer

**Year:** 2026

**Stack:** Next.js · PostgreSQL · Better Auth

**Screens** (alt text · caption)

1. True Legal dashboard in Arabic: payments, expenses, fees, balance and a six-month cash flow chart · *The firm at a glance: payments, expenses, fees and what clients owe.*
2. A client's account with payments, expenses, balance and fees · *One client's account for the current period.*
3. A case's ledger with expenses and office costs, each recorded by a staff member · *Each case keeps its own ledger, and every entry names who recorded it.*
4. The log of every transaction across clients, filterable by client, type and date · *Every movement of money, across all clients, in one log.*

### Kidzenia

**Summary:** An Arabic-first online store for a children's and teens' clothing manufacturer, with cash on delivery.

**Tagline:** From phone orders to online sales.

**Status:** Live

**Sector:** Retail

**Role:** Sole engineer

**Year:** 2026

**Stack:** Payload · Next.js · Postgres

**Screens** (alt text · caption)

1. Kidzenia storefront home page in Arabic with a summer collection banner · *The storefront, Arabic first, with English one click away.*
2. The shop grid with product photos, prices, colours and filters · *The catalogue, filtered by age, size and colour.*
3. A product page with colour and size pickers · *Colours and sizes come from stock, so customers only pick what exists.*
4. The same product page on a phone · *Most orders arrive from a phone.*
5. Staff dashboard in Arabic listing new orders to confirm by phone and stock to review · *The staff side starts with today's work: orders to confirm and stock to check.*
6. An order with its items, totals, delivery address and status history · *An order from placement to the courier, cash on delivery.*

### Tiba Masr

**Summary:** A bilingual export catalogue of Egyptian fruit and vegetables for importers worldwide.

**Tagline:** Egyptian produce, presented for export.

**Status:** Live

**Sector:** Agricultural export

**Role:** Sole engineer

**Year:** 2026

**Stack:** Astro · TypeScript

**Screens** (alt text · caption)

1. Tiba Masr home page: a farmer with a basket of fruit and the line Harvested Fresh, Delivered Pure · *The home page, written for buyers abroad.*
2. Tiba Masr products page with fresh fruit and vegetables on a wooden table · *The product catalogue, in English and Arabic.*

### Aqsat

**Summary:** Installment contracts, payments and balances, each traceable to the entries behind it.

**Tagline:** Every balance, traced to its source.

**Status:** Launching Nov 2026

**Sector:** Consumer credit

**Role:** Sole engineer

**Year:** 2026

**Wordmark:** أقساط

**Stack:** Next.js · Drizzle · PostgreSQL · Garage S3

**Screens** (alt text · caption)

1. Aqsat dashboard in Arabic: overdue total, due today, collected today and the most overdue customers · *The branch's morning: what is overdue, what is due today, and who is furthest behind.*
2. An installment contract with its pricing breakdown and overdue amount · *A contract shows how its price was built, once, at signing.*
3. A twelve-month installment schedule with paid and unpaid rows and days late · *The schedule sums exactly to the amount financed; lateness is counted in days, never charged.*
4. A customer statement built from ledger entries with a running balance · *The statement is the ledger: every balance is a sum of immutable entries.*

### True Visor

**Summary:** A bilingual audit platform that keeps recording findings, evidence and corrective actions when the connection drops.

**Tagline:** Factory audits that work offline.

**Status:** Pilot · Nov 2026

**Sector:** Social compliance

**Role:** Sole engineer

**Year:** 2026

**Stack:** Next.js · PowerSync · Postgres

**Screens** (alt text · caption)

1. True Visor dashboard: today's audit, progress by standard, checks assessed and critical findings · *The consultant's day: today's audit, progress by standard, and critical findings kept apart from the percentages.*
2. A Gap Assessment audit for a knitwear plant, 134 of 186 checks assessed · *One audit across three standards, with every check's result counted.*
3. A single audit check on a phone, with result buttons and a comment field · *On the factory floor: one check at a time, saved offline.*
4. Corrective actions list with severity, owner and deadline · *Findings become corrective actions with an owner and a deadline.*
5. The True Visor dashboard in Arabic, laid out right to left · *The same dashboard in Arabic, right to left.*

### KTC Scanner Hub (paused, not on the site)

**Summary:** Fabric inspection with a phone camera instead of scanner hardware.

**Tagline:** Fabric inspection with a phone camera.

**Status:** In use

**Sector:** Textile manufacturing

**Role:** Systems developer

**Year:** 2025

**Stack:** Next.js · SQL Server

**`src/app/work/page.tsx`**

- L7: Work · Mohamed Saleh
- L13: /work · Featured Projects (
- L15: Systems running in
- L15: businesses.
- L20: Everything else, in the Archive

**`src/components/work/work-index.tsx`**

- L76: data-cursor: View

## Part 4 · Case studies

<sub>source: `src/content/case-studies.ts → CASE_STUDIES`</sub>

### True Visor

**Problem**

A social-compliance consultancy audits factories with 177 checks, interviews and photo evidence, kept until now in an Excel checklist and a Word manual.

Every finding becomes a corrective action the factory must resolve with evidence, and interview notes must never reach the people they describe.

**Constraints**

**1.**

**Title:** No connection on the factory floor

**Body:** Inspections happen on phones and tablets with weak or no signal, so recording must work fully offline.

**2.**

**Title:** Two languages

**Body:** Everything in English and Arabic, with AI-assisted Arabic reviewed by a compliance expert.

**3.**

**Title:** Confidential by design

**Body:** Interview notes stay hidden from factory staff and client managers everywhere, on devices that can be lost.

**4.**

**Title:** Evidence cannot be lost

**Body:** A dropped connection or a closed app must never lose a photo or save it twice.

**Decisions**

**1.**

**Title:** Offline from the first release

**Choice:** Offline support was planned for later, but adding it afterwards would have meant rewriting the audit module, so inspections were built offline-first from version one.

**Tradeoff:** Client-generated IDs and conflict rules for every record, and a way to sign devices out remotely.

**Source:** ADR-0001

**2.**

**Title:** A proven sync engine, uploads through the app

**Choice:** A hand-written sync engine is the code most likely to lose evidence silently, so self-hosted PowerSync brings data down while uploads pass through the app's own endpoint and its rules.

**Tradeoff:** One more service to run, in exchange for not owning the riskiest part of the system.

**Source:** ADR-0002

**3.**

**Title:** Devices check in, or lock

**Choice:** After 14 days without a check-in the app asks the consultant to reconnect, without losing data. Deactivating a user or signing out clears the device.

**Tradeoff:** Two weeks offline means reconnecting before work, so interview notes never outlive a person's access.

**Source:** Decision log #19

**Outcome**

**Points**

Offline tests pass on Android and iPhone: photos survive the app closing mid-upload and are saved exactly once.

Deactivating a consultant, or another person signing in, clears the device's offline copy.

Every check, screen and report in English and Arabic.

**Note:** The pilot starts in November 2026; its results will be added here.

### Aqsat

**Problem**

The client sells goods on installment, collecting the price plus its markup in monthly payments. Its PowerBuilder system did not calculate balances reliably or show how they were reached.

The replacement had to bring over 7,000 customers with their guarantors and legal follow-up intact.

**Constraints**

**1.**

**Title:** Late days counted, never charged

**Body:** The business doesn't charge for late payment, and the database rejects any late fee.

**2.**

**Title:** Arabic, right to left

**Body:** Every screen, statement and PDF is in Arabic; code and data stay in English.

**3.**

**Title:** 7,000 customers to migrate

**Body:** Customers and guarantors keep their original keys, with the old system available for lookups.

**4.**

**Title:** Every balance explainable

**Body:** Staff must be able to show any balance line by line, years later.

**Decisions**

**1.**

**Title:** Late days instead of late fees

**Choice:** Before go-live the owner ruled out charging for lateness, so the planned per-day fee became a Late Days count shown on contracts, statements and the dashboard.

**Tradeoff:** No late-payment income, and a fee engine already designed was dropped; a database check keeps it from returning.

**Source:** ADR-0035

**2.**

**Title:** An append-only ledger

**Choice:** Every financial event is an immutable entry and a balance is their sum. Corrections post reversing entries; nothing is edited.

**Tradeoff:** Balances are computed, not stored, and every feature that moves money must post entries. In return, every historical statement stays correct.

**Source:** ADR-0001

**3.**

**Title:** Money in whole piastres

**Choice:** The calculation core works in integer piastres and converts only at its boundary, because a single floating-point conversion causes untraceable errors of a few piastres.

**Tradeoff:** A conversion at every boundary, and a review rule to enforce it.

**Source:** ADR-0023

**Outcome**

**Points**

Schedules, allocation and Late Days are pure functions, tested down to month-end due dates and 29 February across 28 test files.

An importer brings over 7,000 customers and their guarantors with their original keys.

Arabic statements and PDFs, with encrypted off-site backups from day one.

**Note:** Go-live is set for November 2026; results will be added here.

### True Legal

**Problem**

A law firm needed one system for its clients, their cases and the money moving on their behalf: payments, case expenses, fees and staff advances.

The first version has run the firm's daily operations since launch. An October 2026 review led to production fixes and a second version on the firm's own infrastructure.

**Constraints**

**1.**

**Title:** Three roles, three views of the money

**Body:** Staff, admins and the owner each see a different part of the finances; only the owner sees everything.

**2.**

**Title:** Changes without downtime

**Body:** The firm works in the system daily, so no change may interrupt work or lose a record.

**3.**

**Title:** No password resets

**Body:** The move to the new version must not lock anyone out.

**4.**

**Title:** Arabic reports that match the screens

**Body:** Seven right-to-left PDF reports, matching the application to the piastre.

**Decisions**

**1.**

**Title:** PostgreSQL, with access rules in one place

**Choice:** Self-hosted PostgreSQL replaces Supabase, giving the firm control of its data and backups. Access rules now live in one module that every query passes through.

**Tradeoff:** Without row-level security, every server route checks the caller's role, and Supabase's auth, realtime and storage each needed a replacement.

**Source:** ADR-0001

**2.**

**Title:** Existing passwords carried over

**Choice:** Better Auth verifies the migrated password hashes as they are, so everyone keeps their current password.

**Tradeoff:** The old hashing scheme stays until each password is next changed.

**Source:** ADR-0002

**3.**

**Title:** Settlements that keep the history

**Choice:** Settling an account used to reset its payments and erase the history behind the balance. A dated Settlement record now closes it at a point in time.

**Tradeoff:** One more record type, in exchange for statements that can always be reproduced.

**Source:** Migration plan

**Outcome**

**Points**

The second version was verified against the first under all three roles: every page, exported amount and permission.

All seven Arabic PDF reports come from one module, in one to two seconds each.

Production fixes shipped first, verified against a full backup of the live database.

**Note:** The second version goes live once the firm's new server is in place.

### Kidzenia

**Problem**

A children's and teens' clothing manufacturer sold by phone and wanted to sell online, with cash on delivery, in Arabic first.

The store would be the smaller channel at launch, around 40 to 80 orders a month, selling from the same stock as phone and in-person sales.

**Constraints**

**1.**

**Title:** One stock, three sales channels

**Body:** Staff selling in person can't be expected to update the website first.

**2.**

**Title:** Cash on delivery leaves no room for overselling

**Body:** An oversold item means cancelling a parcel the customer is already expecting.

**3.**

**Title:** The existing WhatsApp number stays

**Body:** Moving the daily order line to the WhatsApp API would take it out of the regular app.

**4.**

**Title:** Why not an off-the-shelf platform

**Body:** None of the hosted platforms the client evaluated handled shared stock and cash on delivery its way, and several don't serve Egypt.

**Decisions**

**1.**

**Title:** A reserved share of stock for the web

**Choice:** Each variant has a Web Allocation. The site sells the lower of the allocation and the stock on hand, minus reservations, so other channels never touch the website.

**Tradeoff:** An item can show as sold out online while units remain; a warning list flags variants below their allocation.

**Source:** ADR-0004

**2.**

**Title:** Order confirmation through WhatsApp

**Choice:** A pre-filled WhatsApp message with the order code and a token goes to the number customers already know, and staff confirm it in the admin panel.

**Tradeoff:** Confirmation is manual, but moving to the WhatsApp API later changes only the evidence type, not the order statuses.

**Source:** ADR-0006 · 0005

**3.**

**Title:** Unconfirmed orders followed up by staff

**Choice:** Unconfirmed orders keep their stock and wait on an oldest-first follow-up list; a daily job releases any still unconfirmed after seven days.

**Tradeoff:** Staff work a list rather than a timer, because a short timeout would cancel Thursday-evening orders over the Friday–Saturday weekend.

**Source:** ADR-0007

**Outcome**

**Points**

Storefront, admin, returns and inspection, plus an illustrated Arabic guide for staff.

Each order reserves stock, creates the order and records the movement in one transaction, so stock and orders can't disagree.

A separate demo environment with the real catalogue and fictional customers.

**Note:** The store is live; order figures will be added as they come in.

### Tiba Masr

**Problem**

Tiba Masr grows, packs and exports Egyptian fruit and vegetables from the Nile Delta and Nubaria. Its buyers are importers abroad who compare varieties, sizes, packaging and seasons before requesting a quote.

The website gives them one place to review the full range, in English or Arabic, and send a quote request.

**Constraints**

**1.**

**Title:** English and Arabic, both directions

**Body:** The Arabic site mirrors the English one page for page, right to left, with its own type scale.

**2.**

**Title:** Written for importers

**Body:** Each product lists varieties, sizes, packaging, monthly availability, minimum order and shipping method.

**3.**

**Title:** Shared hosting

**Body:** Static pages and one small PHP script for quote requests; no server to maintain.

**4.**

**Title:** Heavy photography

**Body:** 8–10 MB source photos must reach visitors resized and stay out of the deployment.

**Decisions**

**1.**

**Title:** A static site, not an application

**Choice:** The catalogue changes a few times a season, so Astro prebuilds it, and a validated content schema stops a missing Arabic name from reaching a buyer.

**Tradeoff:** Changing a product means editing a file and rebuilding.

**Source:** src/content.config.ts

**2.**

**Title:** One entry per product, both languages inside

**Choice:** English and Arabic sit side by side in each product entry, with farm certifications in one shared file.

**Tradeoff:** Every field is written twice, so the two sites never drift apart.

**Source:** src/content.config.ts

**3.**

**Title:** The export map, generated at build time

**Choice:** A script draws the map centred on Egypt, with a shipping route to each market, so the live site loads no mapping libraries.

**Tradeoff:** Adding a market means re-running the script.

**Source:** scripts/generate-export-map.mjs

**Outcome**

**Points**

Live at tibamasr.com in English and Arabic, with 14 products and their monthly availability.

Quote requests reach the export team's inbox, with a fallback if the host's mail service fails.

The deployment shrank from 216 MB to about 70 MB.

**Note:** The site now serves as the company's export catalogue for importers, in English and Arabic.

**`src/app/work/[slug]/opengraph-image.tsx`**

- L6: A case study on msaleh.site: the project's name, its one-line summary and its cover screen.

**`src/app/work/[slug]/page.tsx`**

- L52: In progress
- L54: The full Case Study, with the problem and the decisions behind the system, is being written.
- L87: title: The problem
- L95: title: Constraints
- L106: title: Three key decisions
- L111: Decision
- L117: Trade-off
- L125: title: Outcome

**`src/components/case/case-ask.tsx`**

- L15: Need something like
- L15: for your business?
- L22: data-cursor: Write
- L23: Write to me

**`src/components/case/case-study-header.tsx`**

- L19: Sector
- L20: Role
- L21: Year
- L22: Stack
- L28: · Case Study
- L31: Draft · to confirm

**`src/components/case/next-case-study.tsx`**

- L58: data-cursor: Open
- L60: Next project

**`src/components/case/screen-gallery.tsx`**

- L17: Screens
- L19: Demo data, invented for this page

## Part 5 · About page

<sub>source: `src/content/about.ts → ABOUT_HEADING, INTRO, TRACK_RECORD, HOW_I_WORK, CV`</sub>

**Heading:** About me. / Who builds them.

**Intro:** I'm a full-stack developer in Giza. I learn how a business really works, then build the software its people use every day.

### Track record

**1. 2016 · Education**

**Title:** BSc Computer Science

**Text:** Misr University for Science and Technology, Giza. Graduated 2020.

**2. 2023 · Semi-Code, remote**

**Title:** Tick Hub

**Text:** Built an event-ticketing marketplace frontend from detailed Figma designs, including right-to-left layouts for Arabic-speaking markets.

**3. 2024 · Kazareen, Giza (current)**

**Title:** Systems developer & ERP specialist

**Text:** Maintains the PowerBuilder ERP and was a core part of the move to Odoo: training the teams who use it, loading product data and fixing store and warehouse issues.

**4. −40% · Automation**

**Title:** SQL troubleshooting agent

**Text:** An n8n and Telegram bot that turned plain questions into SQL. Downtime incidents dropped 40%.

**5. −60% · Compliance**

**Title:** QR complaint system

**Text:** A mobile QR platform for complaints and compliance reports, with file uploads and tracking. Reporting time dropped 60%.

**6. 2026 · Independent**

**Title:** Systems for clients

**Text:** Offline factory audits, installment contracts, a law firm's client ledger, a clothing factory's online store and a produce exporter's website.

### How I work

1. **Discover:** Sit with the people who do the work and learn how it really runs, before any screen is drawn.
2. **Map:** Turn that into a process map and a shared vocabulary, so the system and the business use the same words.
3. **Build:** Ship in small, working pieces, with the decisions written down so the next person knows why.
4. **Train:** Hand it over properly: train the teams who use it every day, then stay close while it settles in.

**CV download:** Download CV

**`src/app/about/page.tsx`**

- L10: About · Mohamed Saleh
- L11: Full-stack developer in Giza: the web systems businesses run on, and the ERP behind them.
- L20: /about
- L36: Track record
- L38: From a CS degree to systems in production.
- L49: Method
- L51: How I work
- L68: The full story on two pages: experience, projects, skills and education.
- L71: data-cursor: Get

## Part 6 · Archive

<sub>source: `src/content/archive.ts → ARCHIVE, ARCHIVE_KINDS`</sub>

**Filters:** Production · Tool · Early work

1. **KTC Scanner Hub** (Production, 2025, Next.js · SQL Server): Fabric inspection with a phone camera instead of scanner hardware, feeding defects straight into SQL Server.
2. **Odoo implementation** (Production, 2025, Odoo): A core part of a textile mill's move to Odoo ERP: training the teams who use it, loading product data and fixing store and warehouse issues.
3. **SQL troubleshooting agent** (Production, 2025, n8n · Telegram · SQL Server): A Telegram bot that turned plain questions into SQL for real-time checks and remote troubleshooting. Downtime incidents dropped 40%.
4. **QR complaint system** (Production, 2025, ): A mobile QR platform for complaints and compliance reports, with file uploads and tracking. Reporting time dropped 60%.
5. **Wanloo Sales Order** (Production, 2026, Next.js · SQL Server): Tracks each sales order through production, from design to shipping, with phase permissions and analytics.
6. **WakeUp** (Tool, 2026, Next.js · PostgreSQL · Telegram): Watches every project I run: uptime, certificates, backups, logs and errors, with alerts on Telegram.
7. **Help Desk / IT Ticketing** (Tool, 2026, Next.js · Supabase): An IT help desk: tickets, their status and system health on one dashboard.
8. **Tick Hub** (Early work, 2023, HTML · CSS · JavaScript): An event-ticketing marketplace frontend built from detailed Figma designs, with right-to-left layouts for Arabic markets.
9. **MovieApi** (Early work, 2024, Angular · TypeScript): Browse popular, top-rated and upcoming films, with search.

**`src/app/archive/page.tsx`**

- L7: Archive · Mohamed Saleh
- L8: Every other project: production systems at a textile mill, client work, tools and early work.
- L15: /archive ·
- L15: projects
- L17: Everything else, one line each.

**`src/components/archive/archive-index.tsx`**

- L18: All
- L32: All
- L34: All
- L34: All
- L38: aria-label: Filter by kind
- L40: All
- L88: Live demo

## Part 7 · Other text in components

Labels, accessibility text and small UI words not covered above.

**`src/app/opengraph-image.tsx`**

- L3: MSALEH: Business runs on systems. I build them. Mohamed Saleh, full-stack developer in Giza.

**`src/components/header-icons.tsx`**

- L7: currentColor
- L9: round
- L10: round

**`src/components/home/ascii-mark.tsx`**

- L50:  ####### ################ ####### ####### ####### ################################ ####### ####### ######## ######## CCCCCCCCCC 
- L51:  ####### ############## ####### ######### ######## ################################## ####### ####### ######## ######## CCCCCCCCCC 
- L52:  ####### ############ ####### ############################ ######### ######## ########################### ############################ ######## ######## CCCCCCCCCC 
- L53:  ####### ########### ####### ########################## ######## ######## ########################### ############################ ######## ######## CCCCCCCCCC 
- L54:  ####### ########## ####### ###################### ######## ######### ########################### ############################ ######## ######## CCCCCCCCCC 
- L55:  ####### ####### ################ ######### ######## ########################### ############################ ######## ######## CCCCCCCCCC 
- L58: C

**`src/components/ink-trail.tsx`**

- L40: #version 300 es precision highp float; in vec2 vUv, vL, vR, vT, vB; out vec4 o; 
- L92: EXT_color_buffer_float
- L92: EXT_color_buffer_half_float
- L264: WEBGL_lose_context

**`src/components/live-clock.tsx`**

- L6: Africa/Cairo

**`src/components/logo-mark.tsx`**

- L9: MSALEH

**`src/components/project-thumb.tsx`**

- L10: M130 25H705L606 131Q596 142 578 142H22Z
- L11: M255 158H330Q382 160 408 206V618L268 462Q255 447 255 428Z
- L13: M330 158H372Q472 160 516 246L598 410L842 38Q850 25 870 25H1040L682 586Q660 628 615 624Q590 620 578 600L408 330V206Q382 160 330 158Z
- L32: alt: 
- L40: alt: 
- L57: Offline · saved on device
- L95: alt: 
- L96: Client ledger
- L114: Who owes whom, in plain words.

**`src/components/project-visual.tsx`**

- L133: opacity-0 transition-opacity duration-500 group-hover:opacity-100
- L181: Placeholder ·

**`src/components/stage-placeholder.tsx`**

- L8: · Stage
- L13: Back home

**`src/components/theme-toggle.tsx`**

- L45: cubic-bezier(0.7, 0, 0.3, 1)
- L58: Switch to
- L58: dark
- L59: light
- L59: theme

**`src/components/transition/page-transition.tsx`**

- L19: Work
- L20: About
- L21: Archive

