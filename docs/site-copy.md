# Portfolio copy: every piece of text on the site

Generated from the code on 2026-10-27. Edit any text in place, keep the `source` tags and the `Lnn:` line numbers as they are, and send the file back (or point me at it); I apply each change to the file it came from.

It is set out by page: 1 every page (header, menu, footer, 404), 2 home, 3 projects, 4 case studies, 5 about, 6 archive, 7 playground, 8 small UI text left over. Text from the content files (`src/content/*.ts`) appears as labelled fields under a `source` tag; text written straight into a page or component appears as `- Lnn:` lines under its file name. Lines starting `aria-label:` are read out by screen readers, and `data-cursor:` is the word on the red cursor disc. Code excerpts in the case studies are real code comments from the projects; change them only if you want the excerpt itself different.

## Part 1 · Every page

**`src/app/layout.tsx`**

- L38: Mohamed Saleh · Systems developer
- L40: Mohamed Saleh builds the systems businesses run on: ERP, ledgers, factory-floor tools and offline apps, from Giza.
- L64: Skip to content

**`src/components/site-header.tsx`**

- L52: aria-label: Mohamed Saleh, home
- L56: Systems developer · Giza
- L61: aria-label: Write to me
- L62: data-cursor: Write
- L73: aria-label: Menu

**`src/components/site-menu.tsx`**

- L17: Work
- L18: About
- L19: Archive
- L20: Contact
- L131: aria-label: Site menu
- L139: / Index
- L147: Close
- L151: aria-label: Main
- L180: GitHub

**`src/components/site-footer.tsx`**

- L39: Have a system in mind?
- L44: GitHub
- L51: data-cursor: Write
- L54: Write to me
- L60: © 2026 Mohamed Saleh
- L62: Playground

**`src/components/footer/copy-email.tsx`**

- L36: Copied
- L36: Selected
- L37: Copy
- L50: Copy

**`src/components/footer/ascii-talk.tsx`**

- L9: LET'S TALK
- L171: aria-label: Let's talk

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
- L62: Systems developer
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

**Text:** I'm a systems developer in Giza. I learn how a business really works, then build the software its people use every day.

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

**Summary:** A client ledger a law firm trusts with its clients’ money.

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

**Summary:** Taking a clothing factory from phone orders to an online store.

**Tagline:** From phone orders to an online store.

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

**Summary:** Egyptian fruit and vegetables, presented to buyers around the world.

**Tagline:** Fresh from the farm, ready for export.

**Status:** Live

**Sector:** Agricultural export

**Role:** Sole engineer

**Year:** 2026

**Stack:** Astro · TypeScript

**Screens** (alt text · caption)

1. Tiba Masr home page: a farmer with a basket of fruit and the line Harvested Fresh, Delivered Pure · *The home page, written for buyers abroad.*
2. Tiba Masr products page with fresh fruit and vegetables on a wooden table · *The product catalogue, in English and Arabic.*

### Aqsat

**Summary:** Installment contracts, from markup to the courtroom.

**Tagline:** Every balance, traced to its payments.

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

**Summary:** Factory compliance audits that keep working when the signal drops.

**Tagline:** Factory audits that work without signal.

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

### True Visor (marked draft)

**Problem**

A social-compliance consulting firm audits its clients' factories against social-compliance standards, adding new ones as its clients need them. Its method lived in an Excel checklist and a Word manual: 177 checks, interviews with workers, supervisors and management, and photos of evidence.

Every problem found becomes a corrective action the factory must fix and prove with evidence before a consultant closes it. The interview notes that explain why have to stay away from the people they are about.

**Constraints**

**1.**

**Title:** No signal on the floor

**Body:** Consultants inspect production halls on phones and tablets where signal is weak or gone. Recording results, findings, photos and interview notes has to work fully offline and sync later.

**2.**

**Title:** Two languages

