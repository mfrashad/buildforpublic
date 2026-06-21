import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

const http = httpRouter();

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function checkAdminKey(req: Request): Response | null {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return null; // no key configured — open (dev mode)
  const auth = req.headers.get("Authorization");
  if (auth !== `Bearer ${secret}`) return json({ error: "Unauthorized" }, 401);
  return null;
}

function bearerToken(req: Request): string | null {
  const auth = req.headers.get("Authorization");
  return auth?.startsWith("Bearer ") ? auth.slice(7).trim() : null;
}

// Accepts either the env master secret (ADMIN_SECRET) OR any active per-admin
// API key (generated from the dashboard). Open only in dev when neither an env
// secret nor any API key has been configured.
async function authorizeAgent(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ctx: any,
  req: Request,
): Promise<Response | null> {
  const token = bearerToken(req);
  const envSecret = process.env.ADMIN_SECRET;
  if (token) {
    if (envSecret && token === envSecret) return null;
    const valid = await ctx.runQuery(internal.apiKeys.apiKeyIsValid, {
      key: token,
    });
    if (valid) return null;
    return json({ error: "Unauthorized" }, 401);
  }
  if (envSecret) return json({ error: "Unauthorized" }, 401);
  const hasKeys = await ctx.runQuery(internal.apiKeys.anyActiveApiKeys, {});
  if (hasKeys) return json({ error: "Unauthorized" }, 401);
  return null; // dev: fully open (no secret, no keys)
}

// Whitelist the fields an external caller (e.g. an AI agent) may set on a venue,
// so unknown keys don't trip Convex's strict argument validation.
const VENUE_FIELDS = [
  "name", "description", "contactHandle", "email", "phone", "instagram",
  "threads", "website", "googleMaps", "platform", "message", "eventName",
  "status", "assignedTo", "notes", "hidden",
  "wifi", "plugs", "projector", "parking", "tables", "maxOccupant",
] as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function pickVenue(obj: any): any {
  const out: Record<string, unknown> = {};
  for (const k of VENUE_FIELDS) if (obj?.[k] !== undefined) out[k] = obj[k];
  return out;
}

const NGO_FIELDS = [
  "leadKey", "orgName", "description", "instagram", "facebook", "twitter",
  "linkedin", "tiktok", "youtube", "website", "websiteStatus", "location",
  "email", "phone", "platform", "message", "status", "requirementDocLink",
  "assignedTo", "notes", "hidden",
] as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function pickNgo(obj: any): any {
  const out: Record<string, unknown> = {};
  for (const k of NGO_FIELDS) if (obj?.[k] !== undefined) out[k] = obj[k];
  return out;
}

// GET /api/ngo-helped — list all NGOs
http.route({
  path: "/api/ngo-helped",
  method: "GET",
  handler: httpAction(async (ctx) => {
    const ngos = await ctx.runQuery(api.ngoHelped.list, {});
    return json(ngos);
  }),
});

// POST /api/ngo-helped — create a new NGO
// Body: { name, country, flag, cause, tagline, description, helpedWith, whoFor, website, codeLink?, accentBg, order? }
http.route({
  path: "/api/ngo-helped",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const authErr = checkAdminKey(req);
    if (authErr) return authErr;

    const body = await req.json();
    const id = await ctx.runMutation(api.ngoHelped.create, body);
    return json({ id }, 201);
  }),
});

// PATCH /api/ngo-helped?id=<id> — update fields on an NGO
// Body: any subset of the NGO fields
http.route({
  path: "/api/ngo-helped",
  method: "PATCH",
  handler: httpAction(async (ctx, req) => {
    const authErr = checkAdminKey(req);
    if (authErr) return authErr;

    const id = new URL(req.url).searchParams.get("id");
    if (!id) return json({ error: "Missing ?id= query param" }, 400);

    const body = await req.json();
    await ctx.runMutation(api.ngoHelped.update, {
      id: id as Id<"ngoHelped">,
      ...body,
    });
    return json({ ok: true });
  }),
});

