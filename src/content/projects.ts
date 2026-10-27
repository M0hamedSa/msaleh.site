// The Featured Projects, in the order the site presents them: live work first.
// `screens` are real captures, every one of them showing invented demo data;
// the first is the cover. `visual` picks the placeholder drawing a project
// shows until it has screens.

export type PlaceholderVisual = "lens" | "steps" | "ledger" | "blobs" | "barcode";

export type Screen = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  /** Captured at phone size; shown narrower in the gallery. */
  phone?: boolean;
  /**
   * Which side to keep when a narrower frame crops the screen: where the
   * reading starts, so the left for English and the right for Arabic.
   */
  focus: "left" | "right";
};

const desktop = (src: string, alt: string, caption: string, focus: Screen["focus"] = "right"): Screen => ({
  src,
  width: 2880,
  height: 1800,
  alt,
  caption,
  focus,
});
const phone = (src: string, alt: string, caption: string): Screen => ({ src, width: 1170, height: 2532, alt, caption, phone: true, focus: "left" });

/** A project's own colours, for its thumbnail: a dark-to-light ground, an accent and the text on it. */
export type Brand = { from: string; to: string; accent: string; ink: string; light?: boolean };

export type FeaturedProject = {
  slug: string;
  name: string;
  /** One line: what the system does, in the client's terms. */
  summary: string;
  /** A few words on the idea, set on the thumbnail. */
  tagline: string;
  /** Where it stands today, e.g. "In production" or "Launching Nov 2026". */
  status: string;
  /** Running for real users now; the status dot blinks green. */
  live: boolean;
  brand: Brand;
  /** The client's logo, shown on a white plate. Projects without one use `wordmark`. */
  logo?: { src: string; width: number; height: number };
  wordmark?: string;
  sector: string;
  role: string;
  year: string;
  stack: string[];
  visual: PlaceholderVisual;
  screens: Screen[];
  /** The screens show a public website, so they carry no "demo data" note. */
  publicScreens?: boolean;
};