**Body:** Every check, report and screen in English and Arabic. AI drafts the Arabic; a compliance expert reviews it, because wrong legal wording in an audit is a real risk.

**3.**

**Title:** Confidential by design

**Body:** Worker interview notes are never visible to factory people or client managers, in the app, reports or exports, and they live on devices that can be lost.

**4.**

**Title:** Evidence can't be lost

**Body:** Photos and findings are audit evidence. A dropped connection or a closed app must never lose one or record it twice.

**Under The Hood**

**Intro:** The device only ever holds the Audits its Consultant chose to take offline, and nothing it uploads can land twice.

**Excerpts**

**1.**

**File:** powersync/sync-config.yaml

**Text**

```
# The device learns which Audits to open from this small user-scoped stream.
offline_selections:
  auto_subscribe: true
  query: SELECT audit_id AS id, audit_id FROM offline_audit
         WHERE user_id = auth.user_id()
```

**2.**

**File:** src/server/idempotency.ts

**Text**

```
/**
 * Runs `create` once per actor and key, inside the caller's transaction.
 * A repeated key returns the first request's record instead;
 * a concurrent repeat waits for the first to commit.
 */
```

**3.**

**File:** docs/offline-drills.md

**Text:** A photo's file and details stay on the device until the server
confirms it has recorded the photo. An upload that was cut off goes
to the same storage key again, and recording the same photo twice
keeps the first.

**Decisions**

**1.**

**Title:** Offline from the first release

**Choice:** The original plan left offline work for a later stage. Retrofitting local storage and sync onto an online-only data model is close to rewriting the audit module, so the inspection workflow was built offline-first from v1. Administration, reports and document review stay online-only.

**Tradeoff:** Every record made on a device needs a client-generated ID and a conflict rule, and confidential notes now live on devices, which needed a remote-logout story.

**Source:** ADR-0001

**2.**

**Title:** A proven sync engine, our own uploads

**Choice:** A hand-written sync engine is exactly the kind of code that can silently lose audit evidence. PowerSync, self-hosted, brings data down to each device; everything a device sends back goes through the app's own endpoint, which owns validation, permissions and conflict rules.

**Tradeoff:** One more service to run beside the app and the database, in exchange for not owning the riskiest part of the system.

**Source:** ADR-0002

**3.**

**Title:** Devices check in, or lock

**Choice:** Every page checks the device in whenever it is online. After 14 days without a check-in the app shows only a “Go online” screen; nothing is lost. A deactivated user's device wipes itself, and signing out wipes everything after warning about unsent changes.

**Tradeoff:** A consultant who stays offline for two weeks must reconnect before working, in exchange for interview notes that don't outlive a person's access.

**Source:** Decision log #19

**Outcome**

**Points**

Offline drills pass on Android and on iPhone: photos and notes survive the app being killed mid-upload, and each photo is saved exactly once.

Deactivating a consultant, or another person signing in, wipes the device's offline copy.

Fully bilingual: every check, screen and report in English and Arabic.

**Note:** The pilot starts in November 2026; its results will be added here.

### Aqsat (marked draft)

**Problem**

An Egyptian company buys an item for a customer, adds its markup, and collects the total back in monthly installments. When a customer stops paying, it may take them to court. Two or three employees ran all of this on an old PowerBuilder system that didn't calculate the money properly and couldn't show how a balance was reached.

The new system had to carry 7,000 customers over, keep every guarantor and court case tied to the right debt, and make any balance traceable to the events that produced it.

**Constraints**

**1.**

**Title:** Lateness is never charged

**Body:** The business doesn't charge for late payment. The system counts how late a contract is and shows it, but never charges for it, and the database refuses a late fee whatever code tries to write one.

**2.**

**Title:** Arabic, right to left

**Body:** Every screen, statement and PDF in Arabic for a team of two or three. Code, columns and permissions stay in English, so a second language never means renaming anything.

**3.**

**Title:** 7,000 customers to carry over

