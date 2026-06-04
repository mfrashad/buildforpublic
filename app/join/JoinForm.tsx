"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
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
  name: string;
  email: string;
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
}

type Errors = Partial<Record<keyof FormData, string>>;

const INITIAL: FormData = {
  name: "",
  email: "",
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
};

function toggle<T extends string>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
}

function validate(d: FormData): Errors {
  const e: Errors = {};
  if (!d.name.trim()) e.name = "Required";
  if (!d.email.trim()) e.email = "Required";
  else if (!/^\S+@\S+\.\S+$/.test(d.email)) e.email = "Enter a valid email";
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

function SuccessCard({ name }: { name: string }) {
  return (
    <div className="card-flat p-10 text-center max-w-md mx-auto">
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
        Welcome, {name.split(" ")[0]}!
      </h3>
      <p className="text-black/60 text-sm leading-relaxed mb-6">
        You&apos;re now part of Build for Public. Check the community directory
        to see who else is building.
      </p>
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

export default function JoinForm() {
  const create = useMutation(api.members.create);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [d, setD] = useState<FormData>(INITIAL);

  function set<K extends keyof FormData>(k: K, v: FormData[K]) {
    setD((prev) => ({ ...prev, [k]: v }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(d);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setStatus("submitting");
    setServerError(null);
    try {
      await create({
        name: d.name.trim(),
        email: d.email.trim(),
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
      });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setServerError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    }
  }

  if (status === "success") return <SuccessCard name={d.name} />;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">

      {/* ── 1. Basic info ── */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div id="field-name">
          <Label text="Your name" required />
          <input
            type="text"
            value={d.name}
            onChange={(e) => set("name", e.target.value)}
            className={inputBase}
            placeholder="Your name"
          />
          <ErrMsg msg={errors.name} />
        </div>
        <div id="field-email">
          <Label text="Email" required />
          <input
            type="email"
            value={d.email}
            onChange={(e) => set("email", e.target.value)}
            className={inputBase}
            placeholder="you@example.com"
          />
          <ErrMsg msg={errors.email} />
        </div>
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

      {/* ── 2. Skills ── */}
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

      {/* ── 3. Causes ── */}
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

      {/* ── 4. Socials ── */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label text="LinkedIn" />
          <input
            type="url"
            value={d.linkedin}
            onChange={(e) => set("linkedin", e.target.value)}
            className={inputBase}
            placeholder="https://linkedin.com/in/..."
          />
        </div>
        <div>
          <Label text="GitHub" />
          <input
            type="text"
            value={d.github}
            onChange={(e) => set("github", e.target.value)}
            className={inputBase}
            placeholder="yourusername"
          />
        </div>
        <div>
          <Label text="Twitter / X" />
          <input
            type="text"
            value={d.twitter}
            onChange={(e) => set("twitter", e.target.value)}
            className={inputBase}
            placeholder="@handle"
          />
        </div>
        <div>
          <Label text="Instagram" />
          <input
            type="text"
            value={d.instagram}
            onChange={(e) => set("instagram", e.target.value)}
            className={inputBase}
            placeholder="@handle"
          />
        </div>
      </div>

      {/* ── 5. Directory opt-in ── */}
      <div className="flex items-start gap-3">
        <input
          id="isPublic"
          type="checkbox"
          checked={d.isPublic}
          onChange={(e) => set("isPublic", e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded border-black accent-yellow flex-shrink-0 cursor-pointer"
        />
        <label htmlFor="isPublic" className="text-sm text-black/60 cursor-pointer leading-relaxed">
          Show my profile in the{" "}
          <a href="/community" className="text-black underline underline-offset-2">
            community directory
          </a>{" "}
          — your name, location, skills, and social links. Your email is never shown.
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
        {status === "submitting" ? "Joining…" : "Join Build for Public →"}
      </button>
    </form>
  );
}
