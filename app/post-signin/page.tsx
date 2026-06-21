"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// Routes a user after sign-in: admins → the admin dashboard, everyone else →
// their profile. Used as the redirect target for the navbar / access-denied
// sign-in buttons.
export default function PostSignIn() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.replace("/sign-in");
      return;
    }
    const isAdmin = user?.publicMetadata?.role === "admin";
    router.replace(isAdmin ? "/admin" : "/profile");
  }, [isLoaded, isSignedIn, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-black/40 text-sm animate-pulse">Signing you in…</p>
    </div>
  );
}
