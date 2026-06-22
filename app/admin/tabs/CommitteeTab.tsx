"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import {
  ConfirmModal,
  DeleteButton,
  EmptyState,
  SectionHeader,
  TableSkeleton,
} from "../ui";
import PhotoUploader from "./PhotoUploader";

const DEPARTMENTS = ["Leadership", "Events", "Outreach", "Content", "Finance", "Tech"];
const SLOT_TYPES = ["filled", "open", "mystery"] as const;
type Slot = (typeof SLOT_TYPES)[number];

type Committee = Doc<"committee">;

function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-black/40">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="mt-1 w-full text-sm border border-black/15 rounded-lg px-3 py-2 text-black/80 placeholder:text-black/25 focus:outline-none focus:border-black/40 resize-none"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="mt-1 w-full text-sm border border-black/15 rounded-lg px-3 py-2 text-black/80 placeholder:text-black/25 focus:outline-none focus:border-black/40"
        />
      )}
    </label>
  );
}

type FormState = {
  department: string;
  slotType: Slot;
  roleTitle: string;
  name: string;
  email: string;
  bio: string;
  location: string;
  imageUrl: string;
  linkedin: string;
  github: string;
  twitter: string;
  instagram: string;
  website: string;
  ctaLabel: string;
  ctaLink: string;
  positionId: string;
  order: string;
  isFounder: boolean;
};

function emptyForm(department = "Events"): FormState {
  return {
    department,
    slotType: "filled",
    roleTitle: "",
    name: "",
    email: "",
    bio: "",
    location: "",
    imageUrl: "",
    linkedin: "",
    github: "",
    twitter: "",
    instagram: "",
    website: "",
    ctaLabel: "",
    ctaLink: "",
    positionId: "",
    order: "",
    isFounder: false,
  };
}

function fromDoc(c: Committee): FormState {
  return {
    department: c.department,
    slotType: c.slotType,
    roleTitle: c.roleTitle ?? "",
    name: c.name ?? "",
    email: c.email ?? "",
    bio: c.bio ?? "",
    location: c.location ?? "",
    imageUrl: c.imageUrl ?? "",
    linkedin: c.linkedin ?? "",
    github: c.github ?? "",
    twitter: c.twitter ?? "",
    instagram: c.instagram ?? "",
    website: c.website ?? "",
    ctaLabel: c.ctaLabel ?? "",
    ctaLink: c.ctaLink ?? "",
    positionId: c.positionId ?? "",
    order: String(c.order ?? ""),
    isFounder: c.isFounder ?? false,
  };
}

// Convert a form into mutation args (empty strings → undefined).
function toArgs(f: FormState) {
  const s = (v: string) => (v.trim() ? v.trim() : undefined);
  return {
    department: f.department,
    slotType: f.slotType,
    roleTitle: f.roleTitle.trim(),
    name: s(f.name),
    email: s(f.email),
    bio: s(f.bio),
    location: s(f.location),
    imageUrl: s(f.imageUrl),
    linkedin: s(f.linkedin),
    github: s(f.github),
    twitter: s(f.twitter),
    instagram: s(f.instagram),
    website: s(f.website),
    ctaLabel: s(f.ctaLabel),
    ctaLink: s(f.ctaLink),
    positionId: s(f.positionId),
    order: f.order.trim() ? Number(f.order) : undefined,
    isFounder: f.isFounder || undefined,
  };
}

