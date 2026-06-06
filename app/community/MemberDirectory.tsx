"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import MemberAvatarStack from "@/components/MemberAvatarStack";

type Member = {
  _id: string;
  _creationTime: number;
  name: string;
  country: string;
  city?: string;
  bio?: string;
  skills?: string[];
  causes?: string[];
  imageUrl?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const ACCENT_COLORS = ["#fff200", "#94e8ff", "#6ff5b6", "#ffc0a1", "#e8d5ff"];

function getAccent(id: string) {
  return ACCENT_COLORS[id.charCodeAt(id.length - 1) % ACCENT_COLORS.length];
}

function MemberCard({ member, activeCause }: { member: Member; activeCause: string | null }) {
  const accent = getAccent(member._id);
  const hasSocial = member.linkedin || member.github || member.twitter;
  return (
    <article className="card p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        {member.imageUrl ? (
          <img
            src={member.imageUrl}
            alt={member.name}
            className="w-11 h-11 rounded-full border-2 border-black object-cover flex-shrink-0"
          />
        ) : (
          <div
            className="w-11 h-11 rounded-full border-2 border-black flex items-center justify-center flex-shrink-0 text-sm font-bold"
            style={{ background: accent }}
          >
            {getInitials(member.name)}
          </div>
        )}
        <div className="min-w-0">
          <p
            className="text-sm text-black truncate"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
          >
            {member.name}
          </p>
          <p className="text-xs text-black/40 truncate mt-0.5">
            {member.city ? `${member.city}, ` : ""}{member.country}
          </p>
        </div>
      </div>

      {/* Bio */}
      {member.bio && (
        <p className="text-xs text-black/60 leading-relaxed line-clamp-3">{member.bio}</p>
      )}

      {/* Footer */}
      <div className="mt-auto flex items-end justify-between gap-3 pt-3 border-t border-black/8">
        {/* Skills + social */}
        <div className="min-w-0 flex flex-col gap-1.5">
          {member.skills && member.skills.length > 0 && (
            <p className="text-[11px] text-black/35 truncate">
              {member.skills.slice(0, 3).join(", ")}
              {member.skills.length > 3 && ` +${member.skills.length - 3}`}
            </p>
          )}
          {hasSocial && (
            <div className="flex gap-3">
              {member.linkedin && (
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                  className="text-[11px] text-black/40 hover:text-black transition-colors">
                  LinkedIn ↗
                </a>
              )}
              {member.github && (
                <a href={`https://github.com/${member.github.replace("@", "")}`} target="_blank" rel="noopener noreferrer"
                  className="text-[11px] text-black/40 hover:text-black transition-colors">
                  GitHub ↗
                </a>
              )}
              {member.twitter && (
                <a href={`https://x.com/${member.twitter.replace("@", "")}`} target="_blank" rel="noopener noreferrer"
                  className="text-[11px] text-black/40 hover:text-black transition-colors">
                  X ↗
                </a>
              )}
            </div>
          )}
        </div>

        {/* Causes */}
        {member.causes && member.causes.length > 0 && (
          <div className="flex flex-wrap gap-1 justify-end flex-shrink-0 max-w-[55%]">
            {member.causes.slice(0, 3).map((cause) => {
              const isActive = activeCause === cause;
              return (
                <span
                  key={cause}
                  className="text-[10px] px-1.5 py-0.5 rounded-full whitespace-nowrap"
                  style={{
                    background: isActive ? "#fff200" : "rgba(0,0,0,0.05)",
                    color: isActive ? "#000" : "rgba(0,0,0,0.45)",
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {cause}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
}

function FilterBar({
  members,
  activeCause,
  activeCountry,
  onCause,
  onCountry,
}: {
  members: Member[];
  activeCause: string | null;
  activeCountry: string | null;
  onCause: (c: string | null) => void;
  onCountry: (c: string | null) => void;
}) {
  // Tally causes across all members (each member counted once per cause)
  const byCause = useMemo(() => {
    const map: Record<string, number> = {};
    members.forEach((m) => {
      (m.causes ?? []).forEach((c) => { map[c] = (map[c] || 0) + 1; });
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [members]);

  // Tally countries, filtered by active cause
  const causeFiltered = useMemo(
    () => activeCause ? members.filter((m) => m.causes?.includes(activeCause)) : members,
    [members, activeCause]
  );
  const byCountry = useMemo(() => {
    const map: Record<string, number> = {};
    causeFiltered.forEach((m) => { map[m.country] = (map[m.country] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [causeFiltered]);

  return (
    <div className="card-flat p-6 mb-8 space-y-5">
      {/* Cause filter */}
      <div>
        <p className="text-xs font-semibold text-black/50 uppercase tracking-wider mb-3">
          Filter by cause
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { onCause(null); onCountry(null); }}
            className={`btn-pill text-sm py-1.5 px-4 transition-all ${
              activeCause === null ? "btn-pill-filled" : "btn-pill-outline"
            }`}
          >
            All ({members.length})
          </button>
          {byCause.map(([cause, count]) => (
            <button
              key={cause}
              onClick={() => { onCause(activeCause === cause ? null : cause); onCountry(null); }}
              className={`btn-pill text-sm py-1.5 px-4 transition-all ${
                activeCause === cause ? "btn-pill-filled" : "btn-pill-outline"
              }`}
            >
              {cause} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Country filter — secondary */}
      {byCountry.length > 1 && (
        <div>
          <p className="text-xs font-semibold text-black/50 uppercase tracking-wider mb-3">
            Filter by location
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onCountry(null)}
              className={`btn-pill text-sm py-1.5 px-4 transition-all ${
                activeCountry === null ? "btn-pill-filled" : "btn-pill-outline"
              }`}
            >
              All
            </button>
            {byCountry.map(([country, count]) => (
              <button
                key={country}
                onClick={() => onCountry(activeCountry === country ? null : country)}
                className={`btn-pill text-sm py-1.5 px-4 transition-all ${
                  activeCountry === country ? "btn-pill-filled" : "btn-pill-outline"
                }`}
              >
                {country} ({count})
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="card p-5 animate-pulse">
      <div className="flex gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-black/10 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-black/10 rounded w-2/3" />
          <div className="h-3 bg-black/10 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="h-3 bg-black/10 rounded" />
        <div className="h-3 bg-black/10 rounded w-4/5" />
      </div>
    </div>
  );
}

function LockedState() {
  const count = useQuery(api.members.countPublic);

  return (
    <div className="max-w-md mx-auto text-center py-20 px-6">
      <div className="mb-8">
        <MemberAvatarStack center />
      </div>
      <h2
        className="text-2xl text-black mb-3"
        style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
      >
        {count !== undefined ? `${count} builders in here.` : "The community directory."}
      </h2>
      <p className="text-black/60 text-sm leading-relaxed mb-8">
        The directory is only visible to community members.
        Join or sign in to see who&apos;s building.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a href="/join" className="btn-pill btn-pill-filled px-8 py-2.5 text-sm">
          Join the community →
        </a>
        <a href="/sign-in" className="btn-pill btn-pill-outline px-8 py-2.5 text-sm">
          Sign in
        </a>
      </div>
    </div>
  );
}

export default function MemberDirectory() {
  const { isLoaded, isSignedIn } = useUser();
  const [activeCause, setActiveCause] = useState<string | null>(null);
  const [activeCountry, setActiveCountry] = useState<string | null>(null);

  const members = useQuery(
    api.members.listPublic,
    isLoaded && isSignedIn ? {} : "skip"
  );

  // Apply both filters
  const filtered = useMemo(() => {
    if (!members) return [];
    return members.filter((m) => {
      if (activeCause && !m.causes?.includes(activeCause)) return false;
      if (activeCountry && m.country !== activeCountry) return false;
      return true;
    });
  }, [members, activeCause, activeCountry]);

  // Sort by primary cause alphabetically
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const ca = a.causes?.[0] ?? "zzz";
      const cb = b.causes?.[0] ?? "zzz";
      return ca.localeCompare(cb);
    });
  }, [filtered]);

  if (!isLoaded) return null;
  if (!isSignedIn) return <LockedState />;

  const isLoading = members === undefined;

  return (
    <div>
      {!isLoading && members!.length > 0 && (
        <FilterBar
          members={members!}
          activeCause={activeCause}
          activeCountry={activeCountry}
          onCause={setActiveCause}
          onCountry={setActiveCountry}
        />
      )}

      {/* Stats */}
      {!isLoading && members!.length > 0 && (
        <div className="flex items-center gap-2 mb-6">
          <p className="text-sm text-black/60">
            {filtered.length} member{filtered.length !== 1 ? "s" : ""}
            {activeCause ? ` interested in ${activeCause}` : ""}
            {activeCountry ? ` in ${activeCountry}` : ""}
          </p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-xl text-black mb-3" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>
            No members match this filter
          </p>
          <p className="text-black/60 text-sm mb-6">Try a different cause or location.</p>
          <button
            onClick={() => { setActiveCause(null); setActiveCountry(null); }}
            className="btn-pill btn-pill-outline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Loading skeletons */}
      {isLoading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Flat grid — sorted by primary cause */}
      {!isLoading && sorted.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sorted.map((m) => <MemberCard key={m._id} member={m} activeCause={activeCause} />)}
        </div>
      )}
    </div>
  );
}
