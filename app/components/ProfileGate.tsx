"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";

const EXEMPT = ["/join/complete", "/sign-up", "/sign-in", "/join"];

export default function ProfileGate() {
  const { isSignedIn, isLoaded, user } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  const member = useQuery(
    api.members.getByClerkId,
    isSignedIn && user ? { clerkId: user.id } : "skip"
  );

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    if (EXEMPT.some((p) => pathname.startsWith(p))) return;
    // member === undefined means query is loading; null means no record
    if (member === null) {
      router.replace("/join/complete");
    }
  }, [isLoaded, isSignedIn, member, pathname, router]);

  return null;
}