export const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    slug: "true-legal",
    name: "True Legal",
    summary: "A client ledger a law firm trusts with its clients’ money.",
    tagline: "Client money, accounted for.",
    status: "In production",
    live: true,
    brand: { from: "#1f0b05", to: "#8a3412", accent: "#f08a4b", ink: "#fbeee6" },
    logo: { src: "/projects/true-legal/logo.png", width: 200, height: 200 },
    sector: "Legal",
    role: "Sole engineer",
    year: "2026",
    stack: ["Next.js", "PostgreSQL", "Better Auth"],
    visual: "ledger",
    screens: [
      desktop("/projects/true-legal/dashboard.png", "True Legal dashboard in Arabic: payments, expenses, fees, balance and a six-month cash flow chart", "The firm at a glance: payments, expenses, fees and what clients owe."),
      desktop("/projects/true-legal/client.png", "A client's account with payments, expenses, balance and fees", "One client's account for the current period."),
      desktop("/projects/true-legal/case.png", "A case's ledger with expenses and office costs, each recorded by a staff member", "Each case keeps its own ledger, and every entry names who recorded it."),
      desktop("/projects/true-legal/transactions.png", "The log of every transaction across clients, filterable by client, type and date", "Every movement of money, across all clients, in one log."),
    ],
  },  {
    slug: "kidzenia",
    name: "Kidzenia",
    summary: "Taking a clothing factory from phone orders to an online store.",
    tagline: "From phone orders to an online store.",
    status: "Live",
    live: true,
    brand: { from: "#0b2213", to: "#24583a", accent: "#e3c56b", ink: "#f3efe2" },
    logo: { src: "/projects/kidzenia/logo.png", width: 1253, height: 392 },
    sector: "Retail",
    role: "Sole engineer",
    year: "2026",
    stack: ["Payload", "Next.js", "Postgres"],
    visual: "blobs",
    screens: [
      desktop("/projects/kidzenia/home.png", "Kidzenia storefront home page in Arabic with a summer collection banner", "The storefront, Arabic first, with English one click away."),
      desktop("/projects/kidzenia/shop.png", "The shop grid with product photos, prices, colours and filters", "The catalogue, filtered by age, size and colour."),
      desktop("/projects/kidzenia/product.png", "A product page with colour and size pickers", "Colours and sizes come from stock, so customers only pick what exists."),
      phone("/projects/kidzenia/product-phone.png", "The same product page on a phone", "Most orders arrive from a phone."),
      desktop("/projects/kidzenia/admin-home.png", "Staff dashboard in Arabic listing new orders to confirm by phone and stock to review", "The staff side starts with today's work: orders to confirm and stock to check."),
      desktop("/projects/kidzenia/admin-order.png", "An order with its items, totals, delivery address and status history", "An order from placement to the courier, cash on delivery."),
    ],
  },  {
    slug: "tiba-masr",
    name: "Tiba Masr",
    summary: "Egyptian fruit and vegetables, presented to buyers around the world.",
    tagline: "Fresh from the farm, ready for export.",
    status: "Live",
    live: true,
    brand: { from: "#081a0c", to: "#2c5a1c", accent: "#c8f23c", ink: "#f1f6e6" },
    logo: { src: "/projects/tiba-masr/logo.png", width: 1132, height: 396 },
    sector: "Agricultural export",
    role: "Sole engineer",
    year: "2026",
    stack: ["Astro", "TypeScript"],
    visual: "lens",
    publicScreens: true,
    screens: [
      desktop("/projects/tiba-masr/home.png", "Tiba Masr home page: a farmer with a basket of fruit and the line Harvested Fresh, Delivered Pure", "The home page, written for buyers abroad.", "left"),
      desktop("/projects/tiba-masr/products.png", "Tiba Masr products page with fresh fruit and vegetables on a wooden table", "The product catalogue, in English and Arabic.", "left"),
    ],
  },
  {
    slug: "aqsat",
    name: "Aqsat",
    summary: "Installment contracts, from markup to the courtroom.",
    tagline: "Every balance, traced to its payments.",
    status: "Launching Nov 2026",
    live: false,
    brand: { from: "#f4efe7", to: "#e9dccb", accent: "#e2611b", ink: "#1c1410", light: true },
    wordmark: "أقساط",
    sector: "Consumer credit",
    role: "Sole engineer",
    year: "2026",
    stack: ["Next.js", "Drizzle", "PostgreSQL", "Garage S3"],
    visual: "steps",
    screens: [
      desktop("/projects/aqsat/dashboard.png", "Aqsat dashboard in Arabic: overdue total, due today, collected today and the most overdue customers", "The branch's morning: what is overdue, what is due today, and who is furthest behind."),
      desktop("/projects/aqsat/contract.png", "An installment contract with its pricing breakdown and overdue amount", "A contract shows how its price was built, once, at signing."),
      desktop("/projects/aqsat/schedule.png", "A twelve-month installment schedule with paid and unpaid rows and days late", "The schedule sums exactly to the amount financed; lateness is counted in days, never charged."),
      desktop("/projects/aqsat/statement.png", "A customer statement built from ledger entries with a running balance", "The statement is the ledger: every balance is a sum of immutable entries."),
    ],
  },  {
    slug: "true-visor",
    name: "True Visor",
    summary: "Factory compliance audits that keep working when the signal drops.",
    tagline: "Factory audits that work without signal.",
    status: "Pilot · Nov 2026",
    live: false,
    brand: { from: "#0c0c0c", to: "#3a2f0f", accent: "#f2c94c", ink: "#f6f1e1" },
    logo: { src: "/projects/true-visor/logo.webp", width: 1024, height: 1024 },
    sector: "Social compliance",
    role: "Sole engineer",
    year: "2026",
    stack: ["Next.js", "PowerSync", "Postgres"],
    visual: "lens",
    screens: [
      desktop("/projects/true-visor/dashboard.png", "True Visor dashboard: today's audit, progress by standard, checks assessed and critical findings", "The consultant's day: today's audit, progress by standard, and critical findings kept apart from the percentages.", "left"),
      desktop("/projects/true-visor/audit.png", "A Gap Assessment audit for a knitwear plant, 134 of 186 checks assessed", "One audit across three standards, with every check's result counted.", "left"),
      phone("/projects/true-visor/check-phone.png", "A single audit check on a phone, with result buttons and a comment field", "On the factory floor: one check at a time, saved offline."),
      desktop("/projects/true-visor/actions.png", "Corrective actions list with severity, owner and deadline", "Findings become corrective actions with an owner and a deadline.", "left"),
      desktop("/projects/true-visor/dashboard-ar.png", "The True Visor dashboard in Arabic, laid out right to left", "The same dashboard in Arabic, right to left."),
    ],
  },];

// Off the site until its Case Study is written (it has no repo to draft from yet).
// Move it back into FEATURED_PROJECTS to show it again; counts follow automatically.
export const PAUSED_PROJECTS: FeaturedProject[] = [
  {
    slug: "ktc-scanner-hub",
    name: "KTC Scanner Hub",
    summary: "Fabric inspection with a phone camera instead of scanner hardware.",
    tagline: "Fabric inspection with a phone camera.",
    status: "In use",
    live: true,
    brand: { from: "#0e1116", to: "#2a3340", accent: "#7cc4ff", ink: "#eef3f8" },
    sector: "Textile manufacturing",
    role: "Systems developer",
    year: "2025",
    stack: ["Next.js", "SQL Server"],
    visual: "barcode",
    screens: [],
  },
];

/** How many Featured Projects there are, as shown in labels: "04". */
export const featuredCount = String(FEATURED_PROJECTS.length).padStart(2, "0");

const NUMBER_WORDS = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
/** The same count in words, for prose: "four". */
export const featuredCountWord = NUMBER_WORDS[FEATURED_PROJECTS.length] ?? String(FEATURED_PROJECTS.length);

export function getProject(slug: string) {
  return FEATURED_PROJECTS.find((p) => p.slug === slug);
}

/** The project after this one, wrapping to the first: the Case Study's "next project". */
export function nextProject(slug: string) {
  const i = FEATURED_PROJECTS.findIndex((p) => p.slug === slug);
  return FEATURED_PROJECTS[(i + 1) % FEATURED_PROJECTS.length];
}

/** "01", "02", … */
export const projectNumber = (slug: string) =>
  String(FEATURED_PROJECTS.findIndex((p) => p.slug === slug) + 1).padStart(2, "0");
