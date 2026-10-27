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
  underTheHood: { intro: string; excerpts: { file: string; text: string }[] };
  decisions: { title: string; choice: string; tradeoff: string; source: string }[];
  outcome: { points: string[]; note: string };
};

const trueVisor: CaseStudy = {
  draft: true,
  problem: [
    "A social-compliance consulting firm audits its clients' factories against social-compliance standards, adding new ones as its clients need them. Its method lived in an Excel checklist and a Word manual: 177 checks, interviews with workers, supervisors and management, and photos of evidence.",
    "Every problem found becomes a corrective action the factory must fix and prove with evidence before a consultant closes it. The interview notes that explain why have to stay away from the people they are about.",
  ],
  constraints: [
    {
      title: "No signal on the floor",
      body: "Consultants inspect production halls on phones and tablets where signal is weak or gone. Recording results, findings, photos and interview notes has to work fully offline and sync later.",
    },
    {
      title: "Two languages",
      body: "Every check, report and screen in English and Arabic. AI drafts the Arabic; a compliance expert reviews it, because wrong legal wording in an audit is a real risk.",
    },
    {
      title: "Confidential by design",
      body: "Worker interview notes are never visible to factory people or client managers, in the app, reports or exports, and they live on devices that can be lost.",
    },
    {
      title: "Evidence can't be lost",
      body: "Photos and findings are audit evidence. A dropped connection or a closed app must never lose one or record it twice.",
    },
  ],
  underTheHood: {
    intro:
      "The device only ever holds the Audits its Consultant chose to take offline, and nothing it uploads can land twice.",
    excerpts: [
      {
        file: "powersync/sync-config.yaml",
        text: `# The device learns which Audits to open from this small user-scoped stream.
offline_selections:
  auto_subscribe: true
  query: SELECT audit_id AS id, audit_id FROM offline_audit
         WHERE user_id = auth.user_id()`,
      },
      {
        file: "src/server/idempotency.ts",
        text: `/**
 * Runs \`create\` once per actor and key, inside the caller's transaction.
 * A repeated key returns the first request's record instead;
 * a concurrent repeat waits for the first to commit.
 */`,
      },
      {
        file: "docs/offline-drills.md",
        text: `A photo's file and details stay on the device until the server
confirms it has recorded the photo. An upload that was cut off goes
to the same storage key again, and recording the same photo twice
keeps the first.`,
      },
    ],
  },
  decisions: [
    {
      title: "Offline from the first release",
      choice:
        "The original plan left offline work for a later stage. Retrofitting local storage and sync onto an online-only data model is close to rewriting the audit module, so the inspection workflow was built offline-first from v1. Administration, reports and document review stay online-only.",
      tradeoff:
        "Every record made on a device needs a client-generated ID and a conflict rule, and confidential notes now live on devices, which needed a remote-logout story.",
      source: "ADR-0001",
    },
    {
      title: "A proven sync engine, our own uploads",
      choice:
        "A hand-written sync engine is exactly the kind of code that can silently lose audit evidence. PowerSync, self-hosted, brings data down to each device; everything a device sends back goes through the app's own endpoint, which owns validation, permissions and conflict rules.",
      tradeoff:
        "One more service to run beside the app and the database, in exchange for not owning the riskiest part of the system.",
      source: "ADR-0002",
    },
    {
      title: "Devices check in, or lock",
      choice:
        "Every page checks the device in whenever it is online. After 14 days without a check-in the app shows only a “Go online” screen; nothing is lost. A deactivated user's device wipes itself, and signing out wipes everything after warning about unsent changes.",
      tradeoff:
        "A consultant who stays offline for two weeks must reconnect before working, in exchange for interview notes that don't outlive a person's access.",
      source: "Decision log #19",
    },
  ],
  outcome: {
    points: [
      "Offline drills pass on Android and on iPhone: photos and notes survive the app being killed mid-upload, and each photo is saved exactly once.",
      "Deactivating a consultant, or another person signing in, wipes the device's offline copy.",
      "Fully bilingual: every check, screen and report in English and Arabic.",
    ],
    note: "The pilot starts in November 2026; its results will be added here.",
  },
};