**Body:** Customers, guarantors, phones and addresses come across from the old database with their old keys, while the old system stays open for lookups.

**4.**

**Title:** Every number explained

**Body:** Staff must be able to show a customer exactly how their balance was reached, line by line, years after the fact.

**Under The Hood**

**Intro:** Every piastre is accounted for: money never passes through floating point, and the database itself refuses a charge for lateness.

**Excerpts**

**1.**

**File:** drizzle/0029_legal_expense_charges.sql

**Text**

```
ALTER TABLE "ledger_entries"
  ADD CONSTRAINT "ledger_no_late_payment_fee"
  CHECK ("ledger_entries"."entry_type" <> 'late_payment_fee')
  NOT VALID;
```

**2.**

**File:** docs/adr/0023-money-is-numeric…md

**Text**

```
Money columns are numeric(14,2). The pure functions convert to
integer piastres at their boundary and calculate in whole integers.

The review rule: money never becomes a JS number between the
database and the calculation core.
```

**3.**

**File:** src/lib/allocation.ts

**Text**

```
/**
 * Walk the Customer's Scheduled Installments oldest to newest,
 * settling each completely before moving to the next. Oldest first
 * is what makes arrears come first. No database, no clock, no
 * rounding: whole piastres in, whole piastres out.
 */
```

**Decisions**

**1.**

**Title:** Lateness is counted, never charged

**Choice:** An earlier design charged a flat amount per late day. It was replaced the same morning, before go-live, when the owner decided lateness should never be charged. The system now counts Late Days per contract and shows them on the contract, the statement and the dashboard; what to do about a late customer the owner decides himself.

**Tradeoff:** No income from late payment, and a fee engine already designed was dropped. A database check makes sure no future code can quietly bring one back.

**Source:** ADR-0035

**2.**

**Title:** The balance is an append-only ledger

**Choice:** Every financial event (a contract, a payment, a void, a charged legal expense) is an immutable ledger entry, and a balance is their sum. Corrections post a reversing entry; nothing is edited or deleted.

**Tradeoff:** Balances are summed, not stored, and every feature that moves money must post entries rather than update rows. In exchange, any historical statement stays correct.

**Source:** ADR-0001

**3.**

**Title:** Money in whole piastres

**Choice:** Postgres stores money as numeric; the calculation core works in integer piastres and converts only at its boundary. A single parseFloat would put the ledger into floating point, where errors of a few piastres appear on some contracts with no traceable cause.

**Tradeoff:** A conversion at every boundary and a review rule to enforce it. It also makes “allocation neither creates nor destroys money” checkable by plain summation.

**Source:** ADR-0023

**Outcome**

**Points**

Schedules, payment allocation and Late Days are pure functions tested in milliseconds, down to month-end due dates and 29 February, across 28 test files in the core alone.

An importer carries the 7,000 customers and their guarantors over from the PowerBuilder system, keeping each one's old key.

Arabic statements and PDF exports, with encrypted off-site backups from day one.

**Note:** Go-live is set for November 2026; results will be added here.

### True Legal (marked draft)

**Problem**

A small Egyptian law firm needed one place for its clients, their cases and the money that moves on their behalf: payments clients make, expenses the firm spends on their cases, its fees, and the cash advances it hands to its seven staff.

The first version has run the firm's daily work since launch. A review in October 2026 led to fixes in production and to a second version on the firm's own infrastructure, with clearer money rules and reports.

**Constraints**

**1.**

**Title:** Three roles, three views of the money

**Body:** Staff see every client but only their own expenses, never payments or fees. Admins see payments and balance, never fees or what is due. Only the owner sees everything.

**2.**

**Title:** Live system, no downtime

**Body:** The firm works in the system every day, so every change has to land without interrupting it or losing a single entry.

**3.**

**Title:** Nobody resets a password

**Body:** Moving to the new version must not lock anyone out or ask seven busy people to choose new passwords.

