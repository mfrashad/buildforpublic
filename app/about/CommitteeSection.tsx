"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";

type Member = Doc<"committee">;

function initials(name?: string) {
  if (!name) return "?";
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function socialHref(type: string, value: string): string {
  const v = value.trim();
  if (/^https?:\/\//i.test(v)) return v;
  const h = v.replace(/^@/, "");
  switch (type) {
    case "linkedin": return `https://linkedin.com/in/${h}`;
    case "github": return `https://github.com/${h}`;
    case "twitter": return `https://twitter.com/${h}`;
    case "instagram": return `https://instagram.com/${h}`;
    default: return v.startsWith("//") ? `https:${v}` : `https://${v}`;
  }
}

// A slot is "director-level" if its role or linked position says so.
function isDirectorLevel(m: Member) {
  return /director/i.test(m.roleTitle || "") || (m.positionId || "").toLowerCase().endsWith("director");
}

// Derive the displayed role title:
// - Director-level slots become "{Dept} Co-Director" when a director is already
//   filled AND there's a second director seat; otherwise "{Dept} Director".
//   (So an open seat reads "Director" until one is filled, then both flip to
//   "Co-Director" — there's never a lone "Director" alongside a co-director.)
// - Everything else uses its stored role title.
function displayRole(m: Member, all: Member[]) {
  if (!isDirectorLevel(m)) return m.roleTitle;
  const inDept = all.filter((x) => x.department === m.department && isDirectorLevel(x));
  const filledDirector = inDept.some((x) => x.slotType === "filled");
  const coDirector = filledDirector && inDept.length >= 2;
  return `${m.department} ${coDirector ? "Co-Director" : "Director"}`;
}

function Socials({ m }: { m: Member }) {
  const links: [string, string | undefined][] = [
    ["linkedin", m.linkedin],
    ["github", m.github],
    ["twitter", m.twitter],
    ["instagram", m.instagram],
    ["website", m.website],
  ];
  const present = links.filter(([, v]) => v && v.trim());
  if (!present.length) return null;
  return (
    <div className="flex items-center justify-center gap-3 mt-2">
      {present.map(([type, value]) => (
        <a
          key={type}
          href={socialHref(type, value!)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-white/40 hover:text-white underline underline-offset-2 capitalize"
        >
          {type}
        </a>
      ))}
    </div>
  );
}

// Shared card shell — circular avatar overlapping the top of a dark card.
function Card({
  avatar,
  children,
  href,
}: {
  avatar: React.ReactNode;
  children: React.ReactNode;
  href?: string;
}) {
  const inner = (
    <div className="relative w-full rounded-3xl bg-neutral-900 px-5 pt-16 pb-6 text-center h-full">
      <div className="absolute -top-12 left-1/2 -translate-x-1/2">{avatar}</div>
      {children}
    </div>
  );
  return (
    <div className="w-64 pt-12">
      {href ? (
        <a href={href} className="group block h-full transition-transform hover:-translate-y-1">
          {inner}
        </a>
      ) : (
        inner
      )}
    </div>
  );
}

function FilledCard({ m, all }: { m: Member; all: Member[] }) {
  return (
    <Card
      avatar={
        m.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={m.imageUrl}
            alt={m.name ?? ""}
            className="w-24 h-24 rounded-full object-cover ring-4 ring-neutral-900"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-neutral-700 text-white flex items-center justify-center text-2xl font-bold ring-4 ring-neutral-900">
            {initials(m.name)}
          </div>
        )
      }
    >
      <p className="font-bold text-white leading-tight">{m.name}</p>
      <p className="text-sm italic text-white/50 mt-1 leading-snug">{displayRole(m, all)}</p>
      {m.location && <p className="text-xs text-white/30 mt-1">{m.location}</p>}
      {m.bio && <p className="text-sm text-white/60 leading-relaxed mt-3">{m.bio}</p>}
      <Socials m={m} />
    </Card>
  );
}

function OpenCard({ m, all }: { m: Member; all: Member[] }) {
  return (
    <Card
      href={m.ctaLink || "/volunteer"}
      avatar={
        <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/30 text-white/40 flex items-center justify-center text-3xl font-light ring-4 ring-neutral-900 bg-neutral-900 group-hover:border-white/60 group-hover:text-white/70 transition-colors">
          +
        </div>
      }
    >
      <p className="font-bold text-white/80 leading-tight">{m.ctaLabel || "This could be you"}</p>
      <p className="text-sm italic text-white/50 mt-1 leading-snug">{displayRole(m, all)}</p>
      <p className="text-xs font-medium text-white/40 mt-3 group-hover:text-white/70 transition-colors">
        Open role — apply →
      </p>
    </Card>
  );
}

function MysteryCard({ m }: { m: Member }) {
  return (
    <Card
      avatar={
        <div className="w-24 h-24 rounded-full bg-neutral-800 text-white/40 flex items-center justify-center text-3xl font-black ring-4 ring-neutral-900">
          ?
        </div>
      }
    >
      <p className="font-bold text-white/70 leading-tight">{m.roleTitle}</p>
      <p className="text-sm italic text-white/40 mt-1">Revealing soon 👀</p>
    </Card>
  );
}

export default function CommitteeSection() {
  const members = useQuery(api.committee.list);

  if (members === undefined) {
    return (
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-12 max-w-4xl mx-auto px-6 animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-64 h-52 rounded-3xl bg-black/5 border border-black/10" />
        ))}
      </div>
    );
  }
  if (members.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-x-8 gap-y-6 max-w-5xl mx-auto px-6">
      {members.map((m) =>
        m.slotType === "filled" ? (
          <FilledCard key={m._id} m={m} all={members} />
        ) : m.slotType === "open" ? (
          <OpenCard key={m._id} m={m} all={members} />
        ) : (
          <MysteryCard key={m._id} m={m} />
        ),
      )}
    </div>
  );
}
