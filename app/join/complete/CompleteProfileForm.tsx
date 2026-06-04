"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";

const SKILLS = [
  "Frontend",
  "Backend",
  "AI / ML",
  "Mobile",
  "Design",
  "Product",
  "Research",
  "Content",
  "Writing",
  "Community / Events",
  "Other",
];

const CAUSES = [
  "Education",
  "Environment",
  "Health",
  "Poverty",
  "Human Rights",
  "Gender Equality",
  "Digital Access",
  "Civic Tech",
  "Open Knowledge",
  "AI Literacy",
  "AI Safety",
  "Mental Health",
  "Animal Welfare",
  "Other",
];

interface FormData {
  country: string;
  city: string;
  bio: string;
  skills: string[];
  causes: string[];
  linkedin: string;
  github: string;
  twitter: string;
  instagram: string;
  isPublic: boolean;
  currentStatus: "student" | "working" | "";
  university: string;
  company: string;
  position: string;
}

type Errors = Partial<Record<keyof FormData, string>>;

function toggle<T extends string>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
}

function validate(d: FormData): Errors {
  const e: Errors = {};
  if (!d.country.trim()) e.country = "Required";
  return e;
}

const inputBase =
  "w-full bg-surface border border-black rounded-xl px-4 py-2.5 text-black text-sm focus:outline-none focus:border-black/50 transition-colors placeholder:text-black/30";

function ErrMsg({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-xs text-red-600 mt-1.5">{msg}</p>;
}

function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-black/60 mb-1.5">
      {text}
      {required && <span className="text-clay ml-0.5">*</span>}
    </label>
  );
}

function PillToggle({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`btn-pill text-sm py-1.5 px-4 transition-all ${active ? "btn-pill-filled" : "btn-pill-outline"}`}
    >
      {label}
    </button>
  );
}

