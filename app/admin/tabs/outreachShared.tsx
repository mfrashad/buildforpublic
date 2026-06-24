"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  OutreachTemplate,
  Sender,
  DEFAULT_SENDER,
  fillTemplate,
} from "@/lib/outreachTemplates";

export function fmt(ts: number) {
  return new Date(ts).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const COLLAB_KEY = "outreach_collaborators";

export type AdminUser = { id: string; email: string | null; name: string | null; label: string };

/**
 * All users with the admin role (Clerk), used to populate the "Assigned to"
 * dropdown. Fetched from the admin-accessible /api/admin/team route.
 */
export function useAdminUsers() {
  const [members, setMembers] = useState<AdminUser[]>([]);
  useEffect(() => {
    let active = true;
    fetch("/api/admin/team")
      .then((r) => (r.ok ? r.json() : { members: [] }))
      .then((data) => {
        if (active) setMembers(data.members ?? []);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);
  return members;
}

const SENDERS_KEY = "outreach_senders";

/** Per-person sender overrides, keyed by the assignee's label. */
export type SenderProfile = {
  name?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
};

/**
 * Sender profiles (name / email / phone / LinkedIn per assignee), stored as a
 * JSON map in the `settings` table under `outreach_senders`. Used to fill the
 * {sender_*} tokens in outreach templates based on who a record is assigned to.
 */
export function useSenders() {
  const settings = useQuery(api.admin.getSettings);
  const setSetting = useMutation(api.admin.setSetting);

  let profiles: Record<string, SenderProfile> = {};
  const raw = settings?.[SENDERS_KEY];
  if (raw) {
    try {
      profiles = JSON.parse(raw) as Record<string, SenderProfile>;
    } catch {
      profiles = {};
    }
  }

  const save = (next: Record<string, SenderProfile>) =>
    setSetting({ key: SENDERS_KEY, value: JSON.stringify(next) });

  return { profiles, save, loaded: settings !== undefined };
}

/**
 * Resolve the effective sender for a record from its assignee. Precedence:
 * explicit sender profile → Clerk member details → DEFAULT_SENDER (for the
 * owner) or the bare label. Returns DEFAULT_SENDER when unassigned, preserving
 * the original behaviour where messages signed off as the project owner.
 */
export function resolveSender(
  label: string | undefined,
  profiles: Record<string, SenderProfile>,
  members: AdminUser[],
): Sender {
  if (!label) return DEFAULT_SENDER;
  const p = profiles[label] ?? {};
  const member = members.find((m) => m.label === label);
  const isOwner =
    member?.email?.toLowerCase() === DEFAULT_SENDER.email.toLowerCase();
  const base: Sender = isOwner
    ? DEFAULT_SENDER
    : { name: member?.name ?? label, email: member?.email ?? "", phone: "", linkedin: "" };
  return {
    name: p.name?.trim() || base.name,
    email: p.email?.trim() || base.email,
    phone: p.phone?.trim() ?? base.phone,
    linkedin: p.linkedin?.trim() ?? base.linkedin,
  };
}

const SENDER_FIELDS: { key: keyof SenderProfile; label: string; placeholder: string }[] = [
  { key: "name", label: "Name", placeholder: "Display name" },
  { key: "email", label: "Email", placeholder: "you@buildforpublic.com" },
  { key: "phone", label: "Phone", placeholder: "+60…" },
  { key: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/in/…" },
];

/**
 * Toggle-able editor for per-assignee sender details. Lists every admin and
 * lets you set the name / email / phone / LinkedIn that outreach templates use
 * when a record is assigned to that person.
 */
export function SendersEditor() {
  const members = useAdminUsers();
  const { profiles, save, loaded } = useSenders();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Record<string, SenderProfile>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function openEditor() {
    setDraft(JSON.parse(JSON.stringify(profiles)) as Record<string, SenderProfile>);
    setOpen(true);
  }

  function setField(label: string, key: keyof SenderProfile, value: string) {
    setDraft((d) => ({ ...d, [label]: { ...d[label], [key]: value } }));
  }

  async function handleSave() {
    setSaving(true);
    // Drop empty profiles so the stored blob stays tidy.
    const cleaned: Record<string, SenderProfile> = {};
    for (const [label, p] of Object.entries(draft)) {
      const entries = Object.entries(p).filter(([, v]) => v && String(v).trim());
      if (entries.length) cleaned[label] = Object.fromEntries(entries);
    }
    await save(cleaned);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        onClick={openEditor}
        disabled={!loaded}
        className="text-xs px-3 py-1.5 border border-black/20 rounded-lg text-black/40 hover:text-black hover:border-black/40 transition-colors font-medium disabled:opacity-40"
      >
        ✎ Sender details{saved ? " ✓" : ""}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="bg-white rounded-2xl border border-black/10 shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/10 sticky top-0 bg-white">
          <div>
            <h3 className="font-semibold text-black">Sender details</h3>
            <p className="text-xs text-black/50 mt-0.5">
              Templates auto-fill these based on who a record is assigned to. Blank fields fall back to the owner&apos;s defaults.
            </p>
          </div>
          <button onClick={() => setOpen(false)} className="text-black/40 hover:text-black text-lg leading-none">
            ✕
          </button>
        </div>

        <div className="p-5 space-y-5">
          {members.length === 0 ? (
            <p className="text-sm text-black/50">No admin team members found.</p>
          ) : (
            members.map((m) => (
              <div key={m.id} className="space-y-2">
                <p className="text-sm font-medium text-black">{m.label}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SENDER_FIELDS.map((f) => (
                    <label key={f.key} className="flex flex-col gap-1">
                      <span className="text-[11px] uppercase tracking-wide text-black/40 font-medium">{f.label}</span>
                      <input
                        value={draft[m.label]?.[f.key] ?? ""}
                        onChange={(e) => setField(m.label, f.key, e.target.value)}
                        placeholder={
                          f.key === "email" && m.email ? m.email : f.placeholder
                        }
                        className="text-sm border border-black/15 rounded-lg px-3 py-1.5 focus:outline-none focus:border-black/40"
                      />
                    </label>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-black/10 sticky bottom-0 bg-white">
          <button onClick={() => setOpen(false)} className="text-sm px-3 py-1.5 text-black/50 hover:text-black">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="text-sm px-4 py-1.5 bg-black text-white rounded-lg disabled:opacity-40"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Legacy collaborator list, stored as a comma-separated string in the `settings`
 * table (key `outreach_collaborators`). Kept so any names assigned before the
 * switch to admin-role users remain available; superseded by useAdminUsers.
 */
export function useCollaborators() {
  const { user } = useUser();
  const settings = useQuery(api.admin.getSettings);
  const setSetting = useMutation(api.admin.setSetting);

  const stored = settings?.[COLLAB_KEY];
  const fallback =
    user?.fullName ||
    user?.firstName ||
    user?.primaryEmailAddress?.emailAddress ||
    "";
  const collaborators = (stored ?? fallback)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const save = (list: string[]) =>
    setSetting({ key: COLLAB_KEY, value: list.join(", ") });

  return { collaborators, raw: stored ?? fallback, save, loaded: settings !== undefined };
}

/** Small header affordance to edit the collaborator list inline. */
export function CollaboratorsBar() {
  const { raw, save, loaded } = useCollaborators();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");

  if (!loaded) return null;

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Comma-separated names"
          className="text-xs border border-black/20 rounded-lg px-2 py-1.5 w-64 focus:outline-none focus:border-black/40"
        />
        <button
          onClick={async () => {
            await save(value.split(",").map((s) => s.trim()).filter(Boolean));
            setEditing(false);
          }}
          className="text-xs px-3 py-1.5 bg-black text-white rounded-lg"
        >
          Save
        </button>
        <button
          onClick={() => setEditing(false)}
          className="text-xs px-2 py-1.5 text-black/40 hover:text-black"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => {
        setValue(raw);
        setEditing(true);
      }}
      className="text-xs px-3 py-1.5 border border-black/20 rounded-lg text-black/40 hover:text-black hover:border-black/40 transition-colors font-medium"
    >
      ⚙ Collaborators
    </button>
  );
}

/** "Assigned to" dropdown sourced from the collaborator list. */
export function AssignedToSelect({
  value,
  onChange,
}: {
  value?: string;
  onChange: (v: string | undefined) => void;
}) {
  const members = useAdminUsers();
  const names = members.map((m) => m.label);
  // Include any current value not in the list (e.g. an old assignment) so it
  // stays selectable.
  const options =
    value && !names.includes(value) ? [value, ...names] : names;

  return (
    <select
      value={value ?? ""}
      onChange={(e) => {
        e.stopPropagation();
        onChange(e.target.value || undefined);
      }}
      onClick={(e) => e.stopPropagation()}
      className="text-xs border border-black/15 rounded-md px-2 py-1.5 bg-white text-black/70 focus:outline-none focus:border-black/40 cursor-pointer font-medium"
    >
      <option value="">Unassigned</option>
      {options.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  );
}

/**
 * Message editor with a template picker. Choose a template to pre-fill (with
 * {recipient} replaced by the org/venue name), edit, copy, and save the exact
 * message that was sent.
 */
export function MessageEditor({
  initialValue,
  recipient,
  templates,
  sender = DEFAULT_SENDER,
  onSave,
}: {
  initialValue?: string;
  recipient: string;
  templates: OutreachTemplate[];
  sender?: Sender;
  onSave: (message: string) => Promise<void>;
}) {
  const savedMessage = (initialValue ?? "").trim();
  const [value, setValue] = useState(initialValue ?? "");
  const [editing, setEditing] = useState(savedMessage.length === 0);
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  // Detect whether the collapsed preview is actually clipping content, so the
  // "Show full message" toggle only appears when there's more to read.
  const contentRef = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState(false);
  useEffect(() => {
    const el = contentRef.current;
    if (el && !expanded) setOverflowing(el.scrollHeight > el.clientHeight + 4);
  }, [initialValue, editing, expanded]);

  function insertTemplate(id: string) {
    const t = templates.find((x) => x.id === id);
    if (!t) return;
    const subject = t.subject ? `Subject: ${fillTemplate(t.subject, recipient, sender)}\n\n` : "";
    setValue(subject + fillTemplate(t.body, recipient, sender));
  }

  async function handleSave() {
    setSaving(true);
    await onSave(value);
    setSaving(false);
    setJustSaved(true);
    setEditing(false);
    setExpanded(false);
    setTimeout(() => setJustSaved(false), 2000);
  }

  async function handleCopy(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const label = (
    <span className="w-36 shrink-0 text-black/40 font-medium pt-2">Message sent</span>
  );
  const smallBtn =
    "text-xs px-2.5 py-1 border border-black/15 rounded-md text-black/50 hover:text-black hover:border-black/40 transition-colors";

  // ── Read mode: formatted, collapsible, easy to read ──
  if (!editing) {
    return (
      <div className="flex gap-3 text-sm">
        {label}
        <div className="flex-1 space-y-2">
          {savedMessage ? (
            <>
              <div className="relative">
                <div
                  ref={contentRef}
                  className={`whitespace-pre-wrap text-black/80 leading-relaxed border border-black/10 rounded-lg px-3 py-2 bg-white ${
                    expanded ? "" : "max-h-28 overflow-hidden"
                  }`}
                >
                  {initialValue}
                </div>
                {!expanded && overflowing && (
                  <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-white to-transparent rounded-b-lg pointer-events-none" />
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {(overflowing || expanded) && (
                  <button
                    onClick={() => setExpanded((v) => !v)}
                    className={`${smallBtn} font-medium`}
                  >
                    {expanded ? "Collapse ▲" : "Show full message ▼"}
                  </button>
                )}
                <button onClick={() => handleCopy(initialValue ?? "")} className={smallBtn}>
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={() => {
                    setValue(initialValue ?? "");
                    setEditing(true);
                  }}
                  className={smallBtn}
                >
                  Edit
                </button>
                {justSaved && <span className="text-xs text-[#2d8a56]">Saved</span>}
              </div>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="text-xs px-3 py-1.5 border border-black/20 rounded-lg text-black/50 hover:text-black hover:border-black/40 transition-colors font-medium"
            >
              + Add message
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Edit mode: textarea + template picker ──
  const dirty = value !== (initialValue ?? "");
  return (
    <div className="flex gap-3 text-sm">
      {label}
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value=""
            onChange={(e) => insertTemplate(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="text-xs border border-black/15 rounded-md px-2 py-1 bg-white text-black/60 focus:outline-none focus:border-black/40 cursor-pointer"
          >
            <option value="">↡ Insert template…</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
          {value && (
            <button onClick={() => handleCopy(value)} className={smallBtn}>
              {copied ? "Copied!" : "Copy"}
            </button>
          )}
          <span className="text-[11px] text-black/40">
            Signing as <span className="font-medium text-black/60">{sender.name}</span>
            {sender.email ? ` · ${sender.email}` : ""}
          </span>
        </div>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="The message you DMed (or pick a template above)…"
          rows={10}
          className="w-full text-sm border border-black/15 rounded-lg px-3 py-2 text-black/80 placeholder:text-black/25 focus:outline-none focus:border-black/40 resize-y font-mono leading-relaxed"
        />
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={saving || !dirty}
            className="text-xs px-3 py-1 bg-black text-white rounded-lg disabled:opacity-40"
          >
            {saving ? "Saving…" : "Save message"}
          </button>
          {savedMessage && (
            <button
              onClick={() => {
                setValue(initialValue ?? "");
                setEditing(false);
              }}
              className="text-xs px-3 py-1 text-black/40 hover:text-black"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/** Small labeled text input used in expand panels (e.g. requirement doc link). */
export function FieldInput({
  label,
  value,
  placeholder,
  onSave,
  copyable = false,
}: {
  label: string;
  value?: string;
  placeholder?: string;
  onSave: (v: string) => Promise<void>;
  copyable?: boolean;
}) {
  const [val, setVal] = useState(value ?? "");
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const dirty = val !== (value ?? "");
  return (
    <div className="flex gap-3 text-sm items-start">
      <span className="w-36 shrink-0 text-black/40 font-medium pt-1.5">{label}</span>
      <div className="flex-1 flex items-center gap-2">
        <input
          value={val}
          onChange={(e) => {
            setVal(e.target.value);
            setSaved(false);
          }}
          placeholder={placeholder}
          className="flex-1 text-sm border border-black/15 rounded-lg px-3 py-1.5 text-black/80 placeholder:text-black/25 focus:outline-none focus:border-black/40"
        />
        {dirty ? (
          <button
            onClick={async () => {
              await onSave(val);
              setSaved(true);
              setTimeout(() => setSaved(false), 2000);
            }}
            className="text-xs px-3 py-1.5 bg-black text-white rounded-lg shrink-0"
          >
            Save
          </button>
        ) : (
          copyable &&
          val.trim() && (
            <button
              onClick={async () => {
                await navigator.clipboard.writeText(val.trim());
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="text-xs px-3 py-1.5 border border-black/15 rounded-lg text-black/50 hover:text-black hover:border-black/40 transition-colors shrink-0"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          )
        )}
        {saved && <span className="text-xs text-[#2d8a56] shrink-0">Saved</span>}
      </div>
    </div>
  );
}
