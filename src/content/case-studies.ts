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
    "A social-compliance consulting firm audits its clients' factories against WRAP, amfori BSCI, SMETA and Egyptian labour law. Its method lived in an Excel checklist and a Word manual: 177 checks, interviews with workers, supervisors and management, and photos of evidence.",
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
      title: "One developer, pilot budget",
      body: "Built and run by one person, with hosting planned at about $10–40 a month for the pilot.",
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
      title: "Self-hosted sync, own uploads",
      choice:
        "Writing a sync engine would put the riskiest code, the kind that can silently lose audit evidence, on one developer. PowerSync Cloud starts at $49 a month. The same engine, self-hosted on the existing server, costs nothing extra. It only downloads; uploads go through the app's own endpoint, which owns validation, permissions and conflict rules.",
      tradeoff:
        "One more service to run and upgrade, logical replication on Postgres, and no serverless-only hosting for the sync service.",
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
      "Runs in English and Arabic on one server, with hosting planned at about $10–12 a month for the first two years.",
    ],
    note: "Numbers from the pilot will replace these once it has run.",
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
      body: "Adding to a debt in return for delay is riba, which the business does not take. The system counts how late a contract is and shows it, but never charges for it, and the database refuses a late fee whatever code tries to write one.",
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
      title: "One shared CPU",
      body: "The server is a single shared vCPU with 4 GB of RAM and no paid services, so PDF rendering runs one report at a time and images are never built on it.",
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
        "An earlier design charged a flat amount per late day. It was replaced the same morning, before go-live, because an increase in a debt for delay is riba. The system now counts Late Days per contract and shows them on the contract, the statement and the dashboard; what to do about a late customer the owner decides himself.",
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
      "Arabic statements and PDFs on a single shared CPU, with an encrypted backup kept off the server from day one.",
    ],
    note: "Go-live is set for 1 November 2026; results will follow.",
  },
};

const trueLegal: CaseStudy = {
  draft: true,
  problem: [
    "A small Egyptian law firm needed one place for its clients, their cases and the money that moves on their behalf: payments clients make, expenses the firm spends on their cases, its fees, and the cash advances it hands to its seven staff.",
    "The first version ran on Vercel and Supabase. An audit of it in October 2026 led to fixes on production and to a second version on the firm's own server, with clearer money rules: a dated Settlement replaces resetting a client's payments, and screens say who owes whom in words instead of with a minus sign.",
  ],
  constraints: [
    {
      title: "Three roles, three views of the money",
      body: "Staff see every client but only their own expenses, never payments or fees. Admins see payments and balance, never fees or what is due. Only the owner sees everything.",
    },
    {
      title: "A fixed hosting ceiling",
      body: "One vCPU and 4 GB of RAM is the most the firm will pay for, so the design must fit it rather than grow into a bigger plan.",
    },
    {
      title: "Nobody resets a password",
      body: "Moving off Supabase must not lock anyone out, and there is no email service, because seven staff don't justify running one.",
    },
    {
      title: "Arabic reports",
      body: "Seven PDF reports in Arabic, rendered by Chrome with embedded fonts, one at a time so a report never takes the server down.",
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
        file: "lib/pdf.ts",
        text: `// Reports render one at a time, because the VPS has a single vCPU
// and 4 GB of RAM. Fixed weights rather than variable fonts: Chrome
// writes variable fonts into the PDF as Type 3 glyphs, which makes
// the files several times larger.`,
      },
      {
        file: "docs/vps-migration-plan.md",
        text: `Say who owes whom in words, never with a bare minus sign
("Client owes the firm 17,637"). A test Settlement carrying
−17,637 (the client's debt) read as "we owe the client".`,
      },
    ],
  },
  decisions: [
    {
      title: "Plain PostgreSQL on the firm's server",
      choice:
        "Self-hosting the Supabase stack would likely need the 8 GB plan; staying on Supabase meant free-plan limits and backups the firm doesn't control. Plain PostgreSQL with its own login and data-access code fits the 4 GB server. The move was rehearsed on a Mac against a copy of production, so go-live is one switch.",
      tradeoff:
        "Row-level security no longer guards the data by itself: every server route checks the caller's role, and Supabase's auth, realtime and storage each needed a replacement.",
      source: "ADR-0001",
    },
    {
      title: "Keep everyone's password",
      choice:
        "Better Auth takes over logins, and Supabase's bcrypt hashes are imported as they are and checked by a custom verify function, so nobody resets a password at cutover. The owner creates accounts and resets passwords from the Users page.",
      tradeoff:
        "No self-service “forgot password” without an email service, accepted for a team of seven.",
      source: "ADR-0002",
    },
    {
      title: "A shared, separable server",
      choice:
        "The server is the developer's and the firm pays for it; the developer's monitoring system, WakeUp, runs beside True Legal. True Legal keeps its own database, user, volumes and backups, and a full handover export can be produced at any time.",
      tradeoff:
        "Logs sent to WakeUp must carry no client names, phones, case titles or amounts, and a watchdog outside the server is needed because both share one machine.",
      source: "ADR-0004",
    },
  ],
  outcome: {
    points: [
      "The second version was checked against the first as each of the three roles: the same pages, every exported amount, and each action allowed or refused as the role requires.",
      "All seven PDF reports render through one module, in about one to two seconds each at a peak of around 480 MB.",
      "Production fixes from the audit went live first, verified against a full backup of the live database.",
    ],
    note: "The second version goes live when the server is bought; usage figures will follow.",
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
      title: "Bespoke, one developer",
      body: "The client knew the off-the-shelf platforms and turned them down; Shopify Payments isn't available in Egypt, and the Gulf platforms don't serve it.",
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
    note: "Order figures from the live shop will replace these.",
  },
};

export const CASE_STUDIES: Record<string, CaseStudy> = {
  "true-visor": trueVisor,
  aqsat,
  "true-legal": trueLegal,
  kidzenia,
};
