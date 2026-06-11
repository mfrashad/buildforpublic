import { ConvexError, v } from "convex/values";
import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";

// ── Auth guard ────────────────────────────────────────────────────────────────
// Requires the Clerk "convex" JWT template to include: { "role": "{{user.public_metadata.role}}" }
// Then set publicMetadata.role = "admin" on the owner's Clerk user.

type AuthCtx = Pick<QueryCtx, "auth"> | Pick<MutationCtx, "auth">;

async function requireAdmin(ctx: AuthCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new ConvexError("Not authenticated.");
  if ((identity as { role?: string }).role !== "admin")
    throw new ConvexError("Not authorized.");
  return identity;
}

// ── Stats ─────────────────────────────────────────────────────────────────────

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const [volunteers, members, projectRequests, opportunities, rsvps] =
      await Promise.all([
        ctx.db.query("volunteers").collect(),
        ctx.db.query("members").collect(),
        ctx.db.query("projectRequests").collect(),
        ctx.db.query("opportunities").collect(),
        ctx.db.query("eventRsvps").collect(),
      ]);

    return {
      volunteers: {
        total: volunteers.length,
        new: volunteers.filter((v) => v.status === "new" && !v.hidden).length,
        contacted: volunteers.filter((v) => v.status === "contacted").length,
        accepted: volunteers.filter((v) => v.status === "accepted").length,
        declined: volunteers.filter((v) => v.status === "declined").length,
        hidden: volunteers.filter((v) => v.hidden).length,
      },
      members: {
        total: members.length,
        public: members.filter((m) => m.isPublic !== false).length,
        countries: new Set(members.map((m) => m.country)).size,
      },
      projectRequests: {
        total: projectRequests.length,
        new: projectRequests.filter((p) => p.status === "new" && !p.hidden).length,
        hidden: projectRequests.filter((p) => p.hidden).length,
      },
      opportunities: {
        total: opportunities.length,
        draft: opportunities.filter((o) => o.status === "draft").length,
        published: opportunities.filter((o) => o.status === "published").length,
        archived: opportunities.filter((o) => o.status === "archived").length,
      },
      events: {
        totalRsvps: rsvps.length,
        uniqueEvents: new Set(rsvps.map((r) => r.eventSlug)).size,
      },
    };
  },
});

// ── Volunteers ────────────────────────────────────────────────────────────────

export const listVolunteers = query({
  args: { showHidden: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const all = await ctx.db.query("volunteers").order("desc").collect();
    return args.showHidden ? all : all.filter((v) => !v.hidden);
  },
});

export const updateVolunteerStatus = mutation({
  args: {
    id: v.id("volunteers"),
    status: v.union(
      v.literal("new"),
      v.literal("contacted"),
      v.literal("accepted"),
      v.literal("declined"),
    ),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const setVolunteerNotes = mutation({
  args: { id: v.id("volunteers"), notes: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, { notes: args.notes || undefined });
  },
});

export const updateRecruitment = mutation({
  args: {
    id: v.id("volunteers"),
    recruitStatus: v.optional(
      v.union(
        v.literal("applied"),
        v.literal("shortlisted"),
        v.literal("invite_sent"),
        v.literal("interview_scheduled"),
        v.literal("interviewed"),
        v.literal("offered"),
        v.literal("accepted"),
        v.literal("declined"),
        v.literal("not_shortlisted"),
      ),
    ),
    shortlistedPositions: v.optional(v.array(v.string())),
    finalOffer: v.optional(v.string()),
    potential: v.optional(
      v.union(v.literal("low"), v.literal("moderate"), v.literal("high")),
    ),
    interviewer: v.optional(v.string()),
    interviewSlot: v.optional(v.string()),
    meetLink: v.optional(v.string()),
    inviteEmailSentAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { id, ...fields } = args;
    // Remove undefined values so we only patch what changed
    const patch = Object.fromEntries(
      Object.entries(fields).filter(([, v]) => v !== undefined),
    );
    await ctx.db.patch(id, patch);
  },
});

export const setVolunteerHidden = mutation({
  args: { id: v.id("volunteers"), hidden: v.boolean() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, { hidden: args.hidden });
  },
});

// ── Settings (admin key/value store) ─────────────────────────────────────────

export const getSettings = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const all = await ctx.db.query("settings").collect();
    return Object.fromEntries(all.map((s) => [s.key, s.value]));
  },
});

export const setSetting = mutation({
  args: { key: v.string(), value: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const existing = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { value: args.value });
    } else {
      await ctx.db.insert("settings", { key: args.key, value: args.value });
    }
  },
});

// ── Project Requests ──────────────────────────────────────────────────────────

export const listProjectRequests = query({
  args: { showHidden: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const all = await ctx.db.query("projectRequests").order("desc").collect();
    return args.showHidden ? all : all.filter((r) => !r.hidden);
  },
});

export const updateProjectRequestStatus = mutation({
  args: {
    id: v.id("projectRequests"),
    status: v.union(
      v.literal("new"),
      v.literal("contacted"),
      v.literal("accepted"),
      v.literal("declined"),
    ),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const setProjectRequestNotes = mutation({
  args: { id: v.id("projectRequests"), notes: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, { notes: args.notes || undefined });
  },
});

export const setProjectRequestHidden = mutation({
  args: { id: v.id("projectRequests"), hidden: v.boolean() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, { hidden: args.hidden });
  },
});

// ── Opportunities ─────────────────────────────────────────────────────────────

export const listOpportunities = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db.query("opportunities").order("desc").collect();
  },
});

export const updateOpportunityStatus = mutation({
  args: {
    id: v.id("opportunities"),
    status: v.union(
      v.literal("draft"),
      v.literal("published"),
      v.literal("archived"),
    ),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const toggleOfficialBFP = mutation({
  args: { id: v.id("opportunities"), value: v.boolean() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, { officialBFP: args.value });
  },
});

export const updateOpportunity = mutation({
  args: {
    id: v.id("opportunities"),
    title: v.optional(v.string()),
    summary: v.optional(v.string()),
    description: v.optional(v.string()),
    link: v.optional(v.string()),
    repoLink: v.optional(v.string()),
    orgName: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    skillsNeeded: v.optional(v.array(v.string())),
    difficulty: v.optional(
      v.union(v.literal("beginner"), v.literal("intermediate"), v.literal("advanced")),
    ),
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
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { id, ...fields } = args;
    // Remove undefined values so we only patch what changed
    const patch = Object.fromEntries(
      Object.entries(fields).filter(([, v]) => v !== undefined),
    );
    await ctx.db.patch(id, patch);
  },
});

// ── Members ───────────────────────────────────────────────────────────────────

export const listMembers = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db.query("members").order("desc").collect();
  },
});

// ── Event RSVPs ───────────────────────────────────────────────────────────────

export const listEventRsvps = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db.query("eventRsvps").order("desc").collect();
  },
});
