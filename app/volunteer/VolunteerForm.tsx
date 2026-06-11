"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  MAX_POSITIONS_PER_APPLICATION,
  OPEN_POSITIONS,
  byDepartment,
  getPosition,
  secondaryChoiceQuestion,
  type Position,
} from "@/lib/positions";

const REFERRAL_SOURCES = [
  "Twitter / X",
  "TikTok",
  "Instagram",
  "Friend or colleague",
  "Meetup / event",
  "Google search",
  "Other",
];

const HOURS_OPTIONS = ["<3 hrs", "3–5 hrs", "5–8 hrs", "8+ hrs"];
const SECONDARY_CHOICE_MIN_LENGTH = 10;

interface FormData {
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  linkedin: string;
  github: string;
  portfolio: string;
  about: string;
  motivation: string;
  positions: string[];
  answers: Record<string, string>; // key: `${positionId}:${questionIndex}`
  hoursPerWeek: string;
  canCommit: boolean;
  referralSource: string;
  notes: string;
}

type Errors = Partial<Record<string, string>>;

const INITIAL: FormData = {
  name: "",
  email: "",
  phone: "",
  country: "",
  city: "",
  linkedin: "",
  github: "",
  portfolio: "",
  about: "",
  motivation: "",
  positions: [],
  answers: {},
  hoursPerWeek: "",
  canCommit: false,
  referralSource: "",
  notes: "",
};

function isUrl(s: string) {
  return !s || /^https?:\/\/.+/.test(s);
}

function answerKey(positionId: string, questionIndex: number) {
  return `${positionId}:${questionIndex}`;
}

function secondaryAnswerKey(positionId: string) {
  return `${positionId}:secondary`;
}

function requiresPortfolio(d: FormData) {
  return d.positions.some((id) => getPosition(id)?.requiresPortfolio);
}

