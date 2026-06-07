"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
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

const LEAD_STATUSES = ["new", "contacted", "accepted", "declined"];
const ROLES = ["builder", "advocate", "organizer"];
const BUILDER_LEVELS = ["beginner", "intermediate", "advanced", "senior", "other"];

export default function VolunteersTab() {
  const [showHidden, setShowHidden] = useState(false);
  const [confirmHide, setConfirmHide] = useState<string | null>(null);

  const [roleFilter, setRoleFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");

  const volunteers = useQuery(api.admin.listVolunteers, { showHidden });
  const updateStatus = useMutation(api.admin.updateVolunteerStatus);
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
      if (roleFilter && !v.roles.includes(roleFilter as "builder" | "advocate" | "organizer")) return false;
      if (countryFilter && v.country !== countryFilter) return false;
      if (statusFilter && v.status !== statusFilter) return false;
      if (levelFilter && v.builderLevel !== levelFilter) return false;
      return true;
    });
  }, [volunteers, roleFilter, countryFilter, statusFilter, levelFilter]);

  if (!volunteers) return <TableSkeleton rows={6} />;

  const csvRows = filtered.map((v) => ({
    name: v.name,
    email: v.email,
    phone: v.phone ?? "",
    country: v.country,
    city: v.city ?? "",
    roles: v.roles.join(", "),
    status: v.status,
    linkedin: v.linkedin ?? "",
    builderGithub: v.builderGithub ?? "",
    portfolio: v.portfolio ?? "",
    about: v.about,
    motivation: v.motivation,
    applied: fmt(v._creationTime),
  }));

  const toHide = volunteers.find((v) => v._id === confirmHide);
  const hasFilters = roleFilter || countryFilter || statusFilter || levelFilter;

  return (
    <div className="space-y-4">
      <ConfirmModal
        open={!!confirmHide}
        title={toHide?.hidden ? `Restore ${toHide?.name}?` : `Hide ${toHide?.name}?`}
        description={
          toHide?.hidden
            ? "This volunteer will reappear in the default list."
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

      <SectionHeader title="Volunteers" count={filtered.length}>
        <button
          onClick={() => setShowHidden((v) => !v)}
          className={`text-xs px-3 py-1.5 border rounded-lg transition-colors font-medium ${
            showHidden ? "bg-black text-white border-black" : "border-black/20 text-black/40 hover:border-black/40"
          }`}
        >
          {showHidden ? "Hide hidden" : "Show hidden"}
        </button>
        <ExportCsvButton rows={csvRows} filename="volunteers.csv" />
      </SectionHeader>

      {/* ── Filters ── */}
      <div className="flex flex-wrap items-center gap-3 pb-1">
        <FilterSelect
          label="Role"
          value={roleFilter}
          onChange={setRoleFilter}
          options={ROLES.map((r) => ({ value: r, label: r }))}
        />
        <FilterSelect
          label="Country"
          value={countryFilter}
          onChange={setCountryFilter}
          options={countries.map((c) => ({ value: c, label: c }))}
        />
        <FilterSelect
          label="Status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={LEAD_STATUSES.map((s) => ({ value: s, label: s }))}
        />
        <FilterSelect
          label="Builder level"
          value={levelFilter}
          onChange={setLevelFilter}
          options={BUILDER_LEVELS.map((l) => ({ value: l, label: l }))}
        />
        {hasFilters && (
          <button
            onClick={() => { setRoleFilter(""); setCountryFilter(""); setStatusFilter(""); setLevelFilter(""); }}
            className="text-xs text-black/40 hover:text-black underline"
          >
            Clear
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState message={hasFilters ? "No volunteers match your filters." : "No volunteer applications yet."} />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Roles</Th>
              <Th>Location</Th>
              <Th>Applied</Th>
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
                        github: v.builderGithub,
                        website: v.portfolio,
                      }} />
                    </div>
                  </Td>
                  <Td>
                    <div className="flex flex-wrap gap-1">
                      {v.roles.map((r) => <Tag key={r} label={r} />)}
                    </div>
                  </Td>
                  <Td>
                    <span className="text-black/60 text-sm">
                      {v.city ? `${v.city}, ` : ""}{v.country}
                    </span>
                  </Td>
                  <Td>
                    <span className="text-black/40 text-xs">{fmt(v._creationTime)}</span>
                  </Td>
                  <Td>
                    <StatusBadge status={v.status} />
                    {v.hidden && <span className="ml-1.5 text-xs text-black/30">(hidden)</span>}
                  </Td>
                  <Td>
                    <StatusSelect
                      value={v.status}
                      options={LEAD_STATUSES}
                      onChange={(s) =>
                        updateStatus({ id: v._id as Id<"volunteers">, status: s as "new" | "contacted" | "accepted" | "declined" })
                      }
                    />
                  </Td>
                </Tr>
                <ExpandPanel key={`${v._id}-panel`} open={isOpen(v._id)}>
                  <DetailRow label="Phone" value={v.phone} />
                  <DetailRow label="LinkedIn" value={v.linkedin} />
                  <DetailRow label="Portfolio" value={v.portfolio} />
                  <DetailRow label="About" value={v.about} />
                  <DetailRow label="Motivation" value={v.motivation} />
                  {v.roles.includes("builder") && (
                    <>
                      <DetailRow label="Builder level" value={v.builderLevel} />
                      <DetailRow label="Has idea?" value={v.builderIdea} />
                      <DetailRow label="Project idea" value={v.builderProject} />
                      <DetailRow label="GitHub" value={v.builderGithub} />
                      {v.builderSkills?.length ? (
                        <div className="flex gap-3 text-sm">
                          <span className="w-36 shrink-0 text-black/40 font-medium">Skills</span>
                          <div className="flex flex-wrap gap-1">{v.builderSkills.map((s) => <Tag key={s} label={s} />)}</div>
                        </div>
                      ) : null}
                    </>
                  )}
                  {v.roles.includes("advocate") && (
                    <>
                      {v.advocateFormats?.length ? <DetailRow label="Formats" value={v.advocateFormats.join(", ")} /> : null}
                      {v.advocateLanguages?.length ? <DetailRow label="Languages" value={v.advocateLanguages.join(", ")} /> : null}
                      <DetailRow label="Samples" value={v.advocateSamples} />
                    </>
                  )}
                  {v.roles.includes("organizer") && (
                    <>
                      <DetailRow label="Mode" value={v.organizerMode} />
                      <DetailRow label="City" value={v.organizerCity} />
                      <DetailRow label="Experience" value={v.organizerExperience} />
                    </>
                  )}
                  <DetailRow label="Referral source" value={v.referralSource} />
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