// DELETE /api/ngo-helped?id=<id> — remove an NGO
http.route({
  path: "/api/ngo-helped",
  method: "DELETE",
  handler: httpAction(async (ctx, req) => {
    const authErr = checkAdminKey(req);
    if (authErr) return authErr;

    const id = new URL(req.url).searchParams.get("id");
    if (!id) return json({ error: "Missing ?id= query param" }, 400);

    await ctx.runMutation(api.ngoHelped.remove, {
      id: id as Id<"ngoHelped">,
    });
    return json({ ok: true });
  }),
});

// ── Venue outreach API (AI-agent / MCP friendly) ──────────────────────────────
// Auth: send header `Authorization: Bearer <ADMIN_SECRET>` (open if unset in dev).

// GET /api/venues[?includeHidden=true] — list venues (with ids + all fields)
http.route({
  path: "/api/venues",
  method: "GET",
  handler: httpAction(async (ctx, req) => {
    const authErr = await authorizeAgent(ctx, req);
    if (authErr) return authErr;
    const includeHidden =
      new URL(req.url).searchParams.get("includeHidden") === "true";
    const venues = await ctx.runQuery(internal.outreach.apiListVenues, {
      includeHidden,
    });
    return json({ count: venues.length, venues });
  }),
});

// POST /api/venues — create one venue (object) or many (array, or {venues:[...]})
// Each venue needs at least { name }. Optional: description, contactHandle,
// email, phone, instagram, threads, website, googleMaps, platform, message,
// eventName, status, assignedTo, notes.
//   platform ∈ instagram|threads|whatsapp|email|phone|facebook|other
//   status   ∈ to_contact|dm_sent|responded|negotiating|secured|no_response|declined
http.route({
  path: "/api/venues",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const authErr = await authorizeAgent(ctx, req);
    if (authErr) return authErr;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let body: any;
    try {
      body = await req.json();
    } catch {
      return json({ error: "Invalid JSON body" }, 400);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items: any[] = Array.isArray(body)
      ? body
      : Array.isArray(body?.venues)
        ? body.venues
        : [body];

    const ids: string[] = [];
    const errors: { index: number; error: string }[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item?.name || typeof item.name !== "string") {
        errors.push({ index: i, error: "Missing required 'name' string" });
        continue;
      }
      try {
        const id = await ctx.runMutation(
          internal.outreach.apiCreateVenue,
          pickVenue(item),
        );
        ids.push(id);
      } catch (e) {
        errors.push({ index: i, error: e instanceof Error ? e.message : String(e) });
      }
    }
    return json(
      { created: ids.length, ids, errors },
      errors.length ? (ids.length ? 207 : 400) : 201,
    );
  }),
});

// PATCH /api/venues?id=<id> — update a venue (any subset of fields above + hidden)
http.route({
  path: "/api/venues",
  method: "PATCH",
  handler: httpAction(async (ctx, req) => {
    const authErr = await authorizeAgent(ctx, req);
    if (authErr) return authErr;
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return json({ error: "Missing ?id= query param" }, 400);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let body: any;
    try {
      body = await req.json();
    } catch {
      return json({ error: "Invalid JSON body" }, 400);
    }
    try {
      await ctx.runMutation(internal.outreach.apiUpdateVenue, {
        id: id as Id<"venueOutreach">,
        ...pickVenue(body),
      });
    } catch (e) {
      return json({ error: e instanceof Error ? e.message : String(e) }, 400);
    }
    return json({ ok: true });
  }),
});

// DELETE /api/venues?id=<id> — permanently remove a venue
http.route({
  path: "/api/venues",
  method: "DELETE",
  handler: httpAction(async (ctx, req) => {
    const authErr = await authorizeAgent(ctx, req);
    if (authErr) return authErr;
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return json({ error: "Missing ?id= query param" }, 400);
    await ctx.runMutation(internal.outreach.apiDeleteVenue, {
      id: id as Id<"venueOutreach">,
    });
    return json({ ok: true });
  }),
});

// ── Non-profit outreach API (AI-agent / MCP friendly) ─────────────────────────
// Same bearer-token auth as venues.

