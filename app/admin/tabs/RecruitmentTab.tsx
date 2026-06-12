"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import {
  DEPARTMENTS,
  OPEN_POSITIONS,
  POSITIONS,
  getPosition,
  positionTitle,
} from "@/lib/positions";
import {
  DEFAULT_INVITE_BODY_TEMPLATE,
  DEFAULT_INVITE_SUBJECT_TEMPLATE,
  INVITE_TEMPLATE_TOKENS,
  buildInviteEmail,
} from "@/lib/inviteEmail";
import {
  ConfirmModal,
  DeleteButton,
  DetailRow,
  EmptyState,
  ExpandPanel,
  ExportCsvButton,
  FilterSelect,
  NotesEditor,
  SectionHeader,
  SocialLinks,
  StatusBadge,
  StatusSelect,
  Table,
  TableSkeleton,
  Tag,
  Td,
  Th,
  Tr,
  useExpand,
} from "../ui";

function fmt(ts: number) {
  return new Date(ts).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

type Volunteer = Doc<"volunteers">;
type RecruitStatus = NonNullable<Volunteer["recruitStatus"]>;
type Potential = NonNullable<Volunteer["potential"]>;

const RECRUIT_STATUSES: RecruitStatus[] = [
  "applied",
  "shortlisted",
  "invite_sent",
  "interview_scheduled",
  "interviewed",
  "offered",
  "accepted",
  "declined",
  "not_shortlisted",
];

const POTENTIALS: Potential[] = ["low", "moderate", "high"];

const LEGACY_ROLES = ["builder", "advocate", "organizer"];

function appliedPositions(v: Volunteer): string[] {
  return v.positions ?? v.roles ?? [];
}

function recruitStatusOf(v: Volunteer): RecruitStatus {
  return v.recruitStatus ?? "applied";
}

// ── Pipeline editor ───────────────────────────────────────────────────────────

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 text-sm items-start">
      <span className="w-36 shrink-0 text-black/40 font-medium pt-1.5">{label}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
}

const smallInput =
  "w-full text-sm border border-black/15 rounded-lg px-3 py-1.5 text-black/80 placeholder:text-black/25 focus:outline-none focus:border-black/40";

const selectInput =
  "w-full text-sm border border-black/15 rounded-lg px-3 py-1.5 bg-white text-black/80 focus:outline-none focus:border-black/40";

function formatDate(value: string) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function dateTimeInputValue(value: string | undefined) {
  return value && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)
    ? value.slice(0, 16)
    : "";
}

function dateRangeLabel(from: string, to: string) {
  if (from && to) return `${formatDate(from)} - ${formatDate(to)}`;
  return formatDate(from || to);
}

function addMinutesToLocalDateTime(value: string, minutes: number) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  date.setMinutes(date.getMinutes() + minutes);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`;
}

function toGoogleDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`;
}

function buildCalendarUrl(
  volunteer: Pick<
    Volunteer,
    "name" | "email" | "interviewSlot" | "meetLink" | "linkedin" | "portfolio"
  >,
  selectedTitles: string[],
) {
  if (!volunteer.interviewSlot) return "";
  const start = toGoogleDate(volunteer.interviewSlot);
  const end = addMinutesToLocalDateTime(volunteer.interviewSlot, 30);
  if (!start || !end) return "";

  const details = [
    `Applicant: ${volunteer.name} <${volunteer.email}>`,
    selectedTitles.length ? `Position(s): ${selectedTitles.join(", ")}` : "",
    volunteer.meetLink ? `Meet: ${volunteer.meetLink}` : "",
    volunteer.linkedin ? `LinkedIn: ${volunteer.linkedin}` : "",
    volunteer.portfolio ? `Portfolio: ${volunteer.portfolio}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Build for Public interview - ${volunteer.name}`,
    dates: `${start}/${end}`,
    details,
    location: volunteer.meetLink || "Google Meet",
    ctz: "Asia/Kuala_Lumpur",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function PositionTags({
  selected,
  onRemove,
}: {
  selected: string[];
  onRemove?: (id: string) => void;
}) {
  if (!selected.length) {
    return <span className="text-xs text-black/25">None selected</span>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {selected.map((id) => (
        <span
          key={id}
          className="inline-flex items-center gap-1 text-xs px-2 py-1 border border-black/15 rounded-full bg-white text-black/70"
        >
          {positionTitle(id)}
          {onRemove && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(id);
              }}
              className="text-black/35 hover:text-black leading-none"
              aria-label={`Remove ${positionTitle(id)}`}
            >
              x
            </button>
          )}
        </span>
      ))}
    </div>
  );
}