const aqsat: CaseStudy = {
  draft: true,
  problem: [
    "An Egyptian company buys an item for a customer, adds its markup, and collects the total back in monthly installments. When a customer stops paying, it may take them to court. Two or three employees ran all of this on an old PowerBuilder system that didn't calculate the money properly and couldn't show how a balance was reached.",
    "The new system had to carry 7,000 customers over, keep every guarantor and court case tied to the right debt, and make any balance traceable to the events that produced it.",
  ],
  constraints: [
    {
      title: "Lateness is never charged",
      body: "The business doesn't charge for late payment. The system counts how late a contract is and shows it, but never charges for it, and the database refuses a late fee whatever code tries to write one.",
    },
    {
      title: "Arabic, right to left",
      body: "Every screen, statement and PDF in Arabic for a team of two or three. Code, columns and permissions stay in English, so a second language never means renaming anything.",
    },
    {
      title: "7,000 customers to carry over",
      body: "Customers, guarantors, phones and addresses come across from the old database with their old keys, while the old system stays open for lookups.",
    },
    {
      title: "Every number explained",
      body: "Staff must be able to show a customer exactly how their balance was reached, line by line, years after the fact.",
    },
  ],
  underTheHood: {
    intro: "Every piastre is accounted for: money never passes through floating point, and the database itself refuses a charge for lateness.",
    excerpts: [
      {
        file: "drizzle/0029_legal_expense_charges.sql",
        text: `ALTER TABLE "ledger_entries"
  ADD CONSTRAINT "ledger_no_late_payment_fee"
  CHECK ("ledger_entries"."entry_type" <> 'late_payment_fee')
  NOT VALID;`,
      },
      {
        file: "docs/adr/0023-money-is-numeric…md",
        text: `Money columns are numeric(14,2). The pure functions convert to
integer piastres at their boundary and calculate in whole integers.

The review rule: money never becomes a JS number between the
database and the calculation core.`,
      },
      {
        file: "src/lib/allocation.ts",
        text: `/**
 * Walk the Customer's Scheduled Installments oldest to newest,
 * settling each completely before moving to the next. Oldest first
 * is what makes arrears come first. No database, no clock, no
 * rounding: whole piastres in, whole piastres out.
 */`,
      },
    ],
  },
  decisions: [
    {
      title: "Lateness is counted, never charged",
      choice:
        "An earlier design charged a flat amount per late day. It was replaced the same morning, before go-live, when the owner decided lateness should never be charged. The system now counts Late Days per contract and shows them on the contract, the statement and the dashboard; what to do about a late customer the owner decides himself.",
      tradeoff:
        "No income from late payment, and a fee engine already designed was dropped. A database check makes sure no future code can quietly bring one back.",
      source: "ADR-0035",
    },
    {
      title: "The balance is an append-only ledger",
      choice:
        "Every financial event (a contract, a payment, a void, a charged legal expense) is an immutable ledger entry, and a balance is their sum. Corrections post a reversing entry; nothing is edited or deleted.",
      tradeoff:
        "Balances are summed, not stored, and every feature that moves money must post entries rather than update rows. In exchange, any historical statement stays correct.",
      source: "ADR-0001",
    },
    {
      title: "Money in whole piastres",
      choice:
        "Postgres stores money as numeric; the calculation core works in integer piastres and converts only at its boundary. A single parseFloat would put the ledger into floating point, where errors of a few piastres appear on some contracts with no traceable cause.",
      tradeoff:
        "A conversion at every boundary and a review rule to enforce it. It also makes “allocation neither creates nor destroys money” checkable by plain summation.",
      source: "ADR-0023",
    },
  ],
  outcome: {
    points: [
      "Schedules, payment allocation and Late Days are pure functions tested in milliseconds, down to month-end due dates and 29 February, across 28 test files in the core alone.",
      "An importer carries the 7,000 customers and their guarantors over from the PowerBuilder system, keeping each one's old key.",
      "Arabic statements and PDF exports, with encrypted off-site backups from day one.",
    ],
    note: "Go-live is set for November 2026; results will be added here.",
  },
};

