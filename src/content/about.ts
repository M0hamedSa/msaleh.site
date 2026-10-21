// The About page's content. Facts come from the CV (Mohamed_Saleh_CV_2P.pdf);
// the 2026 line summarises the Featured Projects.

export const INTRO =
  "I'm Mohamed Saleh, a systems developer in Giza. I keep a textile mill's ERP running, led its move to Odoo, and build the web systems around it: barcode inspection on the factory floor, audits that work offline, ledgers a law firm trusts with its clients' money.";

export type Milestone = {
  label: string;
  /** The big mark: a year, or a result. */
  mark: string;
  title: string;
  body: string;
  /** The current role, set in the accent. */
  current?: boolean;
};

export const TRACK_RECORD: Milestone[] = [
  {
    label: "Education",
    mark: "2016",
    title: "BSc Computer Science",
    body: "Misr University for Science and Technology, Giza. Graduated 2020.",
  },
  {
    label: "Semi-Code, remote",
    mark: "2023",
    title: "Tick Hub",
    body: "Built an event-ticketing marketplace frontend from detailed Figma designs, including right-to-left layouts for Arabic-speaking markets.",
  },
  {
    label: "Kazareen, Giza",
    mark: "2024",
    title: "Systems developer & ERP specialist",
    body: "Maintains the PowerBuilder ERP and led the Odoo implementation, including training the teams who use it.",
    current: true,
  },
  {
    label: "Automation",
    mark: "−40%",
    title: "SQL troubleshooting agent",
    body: "An n8n and Telegram bot that turns plain questions into SQL. Downtime incidents dropped 40%.",
  },
  {
    label: "Compliance",
    mark: "−60%",
    title: "QR complaint system",
    body: "A mobile QR platform for complaints and compliance reports, with file uploads and tracking. Reporting time dropped 60%.",
  },
  {
    label: "Independent",
    mark: "2026",
    title: "Systems for clients",
    body: "Offline factory audits, installment contracts, a law firm's client ledger and a clothing factory's online store.",
  },
];

export const HOW_I_WORK = [
  {
    step: "Discover",
    body: "Sit with the people who do the work and learn how it really runs, before any screen is drawn.",
  },
  {
    step: "Map",
    body: "Turn that into a process map and a shared vocabulary, so the system and the business use the same words.",
  },
  {
    step: "Build",
    body: "Ship in small, working pieces, with the decisions written down so the next person knows why.",
  },
  {
    step: "Train",
    body: "Hand it over properly: train the teams who use it every day, then stay close while it settles in.",
  },
];

// Held back until there is a copy without the phone number. When it's ready,
// put it at public/cv/Mohamed_Saleh_CV.pdf and restore:
// { href: "/cv/Mohamed_Saleh_CV.pdf", label: "Download CV", meta: "PDF · 2 pages" }
export const CV: { href: string; label: string; meta: string } | null = null;
