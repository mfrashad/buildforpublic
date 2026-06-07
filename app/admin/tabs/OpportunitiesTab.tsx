"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  ConfirmModal,
  DetailRow,
  EmptyState,
  ExpandPanel,
  ExportCsvButton,
  StatusSelect,
  SectionHeader,
  StatusBadge,
  Table,
  TableSkeleton,
  Tag,
  Td,
  Th,
  Tr,
  useExpand,
} from "../ui";

const KIND_LABELS: Record<string, string> = {
  community_project: "Community Build",
  ngo_request: "NGO Request",
  project_idea: "Project Idea",
  oss_project: "Open Source",
};

type KindFilter = "all" | "community_project" | "ngo_request" | "project_idea" | "oss_project";
type StatusFilter = "all" | "draft" | "published" | "archived";

type Opp = NonNullable<ReturnType<typeof useQuery<typeof api.admin.listOpportunities>>>[number];

function fmt(ts: number) {
  return new Date(ts).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs px-2.5 py-1 rounded-full border transition-colors font-medium ${
        active ? "bg-black text-white border-black" : "bg-white text-black/40 border-black/15 hover:border-black/40 hover:text-black/70"
      }`}
    >
      {label}
    </button>
  );
}

// ── Inline edit form ──────────────────────────────────────────────────────────

function EditForm({ opp, onClose }: { opp: Opp; onClose: () => void }) {
  const updateOpp = useMutation(api.admin.updateOpportunity);
  const [form, setForm] = useState({
    title: opp.title,
    summary: opp.summary,
    description: opp.description,
    link: opp.link ?? "",
    repoLink: opp.repoLink ?? "",
    orgName: opp.orgName ?? "",
    difficulty: opp.difficulty ?? "",
    accent: opp.accent ?? "",
    featured: opp.featured ?? false,
  });
  const [saving, setSaving] = useState(false);

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  async function handleSave() {
    setSaving(true);
    await updateOpp({
      id: opp._id as Id<"opportunities">,
      title: form.title.trim() || undefined,
      summary: form.summary.trim() || undefined,
      description: form.description.trim() || undefined,
      link: form.link.trim() || undefined,
      repoLink: form.repoLink.trim() || undefined,
      orgName: form.orgName.trim() || undefined,
      difficulty: (form.difficulty as Opp["difficulty"]) || undefined,
      accent: (form.accent as Opp["accent"]) || undefined,
      featured: form.featured || undefined,
    });
    setSaving(false);
    onClose();
  }

  const input = "w-full text-sm border border-black/15 rounded-lg px-3 py-2 focus:outline-none focus:border-black/40 text-black/80 placeholder:text-black/25";
  const label = "block text-xs font-medium text-black/40 mb-1";

  return (
    <div className="space-y-4 bg-white border border-black/10 rounded-xl p-5 mt-2">
      <p className="text-sm font-semibold text-black">Edit opportunity</p>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>Title</label>
          <input className={input} value={form.title} onChange={(e) => set("title", e.target.value)} />
        </div>
        <div>
          <label className={label}>Org name</label>
          <input className={input} value={form.orgName} onChange={(e) => set("orgName", e.target.value)} placeholder="—" />
        </div>
      </div>
      <div>
        <label className={label}>One-line summary</label>
        <input className={input} value={form.summary} onChange={(e) => set("summary", e.target.value)} />
      </div>
      <div>
        <label className={label}>Full description</label>
        <textarea className={input} rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>Live URL</label>
          <input className={input} value={form.link} onChange={(e) => set("link", e.target.value)} placeholder="https://…" />
        </div>
        <div>
          <label className={label}>Repo URL</label>
          <input className={input} value={form.repoLink} onChange={(e) => set("repoLink", e.target.value)} placeholder="https://github.com/…" />
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className={label}>Difficulty</label>
          <select
            className={input}
            value={form.difficulty}
            onChange={(e) => set("difficulty", e.target.value)}
          >
            <option value="">—</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <div>
          <label className={label}>Accent colour</label>
          <select className={input} value={form.accent} onChange={(e) => set("accent", e.target.value)}>
            <option value="">—</option>
            {["yellow", "blue", "mint", "peach", "purple", "orange"].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 text-sm text-black/60 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set("featured", e.target.checked)}
              className="w-4 h-4"
            />
            Featured
          </label>
        </div>
      </div>
      <div className="flex gap-2 justify-end pt-1">
        <button onClick={onClose} className="text-sm px-4 py-2 border border-black/20 rounded-lg text-black/50 hover:border-black/40">
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="text-sm px-4 py-2 bg-black text-white rounded-lg disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}

// ── Tab ───────────────────────────────────────────────────────────────────────

export default function OpportunitiesTab() {
  const opportunities = useQuery(api.admin.listOpportunities);
  const updateStatus = useMutation(api.admin.updateOpportunityStatus);
  const toggleBFP = useMutation(api.admin.toggleOfficialBFP);
  const { toggle, isOpen, close } = useExpand();

  const [kindFilter, setKindFilter] = useState<KindFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [editing, setEditing] = useState<string | null>(null);
  const [confirmArchive, setConfirmArchive] = useState<string | null>(null);

  if (!opportunities) return <TableSkeleton rows={6} />;

  const filtered = opportunities.filter((o) => {
    if (kindFilter !== "all" && o.kind !== kindFilter) return false;
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    return true;
  });

  const toArchive = opportunities.find((o) => o._id === confirmArchive);

  const csvRows = filtered.map((o) => ({
    title: o.title,
    kind: o.kind,
    status: o.status,
    summary: o.summary,
    submitter: o.submitterName ?? "",
    submitterEmail: o.submitterEmail ?? "",
    link: o.link ?? "",
    repoLink: o.repoLink ?? "",
    officialBFP: o.officialBFP ? "yes" : "no",
    created: fmt(o._creationTime),
  }));

  return (
    <div className="space-y-4">
      <ConfirmModal
        open={!!confirmArchive}
        title={`Archive "${toArchive?.title}"?`}
        description="This will move it to archived status and hide it from the public board."
        confirmLabel="Archive"
        onConfirm={() => {
          if (confirmArchive)
            updateStatus({ id: confirmArchive as Id<"opportunities">, status: "archived" });
          setConfirmArchive(null);
          close();
        }}
        onCancel={() => setConfirmArchive(null)}
      />

      <SectionHeader title="Opportunities" count={filtered.length}>
        <ExportCsvButton rows={csvRows} filename="opportunities.csv" />
      </SectionHeader>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="flex gap-1">
          {(["all", "draft", "published", "archived"] as StatusFilter[]).map((s) => (
            <FilterPill key={s} label={s === "all" ? "All statuses" : s} active={statusFilter === s} onClick={() => setStatusFilter(s)} />
          ))}
        </div>
        <div className="flex flex-wrap gap-1">
          {(["all", "community_project", "ngo_request", "project_idea", "oss_project"] as KindFilter[]).map((k) => (
            <FilterPill key={k} label={k === "all" ? "All kinds" : KIND_LABELS[k]} active={kindFilter === k} onClick={() => setKindFilter(k)} />
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="No opportunities match your filters." />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Title</Th>
              <Th>Kind</Th>
              <Th>Submitter</Th>
              <Th>Created</Th>
              <Th>Status</Th>
              <Th>Official BFP</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <>
                <Tr key={o._id} onClick={() => { toggle(o._id); setEditing(null); }} active={isOpen(o._id)}>
                  <Td>
                    <p className="font-medium text-black">{o.title}</p>
                    {o.orgName && <p className="text-xs text-black/40">{o.orgName}</p>}
                  </Td>
                  <Td><Tag label={KIND_LABELS[o.kind] ?? o.kind} /></Td>
                  <Td>
                    {o.submitterName ? (
                      <div>
                        <p className="text-black/70 text-xs">{o.submitterName}</p>
                        {o.submitterEmail && <p className="text-xs text-black/40">{o.submitterEmail}</p>}
                      </div>
                    ) : (
                      <span className="text-black/25 text-xs">—</span>
                    )}
                  </Td>
                  <Td><span className="text-black/40 text-xs">{fmt(o._creationTime)}</span></Td>
                  <Td><StatusBadge status={o.status} /></Td>
                  <Td>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBFP({ id: o._id as Id<"opportunities">, value: !o.officialBFP });
                      }}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-colors font-medium ${
                        o.officialBFP
                          ? "bg-black text-white border-black"
                          : "bg-white text-black/35 border-black/15 hover:border-black/40"
                      }`}
                    >
                      {o.officialBFP ? "✓ Official" : "Not official"}
                    </button>
                  </Td>
                  <Td>
                    <StatusSelect
                      value={o.status}
                      options={["draft", "published", "archived"]}
                      onChange={(s) => {
                        if (s === "archived") {
                          setConfirmArchive(o._id);
                        } else {
                          updateStatus({ id: o._id as Id<"opportunities">, status: s as "draft" | "published" | "archived" });
                        }
                      }}
                    />
                  </Td>
                </Tr>
                <ExpandPanel key={`${o._id}-panel`} open={isOpen(o._id)}>
                  {editing === o._id ? (
                    <EditForm opp={o} onClose={() => setEditing(null)} />
                  ) : (
                    <>
                      <DetailRow label="Summary" value={o.summary} />
                      <DetailRow label="Description" value={o.description} />
                      <DetailRow label="Live URL" value={o.link} />
                      <DetailRow label="Repo URL" value={o.repoLink} />
                      <DetailRow label="Difficulty" value={o.difficulty} />
                      <DetailRow label="Accent" value={o.accent} />
                      {o.tags?.length ? (
                        <div className="flex gap-3 text-sm">
                          <span className="w-36 shrink-0 text-black/40 font-medium">Tags</span>
                          <div className="flex flex-wrap gap-1">{o.tags.map((t) => <Tag key={t} label={t} />)}</div>
                        </div>
                      ) : null}
                      {o.skillsNeeded?.length ? (
                        <div className="flex gap-3 text-sm">
                          <span className="w-36 shrink-0 text-black/40 font-medium">Skills needed</span>
                          <div className="flex flex-wrap gap-1">{o.skillsNeeded.map((s) => <Tag key={s} label={s} />)}</div>
                        </div>
                      ) : null}
                      <div className="flex gap-3 text-sm pt-1">
                        <span className="w-36 shrink-0" />
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); setEditing(o._id); }}
                            className="text-xs px-2.5 py-1 rounded-full border border-black/20 text-black/60 hover:border-black hover:text-black transition-colors font-medium"
                          >
                            Edit fields
                          </button>
                          {o.status !== "archived" && (
                            <button
                              onClick={(e) => { e.stopPropagation(); setConfirmArchive(o._id); }}
                              className="text-xs px-2.5 py-1 rounded-full border border-red-200 text-red-400 hover:bg-red-50 hover:border-red-400 transition-colors font-medium"
                            >
                              Archive
                            </button>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </ExpandPanel>
              </>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