const trueLegal: CaseStudy = {
  draft: true,
  problem: [
    "A small Egyptian law firm needed one place for its clients, their cases and the money that moves on their behalf: payments clients make, expenses the firm spends on their cases, its fees, and the cash advances it hands to its seven staff.",
    "The first version has run the firm's daily work since launch. A review in October 2026 led to fixes in production and to a second version on the firm's own infrastructure, with clearer money rules and reports.",
  ],
  constraints: [
    {
      title: "Three roles, three views of the money",
      body: "Staff see every client but only their own expenses, never payments or fees. Admins see payments and balance, never fees or what is due. Only the owner sees everything.",
    },
    {
      title: "Live system, no downtime",
      body: "The firm works in the system every day, so every change has to land without interrupting it or losing a single entry.",
    },
    {
      title: "Nobody resets a password",
      body: "Moving to the new version must not lock anyone out or ask seven busy people to choose new passwords.",
    },
    {
      title: "Arabic reports",
      body: "Seven Arabic PDF reports that read correctly right to left and match the screens to the piastre.",
    },
  ],
  underTheHood: {
    intro: "Row-level security used to guard the data from the browser. On the firm's own server, the same rules live in one module every query goes through.",
    excerpts: [
      {
        file: "lib/data/access.ts",
        text: `// Who may see and change what (CONTEXT.md). The server reaches the
// database as its owner, so these rules stand in for the row-level
// security policies the browser used to go through; each names the
// policy it replaces. Every query and action goes through them.`,
      },
      {
        file: "lib/money.ts",
        text: `// The one place a Client's money is calculated. Every screen and PDF report
// uses these functions so their totals always agree.

// What the Client owes: Fees not covered by the Balance. Never negative.
due: number;`,
      },
      {
        file: "lib/actions/settlements.ts",
        text: `// What is carried forward is worked out here from the Client's
// books, not taken from the form: what the firm holds minus the
// Fees, less any refund paid out that day.
if (latest && input.date <= latest.date) refuse("SETTLEMENT_TOO_EARLY");`,
      },
    ],
  },
  decisions: [
    {
      title: "Plain PostgreSQL, rules in one place",
      choice:
        "Moving from Supabase to plain PostgreSQL gives the firm control of its data and backups. The access rules that Supabase enforced in the database now live in one module every query goes through. The move was rehearsed against a copy of production, so go-live is one switch.",
      tradeoff:
        "Row-level security no longer guards the data by itself, so every server route checks the caller's role, and Supabase's login, realtime and storage each needed a replacement.",
      source: "ADR-0001",
    },
    {
      title: "Keep everyone's password",
      choice:
        "Better Auth takes over logins. The existing password hashes are carried over and checked as they are, so everyone signs in with the password they already have. The owner manages accounts from the Users page.",
      tradeoff:
        "The old hashing scheme stays in use until each password is next changed.",
      source: "ADR-0002",
    },
    {
      title: "Settle, don't reset",
      choice:
        "Settling a client used to mean resetting their payments, which erased the history behind the balance. A dated Settlement now closes the account at a point in time, and screens say who owes whom in words (\"Client owes the firm 17,637\") instead of with a minus sign.",
      tradeoff:
        "One more record type for staff to learn, in exchange for statements that can always be reproduced.",
      source: "Migration plan",
    },
  ],
  outcome: {
    points: [
      "The second version was checked against the first as each of the three roles: the same pages, every exported amount, and each action allowed or refused as the role requires.",
      "All seven Arabic PDF reports render through one module in one to two seconds each.",
      "Production fixes from the audit went live first, verified against a full backup of the live database.",
    ],
    note: "The second version goes live once the firm's new server is in place.",
  },
};