function MemberForm({
  form,
  setForm,
}: {
  form: FormState;
  setForm: (f: FormState) => void;
}) {
  const set = (k: keyof FormState, v: string | boolean) => setForm({ ...form, [k]: v });
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <label className="block">
          <span className="text-xs font-medium text-black/40">Department</span>
          <select
            value={form.department}
            onChange={(e) => set("department", e.target.value)}
            className="mt-1 w-full text-sm border border-black/15 rounded-lg px-3 py-2 bg-white text-black/80 focus:outline-none focus:border-black/40"
          >
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-medium text-black/40">Slot type</span>
          <select
            value={form.slotType}
            onChange={(e) => set("slotType", e.target.value)}
            className="mt-1 w-full text-sm border border-black/15 rounded-lg px-3 py-2 bg-white text-black/80 focus:outline-none focus:border-black/40"
          >
            {SLOT_TYPES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
        <Field label="Order" value={form.order} onChange={(v) => set("order", v)} placeholder="auto (append)" />
      </div>

      <Field label="Role title" value={form.roleTitle} onChange={(v) => set("roleTitle", v)} placeholder="e.g. Events Director, Co-Director" />

      {form.slotType === "filled" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Name" value={form.name} onChange={(v) => set("name", v)} placeholder="Member name" />
            <Field label="Location" value={form.location} onChange={(v) => set("location", v)} placeholder="e.g. Kuala Lumpur" />
          </div>
          <Field
            label="Email (pulls their Google/Clerk photo)"
            value={form.email}
            onChange={(v) => set("email", v)}
            placeholder="member@email.com — used to sync their profile photo"
          />
          <Field label="Bio" value={form.bio} onChange={(v) => set("bio", v)} placeholder="Short public bio for /about" textarea />
          <Field label="Photo URL" value={form.imageUrl} onChange={(v) => set("imageUrl", v)} placeholder="https://…" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="LinkedIn" value={form.linkedin} onChange={(v) => set("linkedin", v)} placeholder="url or handle" />
            <Field label="GitHub" value={form.github} onChange={(v) => set("github", v)} placeholder="url or handle" />
            <Field label="Twitter / X" value={form.twitter} onChange={(v) => set("twitter", v)} placeholder="url or handle" />
            <Field label="Instagram" value={form.instagram} onChange={(v) => set("instagram", v)} placeholder="url or handle" />
            <Field label="Website" value={form.website} onChange={(v) => set("website", v)} placeholder="https://…" />
          </div>
          <label className="flex items-center gap-2 text-sm text-black/70">
            <input
              type="checkbox"
              checked={form.isFounder}
              onChange={(e) => set("isFounder", e.target.checked)}
            />
            Founding team member
          </label>
        </>
      )}

      {form.slotType === "open" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="CTA label" value={form.ctaLabel} onChange={(v) => set("ctaLabel", v)} placeholder="default: This could be you →" />
          <Field label="CTA link" value={form.ctaLink} onChange={(v) => set("ctaLink", v)} placeholder="default: /volunteer" />
        </div>
      )}

      {form.slotType === "mystery" && (
        <p className="text-xs text-black/40">
          Mystery slots show a teaser placeholder on /about (e.g. Finance kept under wraps).
        </p>
      )}
    </div>
  );
}

