// Full Case Study content, keyed by project slug. Projects without an entry
// show their header and cover only, until their Case Study is written.
//
// Sources are each project's own repo: CONTEXT.md (glossary), docs/adr/ and its
// notes. No client names; product names only.

export type CaseStudy = {
  /** Drafted from repo notes; shown with a "to confirm" tag until reviewed. */
  draft: boolean;
  problem: string[];
  constraints: { title: string; body: string }[];
  decisions: { title: string; choice: string; tradeoff: string; source: string }[];
  outcome: { points: string[]; note: string };
};

const trueVisor: CaseStudy = {
  draft: false,
  problem: [
    "A social-compliance consultancy audits factories with 177 checks, interviews and photo evidence, kept until now in an Excel checklist and a Word manual.",
    "Every finding becomes a corrective action the factory must resolve with evidence, and interview notes must never reach the people they describe.",
  ],
  constraints: [
    {
      title: "No connection on the factory floor",
      body: "Inspections happen on phones and tablets with weak or no signal, so recording must work fully offline.",
    },
    {
      title: "Two languages",
      body: "Everything in English and Arabic, with AI-assisted Arabic reviewed by a compliance expert.",
    },
    {
      title: "Confidential by design",
      body:
        "Interview notes stay hidden from factory staff and client managers everywhere, on devices that can be lost.",
    },
    {
      title: "Evidence cannot be lost",
      body: "A dropped connection or a closed app must never lose a photo or save it twice.",
    },
  ],
  decisions: [
    {
      title: "Offline from the first release",
      choice:
        "Offline support was planned for later, but adding it afterwards would have meant rewriting the audit module, so inspections were built offline-first from version one.",
      tradeoff: "Client-generated IDs and conflict rules for every record, and a way to sign devices out remotely.",
      source: "ADR-0001",
    },
    {
      title: "A proven sync engine, uploads through the app",
      choice:
        "A hand-written sync engine is the code most likely to lose evidence silently, so self-hosted PowerSync brings data down while uploads pass through the app's own endpoint and its rules.",
      tradeoff: "One more service to run, in exchange for not owning the riskiest part of the system.",
      source: "ADR-0002",
    },
    {
      title: "Devices check in, or lock",
      choice:
        "After 14 days without a check-in the app asks the consultant to reconnect, without losing data. Deactivating a user or signing out clears the device.",
      tradeoff: "Two weeks offline means reconnecting before work, so interview notes never outlive a person's access.",
      source: "Decision log #19",
    },
  ],
  outcome: {
    points: [
      "Offline tests pass on Android and iPhone: photos survive the app closing mid-upload and are saved exactly once.",
      "Deactivating a consultant, or another person signing in, clears the device's offline copy.",
      "Every check, screen and report in English and Arabic.",
    ],
    note: "The pilot starts in November 2026; its results will be added here.",
  },
};

const elghandour: CaseStudy = {
  draft: false,
  problem: [
    "The client sells goods on installment, collecting the price plus its markup in monthly payments. Its PowerBuilder system could not show how a balance was reached.",
    "The replacement had to bring over all 56,375 of the old system's customers, with their contracts and payments, without burying the work of the day.",
  ],
  constraints: [
    {
      title: "Late days counted, never charged",
      body: "The business doesn't charge for late payment, and the database rejects any late fee.",
    },
    {
      title: "Arabic, right to left",
      body: "Every screen, statement and PDF is in Arabic; code and data stay in English.",
    },
    {
      title: "56,375 customers to migrate",
      body: "About 67,600 contracts and 404,000 payments, most of them years old, brought in without changing a single balance.",
    },
    {
      title: "Every balance explainable",
      body: "Staff must be able to show any balance line by line, years later.",
    },
  ],
  decisions: [
    {
      title: "Late days instead of late fees",
      choice:
        "Before go-live the owner ruled out charging for lateness, so the planned per-day fee became a Late Days count shown on contracts, statements and the dashboard.",
      tradeoff:
        "No late-payment income, and a fee engine already designed was dropped; a database check keeps it from returning.",
      source: "ADR-0035",
    },
    {
      title: "An append-only ledger",
      choice:
        "Every financial event is an immutable entry and a balance is their sum. Corrections post reversing entries; nothing is edited.",
      tradeoff:
        "Balances are computed, not stored, and every feature that moves money must post entries. In return, every historical statement stays correct.",
      source: "ADR-0001",
    },
    {
      title: "Old customers kept apart until activated",
      choice:
        "Only a few hundred of the imported customers had paid since 2024, so they arrive as Old-system Customers: searchable and printable, but left out of the dashboard, overdue lists and reports until staff take each one up.",
      tradeoff:
        "One more state on every customer, in exchange for screens that still show what needs doing today.",
      source: "ADR-0044",
    },
  ],
  outcome: {
    points: [
      "Schedules, allocation and Late Days are pure functions, covered by tests down to month-end due dates and 29 February.",
      "The old system's 56,375 customers were imported after a full rehearsal on a copy of production.",
      "Arabic statements and PDFs across branches, with encrypted off-site backups and a tested restore.",
    ],
    note: "Live since November 2026.",
  },
};