function validate(d: FormData): Errors {
  const e: Errors = {};
  if (!d.name.trim()) e.name = "Required";
  else if (d.name.trim().length > 80) e.name = "Max 80 characters";
  if (!d.email.trim()) e.email = "Required";
  else if (!/^\S+@\S+\.\S+$/.test(d.email)) e.email = "Enter a valid email";
  if (!d.country.trim()) e.country = "Required";
  if (d.linkedin && !isUrl(d.linkedin)) e.linkedin = "Must start with https://";
  if (d.portfolio && !isUrl(d.portfolio)) e.portfolio = "Must start with https://";
  if (!d.about.trim()) e.about = "Required";
  else if (d.about.trim().length < 20) e.about = "Please write at least 20 characters";
  if (!d.motivation.trim()) e.motivation = "Required";
  else if (d.motivation.trim().length < 20)
    e.motivation = "Please write at least 20 characters";
  if (d.positions.length === 0) e.positions = "Please select at least one position";
  d.positions.forEach((id, rank) => {
    const pos = getPosition(id);
    if (!pos) return;
    if (rank === 0) {
      pos.roleQuestions.forEach((_, qi) => {
        const key = answerKey(id, qi);
        const answer = (d.answers[key] ?? "").trim();
        if (!answer) e[key] = "Required";
        else if (answer.length < 20)
          e[key] = "Please write at least 20 characters";
      });
      return;
    }

    const key = secondaryAnswerKey(id);
    const answer = (d.answers[key] ?? "").trim();
    if (!answer) e[key] = "Required";
    else if (answer.length < SECONDARY_CHOICE_MIN_LENGTH)
      e[key] = `Please write at least ${SECONDARY_CHOICE_MIN_LENGTH} characters`;
  });
  if (requiresPortfolio(d) && !d.portfolio.trim())
    e.portfolio = "A portfolio link is required for Content positions";
  if (!d.canCommit) e.canCommit = "We ask core members to commit 3–6 months";
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
      {required && <span className="text-black/40 ml-0.5">*</span>}
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

const ORDINALS = ["1st", "2nd", "3rd"];

function PositionCard({
  position,
  selected,
  rank,
  disabled,
  onToggle,
  children,
}: {
  position: Position;
  selected: boolean;
  rank: number; // index in the ranked selection, -1 if not selected
  disabled: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`card overflow-hidden transition-all ${
        selected ? "ring-2 ring-black/40" : ""
      } ${disabled ? "opacity-50" : ""}`}
    >
      {/* Clickable header — toggles selection */}
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className={`w-full text-left p-5 ${disabled ? "cursor-not-allowed" : ""}`}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                selected ? "bg-black border-black" : "border-black"
              }`}
            >
              {selected && (
                <svg
                  width="10"
                  height="8"
                  viewBox="0 0 10 8"
                  fill="none"
                  className="text-white"
                >
                  <path
                    d="M1 4L3.5 6.5L9 1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            <span
              className="text-base text-black"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
            >
              {position.title}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 border border-black/30 rounded-full text-black/50">
              {position.level}
            </span>
            {selected && rank >= 0 && (
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black text-white">
                {ORDINALS[rank]} choice
              </span>
            )}
          </div>
          <span className="text-xs font-medium text-black/60 bg-white px-2.5 py-1 rounded-full flex-shrink-0 whitespace-nowrap">
            {position.commitment}
          </span>
        </div>
        <p className="text-sm text-black/60 leading-relaxed mb-3 ml-7">
          {position.summary}
        </p>
        <ul className="space-y-1 ml-7">
          {position.responsibilities.map((r, i) => (
            <li key={i} className="text-xs text-black/60/60 flex gap-1.5">
              <span className="flex-shrink-0 mt-0.5">—</span>
              {r}
            </li>
          ))}
        </ul>
        <p className="text-xs text-black/40 mt-3 ml-7">
          {selected
            ? rank === 0
              ? `Your ${ORDINALS[rank]} choice ↑ answer the detailed questions below`
              : `Your ${ORDINALS[rank]} choice ↑ add a quick backup-choice reason below`
            : disabled
              ? `Maximum ${MAX_POSITIONS_PER_APPLICATION} positions`
              : "Click to select this position →"}
        </p>
      </button>

      {/* Role-specific questions — only when selected */}
      {selected && children && (
        <div className="border-t border-black px-5 pb-6 pt-5 space-y-5 bg-white">
          {children}
        </div>
      )}
    </div>
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
        Application submitted!
      </h3>
      <p className="text-black/60 text-sm leading-relaxed">
        Thanks for applying. We&apos;ll review your application and get back to
        you within 1–2 weeks.
      </p>
    </div>
  );
}

export default function VolunteerForm() {
  const apply = useMutation(api.volunteers.apply);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [d, setD] = useState<FormData>(INITIAL);

  function set<K extends keyof FormData>(k: K, v: FormData[K]) {
    setD((prev) => ({ ...prev, [k]: v }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }));
  }

  function setAnswer(key: string, value: string) {
    setD((prev) => ({ ...prev, answers: { ...prev.answers, [key]: value } }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function togglePosition(id: string) {
    setD((prev) => ({
      ...prev,
      positions: prev.positions.includes(id)
        ? prev.positions.filter((p) => p !== id)
        : prev.positions.length < MAX_POSITIONS_PER_APPLICATION
          ? [...prev.positions, id]
          : prev.positions,
    }));
    if (errors.positions) setErrors((prev) => ({ ...prev, positions: undefined }));
  }

  function movePosition(from: number, to: number) {
    setD((prev) => {
      const next = [...prev.positions];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return { ...prev, positions: next };
    });
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
      const positionAnswers = d.positions.flatMap((id, rank) => {
        const pos = getPosition(id);
        if (!pos) return [];
        if (rank > 0) {
          return [
            {
              positionId: id,
              question: secondaryChoiceQuestion(rank, pos.title),
              answer: (d.answers[secondaryAnswerKey(id)] ?? "").trim(),
            },
          ];
        }
        return pos.roleQuestions.map((question, qi) => ({
          positionId: id,
          question,
          answer: (d.answers[answerKey(id, qi)] ?? "").trim(),
        }));
      });

      await apply({
        name: d.name.trim(),
        email: d.email.trim(),
        phone: d.phone || undefined,
        country: d.country.trim(),
        city: d.city || undefined,
        linkedin: d.linkedin || undefined,
        github: d.github || undefined,
        portfolio: d.portfolio || undefined,
        about: d.about.trim(),
        motivation: d.motivation.trim(),
        positions: d.positions,
        positionAnswers,
        hoursPerWeek: d.hoursPerWeek || undefined,
        canCommit: d.canCommit,
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

  const atMax = d.positions.length >= MAX_POSITIONS_PER_APPLICATION;
  const portfolioRequired = requiresPortfolio(d);

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-10">
      {/* ── 1. About you ── */}
      <div>
        <SectionHeading>About you</SectionHeading>
        <div className="grid sm:grid-cols-2 gap-5">
          <div id="field-name">
            <Label text="Full name" required />
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
          <div>
            <Label text="WhatsApp / phone" />
            <input
              type="tel"
              value={d.phone}
              onChange={(e) => set("phone", e.target.value)}
              className={inputBase}
              placeholder="+60 12 345 6789"
            />
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
          <div id="field-linkedin">
            <Label text="LinkedIn" />
            <input
              type="url"
              value={d.linkedin}
              onChange={(e) => set("linkedin", e.target.value)}
              className={inputBase}
              placeholder="https://linkedin.com/in/..."
            />
            <ErrMsg msg={errors.linkedin} />
          </div>
          <div>
            <Label text="GitHub username" />
            <input
              type="text"
              value={d.github}
              onChange={(e) => set("github", e.target.value)}
              className={inputBase}
              placeholder="yourusername"
            />
          </div>
          <div id="field-portfolio">
            <Label
              text="Portfolio / personal site"
              required={portfolioRequired}
            />
            <input
              type="url"
              value={d.portfolio}
              onChange={(e) => set("portfolio", e.target.value)}
              className={inputBase}
              placeholder="https://..."
            />
            {portfolioRequired && (
              <p className="text-xs text-black/60/50 mt-1.5">
                Required for Content positions — link your past content
                (Instagram, TikTok, Behance, Drive, etc.)
              </p>
            )}
            <ErrMsg msg={errors.portfolio} />
          </div>
        </div>
      </div>

      {/* ── 2. About yourself ── */}
      <div>
        <SectionHeading>Tell us about yourself</SectionHeading>
        <div className="space-y-5">
          <div id="field-about">
            <Label text="Your background and relevant experience" required />
            <div className="relative">
              <textarea
                value={d.about}
                onChange={(e) => set("about", e.target.value)}
                maxLength={1000}
                rows={4}
                className={inputBase}
                placeholder="Tell us about your skills, past projects, work, or studies — doesn't have to be technical..."
              />
              <span className="absolute bottom-2.5 right-3 text-xs text-black/60/40 select-none pointer-events-none">
                {d.about.length}/1000
              </span>
            </div>
            <ErrMsg msg={errors.about} />
          </div>
          <div id="field-motivation">
            <Label
              text="Why do you want to join? What's your understanding of what we do?"
              required
            />
            <div className="relative">
              <textarea
                value={d.motivation}
                onChange={(e) => set("motivation", e.target.value)}
                maxLength={1000}
                rows={4}
                className={inputBase}
                placeholder="What draws you to Build for Public? What do you hope to contribute during your time in this role?"
              />
              <span className="absolute bottom-2.5 right-3 text-xs text-black/60/40 select-none pointer-events-none">
                {d.motivation.length}/1000
              </span>
            </div>
            <ErrMsg msg={errors.motivation} />
          </div>
        </div>
      </div>

      {/* ── 3. Position selection — each card expands with its role questions ── */}
      <div id="field-positions">
        <SectionHeading>Which position(s) are you applying for?</SectionHeading>
        <p className="text-sm text-black/60 mb-5">
          Select up to {MAX_POSITIONS_PER_APPLICATION} positions in order of
          preference — your first pick is your 1st choice. We ask detailed
          questions for your 1st choice, then one lighter reason for any backup
          choices.
        </p>
        {d.positions.length > 0 && (
          <div className="card-flat p-4 mb-5">
            <p className="text-xs font-semibold text-black/40 uppercase tracking-widest mb-2.5">
              Your ranking
            </p>
            <div className="space-y-1.5">
              {d.positions.map((id, i) => (
                <div key={id} className="flex items-center gap-2.5 text-sm">
                  <span className="w-16 flex-shrink-0 text-xs font-semibold text-black/50">
                    {ORDINALS[i]} choice
                  </span>
                  <span className="text-black font-medium">
                    {getPosition(id)?.title ?? id}
                  </span>
                  <span className="flex items-center gap-1 ml-auto">
                    {i > 0 && (
                      <button
                        type="button"
                        onClick={() => movePosition(i, i - 1)}
                        title="Move up"
                        className="text-xs w-6 h-6 border border-black/20 rounded-md text-black/50 hover:text-black hover:border-black transition-colors"
                      >
                        ↑
                      </button>
                    )}
                    {i < d.positions.length - 1 && (
                      <button
                        type="button"
                        onClick={() => movePosition(i, i + 1)}
                        title="Move down"
                        className="text-xs w-6 h-6 border border-black/20 rounded-md text-black/50 hover:text-black hover:border-black transition-colors"
                      >
                        ↓
                      </button>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="space-y-8">
          {byDepartment(OPEN_POSITIONS).map((group) => (
            <div key={group.department}>
              <p className="text-xs font-semibold text-black/40 uppercase tracking-widest mb-3">
                {group.department}
              </p>
              <div className="space-y-4">
                {group.positions.map((pos) => {
                  const rank = d.positions.indexOf(pos.id);
                  const selected = rank >= 0;
                  return (
                    <PositionCard
                      key={pos.id}
                      position={pos}
                      selected={selected}
                      rank={rank}
                      disabled={!selected && atMax}
                      onToggle={() => togglePosition(pos.id)}
                    >
                      {rank === 0
                        ? pos.roleQuestions.map((q, qi) => {
                            const key = answerKey(pos.id, qi);
                            const value = d.answers[key] ?? "";
                            return (
                              <div key={key} id={`field-${key}`}>
                                <Label text={q} required />
                                <div className="relative">
                                  <textarea
                                    value={value}
                                    onChange={(e) =>
                                      setAnswer(key, e.target.value)
                                    }
                                    maxLength={1000}
                                    rows={3}
                                    className={inputBase}
                                    placeholder="Your answer..."
                                  />
                                  <span className="absolute bottom-2.5 right-3 text-xs text-black/60/40 select-none pointer-events-none">
                                    {value.length}/1000
                                  </span>
                                </div>
                                <ErrMsg msg={errors[key]} />
                              </div>
                            );
                          })
                        : (() => {
                            const key = secondaryAnswerKey(pos.id);
                            const value = d.answers[key] ?? "";
                            return (
                              <div key={key} id={`field-${key}`}>
                                <Label
                                  text={secondaryChoiceQuestion(rank, pos.title)}
                                  required
                                />
                                <div className="relative">
                                  <textarea
                                    value={value}
                                    onChange={(e) =>
                                      setAnswer(key, e.target.value)
                                    }
                                    maxLength={500}
                                    rows={2}
                                    className={inputBase}
                                    placeholder="One or two sentences is enough..."
                                  />
                                  <span className="absolute bottom-2.5 right-3 text-xs text-black/60/40 select-none pointer-events-none">
                                    {value.length}/500
                                  </span>
                                </div>
                                <ErrMsg msg={errors[key]} />
                              </div>
                            );
                          })()}
                    </PositionCard>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <ErrMsg msg={errors.positions} />
      </div>

      {/* ── 4. Commitment ── */}
      <div>
        <SectionHeading>Commitment</SectionHeading>
        <div className="space-y-5">
          <div id="field-canCommit">
            <button
              type="button"
              onClick={() => set("canCommit", !d.canCommit)}
              className="flex items-start gap-3 text-left"
            >
              <span
                className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                  d.canCommit ? "bg-black border-black" : "border-black"
                }`}
              >
                {d.canCommit && (
                  <svg
                    width="10"
                    height="8"
                    viewBox="0 0 10 8"
                    fill="none"
                    className="text-white"
                  >
                    <path
                      d="M1 4L3.5 6.5L9 1"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              <span className="text-sm text-black/70 leading-relaxed">
                I can commit to this role for at least 3–6 months to ensure the
                sustainability of our projects.{" "}
                <span className="text-black/40">*</span>
              </span>
            </button>
            <ErrMsg msg={errors.canCommit} />
          </div>
          <div>
            <Label text="How many hours per week can you contribute?" />
            <div className="flex flex-wrap gap-2.5">
              {HOURS_OPTIONS.map((h) => (
                <PillToggle
                  key={h}
                  label={h}
                  active={d.hoursPerWeek === h}
                  onClick={() =>
                    set("hoursPerWeek", d.hoursPerWeek === h ? "" : h)
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. Closing ── */}
      <div>
        <SectionHeading>Final details</SectionHeading>
        <div className="space-y-5">
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
            <Label text="Anything else you'd like to share?" />
            <textarea
              value={d.notes}
              onChange={(e) => set("notes", e.target.value)}
              maxLength={500}
              rows={3}
              className={inputBase}
              placeholder="Questions, comments, or anything we should know..."
            />
          </div>
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
        {status === "submitting" ? "Submitting…" : "Submit application →"}
      </button>
    </form>
  );
}
