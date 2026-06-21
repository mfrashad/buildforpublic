"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { NONPROFIT_TEMPLATES } from "@/lib/outreachTemplates";
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
import {
  AssignedToSelect,
  CollaboratorsBar,
  FieldInput,
  MessageEditor,
  fmt,
} from "./outreachShared";

const PLATFORMS = ["instagram", "facebook", "whatsapp", "email", "linkedin", "twitter", "other"];
const STATUSES = [
  "to_contact",
  "dm_sent",
  "responded",
  "in_discussion",
  "requirement_received",
  "secured",
  "no_response",
  "declined",
];

function fmtFollowers(n?: number): string {
  if (n === undefined || n === null) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

// ── Outreach sub-view ─────────────────────────────────────────────────────────

function OutreachView() {
  const [showHidden, setShowHidden] = useState(false);
  const [confirmHide, setConfirmHide] = useState<string | null>(null);
  const [addingManual, setAddingManual] = useState(false);

  const records = useQuery(api.outreach.listNonprofitOutreach, { showHidden });
  const update = useMutation(api.outreach.updateNonprofitOutreach);
  const setHidden = useMutation(api.outreach.setNonprofitOutreachHidden);
  const addManual = useMutation(api.outreach.addNonprofitOutreach);
  const { toggle, isOpen } = useExpand();

  const [manualName, setManualName] = useState("");
  const [manualIg, setManualIg] = useState("");

  if (!records) return <TableSkeleton rows={6} />;

  const csvRows = records.map((r) => ({
    org: r.orgName,
    description: r.description ?? "",
    website: r.website ?? "",
    instagram: r.instagram ?? "",
    email: r.email ?? "",
    phone: r.phone ?? "",
    location: r.location ?? "",
    platform: r.platform ?? "",
    status: r.status,
    assignedTo: r.assignedTo ?? "",
    requirementDoc: r.requirementDocLink ?? "",
    added: fmt(r._creationTime),
  }));

  const toHide = records.find((r) => r._id === confirmHide);

  return (
    <div className="space-y-4">
      <ConfirmModal
        open={!!confirmHide}
        title={toHide?.hidden ? `Restore ${toHide?.orgName}?` : `Hide ${toHide?.orgName}?`}
        description={
          toHide?.hidden
            ? "This record will reappear in the default list."
            : "Hides it from the default view. Toggle 'Show hidden' to see it again."
        }
        confirmLabel={toHide?.hidden ? "Restore" : "Hide"}
        onConfirm={() => {
          if (confirmHide)
            setHidden({ id: confirmHide as Id<"nonprofitOutreach">, hidden: !toHide?.hidden });
          setConfirmHide(null);
        }}
        onCancel={() => setConfirmHide(null)}
      />

      <SectionHeader title="Active outreach" count={records.length}>
        <CollaboratorsBar />
        <button
          onClick={() => setShowHidden((v) => !v)}
          className={`text-xs px-3 py-1.5 border rounded-lg transition-colors font-medium ${
            showHidden
              ? "bg-black text-white border-black"
              : "border-black/20 text-black/40 hover:border-black/40"
          }`}
        >
          {showHidden ? "Hide hidden" : "Show hidden"}
        </button>
        <ExportCsvButton rows={csvRows} filename="nonprofit-outreach.csv" />
        <button
          onClick={() => setAddingManual((v) => !v)}
          className="text-xs px-3 py-1.5 bg-black text-white rounded-lg font-medium"
        >
          + Add manually
        </button>
      </SectionHeader>

      {addingManual && (
        <div className="border border-black/15 rounded-xl p-4 bg-black/[0.02] flex flex-wrap items-center gap-3">
          <input
            autoFocus
            value={manualName}
            onChange={(e) => setManualName(e.target.value)}
            placeholder="Org name *"
            className="text-sm border border-black/15 rounded-lg px-3 py-2 focus:outline-none focus:border-black/40 flex-1 min-w-48"
          />
          <input
            value={manualIg}
            onChange={(e) => setManualIg(e.target.value)}
            placeholder="Instagram (optional)"
            className="text-sm border border-black/15 rounded-lg px-3 py-2 focus:outline-none focus:border-black/40 flex-1 min-w-48"
          />
          <button
            disabled={!manualName.trim()}
            onClick={async () => {
              await addManual({
                orgName: manualName.trim(),
                instagram: manualIg.trim() || undefined,
              });
              setManualName("");
              setManualIg("");
              setAddingManual(false);
            }}
            className="text-sm px-4 py-2 bg-black text-white rounded-lg disabled:opacity-40"
          >
            Add
          </button>
        </div>
      )}

      {records.length === 0 ? (
        <EmptyState message="No outreach yet. Use 'Browse leads' to pick non-profits to DM." />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Org</Th>
              <Th>Platform</Th>
              <Th>Assigned to</Th>
              <Th>Requirement doc</Th>
              <Th>Status</Th>
              <Th>Set status</Th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <>
                <Tr key={r._id} onClick={() => toggle(r._id)} active={isOpen(r._id)}>
                  <Td>
                    <div className={r.hidden ? "opacity-40" : ""}>
                      <p className="font-medium text-black">{r.orgName}</p>
                      {(r.cause || r.followers != null) && (
                        <p className="text-[11px] text-black/40 mt-0.5">
                          {[
                            r.cause?.replace(/-/g, " "),
                            r.followers != null ? `${fmtFollowers(r.followers)} followers` : null,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      )}
                      {r.description && (
                        <p className="text-xs text-black/50 mt-0.5 line-clamp-2 max-w-md">
                          {r.description}
                        </p>
                      )}
                      <SocialLinks
                        links={{
                          instagram: r.instagram,
                          twitter: r.twitter,
                          linkedin: r.linkedin,
                          website: r.website,
                        }}
                      />
                    </div>
                  </Td>
                  <Td>
                    {r.platform ? (
                      <Tag label={r.platform} />
                    ) : (
                      <span className="text-black/25 text-xs">—</span>
                    )}
                  </Td>
                  <Td>
                    <AssignedToSelect
                      value={r.assignedTo}
                      onChange={(assignedTo) =>
                        update({ id: r._id as Id<"nonprofitOutreach">, assignedTo: assignedTo ?? "" })
                      }
                    />
                  </Td>
                  <Td>
                    {r.requirementDocLink ? (
                      <a
                        href={r.requirementDocLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs underline underline-offset-2 text-black/70 hover:text-black"
                      >
                        View doc
                      </a>
                    ) : (
                      <span className="text-black/25 text-xs">—</span>
                    )}
                  </Td>
                  <Td>
                    <StatusBadge status={r.status} />
                    {r.hidden && <span className="ml-1.5 text-xs text-black/30">(hidden)</span>}
                  </Td>
                  <Td>
                    <StatusSelect
                      value={r.status}
                      options={STATUSES}
                      onChange={(s) =>
                        update({ id: r._id as Id<"nonprofitOutreach">, status: s as never })
                      }
                    />
                  </Td>
                </Tr>
                <ExpandPanel key={`${r._id}-panel`} open={isOpen(r._id)}>
                  <DetailRow label="Description" value={r.description} />
                  <DetailRow label="Website" value={r.website} />
                  {r.websiteStatus && (
                    <DetailRow label="Website status" value={r.websiteStatus} />
                  )}
                  <DetailRow label="Location" value={r.location} />
                  <DetailRow label="Instagram" value={r.instagram} />
                  <DetailRow label="Facebook" value={r.facebook} />
                  <DetailRow label="Twitter" value={r.twitter} />
                  <DetailRow label="LinkedIn" value={r.linkedin} />
                  <FieldInput
                    label="Email"
                    value={r.email}
                    placeholder="contact@org.org"
                    copyable
                    onSave={(email) =>
                      update({ id: r._id as Id<"nonprofitOutreach">, email }).then(() => {})
                    }
                  />
                  <FieldInput
                    label="Phone"
                    value={r.phone}
                    placeholder="+60…"
                    copyable
                    onSave={(phone) =>
                      update({ id: r._id as Id<"nonprofitOutreach">, phone }).then(() => {})
                    }
                  />
                  <div className="flex gap-3 text-sm items-center">
                    <span className="w-36 shrink-0 text-black/40 font-medium">Platform</span>
                    <StatusSelect
                      value={r.platform ?? ""}
                      options={["", ...PLATFORMS]}
                      onChange={(p) =>
                        update({ id: r._id as Id<"nonprofitOutreach">, platform: (p || undefined) as never })
                      }
                    />
                  </div>

                  <MessageEditor
                    initialValue={r.message}
                    recipient={r.orgName}
                    templates={NONPROFIT_TEMPLATES}
                    onSave={(message) =>
                      update({ id: r._id as Id<"nonprofitOutreach">, message }).then(() => {})
                    }
                  />

                  <FieldInput
                    label="Requirement doc"
                    value={r.requirementDocLink}
                    placeholder="https://… link to the requirement doc"
                    onSave={(requirementDocLink) =>
                      update({ id: r._id as Id<"nonprofitOutreach">, requirementDocLink }).then(() => {})
                    }
                  />

                  <NotesEditor
                    initialValue={r.notes}
                    onSave={(notes) =>
                      update({ id: r._id as Id<"nonprofitOutreach">, notes }).then(() => {})
                    }
                  />

                  <div className="flex gap-3 text-sm pt-1">
                    <span className="w-36 shrink-0" />
                    <DeleteButton
                      label={r.hidden ? "Restore" : "Hide record"}
                      onClick={() => setConfirmHide(r._id)}
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

// ── Browse leads sub-view ─────────────────────────────────────────────────────

function BrowseLeadsView() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [hasInstagram, setHasInstagram] = useState(false);
  const [websiteStatus, setWebsiteStatus] = useState("");
  const [causeFilter, setCauseFilter] = useState("");
  const [sortBy, setSortBy] = useState("followers");

  // Debounce the search so we don't refetch (and flash the skeleton) on every
  // keystroke — the query arg only updates 250ms after typing stops.
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 250);
    return () => clearTimeout(t);
  }, [searchInput]);

  const leads = useQuery(api.outreach.listNonprofitLeads, {
    search: search || undefined,
    hasInstagram: hasInstagram || undefined,
    websiteStatus: websiteStatus || undefined,
  });
  const outreach = useQuery(api.outreach.listNonprofitOutreach, { showHidden: true });
  const addToOutreach = useMutation(api.outreach.addNonprofitOutreach);

  const claimed = new Set((outreach ?? []).map((r) => r.leadKey).filter(Boolean));

  const causeOptions = useMemo(() => {
    const s = new Set<string>();
    for (const l of leads ?? []) if (l.cause) s.add(l.cause);
    return [...s].sort().map((c) => ({ value: c, label: c.replace(/-/g, " ") }));
  }, [leads]);

  const shown = useMemo(() => {
    let l = [...(leads ?? [])];
    if (causeFilter) l = l.filter((x) => x.cause === causeFilter);
    if (sortBy === "followers") {
      l.sort((a, b) => (b.followers ?? -1) - (a.followers ?? -1));
    } else {
      l.sort((a, b) => a.name.localeCompare(b.name));
    }
    return l;
  }, [leads, causeFilter, sortBy]);

  return (
    <div className="space-y-4">
      <SectionHeader title="Browse leads" count={shown.length}>
        <span className="text-xs text-black/30">from openngo · ranked by IG reach</span>
      </SectionHeader>

      <div className="flex flex-wrap items-center gap-3">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name…"
          className="text-sm border border-black/15 rounded-lg px-3 py-1.5 focus:outline-none focus:border-black/40 w-56"
        />
        <FilterSelect
          label="Cause"
          value={causeFilter}
          onChange={setCauseFilter}
          options={causeOptions}
        />
        <FilterSelect
          label="Website"
          value={websiteStatus}
          onChange={setWebsiteStatus}
          options={[
            { value: "none", label: "none" },
            { value: "social", label: "social only" },
            { value: "free_builder", label: "free builder" },
            { value: "dead", label: "dead" },
          ]}
        />
        <label className="flex items-center gap-1.5 text-xs text-black/50 font-medium cursor-pointer">
          <input
            type="checkbox"
            checked={hasInstagram}
            onChange={(e) => setHasInstagram(e.target.checked)}
          />
          Has Instagram
        </label>
        <label className="flex items-center gap-1.5 text-xs text-black/50">
          <span className="font-medium">Sort</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs border border-black/15 rounded-md px-2 py-1 bg-white text-black/70 focus:outline-none focus:border-black/40 cursor-pointer"
          >
            <option value="followers">IG followers</option>
            <option value="name">Name</option>
          </select>
        </label>
      </div>

      {leads === undefined ? (
        <TableSkeleton rows={8} />
      ) : shown.length === 0 ? (
        <EmptyState message="No leads match. Import the openngo CSV or adjust filters." />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Non-profit</Th>
              <Th>Cause</Th>
              <Th>IG followers</Th>
              <Th>Socials</Th>
              <Th>Website</Th>
              <Th>Action</Th>
            </tr>
          </thead>
          <tbody>
            {shown.map((lead) => {
              const added = claimed.has(lead.leadKey);
              return (
                <Tr key={lead._id}>
                  <Td>
                    <p className="font-medium text-black">{lead.name}</p>
                    {lead.location && (
                      <p className="text-xs text-black/40">{lead.location}</p>
                    )}
                  </Td>
                  <Td>
                    {lead.cause ? (
                      <Tag label={lead.cause.replace(/-/g, " ")} />
                    ) : (
                      <span className="text-black/25 text-xs">—</span>
                    )}
                  </Td>
                  <Td>
                    <span
                      className={`text-sm font-semibold tabular-nums ${
                        lead.followers ? "text-black" : "text-black/25"
                      }`}
                    >
                      {fmtFollowers(lead.followers)}
                    </span>
                  </Td>
                  <Td>
                    <SocialLinks
                      links={{
                        instagram: lead.instagram,
                        twitter: lead.twitter,
                        linkedin: lead.linkedin,
                        website: lead.listedWebsite,
                      }}
                    />
                  </Td>
                  <Td>
                    {lead.websiteStatus ? (
                      <Tag label={lead.websiteStatus} />
                    ) : (
                      <span className="text-black/25 text-xs">—</span>
                    )}
                  </Td>
                  <Td>
                    {added ? (
                      <span className="text-xs text-black/40 font-medium">✓ Added</span>
                    ) : (
                      <button
                        onClick={() =>
                          addToOutreach({ leadKey: lead.leadKey, orgName: lead.name })
                        }
                        className="text-xs px-3 py-1 bg-black text-white rounded-lg font-medium"
                      >
                        + Add to outreach
                      </button>
                    )}
                  </Td>
                </Tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </div>
  );
}

// ── Tab shell ─────────────────────────────────────────────────────────────────

export default function NonprofitsTab() {
  const [view, setView] = useState<"outreach" | "leads">("outreach");

  return (
    <div className="space-y-4">
      <div className="flex gap-1 border border-black/10 rounded-lg p-1 w-fit">
        {(["outreach", "leads"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`text-xs px-4 py-1.5 rounded-md font-medium transition-colors ${
              view === v ? "bg-black text-white" : "text-black/50 hover:text-black"
            }`}
          >
            {v === "outreach" ? "Outreach" : "Browse leads"}
          </button>
        ))}
      </div>

      {view === "outreach" ? <OutreachView /> : <BrowseLeadsView />}
    </div>
  );
}
