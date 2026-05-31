import { internalAction } from "./_generated/server";
import { v } from "convex/values";

export const sendVolunteerNotification = internalAction({
  args: {
    name: v.string(),
    email: v.string(),
    roles: v.array(v.string()),
    country: v.string(),
    about: v.string(),
    motivation: v.string(),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not set — skipping email notification");
      return;
    }

    const rolesStr = args.roles.join(", ");
    const html = `
      <h2>New volunteer application — Build for Public</h2>
      <p><strong>Name:</strong> ${args.name}</p>
      <p><strong>Email:</strong> ${args.email}</p>
      <p><strong>Country:</strong> ${args.country}</p>
      <p><strong>Roles:</strong> ${rolesStr}</p>
      <hr />
      <p><strong>About:</strong></p>
      <p>${args.about}</p>
      <p><strong>Motivation:</strong></p>
      <p>${args.motivation}</p>
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
        subject: `New volunteer: ${args.name} (${rolesStr})`,
        html,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Resend error:", res.status, body);
    }
  },
});
