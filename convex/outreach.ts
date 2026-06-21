import { v } from "convex/values";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
  type MutationCtx,
} from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { requireAdmin } from "./admin";

// ── Validators ────────────────────────────────────────────────────────────────

const venuePlatform = v.union(
  v.literal("instagram"),
  v.literal("threads"),
  v.literal("whatsapp"),
  v.literal("email"),
  v.literal("phone"),
  v.literal("facebook"),
  v.literal("other"),
);

const venueStatus = v.union(
  v.literal("to_contact"),
  v.literal("dm_sent"),
  v.literal("responded"),
  v.literal("negotiating"),
  v.literal("secured"),
  v.literal("no_response"),
  v.literal("declined"),
);

const ngoPlatform = v.union(
  v.literal("instagram"),
  v.literal("facebook"),
  v.literal("whatsapp"),
  v.literal("email"),
  v.literal("linkedin"),
  v.literal("twitter"),
  v.literal("other"),
);

const ngoStatus = v.union(
  v.literal("to_contact"),
  v.literal("dm_sent"),
  v.literal("responded"),
  v.literal("in_discussion"),
  v.literal("requirement_received"),
  v.literal("secured"),
  v.literal("no_response"),
  v.literal("declined"),
);

// Patch only the fields that were actually provided, so partial updates don't
// clobber other columns (same idiom as admin.updateRecruitment).
function definedFields<T extends Record<string, unknown>>(fields: T) {
  return Object.fromEntries(
    Object.entries(fields).filter(([, value]) => value !== undefined),
  );
}

// ── Venues ────────────────────────────────────────────────────────────────────

export const listVenues = query({
  args: { showHidden: v.optional(v.boolean()) },
  handler: async (ctx, { showHidden }) => {
    await requireAdmin(ctx);
    const venues = await ctx.db.query("venueOutreach").order("desc").collect();
    return showHidden ? venues : venues.filter((venue) => !venue.hidden);
  },
});

export const createVenue = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    contactHandle: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    instagram: v.optional(v.string()),
    threads: v.optional(v.string()),
    website: v.optional(v.string()),
    googleMaps: v.optional(v.string()),
    platform: v.optional(venuePlatform),
    eventName: v.optional(v.string()),
    assignedTo: v.optional(v.string()),
    wifi: v.optional(v.boolean()),
    plugs: v.optional(v.boolean()),
    projector: v.optional(v.boolean()),
    parking: v.optional(v.boolean()),
    tables: v.optional(v.boolean()),
    maxOccupant: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.insert("venueOutreach", {
      ...definedFields(args),
      name: args.name,
      status: "to_contact",
    });
  },
});

