"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

type Member = {
  _id: string;
  _creationTime: number;
  name: string;
  country: string;
  city?: string;
  bio?: string;
  skills?: string[];
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
  const index = id.charCodeAt(id.length - 1) % ACCENT_COLORS.length;
  return ACCENT_COLORS[index];
}

function MemberCard({ member }: { member: Member }) {
  const accent = getAccent(member._id);
  return (
    <article className="card p-5 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center flex-shrink-0 text-sm font-bold"
          style={{ background: accent }}
        >
          {getInitials(member.name)}
        </div>
        <div className="min-w-0">
          <p
            className="text-base text-black truncate"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
          >
            {member.name}
          </p>
          <p className="text-xs text-black/50 truncate">
            {member.city ? `${member.city}, ` : ""}{member.country}
          </p>
        </div>
      </div>

      {member.bio && (
        <p className="text-xs text-black/60 leading-relaxed line-clamp-2">{member.bio}</p>
      )}

      {member.skills && member.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {member.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="text-xs px-2 py-0.5 bg-surface border border-black/20 rounded-full text-black/60"
            >
              {skill}
            </span>
          ))}
          {member.skills.length > 4 && (
            <span className="text-xs px-2 py-0.5 text-black/40">
              +{member.skills.length - 4}
            </span>
          )}
        </div>
      )}

      {(member.linkedin || member.github || member.twitter) && (
        <div className="flex gap-3 mt-auto pt-2 border-t border-black/10">
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-black/50 hover:text-black transition-colors"
            >
              LinkedIn ↗
            </a>
          )}
          {member.github && (
            <a
              href={`https://github.com/${member.github.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-black/50 hover:text-black transition-colors"
            >
              GitHub ↗
            </a>
          )}
          {member.twitter && (
            <a
              href={`https://x.com/${member.twitter.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-black/50 hover:text-black transition-colors"
            >
              X ↗
            </a>
          )}
        </div>
      )}
    </article>
  );
}

// Country dot for the simple map view
function CountryMap({
  members,
  activeCountry,
  onSelect,
}: {
  members: Member[];
  activeCountry: string | null;
  onSelect: (country: string | null) => void;
}) {
  const byCountry = useMemo(() => {
    const map: Record<string, number> = {};
    members.forEach((m) => {
      map[m.country] = (map[m.country] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [members]);

  return (
    <div className="card-flat p-6 mb-8">
      <p
        className="text-sm font-semibold text-black/60 uppercase tracking-wider mb-4"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        Members by country
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelect(null)}
          className={`btn-pill text-sm py-1.5 px-4 transition-all ${
            activeCountry === null ? "btn-pill-filled" : "btn-pill-outline"
          }`}
        >
          All ({members.length})
        </button>
        {byCountry.map(([country, count]) => (
          <button
            key={country}
            onClick={() => onSelect(activeCountry === country ? null : country)}
            className={`btn-pill text-sm py-1.5 px-4 transition-all ${
              activeCountry === country ? "btn-pill-filled" : "btn-pill-outline"
            }`}
          >
            {country} ({count})
          </button>
        ))}
      </div>
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

export default function MemberDirectory() {
  const [activeCountry, setActiveCountry] = useState<string | null>(null);
  const members = useQuery(api.members.listPublic);

  const isLoading = members === undefined;

  const filtered = useMemo(() => {
    if (!members) return [];
    if (!activeCountry) return members;
    return members.filter((m) => m.country === activeCountry);
  }, [members, activeCountry]);

  return (
    <div>
      {/* Country filter */}
      {!isLoading && members.length > 0 && (
        <CountryMap
          members={members}
          activeCountry={activeCountry}
          onSelect={setActiveCountry}
        />
      )}

      {/* Stats bar */}
      {!isLoading && members.length > 0 && (
        <div className="flex items-center gap-2 mb-6">
          <p className="text-sm text-black/60" style={{ fontFamily: "var(--font-sans)" }}>
            {activeCountry
              ? `${filtered.length} member${filtered.length !== 1 ? "s" : ""} in ${activeCountry}`
              : `${members.length} member${members.length !== 1 ? "s" : ""} from ${
                  [...new Set(members.map((m) => m.country))].length
                } countries`}
          </p>
        </div>
      )}

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading && (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="col-span-full text-center py-16">
            <p
              className="text-xl text-black mb-3"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
            >
              {activeCountry ? `No members in ${activeCountry} yet` : "No members yet"}
            </p>
            <p className="text-black/60 text-sm mb-6">
              Be the first to join and appear on the directory.
            </p>
            <a href="/join" className="btn-pill btn-pill-filled">
              Join the community →
            </a>
          </div>
        )}

        {filtered.map((member) => (
          <MemberCard key={member._id} member={member} />
        ))}
      </div>
    </div>
  );
}