export default function CompleteProfileForm() {
  const { user } = useUser();
  const create = useMutation(api.members.create);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [d, setD] = useState<FormData>({
    country: "",
    city: "",
    bio: "",
    skills: [],
    causes: [],
    linkedin: "",
    github: "",
    twitter: "",
    instagram: "",
    isPublic: true,
    currentStatus: "",
    university: "",
    company: "",
    position: "",
  });

  function set<K extends keyof FormData>(k: K, v: FormData[K]) {
    setD((prev) => ({ ...prev, [k]: v }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }));
  }

  if (status === "success") {
    return (
      <div className="text-center py-8">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl border-2 border-black"
          style={{ background: "#fff200" }}
        >
          ✓
        </div>
        <h3
          className="text-2xl text-black mb-3"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
        >
          Welcome, {user?.firstName || "builder"}!
        </h3>
        <p className="text-black/60 text-sm mb-6">You&apos;re now part of Build for Public.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="/community" className="btn-pill btn-pill-filled text-sm px-6 py-2.5">
            See the community →
          </a>
          <a href="/directory" className="btn-pill btn-pill-outline text-sm px-6 py-2.5">
            Browse projects
          </a>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(d);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    if (!user) { setServerError("Not signed in."); return; }

    setStatus("submitting");
    setServerError(null);
    try {
      await create({
        name: user.fullName || user.firstName || "Member",
        email: user.primaryEmailAddress?.emailAddress ?? "",
        country: d.country.trim(),
        city: d.city || undefined,
        bio: d.bio || undefined,
        skills: d.skills.length ? d.skills : undefined,
        causes: d.causes.length ? d.causes : undefined,
        linkedin: d.linkedin || undefined,
        github: d.github || undefined,
        twitter: d.twitter || undefined,
        instagram: d.instagram || undefined,
        isPublic: d.isPublic,
        currentStatus: d.currentStatus || undefined,
        university: d.currentStatus === "student" ? d.university || undefined : undefined,
        company: d.currentStatus === "working" ? d.company || undefined : undefined,
        position: d.currentStatus === "working" ? d.position || undefined : undefined,
      });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">

      {/* Pre-filled from Clerk */}
      {user && (
        <div className="card-flat p-4 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{ background: "#fff200" }}
          >
            {(user.firstName?.[0] ?? user.emailAddresses[0]?.emailAddress[0] ?? "?").toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-black">{user.fullName || user.firstName}</p>
            <p className="text-xs text-black/50">{user.primaryEmailAddress?.emailAddress}</p>
          </div>
        </div>
      )}

      {/* Location */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div id="field-country">
          <Label text="Country" required />
          <input
            type="text"
            value={d.country}
            onChange={(e) => set("country", e.target.value)}
            className={inputBase}
            placeholder="Malaysia"
          />
          <ErrMsg msg={errors.country} />
        </div>
        <div>
          <Label text="City" />
          <input
            type="text"
            value={d.city}
            onChange={(e) => set("city", e.target.value)}
            className={inputBase}
            placeholder="Kuala Lumpur"
          />
        </div>
        <div className="sm:col-span-2">
          <Label text="Short bio" />
          <div className="relative">
            <textarea
              value={d.bio}
              onChange={(e) => set("bio", e.target.value)}
              maxLength={200}
              rows={2}
              className={inputBase}
              placeholder="What you do, what you care about — one or two sentences."
            />
            <span className="absolute bottom-2.5 right-3 text-xs text-black/30 select-none pointer-events-none">
              {d.bio.length}/200
            </span>
          </div>
        </div>
      </div>

      {/* Current status */}
      <div className="space-y-4">
        <div>
          <Label text="Current status" />
          <select
            value={d.currentStatus}
            onChange={(e) => set("currentStatus", e.target.value as FormData["currentStatus"])}
            className={inputBase}
          >
            <option value="">Select…</option>
            <option value="student">Student</option>
            <option value="working">Working</option>
          </select>
        </div>
        {d.currentStatus === "student" && (
          <div>
            <Label text="University" />
            <input
              type="text"
              value={d.university}
              onChange={(e) => set("university", e.target.value)}
              className={inputBase}
              placeholder="Universiti Malaya"
            />
          </div>
        )}
        {d.currentStatus === "working" && (
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <Label text="Company" />
              <input
                type="text"
                value={d.company}
                onChange={(e) => set("company", e.target.value)}
                className={inputBase}
                placeholder="Acme Sdn Bhd"
              />
            </div>
            <div>
              <Label text="Position" />
              <input
                type="text"
                value={d.position}
                onChange={(e) => set("position", e.target.value)}
                className={inputBase}
                placeholder="Software Engineer"
              />
            </div>
          </div>
        )}
      </div>

      {/* Skills */}
      <div>
        <Label text="What you work with" />
        <div className="flex flex-wrap gap-2.5 mt-1">
          {SKILLS.map((skill) => (
            <PillToggle
              key={skill}
              label={skill}
              active={d.skills.includes(skill)}
              onClick={() => set("skills", toggle(d.skills, skill))}
            />
          ))}
        </div>
      </div>

      {/* Causes */}
      <div>
        <Label text="Causes you care about" />
        <div className="flex flex-wrap gap-2.5 mt-1">
          {CAUSES.map((cause) => (
            <PillToggle
              key={cause}
              label={cause}
              active={d.causes.includes(cause)}
              onClick={() => set("causes", toggle(d.causes, cause))}
            />
          ))}
        </div>
      </div>

      {/* Socials */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label text="LinkedIn" />
          <input type="url" value={d.linkedin} onChange={(e) => set("linkedin", e.target.value)} className={inputBase} placeholder="https://linkedin.com/in/..." />
        </div>
        <div>
          <Label text="GitHub" />
          <input type="text" value={d.github} onChange={(e) => set("github", e.target.value)} className={inputBase} placeholder="yourusername" />
        </div>
        <div>
          <Label text="Twitter / X" />
          <input type="text" value={d.twitter} onChange={(e) => set("twitter", e.target.value)} className={inputBase} placeholder="@handle" />
        </div>
        <div>
          <Label text="Instagram" />
          <input type="text" value={d.instagram} onChange={(e) => set("instagram", e.target.value)} className={inputBase} placeholder="@handle" />
        </div>
      </div>

      {/* Directory opt-in */}
      <div className="flex items-start gap-3">
        <input
          id="isPublic"
          type="checkbox"
          checked={d.isPublic}
          onChange={(e) => set("isPublic", e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded border-black accent-yellow flex-shrink-0 cursor-pointer"
        />
        <label htmlFor="isPublic" className="text-sm text-black/60 cursor-pointer leading-relaxed">
          Show my profile in the community directory — name, location, skills, and social links. Email is never shown.
        </label>
      </div>

      {serverError && (
        <div className="card-flat p-4 border border-red-500/30 rounded-xl">
          <p className="text-sm text-red-600">{serverError}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-pill btn-pill-filled text-base px-10 py-3 w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Saving…" : "Complete profile →"}
      </button>
    </form>
  );
}
