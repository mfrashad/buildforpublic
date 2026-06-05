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

    projectType: v.optional(
      v.union(v.literal("website"), v.literal("custom"), v.literal("other")),
    ),
    problem: v.string(),
    whoItHelps: v.optional(v.string()),
    currentSolution: v.optional(v.string()),
    idealOutcome: v.optional(v.string()),
    timeline: v.optional(v.string()),
    budget: v.optional(v.string()),
    materialsLink: v.optional(v.string()),
    instagram: v.optional(v.string()),

    acknowledgesOpenSource: v.optional(v.boolean()),
    referralSource: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!/^\S+@\S+\.\S+$/.test(args.contactEmail))
      throw new ConvexError("Invalid email address.");
    // For non-website paths enforce a meaningful problem description
    if (args.projectType !== "website" && args.problem.trim().length < 20)
      throw new ConvexError("Please describe the problem in more detail (20 chars min).");
    if (!args.problem.trim())
      throw new ConvexError("This field is required.");

    const id = await ctx.db.insert("projectRequests", {
      contactName: args.contactName.trim(),
      contactEmail: args.contactEmail.trim().toLowerCase(),
      orgName: args.orgName.trim(),
      orgWebsite: args.orgWebsite || undefined,
      orgType: args.orgType || undefined,
      country: args.country.trim(),
      projectType: args.projectType || undefined,
      problem: args.problem.trim(),
      whoItHelps: args.whoItHelps?.trim() || undefined,
      currentSolution: args.currentSolution || undefined,
      idealOutcome: args.idealOutcome || undefined,
      timeline: args.timeline || undefined,
      budget: args.budget || undefined,
      materialsLink: args.materialsLink || undefined,
      instagram: args.instagram || undefined,
      acknowledgesOpenSource: args.acknowledgesOpenSource ?? undefined,
      referralSource: args.referralSource || undefined,
      notes: args.notes || undefined,
      status: "new",
    });

    await ctx.scheduler.runAfter(0, internal.emails.sendProjectRequestNotification, {
      contactName: args.contactName.trim(),
      contactEmail: args.contactEmail.trim().toLowerCase(),
      orgName: args.orgName.trim(),
      country: args.country.trim(),
      projectType: args.projectType || undefined,
      problem: args.problem.trim(),
      whoItHelps: args.whoItHelps?.trim() || undefined,
      materialsLink: args.materialsLink || undefined,
      instagram: args.instagram || undefined,
    });

    return { ok: true, id };
  },
});
