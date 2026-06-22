import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

// ── Recruitment / core-team API (owner-only, via convex/http.ts) ───────────────
// These are INTERNAL functions: never exposed on the public Convex API. They are
// reachable only through the owner-gated HTTP routes in convex/http.ts (which
// require the OWNER_API_SECRET env secret or an owner-flagged API key), because
// the `volunteers` table holds applicant PII (emails, phone, motivations).

const recruitStatus = v.union(
  v.literal("applied"),
  v.literal("shortlisted"),
  v.literal("invite_sent"),
  v.literal("interview_scheduled"),
  v.literal("interviewed"),
  v.literal("offered"),
  v.literal("accepted"),
  v.literal("declined"),
  v.literal("not_shortlisted"),
);

const applicantStatus = v.union(
  v.literal("new"),
  v.literal("contacted"),
  v.literal("accepted"),
  v.literal("declined"),
);

// Patch only provided fields (same idiom as outreach.ts / admin.updateRecruitment).
function definedFields<T extends Record<string, unknown>>(fields: T) {
  return Object.fromEntries(
    Object.entries(fields).filter(([, value]) => value !== undefined),
  );
}

// Shape returned to API callers — the full applicant + recruitment pipeline.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapApplicant(a: any) {
  return {
    id: a._id,
    createdAt: a._creationTime,
    name: a.name,
    email: a.email,
    phone: a.phone,
    country: a.country,
    city: a.city,
    linkedin: a.linkedin,
    portfolio: a.portfolio,
    github: a.github,
    about: a.about,
    motivation: a.motivation,
    roles: a.roles,
    positions: a.positions,
    positionAnswers: a.positionAnswers,
    hoursPerWeek: a.hoursPerWeek,
    canCommit: a.canCommit,
    // recruitment pipeline
    recruitStatus: a.recruitStatus,
    shortlistedPositions: a.shortlistedPositions,
    finalOffer: a.finalOffer,
    potential: a.potential,
    interviewer: a.interviewer,
    interviewSlot: a.interviewSlot,
    meetLink: a.meetLink,
    inviteEmailSentAt: a.inviteEmailSentAt,
    // role-specific extras
    builderLevel: a.builderLevel,
    builderProject: a.builderProject,
    builderSkills: a.builderSkills,
    builderGithub: a.builderGithub,
    advocateFormats: a.advocateFormats,
    advocateLanguages: a.advocateLanguages,
    advocateSamples: a.advocateSamples,
    organizerMode: a.organizerMode,
    organizerCity: a.organizerCity,
    organizerExperience: a.organizerExperience,
    referralSource: a.referralSource,
    status: a.status,
    notes: a.notes,
    hidden: a.hidden ?? false,
  };
}

export const apiListApplicants = internalQuery({
  args: {
    includeHidden: v.optional(v.boolean()),
    status: v.optional(applicantStatus),
    recruitStatus: v.optional(recruitStatus),
    position: v.optional(v.string()),
  },
  handler: async (ctx, { includeHidden, status, recruitStatus, position }) => {
    const all = await ctx.db.query("volunteers").order("desc").collect();
    return all
      .filter((a) => (includeHidden ? true : !a.hidden))
      .filter((a) => (status ? a.status === status : true))
      .filter((a) => (recruitStatus ? a.recruitStatus === recruitStatus : true))
      .filter((a) =>
        position
          ? (a.positions ?? []).includes(position) ||
            (a.shortlistedPositions ?? []).includes(position) ||
            a.finalOffer === position
          : true,
      )
      .map(mapApplicant);
  },
});

export const apiGetApplicant = internalQuery({
  args: { id: v.id("volunteers") },
  handler: async (ctx, { id }) => {
    const a = await ctx.db.get(id);
    return a ? mapApplicant(a) : null;
  },
});

export const apiUpdateRecruitment = internalMutation({
  args: {
    id: v.id("volunteers"),
    recruitStatus: v.optional(recruitStatus),
    shortlistedPositions: v.optional(v.array(v.string())),
    finalOffer: v.optional(v.string()),
    potential: v.optional(
      v.union(v.literal("low"), v.literal("moderate"), v.literal("high")),
    ),
    interviewer: v.optional(v.string()),
    interviewSlot: v.optional(v.string()),
    meetLink: v.optional(v.string()),
    inviteEmailSentAt: v.optional(v.number()),
    status: v.optional(applicantStatus),
    notes: v.optional(v.string()),
    hidden: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error(`Applicant ${id} not found`);
    await ctx.db.patch(id, definedFields(fields));
  },
});
