"use client";

import { useEffect, useRef, useState } from "react";

// ── CSV export ────────────────────────────────────────────────────────────────

export function exportCsv(rows: Record<string, unknown>[], filename: string) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v).replace(/"/g, '""');
    return s.includes(",") || s.includes("\n") || s.includes('"') ? `"${s}"` : s;
  };
  const csv = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Status badge ──────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  new: "bg-blue-50 text-blue-700 border-blue-200",
  contacted: "bg-[#94e8ff] text-black border-black/20",
  accepted: "bg-[#6ff5b6] text-black border-black/20",
  declined: "bg-[#ffc0a1] text-black border-black/20",
  draft: "bg-black/10 text-black/60 border-black/10",
  published: "bg-[#6ff5b6] text-black border-black/20",
  archived: "bg-black/20 text-black/50 border-black/10",
  // Recruitment pipeline
  applied: "bg-black/10 text-black/60 border-black/10",
  shortlisted: "bg-blue-50 text-blue-700 border-blue-200",
  invite_sent: "bg-purple-50 text-purple-700 border-purple-200",
  interview_scheduled: "bg-indigo-50 text-indigo-700 border-indigo-200",
  interviewed: "bg-[#94e8ff] text-black border-black/20",
  offered: "bg-amber-50 text-amber-700 border-amber-300",
  not_shortlisted: "bg-black/20 text-black/50 border-black/10",
};

export function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? "bg-black/10 text-black/50";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${style}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

// ── Table ─────────────────────────────────────────────────────────────────────

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-black/10 rounded-xl overflow-hidden">
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`text-left px-4 py-2.5 text-xs font-semibold text-black/40 uppercase tracking-wider bg-black/[0.03] border-b border-black/10 ${className}`}>
      {children}
    </th>
  );
}

export function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={`px-4 py-3 align-top border-b border-black/[0.06] ${className}`}>
      {children}
    </td>
  );
}

export function Tr({
  children,
  onClick,
  active,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <tr
      onClick={onClick}
      className={`transition-colors ${onClick ? "cursor-pointer" : ""} ${
        active ? "bg-black/[0.04]" : "hover:bg-black/[0.015]"
      }`}
    >
      {children}
    </tr>
  );
}

// ── Expand panel ──────────────────────────────────────────────────────────────

export function ExpandPanel({ open, children }: { open: boolean; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <tr>
      <td colSpan={99} className="bg-black/[0.02] border-b border-black/[0.06] px-6 py-5">
        <div className="space-y-3">{children}</div>
      </td>
    </tr>
  );
}

export function useExpand() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const toggle = (id: string) => setExpanded((prev) => (prev === id ? null : id));
  const isOpen = (id: string) => expanded === id;
  const close = () => setExpanded(null);
  return { toggle, isOpen, close };
}

// ── Detail row ────────────────────────────────────────────────────────────────

function isUrl(s: string) {
  return /^https?:\/\//i.test(s.trim());
}

export function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex gap-3 text-sm">
      <span className="w-36 shrink-0 text-black/40 font-medium">{label}</span>
      {isUrl(value) ? (
        <a
          href={value.trim()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-black/80 break-all underline underline-offset-2 hover:text-black transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          {value}
        </a>
      ) : (
        <span className="text-black/80 break-words whitespace-pre-wrap">{value}</span>
      )}
    </div>
  );
}

// ── Tag pill ──────────────────────────────────────────────────────────────────

export function Tag({ label }: { label: string }) {
  return (
    <span className="inline-block text-xs px-2 py-0.5 border border-black/15 rounded-full text-black/60 bg-black/5">
      {label}
    </span>
  );
}

// ── Section header ────────────────────────────────────────────────────────────