function MultiPositionDropdown({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const remaining = OPEN_POSITIONS.filter((p) => !selected.includes(p.id));

  return (
    <div className="space-y-2">
      <PositionTags
        selected={selected}
        onRemove={(id) => onChange(selected.filter((s) => s !== id))}
      />
      <select
        value=""
        onChange={(e) => {
          const next = e.target.value;
          if (next) onChange([...selected, next]);
        }}
        className={selectInput}
        onClick={(e) => e.stopPropagation()}
      >
        <option value="">Add shortlisted position...</option>
        {remaining.map((p) => (
          <option key={p.id} value={p.id}>
            {p.title}
          </option>
        ))}
      </select>
    </div>
  );
}

function SinglePositionDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={selectInput}
      onClick={(e) => e.stopPropagation()}
    >
      <option value="">No final offer yet</option>
      {OPEN_POSITIONS.map((p) => (
        <option key={p.id} value={p.id}>
          {p.title}
        </option>
      ))}
    </select>
  );
}

function RecruitmentPanel({ volunteer }: { volunteer: Volunteer }) {
  const update = useMutation(api.admin.updateRecruitment);
  const id = volunteer._id as Id<"volunteers">;

  const [interviewer, setInterviewer] = useState(volunteer.interviewer ?? "");
  const [interviewSlot, setInterviewSlot] = useState(
    dateTimeInputValue(volunteer.interviewSlot),
  );
  const [meetLink, setMeetLink] = useState(volunteer.meetLink ?? "");
  const [saved, setSaved] = useState(false);

  const dirty =
    interviewer !== (volunteer.interviewer ?? "") ||
    interviewSlot !== dateTimeInputValue(volunteer.interviewSlot) ||
    meetLink !== (volunteer.meetLink ?? "");

  const shortlisted = volunteer.shortlistedPositions ?? [];
  const selectedTitles = shortlisted.map(positionTitle);
  const calendarUrl = buildCalendarUrl(
    {
      name: volunteer.name,
      email: volunteer.email,
      interviewSlot,
      meetLink,
      linkedin: volunteer.linkedin,
      portfolio: volunteer.portfolio,
    },
    selectedTitles,
  );

  async function saveTextFields() {
    await update({ id, interviewer, interviewSlot, meetLink });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-3 border-t border-black/10 pt-4">
      <p className="text-xs font-semibold text-black/30 uppercase tracking-widest">
        Recruitment pipeline
      </p>

      <FieldRow label="Shortlisted for">
        <MultiPositionDropdown
          selected={shortlisted}
          onChange={(shortlistedPositions) => update({ id, shortlistedPositions })}
        />
      </FieldRow>

      <FieldRow label="Final offer">
        <SinglePositionDropdown
          value={volunteer.finalOffer ?? ""}
          onChange={(finalOffer) => update({ id, finalOffer })}
        />
      </FieldRow>

      <FieldRow label="Potential">
        <select
          value={volunteer.potential ?? ""}
          onChange={(e) =>
            update({ id, potential: e.target.value as Potential })
          }
          className={selectInput}
          onClick={(e) => e.stopPropagation()}
        >
          <option value="" disabled>
            No rating yet
          </option>
          {POTENTIALS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </FieldRow>

      <FieldRow label="Interviewer">
        <input
          type="text"
          value={interviewer}
          onChange={(e) => setInterviewer(e.target.value)}
          className={smallInput}
          placeholder="Who's running the interview?"
        />
      </FieldRow>

      <FieldRow label="Interview slot">
        <input
          type="datetime-local"
          value={interviewSlot}
          onChange={(e) => setInterviewSlot(e.target.value)}
          className={smallInput}
          onClick={(e) => e.stopPropagation()}
        />
        {interviewSlot && (
          <p className="text-xs text-black/40 mt-1">
            {formatDateTime(interviewSlot)}
          </p>
        )}
      </FieldRow>

      <FieldRow label="Meet link">
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              value={meetLink}
              onChange={(e) => setMeetLink(e.target.value)}
              className={smallInput}
              placeholder="https://meet.google.com/..."
              onClick={(e) => e.stopPropagation()}
            />
            <a
              href="https://meet.new"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="shrink-0 text-xs px-3 py-1.5 border border-black/20 rounded-lg text-black/60 hover:text-black hover:border-black transition-colors font-medium"
            >
              Open meet.new
            </a>
          </div>
          <p className="text-xs text-black/35">
            Google does not expose a no-login link generator here. Open
            meet.new, create the link, then paste it back.
          </p>
        </div>
      </FieldRow>

      <FieldRow label="Calendar">
        <a
          href={calendarUrl || undefined}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={`inline-flex text-xs px-3 py-1.5 border rounded-lg font-medium ${
            calendarUrl
              ? "border-black/20 text-black/60 hover:text-black hover:border-black"
              : "pointer-events-none border-black/10 text-black/20"
          }`}
        >
          Create Google Calendar event
        </a>
      </FieldRow>

      {(dirty || saved) && (
        <FieldRow label="">
          <div className="flex items-center gap-2">
            {dirty && (
              <button
                onClick={saveTextFields}
                className="text-xs px-3 py-1 bg-black text-white rounded-lg"
              >
                Save interview details
              </button>
            )}
            {saved && <span className="text-xs text-[#2d8a56]">Saved</span>}
          </div>
        </FieldRow>
      )}
    </div>
  );
}

// ── Invite email generator ────────────────────────────────────────────────────

interface InviteDefaults {
  bookingLink: string;
  dateFrom: string;
  dateTo: string;
  deadlineAt: string;
  duration: string;
  platform: string;
  senderName: string;
  senderTitle: string;
  subjectTemplate: string;
  bodyTemplate: string;
  /** JSON map of positionId → summary override, "" entries fall back to catalog. */
  positionSummaries: string;
}

const INVITE_DEFAULTS: InviteDefaults = {
  bookingLink: "",
  dateFrom: "",
  dateTo: "",
  deadlineAt: "",
  duration: "30 minutes",
  platform: "Google Meet",
  senderName: "",
  senderTitle: "",
  subjectTemplate: DEFAULT_INVITE_SUBJECT_TEMPLATE,
  bodyTemplate: DEFAULT_INVITE_BODY_TEMPLATE,
  positionSummaries: "{}",
};

const INVITE_SETTING_KEYS: Record<keyof InviteDefaults, string> = {
  bookingLink: "invite.bookingLink",
  dateFrom: "invite.dateFrom",
  dateTo: "invite.dateTo",
  deadlineAt: "invite.deadlineAt",
  duration: "invite.duration",
  platform: "invite.platform",
  senderName: "invite.senderName",
  senderTitle: "invite.senderTitle",
  subjectTemplate: "invite.subjectTemplate",
  bodyTemplate: "invite.bodyTemplate",
  positionSummaries: "invite.positionSummaries",
};

function parseSummaryOverrides(json: string): Record<string, string> {
  try {
    const parsed = JSON.parse(json);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function inviteDefaultsFromSettings(
  settings: Record<string, string> | undefined,
): InviteDefaults {
  if (!settings) return INVITE_DEFAULTS;
  const next = { ...INVITE_DEFAULTS };
  for (const key of Object.keys(INVITE_SETTING_KEYS) as (keyof InviteDefaults)[]) {
    next[key] = settings[INVITE_SETTING_KEYS[key]] ?? INVITE_DEFAULTS[key];
  }
  return next;
}

function CopyButton({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async (e) => {
        e.stopPropagation();
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="text-xs px-3 py-1.5 border border-black/20 rounded-lg text-black/60 hover:text-black hover:border-black transition-colors font-medium"
    >
      {copied ? "Copied ✓" : label}
    </button>
  );
}

function InviteEmailGenerator({
  volunteer,
  settings,
}: {
  volunteer: Volunteer;
  settings: Record<string, string> | undefined;
}) {
  const update = useMutation(api.admin.updateRecruitment);
  const setSetting = useMutation(api.admin.setSetting);
  const id = volunteer._id as Id<"volunteers">;

  const [draft, setDraft] = useState<InviteDefaults>(() =>
    inviteDefaultsFromSettings(settings),
  );
  const [templateOpen, setTemplateOpen] = useState(false);
  const [savedTemplate, setSavedTemplate] = useState(false);
  const [marked, setMarked] = useState(false);

  useEffect(() => {
    setDraft(inviteDefaultsFromSettings(settings));
  }, [settings]);

  function setDefault<K extends keyof InviteDefaults>(key: K, value: string) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  async function saveGlobalTemplate() {
    await Promise.all(
      (Object.keys(INVITE_SETTING_KEYS) as (keyof InviteDefaults)[]).map((key) =>
        setSetting({ key: INVITE_SETTING_KEYS[key], value: draft[key] }),
      ),
    );
    setSavedTemplate(true);
    setTimeout(() => setSavedTemplate(false), 2000);
  }

  const shortlisted = volunteer.shortlistedPositions ?? [];
  const dateRange = dateRangeLabel(draft.dateFrom, draft.dateTo);
  const deadline = formatDate(draft.deadlineAt.slice(0, 10));
  const interviewSlot = formatDateTime(volunteer.interviewSlot ?? "");
  const generated = useMemo(
    () =>
      buildInviteEmail({
        name: volunteer.name,
        email: volunteer.email,
        positionIds: shortlisted,
        bookingLink: draft.bookingLink,
        dateRange,
        deadline,
        duration: draft.duration,
        platform: draft.platform,
        meetLink: volunteer.meetLink,
        interviewSlot,
        senderName: draft.senderName,
        senderTitle: draft.senderTitle,
        subjectTemplate: draft.subjectTemplate,
        bodyTemplate: draft.bodyTemplate,
        summaryOverrides: parseSummaryOverrides(draft.positionSummaries),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      volunteer.name,
      volunteer.email,
      volunteer.meetLink,
      volunteer.interviewSlot,
      shortlisted.join(","),
      draft,
      dateRange,
      deadline,
      interviewSlot,
    ],
  );

  const [subject, setSubject] = useState(generated.subject);
  const [body, setBody] = useState(generated.body);
  useEffect(() => setSubject(generated.subject), [generated.subject]);
  useEffect(() => setBody(generated.body), [generated.body]);

  const gmailHref = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(
    volunteer.email,
  )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <div className="space-y-3 border-t border-black/10 pt-4">
      <p className="text-xs font-semibold text-black/30 uppercase tracking-widest">
        Interview invite email
      </p>
      {shortlisted.length === 0 && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          Shortlist at least one position above — the email lists the
          shortlisted position(s), not the ones they applied for.
        </p>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-black/40 font-medium mb-1">Booking link</p>
          <input
            type="url"
            value={draft.bookingLink}
            onChange={(e) => setDefault("bookingLink", e.target.value)}
            className={smallInput}
            placeholder="https://calendly.com/..."
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-black/40 font-medium mb-1">Window start</p>
            <input
              type="date"
              value={draft.dateFrom}
              onChange={(e) => setDefault("dateFrom", e.target.value)}
              className={smallInput}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div>
            <p className="text-xs text-black/40 font-medium mb-1">Window end</p>
            <input
              type="date"
              value={draft.dateTo}
              onChange={(e) => setDefault("dateTo", e.target.value)}
              className={smallInput}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
        <div>
          <p className="text-xs text-black/40 font-medium mb-1">Booking deadline</p>
          <input
            type="date"
            value={draft.deadlineAt.slice(0, 10)}
            onChange={(e) => setDefault("deadlineAt", e.target.value)}
            className={smallInput}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-black/40 font-medium mb-1">Duration</p>
            <select
              value={draft.duration}
              onChange={(e) => setDefault("duration", e.target.value)}
              className={selectInput}
              onClick={(e) => e.stopPropagation()}
            >
              <option>30 minutes</option>
              <option>45 minutes</option>
              <option>60 minutes</option>
            </select>
          </div>
          <div>
            <p className="text-xs text-black/40 font-medium mb-1">Platform</p>
            <select
              value={draft.platform}
              onChange={(e) => setDefault("platform", e.target.value)}
              className={selectInput}
              onClick={(e) => e.stopPropagation()}
            >
              <option>Google Meet</option>
              <option>Google Meet (link after booking)</option>
              <option>Google Meet (link below)</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-black/40 font-medium mb-1">Your name</p>
            <input
              type="text"
              value={draft.senderName}
              onChange={(e) => setDefault("senderName", e.target.value)}
              className={smallInput}
              placeholder="Rashad"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div>
            <p className="text-xs text-black/40 font-medium mb-1">Your title</p>
            <input
              type="text"
              value={draft.senderTitle}
              onChange={(e) => setDefault("senderTitle", e.target.value)}
              className={smallInput}
              placeholder="Founder"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setTemplateOpen((v) => !v);
          }}
          className="text-xs px-3 py-1.5 border border-black/20 rounded-lg text-black/60 hover:text-black hover:border-black transition-colors font-medium"
        >
          {templateOpen ? "Hide global template" : "Edit global template"}
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            saveGlobalTemplate();
          }}
          className="text-xs px-3 py-1.5 bg-black text-white rounded-lg font-medium"
        >
          {savedTemplate ? "Saved globally" : "Save global defaults"}
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setDraft((prev) => ({
              ...prev,
              subjectTemplate: DEFAULT_INVITE_SUBJECT_TEMPLATE,
              bodyTemplate: DEFAULT_INVITE_BODY_TEMPLATE,
              positionSummaries: "{}",
            }));
          }}
          className="text-xs px-3 py-1.5 border border-black/20 rounded-lg text-black/60 hover:text-black hover:border-black transition-colors font-medium"
        >
          Reset template text
        </button>
      </div>

      {templateOpen && (
        <div className="space-y-3 rounded-lg border border-black/10 bg-black/[0.02] p-3">
          <div>
            <p className="text-xs text-black/40 font-medium mb-1">
              Subject template
            </p>
            <input
              type="text"
              value={draft.subjectTemplate}
              onChange={(e) => setDefault("subjectTemplate", e.target.value)}
              className={smallInput}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div>
            <p className="text-xs text-black/40 font-medium mb-1">
              Body template
            </p>
            <textarea
              value={draft.bodyTemplate}
              onChange={(e) => setDefault("bodyTemplate", e.target.value)}
              rows={12}
              className="w-full text-sm border border-black/15 rounded-lg px-3 py-2 text-black/80 focus:outline-none focus:border-black/40 font-mono leading-relaxed"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {INVITE_TEMPLATE_TOKENS.map((token) => (
              <button
                key={token}
                type="button"
                onClick={async (e) => {
                  e.stopPropagation();
                  await navigator.clipboard.writeText(token);
                }}
                className="text-[11px] px-2 py-0.5 rounded-full border border-black/10 text-black/45 bg-white hover:text-black"
              >
                {token}
              </button>
            ))}
          </div>
          <div>
            <p className="text-xs text-black/40 font-medium mb-1">
              Position descriptions — shown next to each shortlisted position
              in {"{{positionsList}}"}
            </p>
            <div className="space-y-2">
              {POSITIONS.map((p) => {
                const overrides = parseSummaryOverrides(draft.positionSummaries);
                return (
                  <div key={p.id} className="flex items-center gap-2">
                    <span className="w-36 shrink-0 text-xs text-black/50">
                      {p.title}
                    </span>
                    <input
                      type="text"
                      value={overrides[p.id] ?? p.summary}
                      onChange={(e) => {
                        const next = {
                          ...overrides,
                          [p.id]: e.target.value,
                        };
                        // Identical-to-catalog entries drop out so catalog edits flow through
                        if (e.target.value === p.summary) delete next[p.id];
                        setDefault(
                          "positionSummaries",
                          JSON.stringify(next),
                        );
                      }}
                      className={smallInput}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className={`${smallInput} bg-black/[0.03]`}
          onClick={(e) => e.stopPropagation()}
        />
        <CopyButton label="Copy subject" text={subject} />
      </div>

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={14}
        className="w-full text-sm border border-black/15 rounded-lg px-3 py-2 text-black/80 focus:outline-none focus:border-black/40 font-mono leading-relaxed"
        onClick={(e) => e.stopPropagation()}
      />

      <div className="flex flex-wrap items-center gap-2">
        <CopyButton label="Copy body" text={body} />
        <a
          href={gmailHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-xs px-3 py-1.5 border border-black/20 rounded-lg text-black/60 hover:text-black hover:border-black transition-colors font-medium"
        >
          Open Gmail compose ↗
        </a>
        <button
          onClick={async (e) => {
            e.stopPropagation();
            await update({
              id,
              recruitStatus: "invite_sent",
              inviteEmailSentAt: Date.now(),
            });
            setMarked(true);
            setTimeout(() => setMarked(false), 2000);
          }}
          className="text-xs px-3 py-1.5 bg-black text-white rounded-lg font-medium"
        >
          {marked ? "Marked ✓" : "Mark invite sent"}
        </button>
        {volunteer.inviteEmailSentAt && (
          <span className="text-xs text-black/40">
            Invite sent {fmt(volunteer.inviteEmailSentAt)}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Main tab ──────────────────────────────────────────────────────────────────

export default function RecruitmentTab() {
  const [showHidden, setShowHidden] = useState(false);
  const [confirmHide, setConfirmHide] = useState<string | null>(null);

  const [positionFilter, setPositionFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [potentialFilter, setPotentialFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");

  const volunteers = useQuery(api.admin.listVolunteers, { showHidden });
  const settings = useQuery(api.admin.getSettings);
  const update = useMutation(api.admin.updateRecruitment);
  const setNotes = useMutation(api.admin.setVolunteerNotes);
  const setHidden = useMutation(api.admin.setVolunteerHidden);
  const { toggle, isOpen } = useExpand();

  const countries = useMemo(() => {
    if (!volunteers) return [];
    return [...new Set(volunteers.map((v) => v.country))].sort();
  }, [volunteers]);

  const filtered = useMemo(() => {
    if (!volunteers) return [];
    return volunteers.filter((v) => {
      const applied = appliedPositions(v);
      if (positionFilter && !applied.includes(positionFilter)) return false;
      if (
        departmentFilter &&
        !applied.some((p) => getPosition(p)?.department === departmentFilter)
      )
        return false;
      if (statusFilter && recruitStatusOf(v) !== statusFilter) return false;
      if (potentialFilter && v.potential !== potentialFilter) return false;
      if (countryFilter && v.country !== countryFilter) return false;
      return true;
    });
  }, [volunteers, positionFilter, departmentFilter, statusFilter, potentialFilter, countryFilter]);

  if (!volunteers) return <TableSkeleton rows={6} />;

  const csvRows = filtered.map((v) => ({
    name: v.name,
    email: v.email,
    phone: v.phone ?? "",
    country: v.country,
    city: v.city ?? "",
    positions: v.positions
      ? v.positions.map((p, i) => `${i + 1}. ${positionTitle(p)}`).join(", ")
      : (v.roles ?? []).join(", "),
    shortlisted: (v.shortlistedPositions ?? []).map(positionTitle).join(", "),
    finalOffer: v.finalOffer ? positionTitle(v.finalOffer) : "",
    recruitStatus: recruitStatusOf(v),
    potential: v.potential ?? "",
    interviewer: v.interviewer ?? "",
    interviewSlot: v.interviewSlot ?? "",
    meetLink: v.meetLink ?? "",
    linkedin: v.linkedin ?? "",
    github: v.github ?? v.builderGithub ?? "",
    portfolio: v.portfolio ?? "",
    about: v.about,
    motivation: v.motivation,
    applied: fmt(v._creationTime),
  }));

  const toHide = volunteers.find((v) => v._id === confirmHide);
  const hasFilters =
    positionFilter || departmentFilter || statusFilter || potentialFilter || countryFilter;

  const positionOptions = [
    ...POSITIONS.map((p) => ({ value: p.id, label: p.title })),
    ...LEGACY_ROLES.map((r) => ({ value: r, label: `${r} (legacy)` })),
  ];

  return (
    <div className="space-y-4">
      <ConfirmModal
        open={!!confirmHide}
        title={toHide?.hidden ? `Restore ${toHide?.name}?` : `Hide ${toHide?.name}?`}
        description={
          toHide?.hidden
            ? "This applicant will reappear in the default list."
            : "Removes them from the default view. Toggle 'Show hidden' to see them again."
        }
        confirmLabel={toHide?.hidden ? "Restore" : "Hide"}
        onConfirm={() => {
          if (confirmHide)
            setHidden({ id: confirmHide as Id<"volunteers">, hidden: !toHide?.hidden });
          setConfirmHide(null);
        }}
        onCancel={() => setConfirmHide(null)}
      />

      <SectionHeader title="Recruitment" count={filtered.length}>
        <button
          onClick={() => setShowHidden((v) => !v)}
          className={`text-xs px-3 py-1.5 border rounded-lg transition-colors font-medium ${
            showHidden ? "bg-black text-white border-black" : "border-black/20 text-black/40 hover:border-black/40"
          }`}
        >
          {showHidden ? "Hide hidden" : "Show hidden"}
        </button>
        <ExportCsvButton rows={csvRows} filename="recruitment.csv" />
      </SectionHeader>

      {/* ── Filters ── */}
      <div className="flex flex-wrap items-center gap-3 pb-1">
        <FilterSelect
          label="Position"
          value={positionFilter}
          onChange={setPositionFilter}
          options={positionOptions}
        />
        <FilterSelect
          label="Department"
          value={departmentFilter}
          onChange={setDepartmentFilter}
          options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
        />
        <FilterSelect
          label="Status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={RECRUIT_STATUSES.map((s) => ({ value: s, label: s.replace(/_/g, " ") }))}
        />
        <FilterSelect
          label="Potential"
          value={potentialFilter}
          onChange={setPotentialFilter}
          options={POTENTIALS.map((p) => ({ value: p, label: p }))}
        />
        <FilterSelect
          label="Country"
          value={countryFilter}
          onChange={setCountryFilter}
          options={countries.map((c) => ({ value: c, label: c }))}
        />
        {hasFilters && (
          <button
            onClick={() => {
              setPositionFilter(""); setDepartmentFilter(""); setStatusFilter("");
              setPotentialFilter(""); setCountryFilter("");
            }}
            className="text-xs text-black/40 hover:text-black underline"
          >
            Clear
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState message={hasFilters ? "No applicants match your filters." : "No applications yet."} />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Applied for</Th>
              <Th>Shortlisted</Th>
              <Th>Potential</Th>
              <Th>Interview</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v) => (
              <>
                <Tr key={v._id} onClick={() => toggle(v._id)} active={isOpen(v._id)}>
                  <Td>
                    <div className={v.hidden ? "opacity-40" : ""}>
                      <p className="font-medium text-black text-sm">{v.name}</p>
                      <p className="text-xs text-black/40">{v.email}</p>
                      <SocialLinks links={{
                        linkedin: v.linkedin,
                        github: v.github ?? v.builderGithub,
                        website: v.portfolio,
                      }} />
                    </div>
                  </Td>
                  <Td>
                    <div className="flex flex-wrap gap-1">
                      {/* Ranked choices for new applications; unranked legacy roles */}
                      {v.positions
                        ? v.positions.map((p, i) => (
                            <Tag key={p} label={`${i + 1}. ${positionTitle(p)}`} />
                          ))
                        : (v.roles ?? []).map((r) => <Tag key={r} label={r} />)}
                    </div>
                  </Td>
                  <Td>
                    <div className="flex flex-wrap gap-1">
                      {(v.shortlistedPositions ?? []).map((p) => (
                        <Tag key={p} label={positionTitle(p)} />
                      ))}
                      {v.finalOffer && (
                        <span className="inline-block text-xs px-2 py-0.5 border border-black rounded-full text-black bg-[#6ff5b6] font-medium">
                          Offer: {positionTitle(v.finalOffer)}
                        </span>
                      )}
                    </div>
                  </Td>
                  <Td>
                    {v.potential ? (
                      <span
                        className={`text-xs font-medium ${
                          v.potential === "high"
                            ? "text-[#2d8a56]"
                            : v.potential === "moderate"
                              ? "text-amber-600"
                              : "text-red-500"
                        }`}
                      >
                        {v.potential}
                      </span>
                    ) : (
                      <span className="text-xs text-black/20">—</span>
                    )}
                  </Td>
                  <Td>
                    <div className="text-xs text-black/60">
                      {v.interviewer && <p>{v.interviewer}</p>}
                      {v.interviewSlot && (
                        <p className="text-black/40">
                          {formatDateTime(v.interviewSlot)}
                        </p>
                      )}
                      {!v.interviewer && !v.interviewSlot && (
                        <span className="text-black/20">—</span>
                      )}
                    </div>
                  </Td>
                  <Td>
                    <StatusBadge status={recruitStatusOf(v)} />
                    {v.hidden && <span className="ml-1.5 text-xs text-black/30">(hidden)</span>}
                  </Td>
                  <Td>
                    <StatusSelect
                      value={recruitStatusOf(v)}
                      options={RECRUIT_STATUSES}
                      onChange={(s) =>
                        update({ id: v._id as Id<"volunteers">, recruitStatus: s as RecruitStatus })
                      }
                    />
                  </Td>
                </Tr>
                <ExpandPanel key={`${v._id}-panel`} open={isOpen(v._id)}>
                  {/* ── Application ── */}
                  <DetailRow label="Phone" value={v.phone} />
                  <DetailRow label="LinkedIn" value={v.linkedin} />
                  <DetailRow label="GitHub" value={v.github ?? v.builderGithub} />
                  <DetailRow label="Portfolio" value={v.portfolio} />
                  <DetailRow label="About" value={v.about} />
                  <DetailRow label="Motivation" value={v.motivation} />
                  <DetailRow label="Hours / week" value={v.hoursPerWeek} />
                  {v.canCommit !== undefined && (
                    <DetailRow
                      label="3–6 mo commit"
                      value={v.canCommit ? "Yes" : "No"}
                    />
                  )}
                  {(v.positionAnswers ?? []).map((a, i) => (
                    <DetailRow
                      key={i}
                      label={positionTitle(a.positionId)}
                      value={`${a.question}\n\n${a.answer}`}
                    />
                  ))}

                  {/* Legacy role details (pre core-team applications) */}
                  {v.roles?.includes("builder") && (
                    <>
                      <DetailRow label="Builder level" value={v.builderLevel} />
                      <DetailRow label="Has idea?" value={v.builderIdea} />
                      <DetailRow label="Project idea" value={v.builderProject} />
                      {v.builderSkills?.length ? (
                        <div className="flex gap-3 text-sm">
                          <span className="w-36 shrink-0 text-black/40 font-medium">Skills</span>
                          <div className="flex flex-wrap gap-1">{v.builderSkills.map((s) => <Tag key={s} label={s} />)}</div>
                        </div>
                      ) : null}
                    </>
                  )}
                  {v.roles?.includes("advocate") && (
                    <>
                      {v.advocateFormats?.length ? <DetailRow label="Formats" value={v.advocateFormats.join(", ")} /> : null}
                      {v.advocateLanguages?.length ? <DetailRow label="Languages" value={v.advocateLanguages.join(", ")} /> : null}
                      <DetailRow label="Samples" value={v.advocateSamples} />
                    </>
                  )}
                  {v.roles?.includes("organizer") && (
                    <>
                      <DetailRow label="Mode" value={v.organizerMode} />
                      <DetailRow label="City" value={v.organizerCity} />
                      <DetailRow label="Experience" value={v.organizerExperience} />
                    </>
                  )}
                  <DetailRow label="Referral source" value={v.referralSource} />

                  {/* ── Pipeline editor ── */}
                  <RecruitmentPanel volunteer={v} />

                  {/* ── Invite email generator ── */}
                  <InviteEmailGenerator volunteer={v} settings={settings} />

                  <NotesEditor
                    initialValue={v.notes}
                    onSave={(notes) => setNotes({ id: v._id as Id<"volunteers">, notes }).then(() => {})}
                  />
                  <div className="flex gap-3 text-sm pt-1">
                    <span className="w-36 shrink-0" />
                    <DeleteButton
                      label={v.hidden ? "Restore" : "Hide submission"}
                      onClick={() => setConfirmHide(v._id)}
                    />
                  </div>
                </ExpandPanel>
              </>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