const trueLegal: CaseStudy = {
  draft: false,
  problem: [
    "A law firm needed one system for its clients, their cases and the money moving on their behalf: payments, case expenses, fees and staff advances.",
    "The first version has run the firm's daily operations since launch. An October 2026 review led to production fixes and a second version on the firm's own infrastructure.",
  ],
  constraints: [
    {
      title: "Each person sees only their part of the money",
      body: "What staff, admins and the owner can see and do is set by roles the firm edits itself.",
    },
    {
      title: "Changes without downtime",
      body: "The firm works in the system daily, so no change may interrupt work or lose a record.",
    },
    {
      title: "No password resets",
      body: "The move to the new version must not lock anyone out.",
    },
    {
      title: "Reports that match the screens",
      body: "Eight reports in Arabic and English, as PDF and spreadsheet, matching the application to the piastre.",
    },
  ],
  decisions: [
    {
      title: "PostgreSQL, with access rules in one place",
      choice:
        "Self-hosted PostgreSQL replaces Supabase, giving the firm control of its data and backups. Access rules now live in one module that every query passes through.",
      tradeoff:
        "Without row-level security, every server route checks the caller's permissions, and Supabase's auth, realtime and storage each needed a replacement.",
      source: "ADR-0001",
    },
    {
      title: "Existing passwords carried over",
      choice:
        "Better Auth verifies the migrated password hashes as they are, so everyone keeps their current password.",
      tradeoff: "The old hashing scheme stays until each password is next changed.",
      source: "ADR-0002",
    },
    {
      title: "Settlements that keep the history",
      choice:
        "Settling an account used to reset its payments and erase the history behind the balance. A dated Settlement record now closes it at a point in time.",
      tradeoff: "One more record type, in exchange for statements that can always be reproduced.",
      source: "Migration plan",
    },
  ],
  outcome: {
    points: [
      "The second version was verified against the first under all three roles: every page, exported amount and permission.",
      "Staff scan paper documents with a phone's camera straight into a case's files.",
      "The move to the firm's own server checked every record, login and amount, and each client's balance, against the old system.",
    ],
    note: "The second version has run the firm's work on its own server since 16 November 2026.",
  },
};

