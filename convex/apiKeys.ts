import { v } from "convex/values";
import { internalQuery, mutation, query } from "./_generated/server";
import { OWNER_EMAIL, requireAdmin } from "./admin";

// Generate a random, hard-to-guess key like `bfp_<48 hex chars>`.
function randomKey(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `bfp_${hex}`;
}

/** The current admin's API key (or null if they haven't generated one). */
export const getMyApiKey = query({
  args: {},
  handler: async (ctx) => {
    const identity = await requireAdmin(ctx);
    const rec = await ctx.db
      .query("apiKeys")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!rec || !rec.active) return null;
    return { key: rec.key, label: rec.label, createdAt: rec._creationTime };
  },
});

/** Create or rotate the current admin's API key. Returns the new key. */
export const generateMyApiKey = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await requireAdmin(ctx);
    const key = randomKey();
    const label = identity.name ?? identity.email ?? identity.subject;
    // Grant owner-only API access (recruitment) when the JWT carries an email
    // claim matching the owner. Requires the Clerk "convex" JWT template to
    // include `email`; without it this stays false and the OWNER_API_SECRET env
    // secret is the path to the recruitment API.
    const email = ((identity as { email?: string }).email ?? "").toLowerCase();
    const isOwner = email === OWNER_EMAIL.toLowerCase();
    const existing = await ctx.db
      .query("apiKeys")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { key, label, active: true, isOwner });
    } else {
      await ctx.db.insert("apiKeys", {
        key,
        clerkId: identity.subject,
        label,
        active: true,
        isOwner,
      });
    }
    return key;
  },
});

/** Deactivate the current admin's API key. */
export const revokeMyApiKey = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await requireAdmin(ctx);
    const rec = await ctx.db
      .query("apiKeys")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (rec) await ctx.db.patch(rec._id, { active: false });
  },
});

// ── Internal (used by convex/http.ts for bearer-token auth) ────────────────────

export const apiKeyIsValid = internalQuery({
  args: { key: v.string() },
  handler: async (ctx, { key }) => {
    const rec = await ctx.db
      .query("apiKeys")
      .withIndex("by_key", (q) => q.eq("key", key))
      .unique();
    return !!rec && rec.active;
  },
});

/** True if the key is active AND flagged as the owner's (recruitment access). */
export const apiKeyIsOwner = internalQuery({
  args: { key: v.string() },
  handler: async (ctx, { key }) => {
    const rec = await ctx.db
      .query("apiKeys")
      .withIndex("by_key", (q) => q.eq("key", key))
      .unique();
    return !!rec && rec.active && rec.isOwner === true;
  },
});

export const anyActiveApiKeys = internalQuery({
  args: {},
  handler: async (ctx) => {
    const rec = await ctx.db
      .query("apiKeys")
      .withIndex("by_active", (q) => q.eq("active", true))
      .first();
    return !!rec;
  },
});
