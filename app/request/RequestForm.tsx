"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const ORG_TYPES = [
  { value: "ngo", label: "NGO (Non-Governmental Organisation)" },
  { value: "nonprofit", label: "Nonprofit / charity" },
  { value: "public-sector", label: "Public sector / government" },
  { value: "community", label: "Community group" },
  { value: "other", label: "Other" },
] as const;

type OrgType = (typeof ORG_TYPES)[number]["value"];

const REFERRAL_SOURCES = [
  "Word of mouth",
  "LinkedIn",
  "Twitter / X",
  "Google search",
  "Partner community",
  "Event",
  "Other",
];

interface FormData {
  contactName: string;
  contactEmail: string;
  orgName: string;
  orgWebsite: string;
  orgType: OrgType | "";
  country: string;
  problem: string;
  whoItHelps: string;
  currentSolution: string;
  idealOutcome: string;
  timeline: string;
  budget: string;
  acknowledgesOpenSource: boolean;
  referralSource: string;
  notes: string;
}

type Errors = Partial<Record<keyof FormData, string>>;

const INITIAL: FormData = {
  contactName: "",
  contactEmail: "",
  orgName: "",
  orgWebsite: "",
  orgType: "",
  country: "",
  problem: "",
  whoItHelps: "",
  currentSolution: "",
  idealOutcome: "",
  timeline: "",
  budget: "",
  acknowledgesOpenSource: false,
  referralSource: "",
  notes: "",
};

function validate(d: FormData): Errors {
  const e: Errors = {};
  if (!d.contactName.trim()) e.contactName = "Required";
  if (!d.contactEmail.trim()) e.contactEmail = "Required";
  else if (!/^\S+@\S+\.\S+$/.test(d.contactEmail)) e.contactEmail = "Enter a valid email";
  if (!d.orgName.trim()) e.orgName = "Required";
  if (!d.country.trim()) e.country = "Required";
  if (!d.problem.trim()) e.problem = "Required";
  else if (d.problem.trim().length < 20) e.problem = "Please describe the problem in more detail (20 chars min)";
  if (!d.whoItHelps.trim()) e.whoItHelps = "Required";
  if (!d.acknowledgesOpenSource) e.acknowledgesOpenSource = "You must acknowledge the open-source terms";
  return e;
}

const inputBase =
  "w-full bg-surface border border-black rounded-xl px-4 py-2.5 text-black text-sm focus:outline-none focus:border-black/50 transition-colors placeholder:text-black/60/40";

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

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-base font-semibold text-black mb-5 pb-2.5 border-b border-black">
      {children}
    </h3>
  );
}

function SuccessCard() {
  return (
    <div className="card-flat p-10 text-center max-w-md mx-auto">
      <div className="w-16 h-16 rounded-full bg-olive/20 flex items-center justify-center mx-auto mb-6 text-3xl text-olive">
        ✓
      </div>
      <h3
        className="text-2xl text-black mb-3"
        style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
      >
        Request submitted!
      </h3>
      <p className="text-black/60 text-sm leading-relaxed">
        Thanks for reaching out. We&apos;ll review your request and get back to you
        within 48 hours to schedule a 30-minute scoping call.
      </p>
    </div>
  );
}

