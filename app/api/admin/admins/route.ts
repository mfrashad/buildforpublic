import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { OWNER_EMAIL } from "@/lib/constants";

// Owner-only admin management. The owner (OWNER_EMAIL) can grant or revoke the
// Clerk `publicMetadata.role = "admin"` claim on any user by email. That role is
// what `requireAdmin` in convex/admin.ts checks (via the "convex" JWT template).
//
// Security: every handler re-verifies the caller is the owner server-side — the
// client UI gate is cosmetic.

type ClerkClient = Awaited<ReturnType<typeof clerkClient>>;
type ClerkUser = Awaited<ReturnType<ClerkClient["users"]["getUser"]>>;

function primaryEmail(user: ClerkUser): string | null {
  const e = user.emailAddresses.find((a) => a.id === user.primaryEmailAddressId);
  return e?.emailAddress?.toLowerCase() ?? null;
}

/** Returns the Clerk client if the caller is the owner, otherwise an error response. */
async function requireOwner(): Promise<
  { client: ClerkClient } | { error: NextResponse }
> {
  const { userId } = await auth();
  if (!userId) {
    return { error: NextResponse.json({ error: "Not authenticated." }, { status: 401 }) };
  }
  const client = await clerkClient();
  const me = await client.users.getUser(userId);
  if (primaryEmail(me) !== OWNER_EMAIL.toLowerCase()) {
    return { error: NextResponse.json({ error: "Not authorized." }, { status: 403 }) };
  }
  return { client };
}

function adminView(user: ClerkUser) {
  return {
    id: user.id,
    email: primaryEmail(user),
    name: [user.firstName, user.lastName].filter(Boolean).join(" ") || null,
    imageUrl: user.imageUrl,
    isOwner: primaryEmail(user) === OWNER_EMAIL.toLowerCase(),
  };
}

// ── List admins ─────────────────────────────────────────────────────────────
export async function GET() {
  const guard = await requireOwner();
  if ("error" in guard) return guard.error;
  const { client } = guard;

  const { data } = await client.users.getUserList({ limit: 200 });
  const admins = data
    .filter((u) => (u.publicMetadata as { role?: string })?.role === "admin")
    .map(adminView)
    // Owner first, then alphabetical by email.
    .sort((a, b) => Number(b.isOwner) - Number(a.isOwner) || (a.email ?? "").localeCompare(b.email ?? ""));

  return NextResponse.json({ admins });
}

// ── Grant admin by email ─────────────────────────────────────────────────────
export async function POST(req: Request) {
  const guard = await requireOwner();
  if ("error" in guard) return guard.error;
  const { client } = guard;

  const body = (await req.json().catch(() => ({}))) as { email?: unknown };
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email) {
    return NextResponse.json({ error: "An email is required." }, { status: 400 });
  }

  const { data } = await client.users.getUserList({ emailAddress: [email] });
  const target = data[0];
  if (!target) {
    return NextResponse.json(
      { error: `No account found for ${email}. They must sign in once before they can be made an admin.` },
      { status: 404 },
    );
  }

  await client.users.updateUserMetadata(target.id, {
    publicMetadata: { role: "admin" },
  });

  return NextResponse.json({ admin: adminView(target) });
}

// ── Revoke admin by id ───────────────────────────────────────────────────────
export async function DELETE(req: Request) {
  const guard = await requireOwner();
  if ("error" in guard) return guard.error;
  const { client } = guard;

  const id = new URL(req.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "A user id is required." }, { status: 400 });
  }

  const target = await client.users.getUser(id).catch(() => null);
  if (target && primaryEmail(target) === OWNER_EMAIL.toLowerCase()) {
    return NextResponse.json({ error: "The owner can't be removed." }, { status: 400 });
  }

  await client.users.updateUserMetadata(id, {
    publicMetadata: { role: null },
  });

  return NextResponse.json({ ok: true });
}
