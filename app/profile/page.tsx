"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";

const SKILLS = [
  "Frontend",
  "Backend",
  "Mobile",
  "AI / ML",
  "Design",
  "Product",
  "Content creator",
  "Advocacy",
  "Research",
  "NGO ops",
  "Event host",
  "Community building",
  "Other",
];

const CAUSES = [
  "AI literacy",
  "AI safety",
  "Education",
  "Poverty",
  "Climate",
  "Healthcare",
  "Legal aid",
  "Refugee support",
  "Gender equity",
  "Digital rights",
  "Mental health",
  "Open source",
];

function PillToggle({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`btn-pill text-sm py-1.5 px-4 transition-all ${
        active ? "btn-pill-filled" : "btn-pill-outline"
      }`}
    >
      {label}
    </button>
  );
}

function toggle(arr: string[], item: string): string[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
}

const inputBase =
  "w-full bg-surface border border-black rounded-xl px-4 py-2.5 text-black text-sm focus:outline-none focus:border-black/50 transition-colors placeholder:text-black/40";

export default function ProfilePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const upsert = useMutation(api.profiles.upsert);
  const existing = useQuery(
    api.profiles.getByClerkId,
    isLoaded && isSignedIn ? { clerkId: user!.id } : "skip"
  );

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [causes, setCauses] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  // Pre-fill from existing profile or Clerk data
  useEffect(() => {
    if (existing) {
      setName(existing.name ?? user?.fullName ?? "");
      setBio(existing.bio ?? "");
      setInstagram(existing.instagram ?? "");
      setLinkedin(existing.linkedin ?? "");
      setTwitter(existing.twitter ?? "");
      setSkills(existing.skills ?? []);
      setCauses(existing.causes ?? []);
    } else if (existing === null && user) {
      setName(user.fullName ?? "");
    }
  }, [existing, user]);

  // Redirect signed-out users
  useEffect(() => {
    if (isLoaded && !isSignedIn) router.replace("/volunteer");
  }, [isLoaded, isSignedIn, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setStatus("saving");
    await upsert({
      clerkId: user.id,
      name: name.trim() || undefined,
      bio: bio.trim() || undefined,
      instagram: instagram.trim() || undefined,
      linkedin: linkedin.trim() || undefined,
      twitter: twitter.trim() || undefined,
      skills: skills.length ? skills : undefined,
      causes: causes.length ? causes : undefined,
    });
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 2500);
  }

  if (!isLoaded || existing === undefined) {
    return (
      <main>
        <Navbar />
        <div className="pt-40 pb-24 text-center text-black/40 text-sm">Loading…</div>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Navbar />

      <section className="pt-36 pb-24 px-6">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="flex items-center gap-4 mb-10">
            {user?.imageUrl && (
              <img
                src={user.imageUrl}
                alt={user.fullName ?? "Profile"}
                className="w-16 h-16 rounded-full border-2 border-black object-cover"
              />
            )}
            <div>
              <h1
                className="text-3xl text-black"
                style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
              >
                Your profile
              </h1>
              <p className="text-sm text-black/50 mt-0.5">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">

            {/* ── Basic info ── */}
            <div>
              <h2 className="text-base font-semibold text-black mb-5 pb-2.5 border-b border-black">
                About you
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black/60 mb-1.5">Display name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={user?.fullName ?? "Your name"}
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black/60 mb-1.5">Bio</label>
                  <div className="relative">
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      maxLength={300}
                      rows={3}
                      placeholder="A sentence or two about what you do and why you care…"
                      className={inputBase}
                    />
                    <span className="absolute bottom-2.5 right-3 text-xs text-black/30 pointer-events-none">
                      {bio.length}/300
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Social links ── */}
            <div>
              <h2 className="text-base font-semibold text-black mb-5 pb-2.5 border-b border-black">
                Social links
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black/60 mb-1.5">LinkedIn</label>
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/yourhandle"
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black/60 mb-1.5">X / Twitter</label>
                  <input
                    type="text"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="@yourhandle"
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black/60 mb-1.5">Instagram</label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="@yourhandle"
                    className={inputBase}
                  />
                </div>
              </div>
            </div>

            {/* ── Skills ── */}
            <div>
              <h2 className="text-base font-semibold text-black mb-1.5 pb-2.5 border-b border-black">
                Skills
              </h2>
              <p className="text-xs text-black/40 mb-4">What do you bring to the table?</p>
              <div className="flex flex-wrap gap-2.5">
                {SKILLS.map((s) => (
                  <PillToggle
                    key={s}
                    label={s}
                    active={skills.includes(s)}
                    onClick={() => setSkills(toggle(skills, s))}
                  />
                ))}
              </div>
            </div>

            {/* ── Causes ── */}
            <div>
              <h2 className="text-base font-semibold text-black mb-1.5 pb-2.5 border-b border-black">
                Causes you care about
              </h2>
              <p className="text-xs text-black/40 mb-4">Pick as many as resonate.</p>
              <div className="flex flex-wrap gap-2.5">
                {CAUSES.map((c) => (
                  <PillToggle
                    key={c}
                    label={c}
                    active={causes.includes(c)}
                    onClick={() => setCauses(toggle(causes, c))}
                  />
                ))}
              </div>
            </div>

            {/* ── Submit ── */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={status === "saving"}
                className="btn-pill btn-pill-filled px-10 py-3 disabled:opacity-60"
              >
                {status === "saving" ? "Saving…" : "Save profile →"}
              </button>
              {status === "saved" && (
                <span className="text-sm text-green-600 font-medium">✓ Saved</span>
              )}
            </div>

          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