const kidzenia: CaseStudy = {
  draft: true,
  problem: [
    "An Egyptian children's and teens clothing factory took its orders by phone and wanted to sell online, with cash on delivery, in Arabic first and English second.",
    "The website would be the smaller channel at launch, about 40 to 80 orders a month, selling from the same stock the factory keeps selling by phone and over the counter.",
  ],
  constraints: [
    {
      title: "One pile, three ways to sell it",
      body: "Phone, walk-in and web orders all draw on the same garments. Staff selling to someone in front of them can't be expected to update the website first.",
    },
    {
      title: "Cash on delivery",
      body: "Overselling isn't a refund, it's phoning a customer to cancel a parcel they're waiting for.",
    },
    {
      title: "The WhatsApp number stays",
      body: "The order-taking number is in daily manual use. Registering it to WhatsApp's API would take it out of the normal app.",
    },
    {
      title: "Why not an off-the-shelf store",
      body: "The client reviewed the hosted platforms and turned them down: none handled shared stock and cash on delivery the way the factory works, and several don't serve Egypt.",
    },
  ],
  underTheHood: {
    intro: "The storefront sells against one number, defined once, and an order either reserves its stock completely or not at all.",
    excerpts: [
      {
        file: "src/inventory/availability.ts",
        text: `/**
 * The failure mode is chosen deliberately. The site says sold out
 * while stock exists, which costs a sale. It does not oversell,
 * which would cost a customer under cash on delivery.
 */
export function availableFrom({ onHand, webAllocation, committed }) {
  return Math.min(webAllocation, onHand) - committed
}`,
      },
      {
        file: "docs/adr/0003-payload-owns-schema…md",
        text: `Placing an order must lock the Variant's stock row, check
availability against the ring-fence, write the order and its lines,
write the Reservation and write a Movement — atomically.`,
      },
      {
        file: "docs/adr/0006-confirmation-by-whatsapp…md",
        text: `The confirmation token exists for unambiguous matching, not
authentication. A staff member reading a message that says only
"تمام" needs to know which order it belongs to.`,
      },
    ],
  },
  decisions: [
    {
      title: "Sell from a ring-fenced share",
      choice:
        "Each garment variant carries a Web Allocation: the part of the shelf the website may sell. The site sells min(allocation, on hand) minus what's already promised, so phone and walk-in sales never have to touch the website.",
      tradeoff:
        "The site can say sold out while garments are still in the building. A warning list of every variant whose stock has fallen below its allocation keeps that from going unnoticed.",
      source: "ADR-0004",
    },
    {
      title: "Confirm by WhatsApp deep link",
      choice:
        "The thank-you page shows one button that opens WhatsApp with the order code and a confirmation token, sent to the number the customer already knows. Staff read it there and confirm in the admin. Confirmation is recorded as evidence on the order, not a separate status.",
      tradeoff:
        "No automatic confirmation or webhook. Moving to the WhatsApp API later changes the evidence type, not the order's statuses.",
      source: "ADR-0006 · 0005",
    },
    {
      title: "Release stale orders by hand",
      choice:
        "Unconfirmed orders hold their stock and appear on a chase list, oldest first, for staff to cancel. One daily job releases anything still unconfirmed after seven days.",
      tradeoff:
        "Staff work the list instead of a timer. A short timeout would have killed orders placed on a Thursday night, since Egypt's weekend is Friday and Saturday.",
      source: "ADR-0007",
    },
  ],
  outcome: {
    points: [
      "Storefront, admin, returns and inspection, with an illustrated Arabic guide for the factory's staff.",
      "Placing an order reserves its stock, writes the order and records the movement in one transaction, so stock and orders can't disagree.",
      "A separate demo copy with the real catalog and invented customers, for showing the shop without touching live data.",
    ],
    note: "The shop is live; order figures will be added as they come in.",
  },
};