**4.**

**Title:** Arabic reports

**Body:** Seven Arabic PDF reports that read correctly right to left and match the screens to the piastre.

**Under The Hood**

**Intro:** Row-level security used to guard the data from the browser. On the firm's own server, the same rules live in one module every query goes through.

**Excerpts**

**1.**

**File:** lib/data/access.ts

**Text**

```
// Who may see and change what (CONTEXT.md). The server reaches the
// database as its owner, so these rules stand in for the row-level
// security policies the browser used to go through; each names the
// policy it replaces. Every query and action goes through them.
```

**2.**

**File:** lib/money.ts

**Text**

```
// The one place a Client's money is calculated. Every screen and PDF report
// uses these functions so their totals always agree.

// What the Client owes: Fees not covered by the Balance. Never negative.
due: number;
```

**3.**

**File:** lib/actions/settlements.ts

**Text**

```
// What is carried forward is worked out here from the Client's
// books, not taken from the form: what the firm holds minus the
// Fees, less any refund paid out that day.
if (latest && input.date <= latest.date) refuse("SETTLEMENT_TOO_EARLY");
```

**Decisions**

**1.**

**Title:** Plain PostgreSQL, rules in one place

**Choice:** Moving from Supabase to plain PostgreSQL gives the firm control of its data and backups. The access rules that Supabase enforced in the database now live in one module every query goes through. The move was rehearsed against a copy of production, so go-live is one switch.

**Tradeoff:** Row-level security no longer guards the data by itself, so every server route checks the caller's role, and Supabase's login, realtime and storage each needed a replacement.

**Source:** ADR-0001

**2.**

**Title:** Keep everyone's password

**Choice:** Better Auth takes over logins. The existing password hashes are carried over and checked as they are, so everyone signs in with the password they already have. The owner manages accounts from the Users page.

**Tradeoff:** The old hashing scheme stays in use until each password is next changed.

**Source:** ADR-0002

**3.**

**Title:** Settle, don't reset

**Choice:** Settling a client used to mean resetting their payments, which erased the history behind the balance. A dated Settlement now closes the account at a point in time, and screens say who owes whom in words ("Client owes the firm 17,637") instead of with a minus sign.

**Tradeoff:** One more record type for staff to learn, in exchange for statements that can always be reproduced.

**Source:** Migration plan

**Outcome**

**Points**

The second version was checked against the first as each of the three roles: the same pages, every exported amount, and each action allowed or refused as the role requires.

All seven Arabic PDF reports render through one module in one to two seconds each.

Production fixes from the audit went live first, verified against a full backup of the live database.

**Note:** The second version goes live once the firm's new server is in place.

### Kidzenia (marked draft)

**Problem**

An Egyptian children's and teens clothing factory took its orders by phone and wanted to sell online, with cash on delivery, in Arabic first and English second.

The website would be the smaller channel at launch, about 40 to 80 orders a month, selling from the same stock the factory keeps selling by phone and over the counter.

**Constraints**

**1.**

**Title:** One pile, three ways to sell it

**Body:** Phone, walk-in and web orders all draw on the same garments. Staff selling to someone in front of them can't be expected to update the website first.

**2.**

**Title:** Cash on delivery

**Body:** Overselling isn't a refund, it's phoning a customer to cancel a parcel they're waiting for.

**3.**

**Title:** The WhatsApp number stays

**Body:** The order-taking number is in daily manual use. Registering it to WhatsApp's API would take it out of the normal app.

**4.**

**Title:** Why not an off-the-shelf store

**Body:** The client reviewed the hosted platforms and turned them down: none handled shared stock and cash on delivery the way the factory works, and several don't serve Egypt.

**Under The Hood**

**Intro:** The storefront sells against one number, defined once, and an order either reserves its stock completely or not at all.

**Excerpts**

**1.**

**File:** src/inventory/availability.ts

**Text**