// GET /api/nonprofit-leads — browse the imported lead catalog (read-only).
// Query: ?search= &hasInstagram=true &websiteStatus=none|social|free_builder|dead &limit=
http.route({
  path: "/api/nonprofit-leads",
  method: "GET",
  handler: httpAction(async (ctx, req) => {
    const authErr = await authorizeAgent(ctx, req);
    if (authErr) return authErr;
    const p = new URL(req.url).searchParams;
    const leads = await ctx.runQuery(internal.outreach.apiListNonprofitLeads, {
      search: p.get("search") ?? undefined,
      hasInstagram: p.get("hasInstagram") === "true" ? true : undefined,
      websiteStatus: p.get("websiteStatus") ?? undefined,
      limit: p.get("limit") ? Number(p.get("limit")) : undefined,
    });
    return json({ count: leads.length, leads });
  }),
});

// GET /api/nonprofit-outreach[?includeHidden=true] — list active outreach records
http.route({
  path: "/api/nonprofit-outreach",
  method: "GET",
  handler: httpAction(async (ctx, req) => {
    const authErr = await authorizeAgent(ctx, req);
    if (authErr) return authErr;
    const includeHidden =
      new URL(req.url).searchParams.get("includeHidden") === "true";
    const records = await ctx.runQuery(
      internal.outreach.apiListNonprofitOutreach,
      { includeHidden },
    );
    return json({ count: records.length, records });
  }),
});

// POST /api/nonprofit-outreach — add one record (object) or many (array).
// Provide a `leadKey` from /api/nonprofit-leads to auto-copy that lead's org
// name + socials + website, or provide `orgName` directly for a manual add.
// Optional: description, instagram, facebook, twitter, linkedin, website,
// location, email, phone, platform, message, status, requirementDocLink,
// assignedTo, notes.
//   platform ∈ instagram|facebook|whatsapp|email|linkedin|twitter|other
//   status   ∈ to_contact|dm_sent|responded|in_discussion|requirement_received|secured|no_response|declined
http.route({
  path: "/api/nonprofit-outreach",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const authErr = await authorizeAgent(ctx, req);
    if (authErr) return authErr;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let body: any;
    try {
      body = await req.json();
    } catch {
      return json({ error: "Invalid JSON body" }, 400);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items: any[] = Array.isArray(body)
      ? body
      : Array.isArray(body?.records)
        ? body.records
        : [body];

    const ids: string[] = [];
    const errors: { index: number; error: string }[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item?.orgName && !item?.leadKey) {
        errors.push({ index: i, error: "Provide 'orgName' or a 'leadKey'" });
        continue;
      }
      try {
        const id = await ctx.runMutation(
          internal.outreach.apiCreateNonprofitOutreach,
          pickNgo(item),
        );
        ids.push(id);
      } catch (e) {
        errors.push({ index: i, error: e instanceof Error ? e.message : String(e) });
      }
    }
    return json(
      { created: ids.length, ids, errors },
      errors.length ? (ids.length ? 207 : 400) : 201,
    );
  }),
});

// PATCH /api/nonprofit-outreach?id=<id> — update fields (incl. status, message, hidden)
http.route({
  path: "/api/nonprofit-outreach",
  method: "PATCH",
  handler: httpAction(async (ctx, req) => {
    const authErr = await authorizeAgent(ctx, req);
    if (authErr) return authErr;
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return json({ error: "Missing ?id= query param" }, 400);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let body: any;
    try {
      body = await req.json();
    } catch {
      return json({ error: "Invalid JSON body" }, 400);
    }
    try {
      await ctx.runMutation(internal.outreach.apiUpdateNonprofitOutreach, {
        id: id as Id<"nonprofitOutreach">,
        ...pickNgo(body),
      });
    } catch (e) {
      return json({ error: e instanceof Error ? e.message : String(e) }, 400);
    }
    return json({ ok: true });
  }),
});

// DELETE /api/nonprofit-outreach?id=<id> — permanently remove a record
http.route({
  path: "/api/nonprofit-outreach",
  method: "DELETE",
  handler: httpAction(async (ctx, req) => {
    const authErr = await authorizeAgent(ctx, req);
    if (authErr) return authErr;
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return json({ error: "Missing ?id= query param" }, 400);
    await ctx.runMutation(internal.outreach.apiDeleteNonprofitOutreach, {
      id: id as Id<"nonprofitOutreach">,
    });
    return json({ ok: true });
  }),
});

export default http;