export default function RequestForm() {
  const create = useMutation(api.projectRequests.create);
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
      const firstKey = Object.keys(errs)[0];
      document
        .getElementById(`field-${firstKey}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setStatus("submitting");
    setServerError(null);
    try {
      await create({
        contactName: d.contactName.trim(),
        contactEmail: d.contactEmail.trim(),
        orgName: d.orgName.trim(),
        orgWebsite: d.orgWebsite || undefined,
        orgType: d.orgType as OrgType || undefined,
        country: d.country.trim(),
        problem: d.problem.trim(),
        whoItHelps: d.whoItHelps.trim(),
        currentSolution: d.currentSolution || undefined,
        idealOutcome: d.idealOutcome || undefined,
        timeline: d.timeline || undefined,
        budget: d.budget || undefined,
        acknowledgesOpenSource: d.acknowledgesOpenSource,
        referralSource: d.referralSource || undefined,
        notes: d.notes || undefined,
      });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setServerError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    }
  }

  if (status === "success") return <SuccessCard />;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-10">

      {/* ── 1. Your organisation ── */}
      <div>
        <SectionHeading>Your organisation</SectionHeading>
        <div className="grid sm:grid-cols-2 gap-5">
          <div id="field-contactName">
            <Label text="Your name" required />
            <input
              type="text"
              value={d.contactName}
              onChange={(e) => set("contactName", e.target.value)}
              className={inputBase}
              placeholder="Your full name"
            />
            <ErrMsg msg={errors.contactName} />
          </div>
          <div id="field-contactEmail">
            <Label text="Your email" required />
            <input
              type="email"
              value={d.contactEmail}
              onChange={(e) => set("contactEmail", e.target.value)}
              className={inputBase}
              placeholder="you@yourorg.org"
            />
            <ErrMsg msg={errors.contactEmail} />
          </div>
          <div id="field-orgName">
            <Label text="Organisation name" required />
            <input
              type="text"
              value={d.orgName}
              onChange={(e) => set("orgName", e.target.value)}
              className={inputBase}
              placeholder="Your organisation"
            />
            <ErrMsg msg={errors.orgName} />
          </div>
          <div>
            <Label text="Organisation website" />
            <input
              type="url"
              value={d.orgWebsite}
              onChange={(e) => set("orgWebsite", e.target.value)}
              className={inputBase}
              placeholder="https://..."
            />
          </div>
          <div>
            <Label text="Organisation type" />
            <select
              value={d.orgType}
              onChange={(e) => set("orgType", e.target.value as OrgType)}
              className={inputBase}
            >
              <option value="">Select one...</option>
              {ORG_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
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
        </div>
      </div>

      {/* ── 2. The problem ── */}
      <div>
        <SectionHeading>The problem</SectionHeading>
        <div className="space-y-5">
          <div id="field-problem">
            <Label text="Describe the problem you want solved" required />
            <p className="text-xs text-black/60/60 mb-2">
              Don&apos;t describe the solution — describe the problem. What&apos;s hard, slow, or broken?
            </p>
            <div className="relative">
              <textarea
                value={d.problem}
                onChange={(e) => set("problem", e.target.value)}
                maxLength={1000}
                rows={4}
                className={inputBase}
                placeholder="Example: We track donations from 500+ donors across 3 spreadsheets. Reconciling them at month-end takes 2 days and we make errors..."
              />
              <span className="absolute bottom-2.5 right-3 text-xs text-black/60/40 select-none pointer-events-none">
                {d.problem.length}/1000
              </span>
            </div>
            <ErrMsg msg={errors.problem} />
          </div>
          <div id="field-whoItHelps">
            <Label text="Who does this help?" required />
            <input
              type="text"
              value={d.whoItHelps}
              onChange={(e) => set("whoItHelps", e.target.value)}
              className={inputBase}
              placeholder="E.g. our 500 scholarship students, the staff who process applications, rural communities we serve..."
            />
            <ErrMsg msg={errors.whoItHelps} />
          </div>
          <div>
            <Label text="How do you handle this today?" />
            <textarea
              value={d.currentSolution}
              onChange={(e) => set("currentSolution", e.target.value)}
              maxLength={500}
              rows={3}
              className={inputBase}
              placeholder="Manual process, spreadsheets, nothing, an expensive tool that doesn't quite fit..."
            />
          </div>
          <div>
            <Label text="What does success look like?" />
            <textarea
              value={d.idealOutcome}
              onChange={(e) => set("idealOutcome", e.target.value)}
              maxLength={500}
              rows={3}
              className={inputBase}
              placeholder="In 6 months, if this is solved, what changes for you or the people you serve?"
            />
          </div>
        </div>
      </div>

      {/* ── 3. Details ── */}
      <div>
        <SectionHeading>Details (optional)</SectionHeading>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <Label text="Is there a timeline or deadline?" />
            <input
              type="text"
              value={d.timeline}
              onChange={(e) => set("timeline", e.target.value)}
              className={inputBase}
              placeholder="E.g. before our annual gala in August, or no deadline"
            />
          </div>
          <div>
            <Label text="Is there any budget?" />
            <input
              type="text"
              value={d.budget}
              onChange={(e) => set("budget", e.target.value)}
              className={inputBase}
              placeholder="E.g. none, small grant ~RM500, open to discussion"
            />
          </div>
          <div>
            <Label text="How did you hear about us?" />
            <select
              value={d.referralSource}
              onChange={(e) => set("referralSource", e.target.value)}
              className={inputBase}
            >
              <option value="">Select one...</option>
              {REFERRAL_SOURCES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label text="Anything else?" />
            <textarea
              value={d.notes}
              onChange={(e) => set("notes", e.target.value)}
              maxLength={500}
              rows={3}
              className={inputBase}
              placeholder="Questions, context, anything we should know..."
            />
          </div>
        </div>
      </div>

      {/* ── 4. Acknowledgement ── */}
      <div id="field-acknowledgesOpenSource" className="flex items-start gap-3 pt-2">
        <input
          id="acknowledgesOpenSource"
          type="checkbox"
          checked={d.acknowledgesOpenSource}
          onChange={(e) => set("acknowledgesOpenSource", e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded border-black accent-yellow flex-shrink-0 cursor-pointer"
        />
        <div>
          <label
            htmlFor="acknowledgesOpenSource"
            className="text-sm text-black/60 cursor-pointer leading-relaxed"
          >
            I understand that Build for Public is{" "}
            <span className="text-black font-medium">volunteer-run</span>, that
            everything built will be{" "}
            <span className="text-black font-medium">open-source under MIT licence</span>,
            and that{" "}
            <span className="text-black font-medium">
              timelines are best-effort, not guaranteed
            </span>
            . <span className="text-clay">*</span>
          </label>
          <ErrMsg msg={errors.acknowledgesOpenSource} />
        </div>
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
        {status === "submitting" ? "Submitting…" : "Submit request →"}
      </button>
    </form>
  );
}