```
/**
 * The failure mode is chosen deliberately. The site says sold out
 * while stock exists, which costs a sale. It does not oversell,
 * which would cost a customer under cash on delivery.
 */
export function availableFrom({ onHand, webAllocation, committed }) {
  return Math.min(webAllocation, onHand) - committed
}
```

**2.**

**File:** docs/adr/0003-payload-owns-schema…md

**Text:** Placing an order must lock the Variant's stock row, check
availability against the ring-fence, write the order and its lines,
write the Reservation and write a Movement — atomically.

**3.**

**File:** docs/adr/0006-confirmation-by-whatsapp…md

**Text:** The confirmation token exists for unambiguous matching, not
authentication. A staff member reading a message that says only
"تمام" needs to know which order it belongs to.

**Decisions**

**1.**

**Title:** Sell from a ring-fenced share

**Choice:** Each garment variant carries a Web Allocation: the part of the shelf the website may sell. The site sells min(allocation, on hand) minus what's already promised, so phone and walk-in sales never have to touch the website.

**Tradeoff:** The site can say sold out while garments are still in the building. A warning list of every variant whose stock has fallen below its allocation keeps that from going unnoticed.

**Source:** ADR-0004

**2.**

**Title:** Confirm by WhatsApp deep link

**Choice:** The thank-you page shows one button that opens WhatsApp with the order code and a confirmation token, sent to the number the customer already knows. Staff read it there and confirm in the admin. Confirmation is recorded as evidence on the order, not a separate status.

**Tradeoff:** No automatic confirmation or webhook. Moving to the WhatsApp API later changes the evidence type, not the order's statuses.

**Source:** ADR-0006 · 0005

**3.**

**Title:** Release stale orders by hand

**Choice:** Unconfirmed orders hold their stock and appear on a chase list, oldest first, for staff to cancel. One daily job releases anything still unconfirmed after seven days.

**Tradeoff:** Staff work the list instead of a timer. A short timeout would have killed orders placed on a Thursday night, since Egypt's weekend is Friday and Saturday.

**Source:** ADR-0007

**Outcome**

**Points**

Storefront, admin, returns and inspection, with an illustrated Arabic guide for the factory's staff.

Placing an order reserves its stock, writes the order and records the movement in one transaction, so stock and orders can't disagree.

A separate demo copy with the real catalog and invented customers, for showing the shop without touching live data.

**Note:** The shop is live; order figures will be added as they come in.

### Tiba Masr (marked draft)

**Problem**

Tiba Masr grows and exports Egyptian fruit and vegetables, from its farms in the Nile Delta and Nubaria through its own packhouse, cooling and dispatch. Its buyers are importers abroad, who compare varieties, sizes, packaging and the months each crop is available before they ask for a quote.

To confirm: how buyers found and contacted the company before the site, and why it needed one now.

**Constraints**

**1.**

**Title:** Two languages, both directions

**Body:** Every page in English and Arabic. The Arabic site mirrors the English one page for page, right to left, with its own type scale rather than the Latin one flipped.

**2.**

**Title:** Written for importers

**Body:** Each product carries what a buyer compares: varieties, sizes, packaging, availability by month, minimum order and how it ships, by sea, air or refrigerated container.

**3.**

**Title:** Shared hosting

**Body:** The site runs on ordinary shared hosting: static pages, plus one small PHP script to send the quote requests. No server to maintain.

**4.**

**Title:** Heavy photography

**Body:** The source photos run 8 to 10 MB a frame. Visitors must get small, resized images, and the deploy must not carry the originals.

**Under The Hood**

**Intro:** Each product is written once in both languages, and the build throws away every image no page links to.

**Excerpts**

**1.**

**File:** src/content.config.ts

**Text**

```
/* A localised string pair. Every buyer-facing field carries both
   languages in one entry so a product is added once, not twice. */
const i18nText = z.object({ en: z.string(), ar: z.string() });
```

**2.**

