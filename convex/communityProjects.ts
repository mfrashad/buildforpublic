import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";

export const create = mutation({
  args: {
    title: v.string(),
    summary: v.string(),
    description: v.string(),
    submitterName: v.string(),
    submitterEmail: v.string(),
    link: v.optional(v.string()),
    repoLink: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    skillsNeeded: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    if (!/^\S+@\S+\.\S+$/.test(args.submitterEmail))
      throw new ConvexError("Invalid email address.");
    if (!args.title.trim())
      throw new ConvexError("Project name is required.");
    if (args.description.trim().length < 20)
      throw new ConvexError("Please describe the project in more detail (20 chars min).");

    const id = await ctx.db.insert("opportunities", {
      kind: "community_project",
      title: args.title.trim(),
      summary: args.summary.trim(),
      description: args.description.trim(),
      submitterName: args.submitterName.trim(),
      submitterEmail: args.submitterEmail.trim().toLowerCase(),
      link: args.link || undefined,
      repoLink: args.repoLink || undefined,
      tags: args.tags?.length ? args.tags : undefined,
      skillsNeeded: args.skillsNeeded?.length ? args.skillsNeeded : undefined,
      accent: "orange",
      status: "draft",  // requires manual approval before appearing on the board
      officialBFP: false,
    });

    return { ok: true, id };
  },
});