const tibaMasr: CaseStudy = {
  draft: true,
  problem: [
    "Tiba Masr grows and exports Egyptian fruit and vegetables, from its farms in the Nile Delta and Nubaria through its own packhouse, cooling and dispatch. Its buyers are importers abroad, who compare varieties, sizes, packaging and the months each crop is available before they ask for a quote.",
    "To confirm: how buyers found and contacted the company before the site, and why it needed one now.",
  ],
  constraints: [
    {
      title: "Two languages, both directions",
      body: "Every page in English and Arabic. The Arabic site mirrors the English one page for page, right to left, with its own type scale rather than the Latin one flipped.",
    },
    {
      title: "Written for importers",
      body: "Each product carries what a buyer compares: varieties, sizes, packaging, availability by month, minimum order and how it ships, by sea, air or refrigerated container.",
    },
    {
      title: "Shared hosting",
      body: "The site runs on ordinary shared hosting: static pages, plus one small PHP script to send the quote requests. No server to maintain.",
    },
    {
      title: "Heavy photography",
      body: "The source photos run 8 to 10 MB a frame. Visitors must get small, resized images, and the deploy must not carry the originals.",
    },
  ],
  underTheHood: {
    intro:
      "Each product is written once in both languages, and the build throws away every image no page links to.",
    excerpts: [
      {
        file: "src/content.config.ts",
        text: `/* A localised string pair. Every buyer-facing field carries both
   languages in one entry so a product is added once, not twice. */
const i18nText = z.object({ en: z.string(), ar: z.string() });`,
      },
      {
        file: "integrations/prune-unused-assets.mjs",
        text: `/**
 * Drops image files that the finished build never links to.
 * On this site that was 123 files and ~146MB of a 216MB build.
 * A file is removed only if its name appears in no emitted
 * HTML, CSS, JS, JSON, XML or plain-text file in the output.
 */`,
      },
      {
        file: "public/contact.php",
        text: `/**
 * The line-break strip has to happen before anything is
 * interpolated into a mail header: htmlspecialchars() leaves
 * CR and LF intact, and the name goes into "Reply-To:".
 */`,
      },
    ],
  },
  decisions: [
    {
      title: "A static site, not an app",
      choice:
        "The catalogue changes a few times a season, so the site is built ahead of time with Astro and served as plain files. Products live as content files with a checked schema, so a missing Arabic name or a wrong month fails the build instead of reaching a buyer.",
      tradeoff:
        "Changing a product means editing a file and rebuilding, not logging in to an admin panel.",
      source: "src/content.config.ts",
    },
    {
      title: "One entry per product, both languages inside",
      choice:
        "Each product holds its English and Arabic text side by side, and the Arabic pages mirror the English ones one to one. Certifications cover the farms and the packhouse, not single crops, so they live in one file every product reads from.",
      tradeoff:
        "Every new field has to be written twice before it can ship, in exchange for the two sites never drifting apart.",
      source: "src/content.config.ts",
    },
    {
      title: "The export map, drawn at build time",
      choice:
        "The markets live in one list (the United Kingdom, Romania, Saudi Arabia and the UAE). A script projects the world map, centres it on Egypt and draws a shipping lane to each market, then saves the result, so the live site needs none of the mapping libraries.",
      tradeoff:
        "Adding a market means re-running the script, not just editing a list.",
      source: "scripts/generate-export-map.mjs",
    },
  ],
  outcome: {
    points: [
      "Live at tibamasr.com in English and Arabic, with 14 products, each with its specifications and availability by month.",
      "Quote requests go straight to the export desk's inbox, with a fallback if the host's mailer is down.",
      "The deploy shrank from 216 MB to about 70 MB once unused source images were dropped.",
    ],
    note: "To confirm: what changed for the company once the site went live.",
  },
};

export const CASE_STUDIES: Record<string, CaseStudy> = {
  "true-visor": trueVisor,
  aqsat,
  "true-legal": trueLegal,
  kidzenia,
  // Local only until the owner confirms its problem and outcome; the live site
  // keeps the "being written" note for Tiba Masr until then.
  ...(process.env.NODE_ENV !== "production" && { "tiba-masr": tibaMasr }),
};
