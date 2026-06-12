import { getPosition, positionTitle } from "@/lib/positions";

export const DEFAULT_INVITE_SUBJECT_TEMPLATE =
  "Build for Public - Interview Invitation";

export const DEFAULT_INVITE_BODY_TEMPLATE = `Dear {{name}},

Thank you for your interest in joining the core team at Build for Public! We were impressed with your application and would love to invite you for an interview to learn more about your experience, your motivation, and how you can contribute to the community.

Please select a time that works best for you using the link below:
{{bookingLink}}

Interview Details:
- Date: {{dateRange}}
- Duration: {{duration}}
- Platform: {{platform}}

You have been shortlisted for the following position(s):
{{positionsList}}

During the interview, we'll discuss:
- Your background and motivations for joining BFP
- Your skills and experience relevant to the role
- What to expect from the position and the community
- Any questions you might have for us

In case you'd like a refresher on who we are: Build for Public is a community of volunteer builders shipping open-source software for NGOs, nonprofits, and communities that private capital won't serve.
- Website: https://buildforpublic.com
- The LinkedIn post you likely found us through: https://www.linkedin.com/posts/mfathyrashad_build-for-public-open-source-tech-for-the-share-7468574544933535744-B2am/

Please try to schedule your interview by {{deadline}}. If you are unable to find a suitable slot, just reply directly to this email, and we'll do our best to accommodate you.

Looking forward to speaking with you soon!

Best regards,

{{senderName}}
{{senderTitle}}
Build for Public`;

export const INVITE_TEMPLATE_TOKENS = [
  "{{name}}",
  "{{email}}",
  "{{positions}}",
  "{{positionsList}}",
  "{{bookingLink}}",
  "{{dateRange}}",
  "{{deadline}}",
  "{{duration}}",
  "{{platform}}",
  "{{meetLink}}",
  "{{interviewSlot}}",
  "{{senderName}}",
  "{{senderTitle}}",
];

export interface InviteEmailInput {
  name: string;
  email?: string;
  positionIds: string[];
  bookingLink: string;
  dateRange: string;
  deadline: string;
  duration: string;
  platform: string;
  meetLink?: string;
  interviewSlot?: string;
  senderName: string;
  senderTitle: string;
  subjectTemplate?: string;
  bodyTemplate?: string;
  /** Per-position summary overrides (positionId → text); falls back to the catalog summary. */
  summaryOverrides?: Record<string, string>;
}

function or(value: string | undefined, placeholder: string) {
  return value?.trim() || placeholder;
}

function renderTemplate(template: string, input: InviteEmailInput) {
  const titles = input.positionIds.length
    ? input.positionIds.map(positionTitle)
    : ["[Position]"];
  // "- Title — one-sentence description" per shortlisted position
  const overrides = input.summaryOverrides ?? {};
  const positionsList = input.positionIds.length
    ? input.positionIds
        .map((id) => {
          const position = getPosition(id);
          if (!position) return `- ${id}`;
          const summary = overrides[id]?.trim() || position.summary;
          return `- ${position.title} — ${summary}`;
        })
        .join("\n")
    : "- [Position]";
  const replacements: Record<string, string> = {
    "{{name}}": or(input.name, "[Applicant's Name]"),
    "{{email}}": or(input.email, "[Applicant Email]"),
    "{{positions}}": titles.join(", "),
    "{{positionsList}}": positionsList,
    "{{bookingLink}}": or(input.bookingLink, "[Insert Calendly/Booking Link]"),
    "{{dateRange}}": or(input.dateRange, "[Insert Date Range]"),
    "{{deadline}}": or(input.deadline, "[Insert Deadline Date/Time]"),
    "{{duration}}": or(input.duration, "30 minutes"),
    "{{platform}}": or(input.platform, "Google Meet"),
    "{{meetLink}}": or(input.meetLink, "[Google Meet link]"),
    "{{interviewSlot}}": or(input.interviewSlot, "[Interview Slot]"),
    "{{senderName}}": or(input.senderName, "[Your Name]"),
    "{{senderTitle}}": or(input.senderTitle, "[Your Title/Role]"),
  };

  return Object.entries(replacements).reduce(
    (text, [token, value]) => text.split(token).join(value),
    template,
  );
}

export function buildInviteEmail(input: InviteEmailInput): {
  subject: string;
  body: string;
} {
  return {
    subject: renderTemplate(
      input.subjectTemplate || DEFAULT_INVITE_SUBJECT_TEMPLATE,
      input,
    ),
    body: renderTemplate(input.bodyTemplate || DEFAULT_INVITE_BODY_TEMPLATE, input),
  };
}