export function SectionHeader({
  title,
  count,
  children,
}: {
  title: string;
  count?: number;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <h2 className="text-base font-semibold text-black">{title}</h2>
        {count !== undefined && (
          <span className="text-xs font-medium text-black/40 bg-black/5 px-2 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}

// ── Status action buttons ─────────────────────────────────────────────────────

type LeadStatus = "new" | "contacted" | "accepted" | "declined";
type OppStatus = "draft" | "published" | "archived";

function StatusBtn({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(e); }}
      className={`text-xs px-2.5 py-1 rounded-full border transition-colors font-medium ${
        active
          ? "bg-black text-white border-black"
          : "bg-white text-black/40 border-black/15 hover:border-black/50 hover:text-black/70"
      }`}
    >
      {label}
    </button>
  );
}

export function LeadStatusButtons({
  current,
  onChange,
}: {
  current: LeadStatus;
  onChange: (s: LeadStatus) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {(["new", "contacted", "accepted", "declined"] as LeadStatus[]).map((s) => (
        <StatusBtn key={s} label={s} active={s === current} onClick={() => s !== current && onChange(s)} />
      ))}
    </div>
  );
}

export function OppStatusButtons({
  current,
  onChange,
}: {
  current: OppStatus;
  onChange: (s: OppStatus) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {(["draft", "published", "archived"] as OppStatus[]).map((s) => (
        <StatusBtn key={s} label={s} active={s === current} onClick={() => s !== current && onChange(s)} />
      ))}
    </div>
  );
}

// ── CSV export button ─────────────────────────────────────────────────────────

export function ExportCsvButton({
  rows,
  filename,
}: {
  rows: Record<string, unknown>[];
  filename: string;
}) {
  return (
    <button
      onClick={() => exportCsv(rows, filename)}
      className="text-xs px-3 py-1.5 border border-black/20 rounded-lg text-black/50 hover:text-black hover:border-black transition-colors font-medium"
    >
      ↓ Export CSV
    </button>
  );
}

// ── Notes editor ──────────────────────────────────────────────────────────────

export function NotesEditor({
  initialValue,
  onSave,
  placeholder = "Add internal notes…",
}: {
  initialValue?: string;
  onSave: (notes: string) => Promise<void>;
  placeholder?: string;
}) {
  const [value, setValue] = useState(initialValue ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const dirty = value !== (initialValue ?? "");

  async function handleSave() {
    setSaving(true);
    await onSave(value);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex gap-3 text-sm">
      <span className="w-36 shrink-0 text-black/40 font-medium pt-2">Internal notes</span>
      <div className="flex-1 space-y-2">
        <textarea
          value={value}
          onChange={(e) => { setValue(e.target.value); setSaved(false); }}
          placeholder={placeholder}
          rows={3}
          className="w-full text-sm border border-black/15 rounded-lg px-3 py-2 text-black/80 placeholder:text-black/25 focus:outline-none focus:border-black/40 resize-none"
        />
        {dirty && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="text-xs px-3 py-1 bg-black text-white rounded-lg disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save notes"}
          </button>
        )}
        {saved && <span className="text-xs text-[#2d8a56]">Saved</span>}
      </div>
    </div>
  );
}

// ── Confirm modal ─────────────────────────────────────────────────────────────

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  danger = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div ref={ref} className="bg-white border border-black rounded-2xl p-6 max-w-sm w-full shadow-[4px_4px_0_#000]">
        <p className="font-semibold text-black text-base mb-1">{title}</p>
        {description && <p className="text-sm text-black/50 mb-5">{description}</p>}
        <div className="flex gap-2 justify-end mt-4">
          <button
            onClick={onCancel}
            className="text-sm px-4 py-2 border border-black/20 rounded-lg text-black/60 hover:border-black/50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors ${
              danger
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-black text-white hover:bg-black/80"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Empty / loading ───────────────────────────────────────────────────────────

export function EmptyState({ message }: { message: string }) {
  return <div className="text-center py-16 text-sm text-black/30">{message}</div>;
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="border border-black/10 rounded-xl overflow-hidden animate-pulse">
      <div className="h-10 bg-black/5 border-b border-black/10" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 border-b border-black/[0.06] px-4 flex items-center gap-4">
          <div className="h-3 bg-black/8 rounded w-32" />
          <div className="h-3 bg-black/8 rounded w-20" />
          <div className="h-3 bg-black/8 rounded w-48" />
        </div>
      ))}
    </div>
  );
}

// ── Delete button ─────────────────────────────────────────────────────────────

export function DeleteButton({ label = "Delete", onClick }: { label?: string; onClick: (e: React.MouseEvent) => void }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(e); }}
      className="text-xs px-2.5 py-1 rounded-full border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-400 transition-colors font-medium"
    >
      {label}
    </button>
  );
}

// ── Social links ──────────────────────────────────────────────────────────────

type SocialType = "linkedin" | "github" | "twitter" | "instagram" | "website";

function socialHref(type: SocialType, value: string): string {
  const v = value.trim();
  if (/^https?:\/\//i.test(v)) return v;
  const handle = v.replace(/^@/, "");
  switch (type) {
    case "linkedin":  return `https://linkedin.com/in/${handle}`;
    case "github":    return `https://github.com/${handle}`;
    case "twitter":   return `https://twitter.com/${handle}`;
    case "instagram": return `https://instagram.com/${handle}`;
    default:          return v.startsWith("//") ? `https:${v}` : `https://${v}`;
  }
}

const SOCIAL_ICONS: Record<SocialType, React.ReactNode> = {
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
    </svg>
  ),
  website: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
};

export function SocialLinks({
  links,
}: {
  links: Partial<Record<SocialType, string | undefined>>;
}) {
  const entries = (Object.entries(links) as [SocialType, string | undefined][]).filter(
    ([, v]) => v && v.trim(),
  );
  if (!entries.length) return null;
  return (
    <div className="flex items-center gap-1.5 mt-0.5" onClick={(e) => e.stopPropagation()}>
      {entries.map(([type, value]) => (
        <a
          key={type}
          href={socialHref(type, value!)}
          target="_blank"
          rel="noopener noreferrer"
          title={type}
          className="text-black/30 hover:text-black transition-colors"
        >
          {SOCIAL_ICONS[type]}
        </a>
      ))}
    </div>
  );
}

// ── Filter select ─────────────────────────────────────────────────────────────

export function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex items-center gap-1.5 text-xs text-black/50">
      <span className="font-medium">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        className="text-xs border border-black/15 rounded-md px-2 py-1 bg-white text-black/70 focus:outline-none focus:border-black/40 cursor-pointer"
      >
        <option value="">All</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

// ── Status select (replaces pill buttons) ────────────────────────────────────

export function StatusSelect({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => { e.stopPropagation(); onChange(e.target.value); }}
      onClick={(e) => e.stopPropagation()}
      className="text-xs border border-black/15 rounded-md px-2 py-1.5 bg-white text-black/70 focus:outline-none focus:border-black/40 cursor-pointer font-medium"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
