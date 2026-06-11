// Core-team position catalog — single source of truth.
// Pure data module (no Convex function exports) so it can be imported from
// both Convex functions and Next.js client code.

export type Department = "Events" | "Outreach" | "Content" | "Finance" | "Tech";
export type PositionLevel = "director" | "officer";

export interface Position {
  id: string;
  department: Department;
  level: PositionLevel;
  title: string;
  commitment: string;
  summary: string;
  responsibilities: string[];
  roleQuestions: string[];
  filled: boolean;
  /** Applicants must provide a portfolio link (Content roles). */
  requiresPortfolio?: boolean;
}

// Applicants rank their choices — array order is preference order (1st, 2nd, 3rd).
export const MAX_POSITIONS_PER_APPLICATION = 3;

export const POSITIONS: Position[] = [
  // ── Events ──────────────────────────────────────────────────────────────
  {
    id: "events-director",
    department: "Events",
    level: "director",
    title: "Events Director",
    commitment: "5–8 hrs / week",
    summary:
      "Own BFP's monthly meetups end-to-end — from venue and Luma to food and flow on the day.",
    responsibilities: [
      "Lead planning and execution of monthly BFP meetups and programs",
      "Manage and delegate tasks to 2–4 Events Officers",
      "Handle logistics: secure venues, set dates, manage Luma registrations",
      "Oversee on-the-ground operations (food, setup, flow)",
      "Procure and manage event collateral (banners, stickers)",
    ],
    roleQuestions: [
      "Describe a time you organized an event from start to finish. How did you handle unexpected logistical hiccups?",
      "How would you ensure a welcoming, engaging environment for attendees at our meetups?",
    ],
    filled: false,
  },
  {
    id: "events-officer",
    department: "Events",
    level: "officer",
    title: "Events Officer",
    commitment: "3–5 hrs / week",
    summary:
      "Help run BFP meetups on the ground — registrations, setup, food, and attendee experience.",
    responsibilities: [
      "Support the Events Director in running monthly meetups (venue setup, registration desk, food, teardown)",
      "Manage Luma event pages, RSVPs, and attendee communications",
      "Help produce event collateral (banners, stickers, signage) and coordinate printing",
      "Collect on-the-ground feedback to improve the next event",
    ],
    roleQuestions: [
      "Tell us about a time you helped run an event or group activity — what was your role and what did you personally handle on the day?",
      "An event starts in 2 hours and the food vendor cancels. Walk us through what you'd do.",
    ],
    filled: false,
  },

  // ── Outreach ────────────────────────────────────────────────────────────
  {
    id: "outreach-director",
    department: "Outreach",
    level: "director",
    title: "Outreach Director",
    commitment: "5–8 hrs / week",
    summary:
      "Be BFP's bridge to NGOs and partners — scope projects, manage relationships, grow the ecosystem.",
    responsibilities: [
      "Reach out to NGOs to scope their projects and get their needs listed on the project board",
      "Manage relations between NGOs and volunteer developers",
      "Bring NGO representatives and VIPs to BFP events",
      "Manage ecosystem collaborations and partnerships",
    ],
    roleQuestions: [
      "How would you approach an NGO with no technical background to scope out a tech project for our developers?",
      "Tell us about a time you had to build and maintain a professional relationship with an external stakeholder.",
    ],
    filled: false,
  },
  {
    id: "outreach-officer",
    department: "Outreach",
    level: "officer",
    title: "Outreach Officer",
    commitment: "3–5 hrs / week",
    summary:
      "Build the NGO pipeline — research orgs, draft outreach, and support scoping calls.",
    responsibilities: [
      "Research and build a pipeline of NGOs and community orgs that could benefit from BFP projects",
      "Draft first-touch outreach messages and track conversations",
      "Support the Outreach Director on scoping calls and follow-ups",
      "Help coordinate NGO and VIP guest logistics at events",
    ],
    roleQuestions: [
      "Briefly draft how you'd introduce Build for Public in a cold message to a local NGO.",
      "Describe a time you persuaded a person or organization to try something new — how did you do it?",
    ],
    filled: false,
  },

  // ── Content ─────────────────────────────────────────────────────────────
  {
    id: "content-director",
    department: "Content",
    level: "director",
    title: "Content Director",
    commitment: "5–8 hrs / week",
    summary:
      "Lead BFP's voice — social media, event coverage, branding, and community storytelling.",
    responsibilities: [
      "Manage BFP social media and create aesthetic, engaging content",
      "Capture high-quality photos and videos during events",
      "Manage Content Officers, delegating graphic design and daily posting tasks",
      "Maintain consistent branding and community storytelling",
    ],
    roleQuestions: [
      "Can you share an example of how you've used social media to build or engage a community?",
      "How would you translate the technical work of our builders into exciting stories for the general public?",
    ],
    filled: false,
    requiresPortfolio: true,
  },
  {
    id: "content-officer",
    department: "Content",
    level: "officer",
    title: "Content Officer",
    commitment: "3–5 hrs / week",
    summary:
      "Create graphics, edit videos, and keep BFP's socials alive with consistent, on-brand posts.",
    responsibilities: [
      "Create graphics and edit short-form video in BFP's visual style",
      "Help maintain a consistent posting schedule across socials",
      "Capture photos and videos at monthly events",
      "Repurpose project launches and event recaps into shareable content",
    ],
    roleQuestions: [
      "Which piece of your past content are you proudest of, and why?",
      "Pick one recent BFP project or event — how would you turn it into a post people actually share?",
    ],
    filled: false,
    requiresPortfolio: true,
  },

  // ── Finance ─────────────────────────────────────────────────────────────
  {
    id: "finance-director",
    department: "Finance",
    level: "director",
    title: "Finance Director",
    commitment: "5–8 hrs / week",
    summary:
      "Own BFP's money — budgets, grants, sponsorships, and transparent reporting.",
    responsibilities: [
      "Oversee overall spending, budgeting, and high-level financial decisions",
      "Identify, apply for, and manage grants and sponsorships",
      "Manage Finance Officers who handle granular details (Excel sheets, receipts)",
      "Ensure transparency in financial reporting",
    ],
    roleQuestions: [
      "What is your experience with grant writing or securing sponsorships for community initiatives?",
      "How do you balance high-level financial strategy with managing granular day-to-day expenses?",
    ],
    filled: true,
  },
  {
    id: "finance-officer",
    department: "Finance",
    level: "officer",
    title: "Finance Officer",
    commitment: "3–5 hrs / week",
    summary:
      "Keep the books in order — expenses, receipts, budget summaries, and transparent reports.",
    responsibilities: [
      "Maintain bookkeeping sheets (log expenses, collect receipts, monthly reconciliation)",
      "Prepare budget summaries for events and programs",
      "Support grant and sponsorship applications with documentation and numbers",
      "Help publish transparent financial reports to the community",
    ],
    roleQuestions: [
      "Describe your experience with budgeting, spreadsheets, or bookkeeping — school clubs and personal projects count.",
      "You find a RM200 expense with no receipt and nobody remembers what it was for — what do you do?",
    ],
    filled: false,
  },

  // ── Tech ────────────────────────────────────────────────────────────────
  {
    id: "tech-director",
    department: "Tech",
    level: "director",
    title: "Tech Director",
    commitment: "5–8 hrs / week",
    summary:
      "Run BFP's tech — the website, internal infra, and the community of volunteer builders.",
    responsibilities: [
      "Maintain the BFP website and oversee internal tech infrastructure",
      "Manage the community of volunteer builders and developers",
      "Coordinate Mentors (internal officers or external) for event meetups",
      "Assign external volunteers as PICs (Persons In Charge) for NGO projects",
    ],
    roleQuestions: [
      "How would you evaluate a volunteer builder's skill level to match them with the right NGO project?",
      "Describe your approach to managing and motivating a volunteer team of developers.",
    ],
    filled: false,
  },
  {
    id: "tech-officer",
    department: "Tech",
    level: "officer",
    title: "Tech Officer",
    commitment: "3–5 hrs / week",
    summary:
      "Build and maintain BFP's tools, and help volunteer builders ship for NGOs.",
    responsibilities: [
      "Help maintain and improve the BFP website and internal tools",
      "Triage issues, review small PRs, and ship fixes and features",
      "Support onboarding of volunteer builders into NGO projects",
      "Handle meetup tech logistics (demos, AV, showcases)",
    ],
    roleQuestions: [
      "Share your GitHub or a project you've built — which part are you most proud of and why?",
      "Tell us about a bug or technical problem you debugged — how did you track it down?",
    ],
    filled: false,
  },
];

export const POSITION_IDS = POSITIONS.map((p) => p.id);

export function getPosition(id: string): Position | undefined {
  return POSITIONS.find((p) => p.id === id);
}

export function positionTitle(id: string): string {
  return getPosition(id)?.title ?? id;
}

export function rankLabel(rank: number): string {
  return ["1st", "2nd", "3rd"][rank] ?? `${rank + 1}th`;
}

export function secondaryChoiceQuestion(rank: number, title: string): string {
  return `Why is ${title} your ${rankLabel(rank)} choice?`;
}