**File:** integrations/prune-unused-assets.mjs

**Text**

```
/**
 * Drops image files that the finished build never links to.
 * On this site that was 123 files and ~146MB of a 216MB build.
 * A file is removed only if its name appears in no emitted
 * HTML, CSS, JS, JSON, XML or plain-text file in the output.
 */
```

**3.**

**File:** public/contact.php

**Text**

```
/**
 * The line-break strip has to happen before anything is
 * interpolated into a mail header: htmlspecialchars() leaves
 * CR and LF intact, and the name goes into "Reply-To:".
 */
```

**Decisions**

**1.**

**Title:** A static site, not an app

**Choice:** The catalogue changes a few times a season, so the site is built ahead of time with Astro and served as plain files. Products live as content files with a checked schema, so a missing Arabic name or a wrong month fails the build instead of reaching a buyer.

**Tradeoff:** Changing a product means editing a file and rebuilding, not logging in to an admin panel.

**Source:** src/content.config.ts

**2.**

**Title:** One entry per product, both languages inside

**Choice:** Each product holds its English and Arabic text side by side, and the Arabic pages mirror the English ones one to one. Certifications cover the farms and the packhouse, not single crops, so they live in one file every product reads from.

**Tradeoff:** Every new field has to be written twice before it can ship, in exchange for the two sites never drifting apart.

**Source:** src/content.config.ts

**3.**

**Title:** The export map, drawn at build time

**Choice:** The markets live in one list (the United Kingdom, Romania, Saudi Arabia and the UAE). A script projects the world map, centres it on Egypt and draws a shipping lane to each market, then saves the result, so the live site needs none of the mapping libraries.

**Tradeoff:** Adding a market means re-running the script, not just editing a list.

**Source:** scripts/generate-export-map.mjs

**Outcome**

**Points**

Live at tibamasr.com in English and Arabic, with 14 products, each with its specifications and availability by month.

Quote requests go straight to the export desk's inbox, with a fallback if the host's mailer is down.

The deploy shrank from 216 MB to about 70 MB once unused source images were dropped.

**Note:** To confirm: what changed for the company once the site went live.

**`src/app/work/[slug]/page.tsx`**

- L53: In progress
- L55: The full Case Study, with the problem and the decisions behind the system, is being written.
- L88: title: The problem
- L96: title: Constraints
- L107: title: Under the Hood
- L111: title: Three key decisions
- L116: Decision
- L122: Trade-off
- L130: title: Outcome

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

**`src/components/case/under-the-hood.tsx`**

- L106: Lights off
- L106: Lights on

## Part 5 · About page

<sub>source: `src/content/about.ts → ABOUT_HEADING, INTRO, TRACK_RECORD, HOW_I_WORK, CV`</sub>

**Heading:** About me. / Who builds them.

**Intro:** I'm a systems developer in Giza. I learn how a business really works, then build the software its people use every day.

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

**Text:** An n8n and Telegram bot that turns plain questions into SQL. Downtime incidents dropped 40%.

**5. −60% · Compliance**

**Title:** QR complaint system

**Text:** A mobile QR platform for complaints and compliance reports, with file uploads and tracking. Reporting time dropped 60%.

**6. 2026 · Independent**

**Title:** Systems for clients

**Text:** Offline factory audits, installment contracts, a law firm's client ledger and a clothing factory's online store.

### How I work

1. **Discover:** Sit with the people who do the work and learn how it really runs, before any screen is drawn.
2. **Map:** Turn that into a process map and a shared vocabulary, so the system and the business use the same words.
3. **Build:** Ship in small, working pieces, with the decisions written down so the next person knows why.
4. **Train:** Hand it over properly: train the teams who use it every day, then stay close while it settles in.

**CV download:** hidden until a copy without the phone number is ready

**`src/app/about/page.tsx`**

