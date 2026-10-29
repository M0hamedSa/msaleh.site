// The Archive: every other Project worth mentioning, one line each. Lines come
// from each project's repo (README, glossary) or, for work without one, the CV.

export type ArchiveKind = "Production" | "Tool" | "Early work";

export type ArchiveProject = {
  slug: string;
  name: string;
  line: string;
  kind: ArchiveKind;
  year: string;
  stack: string[];
  /** A public demo, when there is one. */
  url?: string;
};

export const ARCHIVE_KINDS: ArchiveKind[] = ["Production", "Tool", "Early work"];

export const ARCHIVE: ArchiveProject[] = [
  {
    slug: "ktc-scanner-hub",
    name: "KTC Scanner Hub",
    line: "Fabric inspection with a phone camera instead of scanner hardware, feeding defects straight into SQL Server.",
    kind: "Production",
    year: "2025",
    stack: ["Next.js", "SQL Server"],
  },
  {
    slug: "odoo",
    name: "Odoo rollout",
    line: "A core part of a textile mill's move to Odoo ERP: training the teams who use it, loading product data and fixing store and warehouse issues.",
    kind: "Production",
    year: "2025",
    stack: ["Odoo"],
  },
  {
    slug: "sql-agent",
    name: "SQL troubleshooting agent",
    line: "A Telegram bot that turned plain questions into SQL for real-time checks and remote troubleshooting. Downtime incidents dropped 40%.",
    kind: "Production",
    year: "2025",
    stack: ["n8n", "Telegram", "SQL Server"],
  },
  {
    slug: "qr-complaints",
    name: "QR complaint system",
    line: "A mobile QR platform for complaints and compliance reports, with file uploads and tracking. Reporting time dropped 60%.",
    kind: "Production",
    year: "2025",
    stack: [],
  },
  {
    slug: "wanloo",
    name: "Wanloo Sales Order",
    line: "Tracks each sales order through production, from design to shipping, with phase permissions and analytics.",
    kind: "Production",
    year: "2026",
    stack: ["Next.js", "SQL Server"],
    url: "https://sales-order-wl.vercel.app",
  },
  {
    slug: "wakeup",
    name: "WakeUp",
    line: "Watches every project I run: uptime, certificates, backups, logs and errors, with alerts on Telegram.",
    kind: "Tool",
    year: "2026",
    stack: ["Next.js", "PostgreSQL", "Telegram"],
  },
  {
    slug: "it-ticketing",
    name: "Help Desk / IT Ticketing",
    line: "An IT help desk: tickets, their status and system health on one dashboard.",
    kind: "Tool",
    year: "2026",
    stack: ["Next.js", "Supabase"],
    url: "https://it-ticketing-app.vercel.app",
  },
  {
    slug: "tick-hub",
    name: "Tick Hub",
    line: "An event-ticketing marketplace frontend built from detailed Figma designs, with right-to-left layouts for Arabic markets.",
    kind: "Early work",
    year: "2023",
    stack: ["HTML", "CSS", "JavaScript"],
  },
  {
    slug: "movie-api",
    name: "MovieApi",
    line: "Browse popular, top-rated and upcoming films, with search.",
    kind: "Early work",
    year: "2024",
    stack: ["Angular", "TypeScript"],
    url: "https://movie-api-nu-three.vercel.app",
  },
];
