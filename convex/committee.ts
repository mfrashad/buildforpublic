import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { requireAdmin } from "./admin";

const slotType = v.union(
  v.literal("filled"),
  v.literal("open"),
  v.literal("mystery"),
);

// Fields shared by create/update (everything except id/order/slotType/department).
const memberFields = {
  roleTitle: v.optional(v.string()),
  positionId: v.optional(v.string()),
  name: v.optional(v.string()),
  bio: v.optional(v.string()),
  imageUrl: v.optional(v.string()),
  location: v.optional(v.string()),
  linkedin: v.optional(v.string()),
  github: v.optional(v.string()),
  twitter: v.optional(v.string()),
  instagram: v.optional(v.string()),
  website: v.optional(v.string()),
  isFounder: v.optional(v.boolean()),
  ctaLabel: v.optional(v.string()),
  ctaLink: v.optional(v.string()),
};

function definedFields<T extends Record<string, unknown>>(fields: T) {
  return Object.fromEntries(
    Object.entries(fields).filter(([, value]) => value !== undefined),
  );
}

// ── Public: drives the /about committee section ─────────────────────────────────

export const list = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db
      .query("committee")
      .withIndex("by_order")
      .order("asc")
      .take(200);
    return all.filter((c) => !c.hidden);
  },
});

// ── Admin ───────────────────────────────────────────────────────────────────────

export const listAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db
      .query("committee")
      .withIndex("by_order")
      .order("asc")
      .take(200);
  },
});

export const create = mutation({
  args: {
    department: v.string(),
    slotType,
    order: v.optional(v.number()),
    ...memberFields,
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    // Default order: append to the end.
    let order = args.order;
    if (order === undefined) {
      const last = await ctx.db
        .query("committee")
        .withIndex("by_order")
        .order("desc")
        .first();
      order = (last?.order ?? 0) + 10;
    }
    const { order: _o, ...rest } = args;
    return await ctx.db.insert("committee", {
      ...definedFields(rest),
      department: args.department,
      slotType: args.slotType,
      roleTitle: args.roleTitle ?? "",
      order,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("committee"),
    department: v.optional(v.string()),
    slotType: v.optional(slotType),
    order: v.optional(v.number()),
    hidden: v.optional(v.boolean()),
    ...memberFields,
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { id, ...fields } = args;
    await ctx.db.patch(id, definedFields(fields));
  },
});

export const setHidden = mutation({
  args: { id: v.id("committee"), hidden: v.boolean() },
  handler: async (ctx, { id, hidden }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(id, { hidden });
  },
});

export const remove = mutation({
  args: { id: v.id("committee") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    await ctx.db.delete(id);
  },
});

// ── Seed (one-time initial founding-team roster) ───────────────────────────────
// Run with: npx convex run committee:seed   (and --prod for production)

export const seed = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("committee").take(1);
    if (existing.length > 0) {
      console.log("committee already seeded — skipping.");
      return { skipped: true };
    }

    // order spacing of 10 keeps room to insert between rows later.
    const rows: Array<Record<string, unknown>> = [
      // Leadership
      {
        department: "Leadership",
        roleTitle: "Founder",
        slotType: "filled",
        name: "Muhammad Fathy Rashad",
        bio: "Founder of Build for Public — rallying builders to ship open-source tech for NGOs and the public good.",
        isFounder: true,
        order: 10,
      },
      // Events
      {
        department: "Events",
        roleTitle: "Events Director",
        positionId: "events-director",
        slotType: "filled",
        name: "Akhlaq Ahmad",
        location: "Kuala Lumpur",
        bio: "KL-based builder who ships in public and lives in AI tools. Makes our meetups the ones you clear your calendar for.",
        isFounder: true,
        order: 20,
      },
      {
        department: "Events",
        roleTitle: "Co-Director",
        positionId: "events-director",
        slotType: "open",
        order: 30,
      },
      // Outreach
      {
        department: "Outreach",
        roleTitle: "Outreach Director",
        positionId: "outreach-director",
        slotType: "filled",
        name: "Razali Mohamed Zain",
        location: "Kuala Lumpur",
        bio: "20+ years across banking, logistics & tech, and an AI-voice startup co-founder. Our bridge to NGOs and partners.",
        isFounder: true,
        order: 40,
      },
      {
        department: "Outreach",
        roleTitle: "Outreach Officer",
        positionId: "outreach-officer",
        slotType: "filled",
        name: "Muhammad Haddif",
        location: "Subang Jaya",
        bio: "IT student at UTP who builds from first principles (a chess engine from scratch!). Freelance dev and project lead.",
        isFounder: true,
        order: 50,
      },
      {
        department: "Outreach",
        roleTitle: "Outreach Officer",
        positionId: "outreach-officer",
        slotType: "filled",
        name: "Tan Yan He",
        location: "Penang",
        bio: "NGO External Relations lead and seasoned event organiser. NGO-native and a natural connector.",
        isFounder: true,
        order: 60,
      },
      {
        department: "Outreach",
        roleTitle: "Co-Director",
        positionId: "outreach-director",
        slotType: "open",
        order: 70,
      },
      // Content
      {
        department: "Content",
        roleTitle: "Co-Director",
        positionId: "content-director",
        slotType: "open",
        order: 80,
      },
      {
        department: "Content",
        roleTitle: "Content Officer",
        positionId: "content-officer",
        slotType: "filled",
        name: "Nur Mazshuky",
        location: "Semenyih",
        bio: "CS student at Nottingham Malaysia, full-stack & AI builder who loves turning work into stories.",
        isFounder: true,
        order: 90,
      },
      {
        department: "Content",
        roleTitle: "Content Officer",
        positionId: "content-officer",
        slotType: "filled",
        name: "Alia Raihah",
        location: "Petaling Jaya",
        bio: "MBA marketer across fintech, robotics & EdTech. Our storytelling and brand firepower.",
        isFounder: true,
        order: 100,
      },
      // Tech
      {
        department: "Tech",
        roleTitle: "Tech Director",
        positionId: "tech-director",
        slotType: "open",
        order: 110,
      },
      {
        department: "Tech",
        roleTitle: "Tech Officer",
        positionId: "tech-officer",
        slotType: "open",
        order: 120,
      },
      // Finance — kept a mystery for now
      {
        department: "Finance",
        roleTitle: "Finance Team",
        slotType: "mystery",
        order: 130,
      },
    ];

    for (const row of rows) await ctx.db.insert("committee", row as never);
    console.log(`Seeded ${rows.length} committee slots.`);
    return { seeded: rows.length };
  },
});
