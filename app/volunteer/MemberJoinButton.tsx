"use client";

import { useUser, SignInButton } from "@clerk/nextjs";

export default function MemberJoinButton() {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return (
      <div className="btn-primary btn-primary-yellow w-full text-center opacity-80 cursor-default">
        ✓ Joined
      </div>
    );
  }

  return (
    <SignInButton mode="modal" forceRedirectUrl="/profile">
      <button className="btn-primary btn-primary-yellow w-full">
        Join →
      </button>
    </SignInButton>
  );
}
