// Cold-DM / outreach message templates for the admin outreach tabs.
//
// These are starting points: pick one in the dashboard, it fills the message
// field with {recipient} replaced by the venue/org name, then you personalise
// the bracketed bits before recording what you actually sent.
//
// Sender details ({sender_name}, {sender_phone}, {sender_email},
// {sender_linkedin}) are auto-filled from whoever the record is assigned to —
// see resolveSender() in app/admin/tabs/outreachShared.tsx. When a record is
// unassigned they fall back to DEFAULT_SENDER (the project owner).

import { BRIEF_SAMPLES } from "./constants";

const SAMPLE_LINKS = BRIEF_SAMPLES.map((s) => s.url).join("\n");

export type OutreachTemplate = {
  id: string;
  label: string; // shown in the picker
  channel: string; // suggested channel
  subject?: string; // for email templates
  body: string; // {recipient} + {sender_*} tokens are filled in at insert time
};

/** Who the message is being sent as. Resolved from the record's assignee. */
export type Sender = {
  name: string;
  email: string;
  phone?: string;
  linkedin?: string; // handle or URL, e.g. "linkedin.com/in/mfathyrashad"
};

/** Fallback sender (project owner) used when a record has no assignee. */
export const DEFAULT_SENDER: Sender = {
  name: "Rashad",
  email: "m.fathyrashad@gmail.com",
  phone: "+60 11-6227 1261",
  linkedin: "linkedin.com/in/mfathyrashad",
};

// Sign-off blocks built from {sender_*} tokens. A line whose only content is a
// missing optional field (phone / linkedin) is dropped by fillTemplate().
const SIGNATURE = `{sender_name}
{sender_phone}
{sender_email}`;

const SIGNATURE_NGO = `{sender_name}
Build for Public
{sender_email}`;

// ── Venue outreach ───────────────────────────────────────────────────────────

