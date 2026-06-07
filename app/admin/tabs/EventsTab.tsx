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
          name: r.name ?? "",
          email: r.email,
          registered: fmt(r._creationTime),
          clerkId: r.clerkId ?? "",
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
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Registered</Th>
                <Th>Clerk user</Th>
              </tr>
            </thead>
            <tbody>
              {active.items
                .slice()
                .sort((a, b) => a._creationTime - b._creationTime)
                .map((r, i) => (
                  <Tr key={r._id}>
                    <Td><span className="text-black/30 text-xs">{i + 1}</span></Td>
                    <Td>
                      <span className="text-black/70 text-sm">
                        {r.name ?? <span className="text-black/25">—</span>}
                      </span>
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
                    <Td><span className="text-black/40 text-xs">{fmt(r._creationTime)}</span></Td>
                    <Td>
                      {r.clerkId
                        ? <span className="text-xs text-black/30 font-mono">{r.clerkId.slice(0, 14)}…</span>
                        : <span className="text-black/20 text-xs">guest</span>}
                    </Td>
                  </Tr>
                ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}
