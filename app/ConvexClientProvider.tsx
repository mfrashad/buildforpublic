"use client";

import { useEffect } from "react";
import { ConvexReactClient, useMutation } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth, useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";

const url = process.env.NEXT_PUBLIC_CONVEX_URL;
const convex = url ? new ConvexReactClient(url) : null;

function SyncUserImage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const patchImageUrl = useMutation(api.members.patchImageUrl);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user?.imageUrl) return;
    const key = `bfp_img_synced_${user.id}`;
    if (sessionStorage.getItem(key)) return;
    patchImageUrl({ clerkId: user.id, imageUrl: user.imageUrl }).then(() => {
      sessionStorage.setItem(key, "1");
    });
  }, [isLoaded, isSignedIn, user, patchImageUrl]);

  return null;
}

export function ConvexClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!convex) return <>{children}</>;
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <SyncUserImage />
      {children}
    </ConvexProviderWithClerk>
  );
}