export const updateVenue = mutation({
  args: {
    id: v.id("venueOutreach"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    contactHandle: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    instagram: v.optional(v.string()),
    threads: v.optional(v.string()),
    website: v.optional(v.string()),
    googleMaps: v.optional(v.string()),
    platform: v.optional(venuePlatform),
    message: v.optional(v.string()),
    eventName: v.optional(v.string()),
    status: v.optional(venueStatus),
    assignedTo: v.optional(v.string()),
    notes: v.optional(v.string()),
    wifi: v.optional(v.boolean()),
    plugs: v.optional(v.boolean()),
    projector: v.optional(v.boolean()),
    parking: v.optional(v.boolean()),
    tables: v.optional(v.boolean()),
    maxOccupant: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { id, ...fields } = args;
    await ctx.db.patch(id, definedFields(fields));
  },
});

// ── Venue API (for AI agents / external tools via convex/http.ts) ──────────────
// These are internal functions: NOT exposed to the public Convex API. They can
// only be reached through the bearer-token-gated HTTP routes in convex/http.ts.

const venueApiFields = {
  description: v.optional(v.string()),
  contactHandle: v.optional(v.string()),
  email: v.optional(v.string()),
  phone: v.optional(v.string()),
  instagram: v.optional(v.string()),
  threads: v.optional(v.string()),
  website: v.optional(v.string()),
  googleMaps: v.optional(v.string()),
  platform: v.optional(venuePlatform),
  message: v.optional(v.string()),
  eventName: v.optional(v.string()),
  status: v.optional(venueStatus),
  assignedTo: v.optional(v.string()),
  notes: v.optional(v.string()),
  wifi: v.optional(v.boolean()),
  plugs: v.optional(v.boolean()),
  projector: v.optional(v.boolean()),
  parking: v.optional(v.boolean()),
  tables: v.optional(v.boolean()),
  maxOccupant: v.optional(v.number()),
};

export const apiListVenues = internalQuery({
  args: { includeHidden: v.optional(v.boolean()) },
  handler: async (ctx, { includeHidden }) => {
    const venues = await ctx.db.query("venueOutreach").order("desc").collect();
    return (includeHidden ? venues : venues.filter((x) => !x.hidden)).map((vn) => ({
      id: vn._id,
      createdAt: vn._creationTime,
      name: vn.name,
      description: vn.description,
      contactHandle: vn.contactHandle,
      email: vn.email,
      phone: vn.phone,
      instagram: vn.instagram,
      threads: vn.threads,
      website: vn.website,
      googleMaps: vn.googleMaps,
      platform: vn.platform,
      message: vn.message,
      eventName: vn.eventName,
      status: vn.status,
      assignedTo: vn.assignedTo,
      notes: vn.notes,
      wifi: vn.wifi,
      plugs: vn.plugs,
      projector: vn.projector,
      parking: vn.parking,
      tables: vn.tables,
      maxOccupant: vn.maxOccupant,
      hidden: vn.hidden ?? false,
    }));
  },
});

export const apiCreateVenue = internalMutation({
  args: { name: v.string(), ...venueApiFields },
  handler: async (ctx, args) => {
    return await ctx.db.insert("venueOutreach", {
      ...definedFields(args),
      name: args.name,
      status: args.status ?? "to_contact",
    });
  },
});

export const apiUpdateVenue = internalMutation({
  args: {
    id: v.id("venueOutreach"),
    name: v.optional(v.string()),
    hidden: v.optional(v.boolean()),
    ...venueApiFields,
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error(`Venue ${id} not found`);
    await ctx.db.patch(id, definedFields(fields));
  },
});

export const apiDeleteVenue = internalMutation({
  args: { id: v.id("venueOutreach") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

// ── Non-profit outreach API (for AI agents via convex/http.ts) ─────────────────

const ngoApiFields = {
  description: v.optional(v.string()),
  instagram: v.optional(v.string()),
  facebook: v.optional(v.string()),
  twitter: v.optional(v.string()),
  linkedin: v.optional(v.string()),
  tiktok: v.optional(v.string()),
  youtube: v.optional(v.string()),
  website: v.optional(v.string()),
  websiteStatus: v.optional(v.string()),
  location: v.optional(v.string()),
  email: v.optional(v.string()),
  phone: v.optional(v.string()),
  platform: v.optional(ngoPlatform),
  message: v.optional(v.string()),
  status: v.optional(ngoStatus),
  requirementDocLink: v.optional(v.string()),
  assignedTo: v.optional(v.string()),
  notes: v.optional(v.string()),
};

// Read-only catalog of imported leads, so an agent can pick which to add.
export const apiListNonprofitLeads = internalQuery({
  args: {
    search: v.optional(v.string()),
    hasInstagram: v.optional(v.boolean()),
    websiteStatus: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { search, hasInstagram, websiteStatus, limit }) => {
    const leads = await ctx.db.query("nonprofitLeads").take(2000);
    const q = search?.trim().toLowerCase();
    const filtered = leads.filter((lead) => {
      if (q && !lead.name.toLowerCase().includes(q)) return false;
      if (hasInstagram && !lead.instagram) return false;
      if (websiteStatus && lead.websiteStatus !== websiteStatus) return false;
      return true;
    });
    return filtered.slice(0, limit ?? 200).map((l) => ({
      leadKey: l.leadKey,
      name: l.name,
      websiteStatus: l.websiteStatus,
      website: l.listedWebsite,
      location: l.location,
      instagram: l.instagram,
      facebook: l.facebook,
      twitter: l.twitter,
      linkedin: l.linkedin,
      tiktok: l.tiktok,
      youtube: l.youtube,
      sources: l.sources,
    }));
  },
});

export const apiListNonprofitOutreach = internalQuery({
  args: { includeHidden: v.optional(v.boolean()) },
  handler: async (ctx, { includeHidden }) => {
    const rows = await ctx.db.query("nonprofitOutreach").order("desc").collect();
    return (includeHidden ? rows : rows.filter((r) => !r.hidden)).map((r) => ({
      id: r._id,
      createdAt: r._creationTime,
      leadKey: r.leadKey,
      orgName: r.orgName,
      description: r.description,
      instagram: r.instagram,
      facebook: r.facebook,
      twitter: r.twitter,
      linkedin: r.linkedin,
      tiktok: r.tiktok,
      youtube: r.youtube,
      website: r.website,
      websiteStatus: r.websiteStatus,
      location: r.location,
      email: r.email,
      phone: r.phone,
      platform: r.platform,
      message: r.message,
      status: r.status,
      requirementDocLink: r.requirementDocLink,
      assignedTo: r.assignedTo,
      notes: r.notes,
      hidden: r.hidden ?? false,
    }));
  },
});

export const apiCreateNonprofitOutreach = internalMutation({
  args: {
    leadKey: v.optional(v.string()),
    orgName: v.optional(v.string()),
    ...ngoApiFields,
  },
  handler: async (ctx, args) => {
    return await insertNonprofitOutreach(ctx, args);
  },
});

export const apiUpdateNonprofitOutreach = internalMutation({
  args: {
    id: v.id("nonprofitOutreach"),
    orgName: v.optional(v.string()),
    hidden: v.optional(v.boolean()),
    ...ngoApiFields,
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error(`Outreach record ${id} not found`);
    await ctx.db.patch(id, definedFields(fields));
  },
});

export const apiDeleteNonprofitOutreach = internalMutation({
  args: { id: v.id("nonprofitOutreach") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

export const setVenueHidden = mutation({
  args: { id: v.id("venueOutreach"), hidden: v.boolean() },
  handler: async (ctx, { id, hidden }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(id, { hidden });
  },
});

// ── Non-profit leads (catalog, imported from openngo) ──────────────────────────

export const listNonprofitLeads = query({
  args: {
    search: v.optional(v.string()),
    hasInstagram: v.optional(v.boolean()),
    websiteStatus: v.optional(v.string()),
  },
  handler: async (ctx, { search, hasInstagram, websiteStatus }) => {
    await requireAdmin(ctx);
    // Catalog is bounded (~441 rows) and admin-only; cap and filter in-handler.
    const leads = await ctx.db.query("nonprofitLeads").take(1000);
    const q = search?.trim().toLowerCase();
    return leads.filter((lead) => {
      if (q && !lead.name.toLowerCase().includes(q)) return false;
      if (hasInstagram && !lead.instagram) return false;
      if (websiteStatus && lead.websiteStatus !== websiteStatus) return false;
      return true;
    });
  },
});

// ── Non-profit outreach (state) ────────────────────────────────────────────────

export const listNonprofitOutreach = query({
  args: { showHidden: v.optional(v.boolean()) },
  handler: async (ctx, { showHidden }) => {
    await requireAdmin(ctx);
    const records = await ctx.db
      .query("nonprofitOutreach")
      .order("desc")
      .collect();
    return showHidden ? records : records.filter((r) => !r.hidden);
  },
});

// Shared insert: enriches from the matching lead (carrying over instagram,
// website, socials, location, etc.) when a leadKey is given, with any explicitly
// passed fields overriding. Used by both the dashboard mutation and the API.
async function insertNonprofitOutreach(
  ctx: MutationCtx,
  args: Record<string, unknown> & { leadKey?: string; orgName?: string },
): Promise<Id<"nonprofitOutreach">> {
  const leadKey = typeof args.leadKey === "string" ? args.leadKey : undefined;
  let lead = null;
  if (leadKey) {
    const existing = await ctx.db
      .query("nonprofitOutreach")
      .withIndex("by_leadKey", (q) => q.eq("leadKey", leadKey))
      .first();
    if (existing) return existing._id; // already in outreach — don't duplicate
    lead = await ctx.db
      .query("nonprofitLeads")
      .withIndex("by_leadKey", (q) => q.eq("leadKey", leadKey))
      .first();
  }
  const orgName = (args.orgName as string | undefined) ?? lead?.name;
  if (!orgName) throw new Error("orgName is required (or a known leadKey)");

  const fromLead = lead
    ? {
        instagram: lead.instagram,
        facebook: lead.facebook,
        twitter: lead.twitter,
        linkedin: lead.linkedin,
        tiktok: lead.tiktok,
        youtube: lead.youtube,
        website: lead.listedWebsite,
        websiteStatus: lead.websiteStatus,
        location: lead.location,
      }
    : {};

  const status = ((args.status as string | undefined) ??
    "to_contact") as Doc<"nonprofitOutreach">["status"];
  const merged = {
    ...fromLead,
    ...definedFields(args), // explicit args win over lead-derived values
    leadKey,
  };
  return await ctx.db.insert("nonprofitOutreach", {
    ...definedFields(merged),
    orgName,
    status,
  });
}

export const addNonprofitOutreach = mutation({
  args: {
    leadKey: v.optional(v.string()),
    orgName: v.optional(v.string()),
    instagram: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    website: v.optional(v.string()),
    description: v.optional(v.string()),
    platform: v.optional(ngoPlatform),
    assignedTo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await insertNonprofitOutreach(ctx, args);
  },
});

export const updateNonprofitOutreach = mutation({
  args: {
    id: v.id("nonprofitOutreach"),
    orgName: v.optional(v.string()),
    description: v.optional(v.string()),
    instagram: v.optional(v.string()),
    facebook: v.optional(v.string()),
    twitter: v.optional(v.string()),
    linkedin: v.optional(v.string()),
    website: v.optional(v.string()),
    location: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    platform: v.optional(ngoPlatform),
    message: v.optional(v.string()),
    status: v.optional(ngoStatus),
    requirementDocLink: v.optional(v.string()),
    assignedTo: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { id, ...fields } = args;
    await ctx.db.patch(id, definedFields(fields));
  },
});

export const setNonprofitOutreachHidden = mutation({
  args: { id: v.id("nonprofitOutreach"), hidden: v.boolean() },
  handler: async (ctx, { id, hidden }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(id, { hidden });
  },
});