export const VENUE_TEMPLATES: OutreachTemplate[] = [
  {
    id: "venue_cafe_ig",
    label: "Cafe — Instagram / Threads DM (personalised)",
    channel: "Instagram / Threads",
    body: `Hi {recipient}! 👋 saw your post on hosting community event collaborations, and I'm interested to collaborate on this.

I run a non-profit community initiative called Build for Public (https://buildforpublic.com), a tech-for-good digital volunteerism initiative where people gather to co-build digital projects for local NGOs. We're looking for a venue for our first KL meetup for about 15-30 people. We're hoping to host it on Sunday, June 28th for a 3-4 hour block (looking at 11 AM - 3 PM or 12 PM - 4 PM, but fully flexible to fit around your peak hours!).

In exchange for letting us use the space for free, here's what we can offer:
☕ Customers: I'll heavily encourage all 15-30 attendees to buy food, coffee, and drinks throughout the event — a great win-win if you have quieter hours during the day!
📱 TikTok Promotion: I'm a content creator with 16K followers. My cafe posts average 100K-500K views, with over 3M cumulative views (see my work: https://www.rashadcodes.com/create). I'd love to create a dedicated photo carousel post highlighting {recipient} as our generous venue partner!
🤝 Brand Goodwill: Your space will be officially credited for supporting a local tech-for-good movement.

All we'd really need is good WiFi and plugs! Let me know if you'd be open to chatting about this?

${SIGNATURE}`,
  },
  {
    id: "venue_cafe_email",
    label: "Cafe — Email / LinkedIn (detailed)",
    channel: "Email / LinkedIn",
    subject: "Venue Partnership Inquiry: Build for Public x {recipient}",
    body: `Hi {recipient} team,

I hope you're having a great week! I'm reaching out because I love your space and wanted to propose a partnership for an upcoming social good event.

I lead Build for Public, a community initiative where volunteers gather to build projects for non-profits. We're organizing our first KL meetup on Sunday, June 28th (looking at a 3-4 hour slot between 11 AM and 4 PM). We're looking for a venue partner to host roughly 20-30 attendees, and your cafe came to mind as an ideal spot.

Since we're a non-profit initiative, we're looking to borrow a space for free, but we want to make sure it brings real value to your business in return:
• F&B Sales: We'll heavily encourage all attendees to purchase food and drinks to support you. If your cafe typically has lower traffic during the morning or mid-day, this is a perfect win-win to help fill the space with paying customers.
• Marketing & Exposure: I'm a TikTok content creator (16K followers) with a track record of viral cafe photo carousels (averaging 100K-500K views per post, over 3M cumulative views). I'd love to create a dedicated carousel post promoting your cafe as our venue partner: https://www.rashadcodes.com/create
• Social Impact: A great opportunity to align your brand with a community doing social good in KL.

Our main requirement is solid WiFi (a projector/screen would be amazing, but not strictly necessary!). Would you be open to hosting us? Happy to discuss further over DM or drop by in person.

Best,
${SIGNATURE}`,
  },
  {
    id: "venue_space_pitch",
    label: "Event / coworking space — pitch",
    channel: "Email / DM",
    subject: "Venue Sponsorship: Build for Public KL Meetup",
    body: `Hi {recipient} team,

I hope you're having a great week! I love the aesthetic of your space and wanted to see if you'd be open to a venue sponsorship for an upcoming social good event.

I lead Build for Public, a community initiative where folks gather to build tech projects for local non-profits. We're hosting our first KL meetup on Sunday, June 28th and are looking for a space to host about 20-30 volunteers for a 3-4 hour block (flexible between 11 AM and 4 PM).

Since we're a non-profit initiative, we're looking to borrow a space for free, but we want to make sure we drive real value to your business in return:
• Marketing & Exposure: I'm a TikTok content creator (16K followers) with a track record of viral venue/cafe reviews (averaging 100K-500K views per post, over 3M cumulative views). I'd love to create a dedicated carousel post highlighting your space as our generous venue partner: https://www.rashadcodes.com/create
• Direct Networking: You'll have 20-30 professionals and builders experiencing your space firsthand — a great way to generate future paid bookings or memberships.
• Brand Goodwill: Your space will be officially credited for supporting a tech-for-good movement in KL.

Our main requirement is solid WiFi (a projector/screen would be amazing to present the projects, but not strictly necessary!). Would you be open to hosting us? Happy to discuss further!

Best,
${SIGNATURE}`,
  },
  {
    id: "venue_impact_aligned",
    label: "Impact-aligned space — personalised email",
    channel: "Email",
    subject: "Venue Partnership Inquiry: Build for Public x {recipient}",
    body: `Hi {recipient} team,

I hope you're having a great week! I came across your space and absolutely loved it. Knowing your deep commitment to social impact, I wanted to reach out and see if you'd be open to a venue partnership for an upcoming tech-for-good event.

I lead Build for Public, a community initiative where volunteers gather to build tech projects for local non-profits. We're hosting our first KL meetup on Sunday, June 28th and are looking for a space to host about 20-30 volunteers for a 3-4 hour block (flexible between 11 AM and 4 PM).

Since we're a non-profit initiative, we're looking to borrow a space for free, but we want to make sure it drives real value for you in return:
• Impact Alignment: Since we're building tech infrastructure for local non-profits, hosting us directly supports the broader NGO ecosystem in Malaysia — something I know you care deeply about.
• Marketing & Exposure: I'm a TikTok content creator (16K followers) with a track record of viral venue photo carousels (averaging 100K-500K views per post, over 3M cumulative views). I'd love to create a dedicated carousel post highlighting {recipient} as a space that champions local community initiatives: https://www.rashadcodes.com/create
• Community Networking: You'll have 20-30 tech professionals and builders experiencing your space firsthand — a great way to generate future paid bookings.

Our main requirement is solid WiFi (a projector/screen to present the projects would be amazing, but not strictly necessary!). Would you be open to hosting us? Happy to discuss further!

Best,
${SIGNATURE}
LinkedIn: {sender_linkedin}`,
  },
];

// ── Non-profit outreach ──────────────────────────────────────────────────────
// Designed to mirror the public project request form (/request): it gently
// gathers the same inputs (the problem, who it helps, current solution, ideal
// outcome) and points the org to the form to formalise the request.