const kidzenia: CaseStudy = {
  draft: false,
  problem: [
    "A children's and teens' clothing manufacturer sold by phone and wanted to sell online, with cash on delivery, in Arabic first.",
    "The store would be the smaller channel at launch, around 40 to 80 orders a month, selling from the same stock as phone and in-person sales.",
  ],
  constraints: [
    {
      title: "One stock, three sales channels",
      body: "Phone and in-store sales can't wait for the website to be updated.",
    },
    {
      title: "Cash on delivery leaves no room for overselling",
      body: "An oversold item means cancelling a parcel the customer is already expecting.",
    },
    {
      title: "The existing WhatsApp number stays",
      body: "Switching to the WhatsApp Business API would take the number out of the WhatsApp app staff already use.",
    },
    {
      title: "Why not an off-the-shelf platform",
      body:
        "None of the hosted platforms the client evaluated handled shared stock and cash on delivery the way the business works, and several don't serve Egypt.",
    },
  ],
  decisions: [
    {
      title: "A reserved share of stock for the web",
      choice:
        "Each variant has a Web Allocation. The site sells the lower of the allocation and the stock on hand, minus reservations, so other channels never touch the website.",
      tradeoff:
        "An item can show as sold out online while units remain; a warning list flags variants below their allocation.",
      source: "ADR-0004",
    },
    {
      title: "Order confirmation through WhatsApp",
      choice:
        "A pre-filled WhatsApp message with the order code and a token goes to the number customers already know, and staff confirm it in the admin panel.",
      tradeoff:
        "Confirmation is manual, but moving to the WhatsApp API later changes only the evidence type, not the order statuses.",
      source: "ADR-0006 · 0005",
    },
    {
      title: "Unconfirmed orders followed up by staff",
      choice:
        "Unconfirmed orders keep their stock and wait on an oldest-first follow-up list; a daily job releases any still unconfirmed after seven days.",
      tradeoff:
        "Staff work a list rather than a timer, because a short timeout would cancel Thursday-evening orders over the Friday–Saturday weekend.",
      source: "ADR-0007",
    },
  ],
  outcome: {
    points: [
      "Storefront, admin, returns and inspection, plus an illustrated Arabic guide for staff.",
      "Each order reserves stock, creates the order and records the movement in one transaction, so stock and orders can't disagree.",
      "A separate demo environment with the real catalogue and fictional customers.",
    ],
    note: "The store is live; order figures will be added as they come in.",
  },
};

const tibaMasr: CaseStudy = {
  draft: false,
  problem: [
    "Tiba Masr grows, packs and exports Egyptian fruit and vegetables from the Nile Delta and Nubaria. Its buyers are importers abroad who compare varieties, sizes, packaging and seasons before requesting a quote.",
    "The website gives them one place to review the full range, in English or Arabic, and send a quote request.",
  ],
  constraints: [
    {
      title: "English and Arabic, both directions",
      body: "The Arabic site mirrors the English one page for page, right to left, with its own type scale.",
    },
    {
      title: "Written for importers",
      body: "Each product lists varieties, sizes, packaging, monthly availability, minimum order and shipping method.",
    },
    {
      title: "Shared hosting",
      body: "Static pages and one small PHP script for quote requests; no server to maintain.",
    },
    {
      title: "Heavy photography",
      body: "8–10 MB source photos must reach visitors resized and stay out of the deployment.",
    },
  ],
  decisions: [
    {
      title: "A static site, not an application",
      choice:
        "The catalogue changes a few times a season, so Astro prebuilds it, and a validated content schema stops a missing Arabic name from reaching a buyer.",
      tradeoff: "Changing a product means editing a file and rebuilding.",
      source: "src/content.config.ts",
    },
    {
      title: "One entry per product, both languages inside",
      choice: "English and Arabic sit side by side in each product entry, with farm certifications in one shared file.",
      tradeoff: "Every field is written twice, so the two sites never drift apart.",
      source: "src/content.config.ts",
    },
    {
      title: "The export map, generated at build time",
      choice:
        "A script draws the map centred on Egypt, with a shipping route to each market, so the live site loads no mapping libraries.",
      tradeoff: "Adding a market means re-running the script.",
      source: "scripts/generate-export-map.mjs",
    },
  ],
  outcome: {
    points: [
      "Live at tibamasr.com in English and Arabic, with 14 products and their monthly availability.",
      "Quote requests reach the export team's inbox, with a fallback if the host's mail service fails.",
      "The deployment shrank from 216 MB to about 70 MB.",
    ],
    note: "The site now serves as the company's export catalogue for importers, in English and Arabic.",
  },
};

export const CASE_STUDIES: Record<string, CaseStudy> = {
  "true-visor": trueVisor,
  elghandour,
  "true-legal": trueLegal,
  kidzenia,
  "tiba-masr": tibaMasr,
};
