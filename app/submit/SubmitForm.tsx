"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const SKILL_OPTIONS = [
  "Frontend",
  "Backend",
  "AI / ML",
  "Mobile",
  "Design",
  "Product",
  "Research",
  "Content",
  "Other",
];

interface FormData {
  title: string;
  summary: string;
  description: string;
  submitterName: string;
  submitterEmail: string;
  link: string;
  repoLink: string;
  tags: string[];
  skillsNeeded: string[];
}

type Errors = Partial<Record<keyof FormData, string>>;

const INITIAL: FormData = {
  title: "",
  summary: "",
  description: "",
  submitterName: "",
  submitterEmail: "",
  link: "",
  repoLink: "",
  tags: [],
  skillsNeeded: [],
};

function toggle<T extends string>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
}

function validate(d: FormData): Errors {
  const e: Errors = {};
  if (!d.title.trim()) e.title = "Required";
  if (!d.summary.trim()) e.summary = "Required";
  if (!d.description.trim()) e.description = "Required";
  else if (d.description.trim().length < 20) e.description = "Please add more detail (20 chars min)";
  if (!d.submitterName.trim()) e.submitterName = "Required";
  if (!d.submitterEmail.trim()) e.submitterEmail = "Required";
  else if (!/^\S+@\S+\.\S+$/.test(d.submitterEmail)) e.submitterEmail = "Enter a valid email";
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

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-base font-semibold text-black mb-5 pb-2.5 border-b border-black">
      {children}
    </h3>
  );
}

function SuccessCard({ title }: { title: string }) {
  return (
    <div className="card-flat p-10 text-center max-w-md mx-auto">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl border-2 border-black"
        style={{ background: "#fff200" }}
      >
        ✓
      </div>
      <h3 className="text-2xl text-black mb-3" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>
        Project submitted!
      </h3>
      <p className="text-black/60 text-sm leading-relaxed mb-6">
        &ldquo;{title}&rdquo; is under review. We&apos;ll publish it to the Projects Board once we&apos;ve had a look.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a href="/directory" className="btn-pill btn-pill-filled text-sm px-6 py-2.5">
          View the board →
        </a>
        <a href="/submit" className="btn-pill btn-pill-outline text-sm px-6 py-2.5">
          Submit another
        </a>
      </div>
    </div>
  );
}

export default function SubmitForm() {
  const create = useMutation(api.communityProjects.create);
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
        title: d.title.trim(),
        summary: d.summary.trim(),
        description: d.description.trim(),
        submitterName: d.submitterName.trim(),
        submitterEmail: d.submitterEmail.trim(),
        link: d.link || undefined,
        repoLink: d.repoLink || undefined,
        tags: d.tags.length ? d.tags : undefined,
        skillsNeeded: d.skillsNeeded.length ? d.skillsNeeded : undefined,
      });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") return <SuccessCard title={d.title} />;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-10">

      {/* ── Project details ── */}
      <div>
        <SectionHeading>About the project</SectionHeading>
        <div className="space-y-5">
          <div id="field-title">
            <Label text="Project name" required />
            <input type="text" value={d.title} onChange={(e) => set("title", e.target.value)} className={inputBase} placeholder="e.g. NGO Donor Tracker" />
            <ErrMsg msg={errors.title} />
          </div>
          <div id="field-summary">
            <Label text="One-line description" required />
            <input type="text" value={d.summary} onChange={(e) => set("summary", e.target.value)} className={inputBase} placeholder="What it does in one sentence" />
            <ErrMsg msg={errors.summary} />
          </div>
          <div id="field-description">
            <Label text="Full description" required />
            <div className="relative">
              <textarea
                value={d.description}
                onChange={(e) => set("description", e.target.value)}
                maxLength={1000}
                rows={4}
                className={inputBase}
                placeholder="What problem does it solve? Who is it for? What did you build?"
              />
              <span className="absolute bottom-2.5 right-3 text-xs text-black/30 select-none pointer-events-none">
                {d.description.length}/1000
              </span>
            </div>
            <ErrMsg msg={errors.description} />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <Label text="Live site URL" />
              <input type="url" value={d.link} onChange={(e) => set("link", e.target.value)} className={inputBase} placeholder="https://..." />
            </div>
            <div>
              <Label text="GitHub / repo URL" />
              <input type="url" value={d.repoLink} onChange={(e) => set("repoLink", e.target.value)} className={inputBase} placeholder="https://github.com/..." />
            </div>
          </div>
        </div>
      </div>

      {/* ── Skills needed ── */}
      <div>
        <SectionHeading>Skills & tags</SectionHeading>
        <div className="space-y-4">
          <div>
            <Label text="Skills needed (if looking for contributors)" />
            <div className="flex flex-wrap gap-2.5 mt-1">
              {SKILL_OPTIONS.map((s) => (
                <PillToggle key={s} label={s} active={d.skillsNeeded.includes(s)} onClick={() => set("skillsNeeded", toggle(d.skillsNeeded, s))} />
              ))}
            </div>
          </div>
          <div>
            <Label text="Tags" />
            <input
              type="text"
              placeholder="e.g. Next.js, NGO, Open Data — press Enter to add"
              className={inputBase}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const val = (e.target as HTMLInputElement).value.trim();
                  if (val && !d.tags.includes(val)) {
                    set("tags", [...d.tags, val]);
                    (e.target as HTMLInputElement).value = "";
                  }
                }
              }}
            />
            {d.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {d.tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => set("tags", d.tags.filter((t) => t !== tag))}
                    className="text-xs px-2.5 py-1 bg-surface border border-black rounded-full hover:bg-black/5 transition-colors"
                  >
                    {tag} ×
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Your info ── */}
      <div>
        <SectionHeading>Your details</SectionHeading>
        <div className="grid sm:grid-cols-2 gap-5">
          <div id="field-submitterName">
            <Label text="Your name" required />
            <input type="text" value={d.submitterName} onChange={(e) => set("submitterName", e.target.value)} className={inputBase} placeholder="Your name" />
            <ErrMsg msg={errors.submitterName} />
          </div>
          <div id="field-submitterEmail">
            <Label text="Your email" required />
            <input type="email" value={d.submitterEmail} onChange={(e) => set("submitterEmail", e.target.value)} className={inputBase} placeholder="you@example.com" />
            <ErrMsg msg={errors.submitterEmail} />
          </div>
        </div>
        <p className="text-xs text-black/40 mt-3">Your email is never shown publicly. Used only to reach you if needed.</p>
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
        {status === "submitting" ? "Posting…" : "Post project →"}
      </button>
    </form>
  );
}
