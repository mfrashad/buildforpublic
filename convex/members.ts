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
  },
  handler: async (ctx, args) => {
    if (!/^\S+@\S+\.\S+$/.test(args.email))
      throw new ConvexError("Invalid email address.");
    if (!args.name.trim())
      throw new ConvexError("Name is required.");

    // Prevent duplicate email registrations
    const existing = await ctx.db
      .query("members")
      .withIndex("by_email", (q) => q.eq("email", args.email.trim().toLowerCase()))
      .unique();
    if (existing) throw new ConvexError("This email is already registered.");

    // Link to Clerk identity if the user is authenticated
    const identity = await ctx.auth.getUserIdentity();
    const clerkId = identity?.tokenIdentifier ?? undefined;

    const id = await ctx.db.insert("members", {
      name: args.name.trim(),
      email: args.email.trim().toLowerCase(),
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
      clerkId,
    });

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
  linkedin?: string;
  github?: string;
  twitter?: string;
};

export const listPublic = query({
  args: {},
  handler: async (ctx): Promise<PublicMember[]> => {
    const docs = await ctx.db
      .query("members")
      .withIndex("by_public", (q) => q.eq("isPublic", true))
      .order("desc")
      .take(500);

    return docs.map((doc) => ({
      _id: doc._id,
      _creationTime: doc._creationTime,
      name: doc.name,
      country: doc.country,
      city: doc.city,
      bio: doc.bio,
      skills: doc.skills,
      linkedin: doc.linkedin,
      github: doc.github,
      twitter: doc.twitter,
    }));
  },
});