export const NONPROFIT_TEMPLATES: OutreachTemplate[] = [
  {
    id: "ngo_no_website_dm",
    label: "NGO — no / dead website offer (DM)",
    channel: "Instagram / WhatsApp",
    body: `Hi {recipient}! 👋 I came across your page and noticed you don't have a website yet — or the link I found wasn't working.

I run Build for Public (https://buildforpublic.com), a tech-for-good initiative where volunteer developers and designers build websites for non-profits, completely free. We'd love to build one for {recipient}: a clean, fast site to tell your story, showcase your work, and help people donate or get involved.

And the easy part for you — if writing copy feels like a lot, just point us to your Instagram and we'll pull your brand, colours, and photos from there and draft everything ourselves. Two quick examples of what helps, if you're curious:
${SAMPLE_LINKS}

No cost, no catch — our volunteers do this to give back. Want us to put something together? Reply here or fill in our short form: https://buildforpublic.com/request

Warmly,
${SIGNATURE_NGO}`,
  },
  {
    id: "ngo_dm_short",
    label: "NGO — Instagram / WhatsApp DM (short)",
    channel: "Instagram / WhatsApp",
    body: `Hi {recipient}! 👋 I came across your work and love what you're doing for the community.

I run Build for Public (https://buildforpublic.com) — a tech-for-good initiative where volunteer developers and designers build digital projects for non-profits, completely free. Think websites, internal tools, apps, dashboards, automations — whatever would actually move your mission forward.

We'd genuinely love to build something for {recipient}. To see if we're a good fit, it'd help to understand a bit about your needs:
• What's a problem or recurring task that slows your work down?
• Who would solving it help most — your team, the people you serve, or donors?
• How do you handle it today?
• What would the ideal outcome look like?

Not sure how to put it together? Here are two example briefs to follow:
${SAMPLE_LINKS}

And if writing one feels like too much — no problem at all. Just send us your Instagram and our volunteers will pull your brand style, colours, and photos from there and draft the copy themselves.

No cost, no catch — our volunteers do this to give back. If you're open to it, reply here or fill in our short project request form: https://buildforpublic.com/request

Warmly,
${SIGNATURE_NGO}`,
  },
  {
    id: "ngo_email_long",
    label: "NGO — Email (detailed, follows request form)",
    channel: "Email",
    subject: "A free digital project for {recipient} — Build for Public",
    body: `Hi {recipient} team,

I hope you're doing well! I'm reaching out because I admire the work you do, and I'd love to offer you something at no cost.

I lead Build for Public (https://buildforpublic.com), a tech-for-good community where volunteer developers, designers, and builders create digital projects for non-profits for free — websites, internal tools, apps, dashboards, automations, and more. Our goal is simply to help local NGOs do more with better digital tools.

We'd love to build something for {recipient}. To match you with the right volunteer team, it helps to understand your needs:
• The problem: What's a task or challenge that currently takes too much time, or holds your work back?
• Who it helps: Who would benefit most — your team, the people you serve, or your donors/volunteers?
• Today: How do you handle this right now (a spreadsheet, manually, or not at all)?
• Ideal outcome: If this were solved, what would "great" look like?

Not sure how to write it up? Here are two example briefs other orgs sent us, so you can see what's helpful:
${SAMPLE_LINKS}

And if putting a doc together feels like too much, that's completely fine — just point us to your Instagram (or any social account you're happy with) and our volunteers will source your brand style, colours, and photos from there and draft the copy for you. We'll refine it together.

If anything comes to mind, just reply — or you can fill in our short project request form and we'll follow up: https://buildforpublic.com/request

There's no cost and no catch; our volunteers do this to give back to the community.

Warmly,
${SIGNATURE}
LinkedIn: {sender_linkedin}`,
  },
];

/**
 * Fill {recipient} and the {sender_*} tokens. A line whose only meaningful
 * content is an empty optional sender field (phone / linkedin) is dropped, so
 * senders without a phone or LinkedIn don't leave blank lines in the sign-off.
 */
export function fillTemplate(
  body: string,
  recipient: string,
  sender: Sender = DEFAULT_SENDER,
): string {
  const kept = body.split("\n").filter((line) => {
    if (line.includes("{sender_phone}") && !sender.phone?.trim()) return false;
    if (line.includes("{sender_linkedin}") && !sender.linkedin?.trim()) return false;
    return true;
  });
  return kept
    .join("\n")
    .replace(/\{recipient\}/g, recipient || "there")
    .replace(/\{sender_name\}/g, sender.name)
    .replace(/\{sender_email\}/g, sender.email)
    .replace(/\{sender_phone\}/g, sender.phone ?? "")
    .replace(/\{sender_linkedin\}/g, sender.linkedin ?? "");
}
