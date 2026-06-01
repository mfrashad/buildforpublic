import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const join = mutation({
  args: {
    eventSlug: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("eventRsvps")
      .withIndex("by_email_and_event", (q) =>
        q.eq("email", args.email).eq("eventSlug", args.eventSlug)
      )
      .first();

    if (existing) return { status: "already_registered" as const };

    const identity = await ctx.auth.getUserIdentity();

    await ctx.db.insert("eventRsvps", {
      eventSlug: args.eventSlug,
      email: args.email,
      name: args.name,
      clerkId: identity?.subject,
    });

    return { status: "ok" as const };
  },
});

export const count = query({
  args: { eventSlug: v.string() },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("eventRsvps")
      .withIndex("by_event", (q) => q.eq("eventSlug", args.eventSlug))
      .collect();
    return rows.length;
  },
});
