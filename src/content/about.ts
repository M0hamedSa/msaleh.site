// The About page's content. Facts come from the one-page CV (Mohamed_Saleh_CV_source.html);
// the 2026 line summarises the Featured Projects.

/** The About header: two lines, the second in red (answers the hero's "I build them."). */
export const ABOUT_HEADING = ["About me.", "Who builds them."] as const;

/** Who you are in one sentence: the About page intro, and the About section at the end of the home page. */
export const INTRO = "I'm a full-stack developer in Giza. I learn how a business really works, then build the software its people use every day.";

export type Milestone = {
  label: string;
  /** The big mark: a year, or a result. */
  mark: string;
  title: string;
  body: string;
  /** The current role: an ink panel with its year in red. */
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
    body: "Maintains the PowerBuilder ERP and was a core part of the move to Odoo: training the teams who use it, loading product data and fixing store and warehouse issues.",
    current: true,
  },
  {
    label: "Automation",
    mark: "−40%",
    title: "SQL troubleshooting agent",
    body: "An n8n and Telegram bot that turned plain questions into SQL. Downtime incidents dropped 40%.",
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
    body: "Offline factory audits, installment contracts, a law firm's client ledger, a clothing factory's online store and a produce exporter's website.",
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

// The public copy of the CV: the one-page CV with the phone number left out
// (made from Mohamed_Saleh_CV_source.html). Set to null to hide the link.
export const CV: { href: string; label: string; meta: string } | null = {
  href: "/cv/Mohamed_Saleh_CV.pdf",
  label: "Download CV",
  meta: "PDF · 1 page",
};
