import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { OWNER_EMAIL } from "@/lib/constants";

// POST /api/admin/committee-photos — pull each committee member's Google/Clerk
// profile photo (by email) and store it on their committee row. Admin-only.
// Body (optional): { force?: boolean } — overwrite existing photos too.

type ClerkClient = Awaited<ReturnType<typeof clerkClient>>;
type ClerkUser = Awaited<ReturnType<ClerkClient["users"]["getUser"]>>;

function primaryEmail(user: ClerkUser): string | null {
  const e = user.emailAddresses.find((a) => a.id === user.primaryEmailAddressId);
  return (e?.emailAddress ?? user.emailAddresses[0]?.emailAddress ?? null);
}

export async function POST(req: Request) {
  const { userId, getToken } = await auth();
  if (!userId) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const client = await clerkClient();
  const me = await client.users.getUser(userId);
  const myEmail = primaryEmail(me)?.toLowerCase();
  const isAdmin = (me.publicMetadata as { role?: string })?.role === "admin";
  if (!isAdmin && myEmail !== OWNER_EMAIL.toLowerCase()) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const force = await req.json().then((b) => !!b?.force).catch(() => false);

  const token = await getToken({ template: "convex" });
  if (!token) return NextResponse.json({ error: "No Convex token." }, { status: 401 });
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  convex.setAuth(token);

  const rows = await convex.query(api.committee.listAdmin, {});
  const targets = rows.filter(
    (r) => r.slotType === "filled" && r.email && (force || !r.imageUrl),
  );
  if (targets.length === 0) {
    return NextResponse.json({ updated: 0, message: "Nothing to sync." });
  }

  // Look up Clerk users for all target emails in one call.
  const emails = [...new Set(targets.map((r) => r.email!.toLowerCase()))];
  const { data: users } = await client.users.getUserList({
    emailAddress: emails,
    limit: 200,
  });
  const imageByEmail = new Map<string, string>();
  for (const u of users) {
    const e = primaryEmail(u)?.toLowerCase();
    if (e && u.imageUrl) imageByEmail.set(e, u.imageUrl);
  }

  const updated: string[] = [];
  const missing: string[] = [];
  for (const r of targets) {
    const img = imageByEmail.get(r.email!.toLowerCase());
    if (img) {
      await convex.mutation(api.committee.update, { id: r._id, imageUrl: img });
      updated.push(r.name ?? r.email!);
    } else {
      missing.push(r.name ?? r.email!);
    }
  }

  return NextResponse.json({ updated: updated.length, names: updated, missing });
}
