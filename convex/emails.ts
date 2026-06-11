import { internalAction } from "./_generated/server";
import { v } from "convex/values";

export const sendVolunteerNotification = internalAction({
  args: {
    name: v.string(),
    email: v.string(),
    positions: v.array(v.string()),
    country: v.string(),
    about: v.string(),
    motivation: v.string(),
    answers: v.optional(
      v.array(
        v.object({
          position: v.string(),
          question: v.string(),
          answer: v.string(),
        }),
      ),
    ),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not set — skipping email notification");
      return;
    }

    const positionsStr = args.positions.join(", ");
    const answersHtml = (args.answers ?? [])
      .map(
        (a) => `
      <p><strong>[${a.position}] ${a.question}</strong></p>
      <p>${a.answer}</p>`,
      )
      .join("");
    const html = `
      <h2>New core-team application — Build for Public</h2>
      <p><strong>Name:</strong> ${args.name}</p>
      <p><strong>Email:</strong> ${args.email}</p>
      <p><strong>Country:</strong> ${args.country}</p>
      <p><strong>Positions:</strong> ${positionsStr}</p>
      <hr />
      <p><strong>About:</strong></p>
      <p>${args.about}</p>
      <p><strong>Motivation:</strong></p>
      <p>${args.motivation}</p>
      ${answersHtml ? `<hr />${answersHtml}` : ""}
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Build for Public <noreply@buildforpublic.com>",
        to: ["m.fathyrashad@gmail.com"],
        subject: `New core-team application: ${args.name} (${positionsStr})`,
        html,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Resend error:", res.status, body);
    }
  },
});

export const sendProjectRequestNotification = internalAction({
  args: {
    contactName: v.string(),
    contactEmail: v.string(),
    orgName: v.string(),
    country: v.string(),
    projectType: v.optional(v.string()),
    problem: v.string(),
    whoItHelps: v.optional(v.string()),
    materialsLink: v.optional(v.string()),
    instagram: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not set — skipping email notification");
      return;
    }

    const typeLabel = args.projectType === "website"
      ? "Website / landing page"
      : args.projectType === "custom"
      ? "Custom tool / app / platform"
      : args.projectType === "other"
      ? "Other"
      : "Not specified";

    const html = `
      <h2>New project request — Build for Public</h2>
      <p><strong>Contact:</strong> ${args.contactName} (${args.contactEmail})</p>
      <p><strong>Organisation:</strong> ${args.orgName}</p>
      <p><strong>Country:</strong> ${args.country}</p>
      <p><strong>Project type:</strong> ${typeLabel}</p>
      <hr />
      <p><strong>${args.projectType === "website" ? "About the org / site goal" : "Problem"}:</strong></p>
      <p>${args.problem}</p>
      ${args.whoItHelps ? `<p><strong>Who it helps:</strong></p><p>${args.whoItHelps}</p>` : ""}
      ${args.materialsLink ? `<p><strong>Materials link (copy + photos):</strong> <a href="${args.materialsLink}">${args.materialsLink}</a></p>` : ""}
      ${args.instagram ? `<p><strong>Instagram:</strong> ${args.instagram}</p>` : ""}
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Build for Public <noreply@buildforpublic.com>",
        to: ["m.fathyrashad@gmail.com"],
        subject: `New project request: ${args.orgName} — ${args.contactName}`,
        html,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Resend error:", res.status, body);
    }
  },
});
