import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { OWNER_EMAIL } from "@/lib/constants";

// Admin-accessible roster of all users with the admin role. Used to populate the
// "Assigned to" dropdowns in the outreach tabs. Unlike /api/admin/admins (which
// is owner-only and mutates roles), this is read-only and any admin may call it.

type ClerkClient = Awaited<ReturnType<typeof clerkClient>>;
type ClerkUser = Awaited<ReturnType<ClerkClient["users"]["getUser"]>>;

function primaryEmail(user: ClerkUser): string | null {
  const e = user.emailAddresses.find((a) => a.id === user.primaryEmailAddressId);
  return e?.emailAddress ?? null;
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const client = await clerkClient();
  const me = await client.users.getUser(userId);
  const myEmail = primaryEmail(me)?.toLowerCase();
  const isAdmin = (me.publicMetadata as { role?: string })?.role === "admin";
  if (!isAdmin && myEmail !== OWNER_EMAIL.toLowerCase()) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const { data } = await client.users.getUserList({ limit: 200 });
  const members = data
    .filter((u) => (u.publicMetadata as { role?: string })?.role === "admin")
    .map((u) => {
      const email = primaryEmail(u);
      const name = [u.firstName, u.lastName].filter(Boolean).join(" ").trim();
      return { id: u.id, email, name: name || null, label: name || email || u.id };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

  return NextResponse.json({ members });
}
