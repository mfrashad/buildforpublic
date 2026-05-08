import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    country: v.string(),
    city: v.optional(v.string()),
    linkedin: v.optional(v.string()),
    portfolio: v.optional(v.string()),

    about: v.string(),
    motivation: v.string(),

    roles: v.array(
      v.union(
        v.literal("builder"),
        v.literal("advocate"),
        v.literal("organizer"),
      ),
    ),

    builderLevel: v.optional(v.string()),
    builderIdea: v.optional(
      v.union(v.literal("have"), v.literal("match"), v.literal("either")),
    ),
    builderProject: v.optional(v.string()),
    builderSkills: v.optional(v.array(v.string())),
    builderGithub: v.optional(v.string()),

    advocateFormats: v.optional(v.array(v.string())),
    advocateLanguages: v.optional(v.array(v.string())),
    advocateSamples: v.optional(v.string()),

    organizerMode: v.optional(
      v.union(v.literal("in-person"), v.literal("online"), v.literal("both")),
    ),
    organizerCity: v.optional(v.string()),
    organizerExperience: v.optional(v.string()),

    acknowledgesUnpaid: v.boolean(),
    referralSource: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!/^\S+@\S+\.\S+$/.test(args.email))
      throw new ConvexError("Invalid email address.");
    if (args.roles.length === 0)
      throw new ConvexError("At least one role is required.");
    if (!args.acknowledgesUnpaid)
      throw new ConvexError("You must acknowledge this is a volunteer role.");
    if (args.about.length < 20)
      throw new ConvexError("Please tell us more about yourself (20 chars min).");
    if (args.motivation.length < 20)
      throw new ConvexError("Please share more about your motivation (20 chars min).");

    const isBuilder = args.roles.includes("builder");
    const isAdvocate = args.roles.includes("advocate");
    const isOrganizer = args.roles.includes("organizer");

    const id = await ctx.db.insert("volunteers", {
      name: args.name.trim(),
      email: args.email.trim().toLowerCase(),
      phone: args.phone || undefined,
      country: args.country.trim(),
      city: args.city || undefined,
      linkedin: args.linkedin || undefined,
      portfolio: args.portfolio || undefined,
      about: args.about.trim(),
      motivation: args.motivation.trim(),
      roles: args.roles,
      acknowledgesUnpaid: args.acknowledgesUnpaid,
      referralSource: args.referralSource || undefined,
      notes: args.notes || undefined,
      status: "new",
      ...(isBuilder
        ? {
            builderLevel: args.builderLevel || undefined,
            builderIdea: args.builderIdea,
            builderProject: args.builderProject || undefined,
            builderSkills: args.builderSkills,
            builderGithub: args.builderGithub || undefined,
          }
        : {}),
      ...(isAdvocate
        ? {
            advocateFormats: args.advocateFormats,
            advocateLanguages: args.advocateLanguages,
            advocateSamples: args.advocateSamples || undefined,
          }
        : {}),
      ...(isOrganizer
        ? {
            organizerMode: args.organizerMode,
            organizerCity: args.organizerCity || undefined,
            organizerExperience: args.organizerExperience || undefined,
          }
        : {}),
    });

    return { ok: true, id };
  },
});
