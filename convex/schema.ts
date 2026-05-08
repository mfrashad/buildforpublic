import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  volunteers: defineTable({
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
      v.union(
        v.literal("have"),
        v.literal("match"),
        v.literal("either"),
      ),
    ),
    builderProject: v.optional(v.string()),
    builderSkills: v.optional(v.array(v.string())),
    builderGithub: v.optional(v.string()),

    advocateFormats: v.optional(v.array(v.string())),
    advocateLanguages: v.optional(v.array(v.string())),
    advocateSamples: v.optional(v.string()),

    organizerMode: v.optional(
      v.union(
        v.literal("in-person"),
        v.literal("online"),
        v.literal("both"),
      ),
    ),
    organizerCity: v.optional(v.string()),
    organizerExperience: v.optional(v.string()),

    acknowledgesUnpaid: v.boolean(),
    referralSource: v.optional(v.string()),
    notes: v.optional(v.string()),

    status: v.union(
      v.literal("new"),
      v.literal("contacted"),
      v.literal("accepted"),
      v.literal("declined"),
    ),
  })
    .index("by_email", ["email"])
    .index("by_status", ["status"]),
});
