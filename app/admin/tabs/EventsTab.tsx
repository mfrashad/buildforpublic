"use client";

import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  EmptyState,
  ExportCsvButton,
  SectionHeader,
  Table,
  TableSkeleton,
  Td,
  Th,
  Tr,
} from "../ui";

function fmt(ts: number) {
  return new Date(ts).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

type Member = NonNullable<
  NonNullable<ReturnType<typeof useQuery<typeof api.admin.listEventRsvps>>>[number]["member"]
>;

function location(m: Member): string {
  return [m.city, m.country].filter(Boolean).join(", ");
}

function workStudy(m: Member): string {
  if (m.currentStatus === "student") return ["Student", m.university].filter(Boolean).join(" · ");
  if (m.currentStatus === "working")
    return ["Working", m.position && m.company ? `${m.position} @ ${m.company}` : m.company].filter(Boolean).join(" · ");
  return m.company || m.university || "";
}

function Avatar({ src, name }: { src: string | null; name: string }) {
  const initials = name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt="" className="w-7 h-7 rounded-full bg-black/5 object-cover shrink-0" />;
  }
  return (
    <span className="w-7 h-7 rounded-full bg-black/[0.07] text-black/40 text-[10px] font-semibold flex items-center justify-center shrink-0">
      {initials || "?"}
    </span>
  );
}

export default function EventsTab() {
  const rsvps = useQuery(api.admin.listEventRsvps);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const grouped = useMemo(() => {
    if (!rsvps) return null;
    const map = new Map<string, typeof rsvps>();
    for (const r of rsvps) {
      const list = map.get(r.eventSlug) ?? [];
      list.push(r);
      map.set(r.eventSlug, list);
    }
    return Array.from(map.entries())
      .map(([slug, items]) => ({ slug, items }))
      .sort((a, b) => b.items[0]._creationTime - a.items[0]._creationTime);
  }, [rsvps]);

  if (!grouped) return <TableSkeleton rows={4} />;
  if (grouped.length === 0) return <EmptyState message="No event RSVPs yet." />;

  const active = grouped.find((g) => g.slug === selectedSlug);
  const csvRows = active
    ? active.items
        .slice()
        .sort((a, b) => a._creationTime - b._creationTime)
        .map((r, i) => ({
          "#": i + 1,
          name: r.name ?? r.member?.name ?? "",
          email: r.email,
          location: r.member ? location(r.member) : "",
          status: r.member ? workStudy(r.member) : "",
          member: r.member ? "yes" : "no",
          registered: fmt(r._creationTime),
        }))
    : [];

  return (
    <div className="space-y-6">
      {/* ── Event cards ── */}
      <div>
        <SectionHeader title="Events" count={grouped.length} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {grouped.map(({ slug, items }) => (
            <button
              key={slug}
              onClick={() => setSelectedSlug(slug === selectedSlug ? null : slug)}
              className={`text-left border rounded-xl p-4 transition-all ${
                selectedSlug === slug
                  ? "border-black bg-black text-white shadow-[3px_3px_0_#000]"
                  : "border-black/15 bg-white hover:border-black/40"
              }`}
            >
              <p className="font-semibold text-sm truncate">{slug}</p>
              <p className={`text-xs mt-1 ${selectedSlug === slug ? "text-white/50" : "text-black/50"}`}>
                {items.length} RSVP{items.length !== 1 ? "s" : ""}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* ── RSVP list ── */}
      {active && (
        <div>
          <SectionHeader title={`RSVPs — ${active.slug}`} count={active.items.length}>
            <ExportCsvButton rows={csvRows} filename={`rsvps-${active.slug}.csv`} />
          </SectionHeader>
          <Table>
            <thead>
              <tr>
                <Th>#</Th>
                <Th>Member</Th>
                <Th>Email</Th>
                <Th>Location</Th>
                <Th>Work / Study</Th>
                <Th>Registered</Th>
              </tr>
            </thead>
            <tbody>
              {active.items
                .slice()
                .sort((a, b) => a._creationTime - b._creationTime)
                .map((r, i) => {
                  const m = r.member;
                  const displayName = r.name ?? m?.name ?? "";
                  return (
                    <Tr key={r._id}>
                      <Td><span className="text-black/30 text-xs">{i + 1}</span></Td>
                      <Td>
                        <div className="flex items-center gap-2.5">
                          <Avatar src={m?.imageUrl ?? null} name={displayName} />
                          <span className="text-black/80 text-sm">
                            {displayName || <span className="text-black/25">—</span>}
                            {!m && (
                              <span className="ml-2 text-[10px] uppercase tracking-wider text-amber-600/80 align-middle">
                                guest
                              </span>
                            )}
                          </span>
                        </div>
                      </Td>
                      <Td>
                        <a
                          href={`mailto:${r.email}`}
                          className="text-sm text-black hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {r.email}
                        </a>
                      </Td>
                      <Td>
                        <span className="text-black/60 text-sm">
                          {m && location(m) ? location(m) : <span className="text-black/20">—</span>}
                        </span>
                      </Td>
                      <Td>
                        <span className="text-black/60 text-sm">
                          {m && workStudy(m) ? workStudy(m) : <span className="text-black/20">—</span>}
                        </span>
                      </Td>
                      <Td><span className="text-black/40 text-xs">{fmt(r._creationTime)}</span></Td>
                    </Tr>
                  );
                })}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}
