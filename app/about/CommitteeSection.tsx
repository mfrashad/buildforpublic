"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";

type Member = Doc<"committee">;

// Accent fill for initials avatars / mystery, by department (BFP palette).
const DEPT_ACCENT: Record<string, string> = {
  Leadership: "var(--color-bp-yellow)",
  Events: "var(--color-bp-mint)",
  Outreach: "var(--color-bp-blue)",
  Content: "var(--color-bp-peach)",
  Tech: "var(--color-bp-purple)",
  Finance: "var(--color-bp-orange)",
};

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
          className="text-xs font-medium text-black/40 hover:text-black underline underline-offset-2 capitalize"
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
    <div className="relative w-full rounded-2xl bg-white border border-black shadow-[4px_4px_0_#000] px-5 pt-16 pb-6 text-center h-full">
      <div className="absolute -top-12 left-1/2 -translate-x-1/2">{avatar}</div>
      {children}
    </div>
  );
  return (
    <div className="w-64 pt-12">
      {href ? (
        <a
          href={href}
          className="group block h-full transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_#000]"
        >
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
            className="w-24 h-24 rounded-full object-cover border-2 border-black"
          />
        ) : (
          <div
            className="w-24 h-24 rounded-full border-2 border-black text-black flex items-center justify-center text-2xl font-bold"
            style={{ background: DEPT_ACCENT[m.department] ?? "var(--color-bp-yellow)" }}
          >
            {initials(m.name)}
          </div>
        )
      }
    >
      <p className="font-bold text-black leading-tight">{m.name}</p>
      <p className="text-sm text-black/55 mt-1 leading-snug">{displayRole(m, all)}</p>
      {m.location && <p className="text-xs text-black/35 mt-1">{m.location}</p>}
      {m.bio && <p className="text-sm text-black/65 leading-relaxed mt-3">{m.bio}</p>}
      <Socials m={m} />
    </Card>
  );
}

function OpenCard({ m, all }: { m: Member; all: Member[] }) {
  return (
    <div className="w-64 pt-12">
      <a
        href={m.ctaLink || "/volunteer"}
        className="group block h-full transition-all hover:-translate-y-1"
      >
        <div className="relative w-full rounded-2xl bg-white border-2 border-dashed border-black/30 px-5 pt-16 pb-6 text-center h-full group-hover:border-black transition-colors">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2">
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-black/30 bg-white text-black/40 flex items-center justify-center text-3xl font-light group-hover:border-black group-hover:text-black transition-colors">
              +
            </div>
          </div>
          <p className="font-bold text-black/70 leading-tight group-hover:text-black transition-colors">
            {m.ctaLabel || "This could be you"}
          </p>
          <p className="text-sm text-black/55 mt-1 leading-snug">{displayRole(m, all)}</p>
          <p className="text-xs font-semibold text-black/50 mt-3 group-hover:text-black transition-colors">
            Open role — apply →
          </p>
        </div>
      </a>
    </div>
  );
}

function MysteryCard({ m }: { m: Member }) {
  return (
    <Card
      avatar={
        <div
          className="w-24 h-24 rounded-full border-2 border-black text-black flex items-center justify-center text-3xl font-black"
          style={{ background: DEPT_ACCENT[m.department] ?? "var(--color-bp-purple)" }}
        >
          ?
        </div>
      }
    >
      <p className="font-bold text-black leading-tight">{m.roleTitle}</p>
      <p className="text-sm text-black/50 mt-1">Revealing soon 👀</p>
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