export default function CommitteeTab() {
  const rows = useQuery(api.committee.listAdmin);
  const create = useMutation(api.committee.create);
  const update = useMutation(api.committee.update);
  const setHidden = useMutation(api.committee.setHidden);
  const remove = useMutation(api.committee.remove);

  const [adding, setAdding] = useState(false);
  const [addForm, setAddForm] = useState<FormState>(emptyForm());
  const [editId, setEditId] = useState<Id<"committee"> | null>(null);
  const [editForm, setEditForm] = useState<FormState>(emptyForm());
  const [deleteId, setDeleteId] = useState<Id<"committee"> | null>(null);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);

  async function handleSyncPhotos() {
    setSyncing(true);
    setSyncMsg(null);
    try {
      const res = await fetch("/api/admin/committee-photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ force: false }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Sync failed");
      const missing = data.missing?.length ? ` · no Clerk photo for: ${data.missing.join(", ")}` : "";
      setSyncMsg(`Synced ${data.updated} photo(s)${missing}`);
    } catch (e) {
      setSyncMsg(e instanceof Error ? e.message : "Sync failed");
    } finally {
      setSyncing(false);
    }
  }

  if (rows === undefined) return <TableSkeleton />;

  const byDept = DEPARTMENTS.map((d) => ({
    dept: d,
    items: rows.filter((r) => r.department === d),
  })).filter((g) => g.items.length > 0);
  // Any departments not in the canonical list
  const otherDepts = rows.filter((r) => !DEPARTMENTS.includes(r.department));

  async function handleAdd() {
    if (!addForm.roleTitle.trim()) return;
    setSaving(true);
    await create(toArgs(addForm));
    setSaving(false);
    setAdding(false);
    setAddForm(emptyForm());
  }

  async function handleSaveEdit() {
    if (!editId) return;
    setSaving(true);
    await update({ id: editId, ...toArgs(editForm) });
    setSaving(false);
    setEditId(null);
  }

  function startEdit(c: Committee) {
    setEditId(c._id);
    setEditForm(fromDoc(c));
  }

  return (
    <div>
      <SectionHeader title="Committee / org structure" count={rows.length}>
        <a
          href="/about"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs px-3 py-1.5 border border-black/20 rounded-lg text-black/50 hover:text-black hover:border-black transition-colors font-medium"
        >
          ↗ View /about
        </a>
        <button
          onClick={handleSyncPhotos}
          disabled={syncing}
          className="text-xs px-3 py-1.5 border border-black/20 rounded-lg text-black/50 hover:text-black hover:border-black transition-colors font-medium disabled:opacity-50"
        >
          {syncing ? "Syncing…" : "↻ Sync photos from Clerk"}
        </button>
        <button
          onClick={() => { setAdding((v) => !v); setAddForm(emptyForm()); }}
          className="text-xs px-3 py-1.5 bg-black text-white rounded-lg font-medium hover:bg-black/80 transition-colors"
        >
          {adding ? "Cancel" : "+ Add slot"}
        </button>
      </SectionHeader>

      <p className="text-xs text-black/40 mb-4 -mt-2">
        Controls the committee section on the public <span className="font-medium">/about</span> page.
        Filled = a person&apos;s card · Open = a &quot;this could be you&quot; CTA · Mystery = teaser placeholder.
      </p>
      {syncMsg && (
        <p className="text-xs text-black/60 mb-4 -mt-2 bg-black/[0.04] border border-black/10 rounded-lg px-3 py-2">
          {syncMsg}
        </p>
      )}

      {adding && (
        <div className="border border-black/15 rounded-xl p-4 mb-6 bg-black/[0.015]">
          <MemberForm form={addForm} setForm={setAddForm} />
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={handleAdd}
              disabled={saving || !addForm.roleTitle.trim()}
              className="text-sm px-4 py-2 bg-black text-white rounded-lg font-medium disabled:opacity-50"
            >
              {saving ? "Saving…" : "Add slot"}
            </button>
          </div>
        </div>
      )}

      {rows.length === 0 ? (
        <EmptyState message="No committee slots yet. Add one, or run the seed (committee:seed)." />
      ) : (
        <div className="space-y-6">
          {byDept.map((group) => (
            <div key={group.dept}>
              <h3 className="text-xs font-semibold text-black/40 uppercase tracking-widest mb-2">
                {group.dept}
              </h3>
              <div className="border border-black/10 rounded-xl divide-y divide-black/[0.06]">
                {group.items.map((c) => (
                  <div key={c._id}>
                    <div className="flex items-center gap-3 px-4 py-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-black">
                            {c.slotType === "filled"
                              ? (c.name || "(unnamed)")
                              : c.slotType === "open"
                                ? `${c.roleTitle} — open`
                                : `${c.roleTitle} — mystery`}
                          </span>
                          {c.slotType === "filled" && (
                            <span className="text-xs text-black/40">· {c.roleTitle}</span>
                          )}
                          <SlotBadge slot={c.slotType} />
                          {c.isFounder && (
                            <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#ffe27a] text-black border border-black/20">
                              Founding
                            </span>
                          )}
                          {c.hidden && (
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-black/10 text-black/50">
                              hidden
                            </span>
                          )}
                        </div>
                        {c.bio && (
                          <p className="text-xs text-black/40 truncate mt-0.5">{c.bio}</p>
                        )}
                      </div>
                      <span className="text-xs text-black/30 tabular-nums shrink-0">#{c.order}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => (editId === c._id ? setEditId(null) : startEdit(c))}
                          className="text-xs px-2.5 py-1 rounded-full border border-black/15 text-black/50 hover:border-black/50 hover:text-black transition-colors font-medium"
                        >
                          {editId === c._id ? "Close" : "Edit"}
                        </button>
                        <button
                          onClick={() => setHidden({ id: c._id, hidden: !c.hidden })}
                          className="text-xs px-2.5 py-1 rounded-full border border-black/15 text-black/50 hover:border-black/50 hover:text-black transition-colors font-medium"
                        >
                          {c.hidden ? "Show" : "Hide"}
                        </button>
                        <DeleteButton onClick={() => setDeleteId(c._id)} />
                      </div>
                    </div>
                    {editId === c._id && (
                      <div className="px-4 pb-4 pt-1 bg-black/[0.02]">
                        {c.slotType === "filled" && (
                          <div className="mb-4">
                            <span className="text-xs font-medium text-black/40 block mb-2">
                              Profile photo (uploaded overrides Google/Clerk)
                            </span>
                            <PhotoUploader
                              committeeId={c._id}
                              currentUrl={c.uploadedUrl ?? c.imageUrl ?? c.clerkImageUrl ?? null}
                              hasUpload={!!c.imageStorageId}
                            />
                          </div>
                        )}
                        <MemberForm form={editForm} setForm={setEditForm} />
                        <div className="flex justify-end gap-2 mt-4">
                          <button
                            onClick={handleSaveEdit}
                            disabled={saving}
                            className="text-sm px-4 py-2 bg-black text-white rounded-lg font-medium disabled:opacity-50"
                          >
                            {saving ? "Saving…" : "Save changes"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {otherDepts.length > 0 && (
            <p className="text-xs text-black/30">
              {otherDepts.length} slot(s) in non-standard departments — edit to reassign.
            </p>
          )}
        </div>
      )}

      <ConfirmModal
        open={deleteId !== null}
        title="Delete this slot?"
        description="It will be removed from /about. This can't be undone."
        confirmLabel="Delete"
        danger
        onConfirm={async () => {
          if (deleteId) await remove({ id: deleteId });
          setDeleteId(null);
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

function SlotBadge({ slot }: { slot: Slot }) {
  const styles: Record<Slot, string> = {
    filled: "bg-[#6ff5b6] text-black border-black/20",
    open: "bg-[#94e8ff] text-black border-black/20",
    mystery: "bg-black/80 text-white border-black",
  };
  return (
    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${styles[slot]}`}>
      {slot}
    </span>
  );
}
