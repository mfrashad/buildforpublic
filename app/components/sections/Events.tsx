"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import MemberAvatarStack from "@/components/MemberAvatarStack";

const EVENT_SLUG = "cobuilding-kl-1";

export default function Events({ noBand = false }: { noBand?: boolean }) {
  const { user, isLoaded, isSignedIn } = useUser();
  const joinWaitlist = useMutation(api.eventRsvps.join);
  const count = useQuery(api.eventRsvps.count, { eventSlug: EVENT_SLUG });

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "duplicate">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoaded && isSignedIn && user?.primaryEmailAddress?.emailAddress) {
      setEmail(user.primaryEmailAddress.emailAddress);
    }
  }, [isLoaded, isSignedIn, user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    setStatus("loading");
    setError("");
    try {
      const result = await joinWaitlist({ eventSlug: EVENT_SLUG, email });
      setStatus(result.status === "already_registered" ? "duplicate" : "done");
    } catch {
      setError("Something went wrong. Try again.");
      setStatus("idle");
    }
  }

  const isDone = status === "done" || status === "duplicate";

  if (noBand) {
    return (
      <div className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
            <h2 className="text-2xl font-bold text-black" style={{ fontFamily: "var(--font-display)" }}>
              Next event.
            </h2>
            <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1.5 border-2 border-black bg-white rounded-full">
              Monthly · KL
            </span>
          </div>
          <div className="card overflow-hidden">
            <div className="h-2 w-full border-b-2 border-black" style={{ background: "#fff200" }} />
            <div className="p-8 flex flex-col sm:flex-row gap-8 items-start">
              <div className="flex-1">
                <p className="text-2xl text-black mb-3" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>
                  Build for Public — Co-building Meetup #1
                </p>
                <div className="flex flex-wrap gap-4 mb-4">
                  <span className="text-sm text-black/50 flex items-center gap-1.5">📅 Late June 2026</span>
                  <span className="text-sm text-black/50 flex items-center gap-1.5">📍 Kuala Lumpur, Malaysia</span>
                </div>
                <p className="text-sm text-black/60 leading-relaxed max-w-xl">
                  Pick a public-interest project from the board, form a team, and build for a few hours.
                  All skill levels welcome — designers, researchers, and non-coders too.
                </p>
                <div className="mt-4">
                  <MemberAvatarStack />
                </div>
              </div>
              <div className="flex-shrink-0 w-full sm:w-72">
                {isDone ? (
                  <div className="card-flat p-5 text-center">
                    <p className="text-2xl mb-1">🎉</p>
                    <p className="text-base text-black font-semibold mb-1" style={{ fontFamily: "var(--font-display)" }}>
                      {status === "duplicate" ? "You're already on the list!" : "You're on the list!"}
                    </p>
                    <p className="text-xs text-black/50">We'll email you when the date and venue are confirmed.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <p className="text-sm font-semibold text-black" style={{ fontFamily: "var(--font-display)" }}>
                      Get notified when it&apos;s confirmed
                    </p>
                    {isSignedIn ? (
                      <p className="text-xs text-black/50">Signing up as <span className="font-medium text-black">{email}</span></p>
                    ) : (
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="px-3 py-2 border-2 border-black rounded text-sm outline-none focus:ring-2 focus:ring-black/20 w-full"
                        required
                      />
                    )}
                    {error && <p className="text-xs text-red-600">{error}</p>}
                    <button type="submit" disabled={status === "loading"} className="btn-primary btn-primary-yellow w-full disabled:opacity-60">
                      {status === "loading" ? "Saving…" : "Join the waitlist →"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section
      className="band band-yellow section-padding px-6"
      aria-labelledby="events-heading"
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <h2 id="events-heading" className="heading-section">
            Next event.
          </h2>
          <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1.5 border-2 border-black bg-white rounded-full">
            Monthly · KL
          </span>
        </div>

        <div className="card overflow-hidden">
          <div className="h-2 w-full border-b-2 border-black" style={{ background: "#fff200" }} />
          <div className="p-8 flex flex-col sm:flex-row gap-8 items-start">
            {/* Event info */}
            <div className="flex-1">
              <p
                className="text-2xl text-black mb-3"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                Build for Public — Co-building Meetup #1
              </p>
              <div className="flex flex-wrap gap-4 mb-4">
                <span className="text-sm text-black/50 flex items-center gap-1.5">
                  📅 Late June 2026
                </span>
                <span className="text-sm text-black/50 flex items-center gap-1.5">
                  📍 Kuala Lumpur, Malaysia
                </span>
              </div>
              <p className="text-sm text-black/60 leading-relaxed max-w-xl">
                Pick a public-interest project from the board, form a team, and build for a few hours.
                All skill levels welcome — designers, researchers, and non-coders too.
              </p>
              {count !== undefined && count > 0 && (
                <p className="mt-3 text-xs text-black/40 font-medium">
                  {count} {count === 1 ? "person" : "people"} on the waitlist
                </p>
              )}
            </div>

            {/* Waitlist form */}
            <div className="flex-shrink-0 w-full sm:w-72">
              {isDone ? (
                <div className="card-flat p-5 text-center">
                  <p className="text-2xl mb-1">🎉</p>
                  <p
                    className="text-base text-black font-semibold mb-1"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {status === "duplicate" ? "You're already on the list!" : "You're on the list!"}
                  </p>
                  <p className="text-xs text-black/50">
                    We'll email you when the date and venue are confirmed.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  <p
                    className="text-sm font-semibold text-black"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Get notified when it&apos;s confirmed
                  </p>
                  {isSignedIn ? (
                    <p className="text-xs text-black/50">Signing up as <span className="font-medium text-black">{email}</span></p>
                  ) : (
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="px-3 py-2 border-2 border-black rounded text-sm outline-none focus:ring-2 focus:ring-black/20 w-full"
                      required
                    />
                  )}
                  {error && (
                    <p className="text-xs text-red-600">{error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="btn-primary btn-primary-yellow w-full disabled:opacity-60"
                  >
                    {status === "loading" ? "Saving…" : "Join the waitlist →"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
