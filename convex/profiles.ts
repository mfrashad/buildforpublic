import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    return await ctx.db
      .query("profiles")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .unique();
  },
});

export const upsert = mutation({
  args: {
    clerkId: v.string(),
    name: v.optional(v.string()),
    bio: v.optional(v.string()),
    github: v.optional(v.string()),
    instagram: v.optional(v.string()),
    linkedin: v.optional(v.string()),
    twitter: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
    causes: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        bio: args.bio,
        github: args.github,
        instagram: args.instagram,
        linkedin: args.linkedin,
        twitter: args.twitter,
        skills: args.skills,
        causes: args.causes,
      });
      return existing._id;
    } else {
      return await ctx.db.insert("profiles", args);
    }
  },
});
