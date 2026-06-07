import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
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

export default http;
