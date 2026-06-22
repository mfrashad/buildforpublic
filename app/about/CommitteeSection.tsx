"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";

type Member = Doc<"committee">;

// Accent background per department (BFP palette).
const DEPT_ACCENT: Record<string, string> = {
  Leadership: "var(--color-bp-yellow)",
  Events: "var(--color-bp-mint)",
  Outreach: "var(--color-bp-blue)",
  Content: "var(--color-bp-peach)",
  Tech: "var(--color-bp-purple)",
  Finance: "#1a1a1a",
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
    <div className="flex items-center gap-3 mt-3">
      {present.map(([type, value]) => (
        <a
          key={type}
          href={socialHref(type, value!)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-black/50 hover:text-black underline underline-offset-2 capitalize"
        >
          {type}
        </a>
      ))}
    </div>
  );
}

function FilledCard({ m }: { m: Member }) {
  return (
    <div className="border border-black rounded-2xl p-5 bg-white shadow-[4px_4px_0_#000] flex flex-col">
      <div className="flex items-center gap-3">
        {m.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={m.imageUrl}
            alt={m.name ?? ""}
            className="w-14 h-14 rounded-full object-cover border border-black"
          />
        ) : (
          <div
            className="w-14 h-14 rounded-full border border-black flex items-center justify-center font-bold text-lg"
            style={{ background: DEPT_ACCENT[m.department] ?? "var(--color-bp-yellow)" }}
          >
            {initials(m.name)}
          </div>
        )}
        <div className="min-w-0">
          <p className="font-bold text-black leading-tight">{m.name}</p>
          <p className="text-sm text-black/60">{m.roleTitle}</p>
          {m.location && <p className="text-xs text-black/40 mt-0.5">{m.location}</p>}
        </div>
      </div>
      {m.isFounder && (
        <span className="self-start mt-3 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-bp-yellow text-black border border-black">
          Founding team
        </span>
      )}
      {m.bio && <p className="text-sm text-black/70 leading-relaxed mt-3">{m.bio}</p>}
      <Socials m={m} />
    </div>
  );
}

function OpenCard({ m }: { m: Member }) {
  return (
    <a
      href={m.ctaLink || "/volunteer"}
      className="group border-2 border-dashed border-black/30 rounded-2xl p-5 bg-transparent flex flex-col items-start justify-center min-h-[150px] hover:border-black hover:bg-black/[0.02] transition-colors"
    >
      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-bp-blue text-black border border-black">
        Open role
      </span>
      <p className="font-bold text-black mt-3">{m.roleTitle}</p>
      <p className="text-sm text-black/50 mt-1 leading-relaxed">
        We&apos;re looking for the right person — maybe it&apos;s you.
      </p>
      <span className="mt-4 text-sm font-semibold text-black underline underline-offset-4 group-hover:translate-x-0.5 transition-transform">
        {m.ctaLabel || "This could be you →"}
      </span>
    </a>
  );
}

function MysteryCard({ m }: { m: Member }) {
  return (
    <div className="border border-black rounded-2xl p-5 bg-black text-white flex flex-col items-start justify-center min-h-[150px] shadow-[4px_4px_0_#000]">
      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/15 text-white border border-white/30">
        Coming soon
      </span>
      <p className="text-4xl font-black mt-3" style={{ fontFamily: "var(--font-display)" }}>
        ?
      </p>
      <p className="font-bold mt-2">{m.roleTitle}</p>
      <p className="text-sm text-white/50 mt-1">Revealing soon. 👀</p>
    </div>
  );
}

export default function CommitteeSection() {
  const members = useQuery(api.committee.list);

  if (members === undefined) {
    return (
      <div className="max-w-5xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-40 rounded-2xl bg-black/5 border border-black/10" />
        ))}
      </div>
    );
  }
  if (members.length === 0) return null;

  // Group by department, preserving first-seen (order-sorted) order.
  const depts: { name: string; items: Member[] }[] = [];
  for (const m of members) {
    let g = depts.find((d) => d.name === m.department);
    if (!g) { g = { name: m.department, items: [] }; depts.push(g); }
    g.items.push(m);
  }

  return (
    <div className="max-w-5xl mx-auto px-6 space-y-14">
      {depts.map((dept) => (
        <div key={dept.name}>
          <div className="flex items-center gap-3 mb-6">
            <span
              className="inline-block w-4 h-4 rounded-full border border-black"
              style={{ background: DEPT_ACCENT[dept.name] ?? "var(--color-bp-yellow)" }}
            />
            <h2 className="heading-section text-2xl sm:text-3xl text-black">{dept.name}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dept.items.map((m) =>
              m.slotType === "filled" ? (
                <FilledCard key={m._id} m={m} />
              ) : m.slotType === "open" ? (
                <OpenCard key={m._id} m={m} />
              ) : (
                <MysteryCard key={m._id} m={m} />
              ),
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
