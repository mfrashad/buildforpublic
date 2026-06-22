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
  email: v.optional(v.string()),
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
    const visible = all.filter((c) => !c.hidden);
    // Resolve the photo (explicit override → Clerk/Google photo mirrored in the
    // members table, matched by email) and strip email from the public payload.
    const out = [];
    for (const c of visible) {
      let imageUrl = c.imageUrl;
      if (!imageUrl && c.email) {
        const m = await ctx.db
          .query("members")
          .withIndex("by_email", (q) => q.eq("email", c.email!))
          .first();
        imageUrl = m?.imageUrl ?? undefined;
      }
      const { email: _email, ...rest } = c;
      out.push({ ...rest, imageUrl });
    }
    return out;
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
        roleTitle: "Co-Founder",
        slotType: "filled",
        name: "Muhammad Fathy Rashad",
        email: "m.fathyrashad@gmail.com",
        bio: "Co-Founder of Build for Public — rallying builders to ship open-source tech for NGOs and the public good.",
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
        email: "akhlaq.dev@gmail.com",
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
        email: "razalizain@gmail.com",
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
        email: "haddifhairi@gmail.com",
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
        email: "lucastyh2009@gmail.com",
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
        email: "mazshuky@gmail.com",
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
        email: "aliaraihah@gmail.com",
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

// One-off: place Puvaan Raaj into the Tech Officer slot (founding team).
// Idempotent. Run with: npx convex run committee:addPuvaan  (and --prod)
export const addPuvaan = internalMutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("committee").take(200);
    const data = {
      department: "Tech",
      roleTitle: "Tech Officer",
      positionId: "tech-officer",
      slotType: "filled" as const,
      name: "Puvaan Raaj",
      email: "puvaanraaj2001@gmail.com",
      location: "Shah Alam",
      linkedin: "https://www.linkedin.com/in/puvaan-raaj/",
      website: "https://puvaan.dev",
      bio: "Software engineer across backend, cloud infrastructure & AI tooling — turns messy manual problems into simple tools people actually use.",
      isFounder: true,
    };
    // Already added?
    if (all.some((c) => c.name === "Puvaan Raaj")) {
      return { skipped: true };
    }
    // Prefer converting the existing open Tech Officer slot to keep ordering.
    const openOfficer = all.find(
      (c) =>
        c.department === "Tech" &&
        c.slotType === "open" &&
        /officer/i.test(c.roleTitle || ""),
    );
    if (openOfficer) {
      await ctx.db.patch(openOfficer._id, data);
      return { converted: openOfficer._id };
    }
    const last = all.reduce((m, c) => Math.max(m, c.order ?? 0), 0);
    const id = await ctx.db.insert("committee", { ...data, order: last + 10 });
    return { inserted: id };
  },
});

// One-off: backfill emails (for Clerk/Google photo matching) and the Co-Founder
// title onto already-seeded rows. Safe to re-run. Run with:
//   npx convex run committee:backfill   (and --prod)
export const backfill = internalMutation({
  args: {},
  handler: async (ctx) => {
    const byName: Record<string, string> = {
      "Muhammad Fathy Rashad": "m.fathyrashad@gmail.com",
      "Akhlaq Ahmad": "akhlaq.dev@gmail.com",
      "Razali Mohamed Zain": "razalizain@gmail.com",
      "Muhammad Haddif": "haddifhairi@gmail.com",
      "Tan Yan He": "lucastyh2009@gmail.com",
      "Nur Mazshuky": "mazshuky@gmail.com",
      "Alia Raihah": "aliaraihah@gmail.com",
    };
    const all = await ctx.db.query("committee").take(200);
    let updated = 0;
    for (const c of all) {
      const patch: Record<string, unknown> = {};
      if (c.name && byName[c.name] && c.email !== byName[c.name]) {
        patch.email = byName[c.name];
      }
      if (c.name === "Muhammad Fathy Rashad" && c.roleTitle !== "Co-Founder") {
        patch.roleTitle = "Co-Founder";
        patch.bio =
          "Co-Founder of Build for Public — rallying builders to ship open-source tech for NGOs and the public good.";
      }
      if (Object.keys(patch).length) {
        await ctx.db.patch(c._id, patch);
        updated++;
      }
    }
    console.log(`Backfilled ${updated} committee rows.`);
    return { updated };
  },
});
