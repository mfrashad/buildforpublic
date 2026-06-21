"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  OutreachTemplate,
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

/**
 * Collaborator list for the "Assigned to" dropdown, stored as a comma-separated
 * string in the `settings` table (key `outreach_collaborators`). Falls back to
 * the current admin's name/email when unset.
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
  const { collaborators } = useCollaborators();
  // Include any current value not in the list so it stays selectable.
  const options =
    value && !collaborators.includes(value)
      ? [value, ...collaborators]
      : collaborators;

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
  onSave,
}: {
  initialValue?: string;
  recipient: string;
  templates: OutreachTemplate[];
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
    const subject = t.subject ? `Subject: ${fillTemplate(t.subject, recipient)}\n\n` : "";
    setValue(subject + fillTemplate(t.body, recipient));
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
