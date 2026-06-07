import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("ngoHelped")
      .withIndex("by_order")
      .order("asc")
      .take(100);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    country: v.string(),
    flag: v.string(),
    cause: v.string(),
    tagline: v.string(),
    description: v.string(),
    helpedWith: v.string(),
    whoFor: v.string(),
    website: v.string(),
    codeLink: v.optional(v.string()),
    accentBg: v.string(),
    image: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("ngoHelped", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("ngoHelped"),
    name: v.optional(v.string()),
    country: v.optional(v.string()),
    flag: v.optional(v.string()),
    cause: v.optional(v.string()),
    tagline: v.optional(v.string()),
    description: v.optional(v.string()),
    helpedWith: v.optional(v.string()),
    whoFor: v.optional(v.string()),
    website: v.optional(v.string()),
    codeLink: v.optional(v.string()),
    accentBg: v.optional(v.string()),
    image: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, { id, ...fields }) => {
    await ctx.db.patch(id, fields);
    return id;
  },
});

export const remove = mutation({
  args: { id: v.id("ngoHelped") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return id;
  },
});

export const seedNgoHelped = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("ngoHelped").take(1);
    if (existing.length > 0) {
      console.log("NGO helped already seeded — skipping.");
      return { skipped: true };
    }

    const ngos = [
      {
        name: "Pocket of Pink",
        country: "Malaysia",
        flag: "🇲🇾",
        cause: "Gender equality & youth",
        tagline: "Gender empowerment for young people through art and education.",
        description:
          "Founded by Ain Husniza after her viral campaign against school rape culture, Pocket of Pink uses art, advocacy, and Comprehensive Sexuality Education to empower youth and challenge harmful gender norms. We helped them ship their site in a day using AI.",
        helpedWith: "Website design and development",
        whoFor: "Youth and advocates across Malaysia",
        website: "https://www.pocketofpink.com",
        codeLink: "https://github.com/mfrashad/pocketofpink",
        accentBg: "#ffc0a1",
        order: 1,
      },
      {
        name: "ISTAID Center",
        country: "Indonesia",
        flag: "🇮🇩",
        cause: "Islamic education & da'wah",
        tagline: "30 years of Islamic education and outreach across Sumatera.",
        description:
          "Founded in 1993 in Medan, North Sumatra, ISTAID Center has spent over 30 years building generations of Muslim scholars through Quran memorization programs, youth camps, and a weekly bulletin distributed to 60+ mosques. We helped them bring their mission online.",
        helpedWith: "Website design and development",
        whoFor: "Muslim communities across Sumatera Utara and Aceh",
        website: "https://www.istaidcenter.com",
        codeLink: "https://github.com/mfrashad/istaid-website",
        accentBg: "#bbf7d0",
        order: 2,
      },
    ];

    for (const ngo of ngos) {
      await ctx.db.insert("ngoHelped", ngo);
    }

    console.log(`Seeded ${ngos.length} NGOs.`);
    return { seeded: ngos.length };
  },
});
