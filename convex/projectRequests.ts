import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { internal } from "./_generated/api";

export const create = mutation({
  args: {
    contactName: v.string(),
    contactEmail: v.string(),
    orgName: v.string(),
    orgWebsite: v.optional(v.string()),
    orgType: v.optional(
      v.union(
        v.literal("ngo"),
        v.literal("nonprofit"),
        v.literal("public-sector"),
        v.literal("community"),
        v.literal("other"),
      ),
    ),
    country: v.string(),

    problem: v.string(),
    whoItHelps: v.string(),
    currentSolution: v.optional(v.string()),
    idealOutcome: v.optional(v.string()),
    timeline: v.optional(v.string()),
    budget: v.optional(v.string()),

    acknowledgesOpenSource: v.boolean(),
    referralSource: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!/^\S+@\S+\.\S+$/.test(args.contactEmail))
      throw new ConvexError("Invalid email address.");
    if (!args.acknowledgesOpenSource)
      throw new ConvexError("You must acknowledge the open-source terms.");
    if (args.problem.trim().length < 20)
      throw new ConvexError("Please describe the problem in more detail (20 chars min).");
    if (!args.whoItHelps.trim())
      throw new ConvexError("Please describe who this helps.");

    const id = await ctx.db.insert("projectRequests", {
      contactName: args.contactName.trim(),
      contactEmail: args.contactEmail.trim().toLowerCase(),
      orgName: args.orgName.trim(),
      orgWebsite: args.orgWebsite || undefined,
      orgType: args.orgType || undefined,
      country: args.country.trim(),
      problem: args.problem.trim(),
      whoItHelps: args.whoItHelps.trim(),
      currentSolution: args.currentSolution || undefined,
      idealOutcome: args.idealOutcome || undefined,
      timeline: args.timeline || undefined,
      budget: args.budget || undefined,
      acknowledgesOpenSource: args.acknowledgesOpenSource,
      referralSource: args.referralSource || undefined,
      notes: args.notes || undefined,
      status: "new",
    });

    await ctx.scheduler.runAfter(0, internal.emails.sendProjectRequestNotification, {
      contactName: args.contactName.trim(),
      contactEmail: args.contactEmail.trim().toLowerCase(),
      orgName: args.orgName.trim(),
      country: args.country.trim(),
      problem: args.problem.trim(),
      whoItHelps: args.whoItHelps.trim(),
    });

    return { ok: true, id };
  },
});
