import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    country: v.string(),
    city: v.optional(v.string()),
    bio: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
    causes: v.optional(v.array(v.string())),
    linkedin: v.optional(v.string()),
    github: v.optional(v.string()),
    twitter: v.optional(v.string()),
    instagram: v.optional(v.string()),
    isPublic: v.optional(v.boolean()),
    imageUrl: v.optional(v.string()),
    currentStatus: v.optional(v.union(v.literal("student"), v.literal("working"))),
    university: v.optional(v.string()),
    company: v.optional(v.string()),
    position: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!/^\S+@\S+\.\S+$/.test(args.email))
      throw new ConvexError("Invalid email address.");
    if (!args.name.trim())
      throw new ConvexError("Name is required.");

    const identity = await ctx.auth.getUserIdentity();
    const clerkId = identity?.tokenIdentifier ?? undefined;
    const email = args.email.trim().toLowerCase();

    const fields = {
      name: args.name.trim(),
      email,
      country: args.country.trim(),
      city: args.city || undefined,
      bio: args.bio?.trim() || undefined,
      skills: args.skills?.length ? args.skills : undefined,
      causes: args.causes?.length ? args.causes : undefined,
      linkedin: args.linkedin || undefined,
      github: args.github || undefined,
      twitter: args.twitter || undefined,
      instagram: args.instagram || undefined,
      isPublic: args.isPublic !== false,
      imageUrl: args.imageUrl || undefined,
      clerkId,
      currentStatus: args.currentStatus,
      university: args.university || undefined,
      company: args.company || undefined,
      position: args.position || undefined,
    };

    // Upsert — find by clerkId first, fall back to email
    const byClerk = clerkId
      ? await ctx.db.query("members").withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId)).unique()
      : null;
    const existing = byClerk
      ?? await ctx.db.query("members").withIndex("by_email", (q) => q.eq("email", email)).unique();

    if (existing) {
      await ctx.db.patch(existing._id, fields);
      return { ok: true, id: existing._id };
    }

    const id = await ctx.db.insert("members", fields);
    return { ok: true, id };
  },
});

export const getByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    return await ctx.db
      .query("members")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .unique();
  },
});

// Public-safe member shape — strips email
type PublicMember = {
  _id: string;
  _creationTime: number;
  name: string;
  country: string;
  city?: string;
  bio?: string;
  skills?: string[];
  imageUrl?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
};

export const patchImageUrl = mutation({
  args: { clerkId: v.string(), imageUrl: v.string() },
  handler: async (ctx, { clerkId, imageUrl }) => {
    const doc = await ctx.db
      .query("members")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .unique();
    if (doc) await ctx.db.patch(doc._id, { imageUrl });
  },
});

export const countPublic = query({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db.query("members").collect();
    return docs.filter((doc) => doc.name && doc.name !== "Member").length;
  },
});

export const listPublic = query({
  args: {},
  handler: async (ctx): Promise<PublicMember[]> => {
    const docs = await ctx.db
      .query("members")
      .withIndex("by_public", (q) => q.eq("isPublic", true))
      .order("desc")
      .take(500);

    return docs.filter((doc) => doc.name && doc.name !== "Member").map((doc) => ({
      _id: doc._id,
      _creationTime: doc._creationTime,
      name: doc.name,
      country: doc.country,
      city: doc.city,
      bio: doc.bio,
      skills: doc.skills,
      imageUrl: doc.imageUrl,
      linkedin: doc.linkedin,
      github: doc.github,
      twitter: doc.twitter,
    }));
  },
});
