"use client";

import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  DetailRow,
  EmptyState,
  ExpandPanel,
  ExportCsvButton,
  FilterSelect,
  SectionHeader,
  SocialLinks,
  Table,
  TableSkeleton,
  Tag,
  Td,
  Th,
  Tr,
  useExpand,
} from "../ui";

function fmt(ts: number) {
  return new Date(ts).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function Avatar({ name, imageUrl }: { name: string; imageUrl?: string }) {
  if (imageUrl) {
    return <img src={imageUrl} alt={name} className="w-8 h-8 rounded-full border border-black/10 object-cover shrink-0" />;
  }
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="w-8 h-8 rounded-full bg-black/10 border border-black/10 flex items-center justify-center text-xs font-bold text-black shrink-0">
      {initials}
    </div>
  );
}

export default function MembersTab() {
  const members = useQuery(api.admin.listMembers);
  const { toggle, isOpen } = useExpand();

  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [causeFilter, setCauseFilter] = useState("");

  // Derived option lists from data
  const countries = useMemo(() => {
    if (!members) return [];
    return [...new Set(members.map((m) => m.country))].sort();
  }, [members]);

  const skills = useMemo(() => {
    if (!members) return [];
    return [...new Set(members.flatMap((m) => m.skills ?? []))].sort();
  }, [members]);

  const causes = useMemo(() => {
    if (!members) return [];
    return [...new Set(members.flatMap((m) => m.causes ?? []))].sort();
  }, [members]);

  const filtered = useMemo(() => {
    if (!members) return [];
    const q = search.toLowerCase().trim();
    return members.filter((m) => {
      if (q && !(
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.country.toLowerCase().includes(q) ||
        (m.city ?? "").toLowerCase().includes(q)
      )) return false;
      if (countryFilter && m.country !== countryFilter) return false;
      if (statusFilter && m.currentStatus !== statusFilter) return false;
      if (skillFilter && !(m.skills ?? []).includes(skillFilter)) return false;
      if (causeFilter && !(m.causes ?? []).includes(causeFilter)) return false;
      return true;
    });
  }, [members, search, countryFilter, statusFilter, skillFilter, causeFilter]);

  const stats = useMemo(() => {
    if (!members) return null;
    return {
      total: members.length,
      public: members.filter((m) => m.isPublic !== false).length,
      countries: new Set(members.map((m) => m.country)).size,
      students: members.filter((m) => m.currentStatus === "student").length,
      working: members.filter((m) => m.currentStatus === "working").length,
    };
  }, [members]);

  const csvRows = filtered.map((m) => ({
    name: m.name,
    email: m.email,
    country: m.country,
    city: m.city ?? "",
    status: m.currentStatus ?? "",
    company: m.company ?? "",
    university: m.university ?? "",
    skills: m.skills?.join(", ") ?? "",
    causes: m.causes?.join(", ") ?? "",
    isPublic: m.isPublic !== false ? "yes" : "no",
    linkedin: m.linkedin ?? "",
    github: m.github ?? "",
    twitter: m.twitter ?? "",
    joined: fmt(m._creationTime),
  }));

  if (!members) return <TableSkeleton rows={8} />;

  const hasFilters = countryFilter || statusFilter || skillFilter || causeFilter || search;

  return (
    <div className="space-y-6">
      {/* ── Stats ── */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: "Total", value: stats.total },
            { label: "Public", value: stats.public },
            { label: "Countries", value: stats.countries },
            { label: "Students", value: stats.students },
            { label: "Working", value: stats.working },
          ].map(({ label, value }) => (
            <div key={label} className="border border-black/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-black" style={{ fontFamily: "var(--font-display)" }}>{value}</p>
              <p className="text-xs text-black/35 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      <div>
        <SectionHeader title="Members" count={filtered.length}>
          <ExportCsvButton rows={csvRows} filename="members.csv" />
        </SectionHeader>

        {/* ── Filters ── */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <input
            type="text"
            placeholder="Search name, email, location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-xs border border-black/15 rounded-md px-2.5 py-1.5 w-52 focus:outline-none focus:border-black/40 placeholder:text-black/30 text-black/70"
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
            options={[
              { value: "student", label: "Student" },
              { value: "working", label: "Working" },
            ]}
          />
          <FilterSelect
            label="Skill"
            value={skillFilter}
            onChange={setSkillFilter}
            options={skills.map((s) => ({ value: s, label: s }))}
          />
          <FilterSelect
            label="Cause"
            value={causeFilter}
            onChange={setCauseFilter}
            options={causes.map((c) => ({ value: c, label: c }))}
          />
          {hasFilters && (
            <button
              onClick={() => { setSearch(""); setCountryFilter(""); setStatusFilter(""); setSkillFilter(""); setCauseFilter(""); }}
              className="text-xs text-black/40 hover:text-black underline"
            >
              Clear
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <EmptyState message="No members match your filters." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Member</Th>
                <Th>Location</Th>
                <Th>Role / Status</Th>
                <Th>Skills</Th>
                <Th>Visible</Th>
                <Th>Joined</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <>
                  <Tr key={m._id} onClick={() => toggle(m._id)} active={isOpen(m._id)}>
                    <Td>
                      <div className="flex items-center gap-2.5">
                        <Avatar name={m.name} imageUrl={m.imageUrl} />
                        <div>
                          <p className="font-medium text-black text-sm">{m.name}</p>
                          <p className="text-xs text-black/40">{m.email}</p>
                          <SocialLinks links={{
                            linkedin: m.linkedin,
                            github: m.github,
                            twitter: m.twitter,
                            instagram: m.instagram,
                          }} />
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <span className="text-black/60 text-sm">
                        {m.city ? `${m.city}, ` : ""}{m.country}
                      </span>
                    </Td>
                    <Td>
                      {m.currentStatus
                        ? <Tag label={m.currentStatus} />
                        : <span className="text-black/20 text-xs">—</span>}
                    </Td>
                    <Td>
                      <div className="flex flex-wrap gap-1">
                        {m.skills?.slice(0, 3).map((s) => <Tag key={s} label={s} />)}
                        {(m.skills?.length ?? 0) > 3 && (
                          <span className="text-xs text-black/35">+{(m.skills?.length ?? 0) - 3}</span>
                        )}
                      </div>
                    </Td>
                    <Td>
                      <span className={`text-xs font-medium ${m.isPublic !== false ? "text-[#2d8a56]" : "text-black/30"}`}>
                        {m.isPublic !== false ? "Public" : "Private"}
                      </span>
                    </Td>
                    <Td>
                      <span className="text-black/40 text-xs">{fmt(m._creationTime)}</span>
                    </Td>
                  </Tr>
                  <ExpandPanel key={`${m._id}-panel`} open={isOpen(m._id)}>
                    <DetailRow label="Bio" value={m.bio} />
                    <DetailRow
                      label="Current role"
                      value={
                        m.currentStatus === "student"
                          ? `Student${m.university ? ` — ${m.university}` : ""}`
                          : m.currentStatus === "working"
                          ? `${m.position ?? ""}${m.company ? ` @ ${m.company}` : ""}`.trim() || undefined
                          : undefined
                      }
                    />
                    <DetailRow label="LinkedIn" value={m.linkedin} />
                    <DetailRow label="GitHub" value={m.github} />
                    <DetailRow label="Twitter / X" value={m.twitter} />
                    <DetailRow label="Instagram" value={m.instagram} />
                    <DetailRow label="Clerk ID" value={m.clerkId} />
                    {m.causes?.length ? (
                      <div className="flex gap-3 text-sm">
                        <span className="w-36 shrink-0 text-black/40 font-medium">Causes</span>
                        <div className="flex flex-wrap gap-1">{m.causes.map((c) => <Tag key={c} label={c} />)}</div>
                      </div>
                    ) : null}
                    {m.skills?.length ? (
                      <div className="flex gap-3 text-sm">
                        <span className="w-36 shrink-0 text-black/40 font-medium">All skills</span>
                        <div className="flex flex-wrap gap-1">{m.skills.map((s) => <Tag key={s} label={s} />)}</div>
                      </div>
                    ) : null}
                  </ExpandPanel>
                </>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
}
