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

    acknowledgesUnpaid: v.optional(v.boolean()),
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

  opportunities: defineTable({
    kind: v.union(
      v.literal("ngo_request"),
      v.literal("project_idea"),
      v.literal("oss_project"),
      v.literal("community_project"),
    ),
    title: v.string(),
    summary: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("published"),
      v.literal("archived"),
    ),
    tags: v.optional(v.array(v.string())),
    link: v.optional(v.string()),
    repoLink: v.optional(v.string()),
    accent: v.optional(
      v.union(
        v.literal("yellow"),
        v.literal("blue"),
        v.literal("mint"),
        v.literal("peach"),
        v.literal("purple"),
        v.literal("orange"),
      ),
    ),
    orgName: v.optional(v.string()),
    skillsNeeded: v.optional(v.array(v.string())),
    difficulty: v.optional(
      v.union(
        v.literal("beginner"),
        v.literal("intermediate"),
        v.literal("advanced"),
      ),
    ),
    featured: v.optional(v.boolean()),
    officialBFP: v.optional(v.boolean()),
    submitterName: v.optional(v.string()),
    submitterEmail: v.optional(v.string()),
    submitterRequestId: v.optional(v.string()),
  })
    .index("by_status", ["status"])
    .index("by_status_and_kind", ["status", "kind"]),

  members: defineTable({
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
    clerkId: v.optional(v.string()),
    currentStatus: v.optional(v.union(v.literal("student"), v.literal("working"))),
    university: v.optional(v.string()),
    company: v.optional(v.string()),
    position: v.optional(v.string()),
  })
    .index("by_email", ["email"])
    .index("by_public", ["isPublic"])
    .index("by_country", ["country"])
    .index("by_clerk_id", ["clerkId"]),

  projectRequests: defineTable({
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
    whoItHelps: v.optional(v.string()),
    currentSolution: v.optional(v.string()),
    idealOutcome: v.optional(v.string()),
    timeline: v.optional(v.string()),
    budget: v.optional(v.string()),
    projectType: v.optional(
      v.union(
        v.literal("website"),
        v.literal("custom"),
        v.literal("other"),
      ),
    ),
    materialsLink: v.optional(v.string()),
    instagram: v.optional(v.string()),
    acknowledgesOpenSource: v.optional(v.boolean()),
    referralSource: v.optional(v.string()),
    notes: v.optional(v.string()),
    status: v.union(
      v.literal("new"),
      v.literal("contacted"),
      v.literal("accepted"),
      v.literal("declined"),
    ),
  })
    .index("by_status", ["status"])
    .index("by_email", ["contactEmail"]),

  profiles: defineTable({
    clerkId: v.string(),
    name: v.optional(v.string()),
    bio: v.optional(v.string()),
    instagram: v.optional(v.string()),
    linkedin: v.optional(v.string()),
    twitter: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
    causes: v.optional(v.array(v.string())),
  }).index("by_clerk_id", ["clerkId"]),

  eventRsvps: defineTable({
    eventSlug: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    clerkId: v.optional(v.string()),
  })
    .index("by_event", ["eventSlug"])
    .index("by_email_and_event", ["email", "eventSlug"]),
});