- L10: About · Mohamed Saleh
- L11: Systems developer in Giza: ERP, Odoo, and the web systems businesses run on.
- L20: /about
- L36: Track record
- L38: From a CS degree to systems in production.
- L49: Method
- L51: How I work
- L68: The full story on two pages: experience, projects, skills and education.
- L71: data-cursor: Get

## Part 6 · Archive

<sub>source: `src/content/archive.ts → ARCHIVE, ARCHIVE_KINDS`</sub>

**Filters:** Production · Client · Tool · Early work

1. **KTC Scanner Hub** (Production, 2025, Next.js · SQL Server): Fabric inspection with a phone camera instead of scanner hardware, feeding defects straight into SQL Server.
2. **Odoo implementation** (Production, 2025, Odoo): A core part of a textile mill's move to Odoo ERP: training the teams who use it, loading product data and fixing store and warehouse issues.
3. **SQL troubleshooting agent** (Production, 2025, n8n · Telegram · SQL Server): A Telegram bot that turns plain questions into SQL for real-time checks and remote troubleshooting. Downtime incidents dropped 40%.
4. **QR complaint system** (Production, 2025, ): A mobile QR platform for complaints and compliance reports, with file uploads and tracking. Reporting time dropped 60%.
5. **Wanloo Sales Order** (Client, 2026, Next.js · SQL Server): Tracks each sales order through production, from design to shipping, with phase permissions and analytics.
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

## Part 7 · Playground

<sub>source: `src/content/playground.ts → README, SCHEMA`</sub>

**README.md window**

```
# Mohamed Saleh
Systems developer · Giza

I keep a textile mill's ERP running, was a core part of its move to Odoo, and build the web systems around it.

## Featured
- True Visor   offline factory audits
- Aqsat        installment contracts
- True Legal   a law firm's client ledger
- Kidzenia     a factory's online store

## Contact
moh.sa.dev@gmail.com
github.com/M0hamedSa
```

**schema.sql window**

```
-- aqsat · every financial event is one immutable row;
-- a balance is their sum (ADR-0001).
CREATE TABLE "ledger_entries" (
  "id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "customer_id" uuid NOT NULL,
  "contract_id" uuid,
  "entry_type" text NOT NULL,
  "entry_date" date NOT NULL,
  "direction" text NOT NULL,
  "amount" numeric(14, 2) NOT NULL,
  "signed_amount" numeric(14, 2) GENERATED ALWAYS AS
    (case when direction = 'debit' then amount else -amount end) STORED,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "ledger_amount_positive" CHECK ("amount" > 0),
  CONSTRAINT "ledger_direction_check"
    CHECK ("direction" in ('debit', 'credit'))
);

-- Lateness is counted, never charged (ADR-0035).
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_no_late_payment_fee"
  CHECK ("entry_type" <> 'late_payment_fee') NOT VALID;
```

**`src/app/playground/page.tsx`**

- L6: Playground · Mohamed Saleh
- L7: A desktop to play with: drag the windows around.
- L14: Playground

**`src/components/playground/desktop.tsx`**

- L19: projects
- L19: projects/
- L20: readme
- L20: README.md
- L21: schema
- L21: schema.sql
- L114: archive/
- L115: items
- L132: /playground
- L133: Drag the windows by their title bars
- L174: aria-label: Windows
- L191: Giza

## Part 8 · Other text in components

Labels, accessibility text and small UI words not covered above.

**`src/components/header-icons.tsx`**

- L7: currentColor
- L9: round
- L10: round

**`src/components/home/ascii-mark.tsx`**

- L34: MS
- L51: MS

**`src/components/ink-trail.tsx`**

- L36: #version 300 es precision highp float; in vec2 vUv, vL, vR, vT, vB; out vec4 o; 
- L85: EXT_color_buffer_float
- L253: WEBGL_lose_context

**`src/components/live-clock.tsx`**

- L6: Africa/Cairo

**`src/components/logo-mark.tsx`**

- L9: MS

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
- L22: Playground

