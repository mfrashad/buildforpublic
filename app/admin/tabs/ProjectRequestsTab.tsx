"use client";

import { useState } from "react";
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
  StatusSelect,
  NotesEditor,
  SectionHeader,
  StatusBadge,
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

export default function ProjectRequestsTab() {
  const [showHidden, setShowHidden] = useState(false);
  const [confirmHide, setConfirmHide] = useState<string | null>(null);

  const requests = useQuery(api.admin.listProjectRequests, { showHidden });
  const updateStatus = useMutation(api.admin.updateProjectRequestStatus);
  const setNotes = useMutation(api.admin.setProjectRequestNotes);
  const setHidden = useMutation(api.admin.setProjectRequestHidden);
  const { toggle, isOpen } = useExpand();

  if (!requests) return <TableSkeleton rows={6} />;

  const csvRows = requests.map((r) => ({
    org: r.orgName,
    orgType: r.orgType ?? "",
    contact: r.contactName,
    email: r.contactEmail,
    country: r.country,
    projectType: r.projectType ?? "",
    status: r.status,
    problem: r.problem,
    submitted: fmt(r._creationTime),
  }));

  const toHide = requests.find((r) => r._id === confirmHide);

  return (
    <div className="space-y-4">
      <ConfirmModal
        open={!!confirmHide}
        title={toHide?.hidden ? `Restore ${toHide?.orgName}?` : `Hide ${toHide?.orgName}?`}
        description={
          toHide?.hidden
            ? "This request will reappear in the default list."
            : "Hides it from the default view. Toggle 'Show hidden' to see it again."
        }
        confirmLabel={toHide?.hidden ? "Restore" : "Hide"}
        onConfirm={() => {
          if (confirmHide)
            setHidden({ id: confirmHide as Id<"projectRequests">, hidden: !toHide?.hidden });
          setConfirmHide(null);
        }}
        onCancel={() => setConfirmHide(null)}
      />

      <SectionHeader title="Project Requests" count={requests.length}>
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
        <ExportCsvButton rows={csvRows} filename="project-requests.csv" />
      </SectionHeader>

      {requests.length === 0 ? (
        <EmptyState message="No project requests yet." />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Org</Th>
              <Th>Contact</Th>
              <Th>Type</Th>
              <Th>Country</Th>
              <Th>Submitted</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <>
                <Tr key={r._id} onClick={() => toggle(r._id)} active={isOpen(r._id)}>
                  <Td>
                    <div className={r.hidden ? "opacity-40" : ""}>
                      <p className="font-medium text-black">{r.orgName}</p>
                      {r.orgType && <Tag label={r.orgType} />}
                    </div>
                  </Td>
                  <Td>
                    <p className="text-black/80 text-sm">{r.contactName}</p>
                    <p className="text-xs text-black/40">{r.contactEmail}</p>
                  </Td>
                  <Td>
                    {r.projectType
                      ? <Tag label={r.projectType} />
                      : <span className="text-black/25 text-xs">—</span>}
                  </Td>
                  <Td>
                    <span className="text-black/60 text-sm">{r.country}</span>
                  </Td>
                  <Td>
                    <span className="text-black/40 text-xs">{fmt(r._creationTime)}</span>
                  </Td>
                  <Td>
                    <StatusBadge status={r.status} />
                    {r.hidden && <span className="ml-1.5 text-xs text-black/30">(hidden)</span>}
                  </Td>
                  <Td>
                    <StatusSelect
                      value={r.status}
                      options={["new", "contacted", "accepted", "declined"]}
                      onChange={(s) =>
                        updateStatus({ id: r._id as Id<"projectRequests">, status: s as "new" | "contacted" | "accepted" | "declined" })
                      }
                    />
                  </Td>
                </Tr>
                <ExpandPanel key={`${r._id}-panel`} open={isOpen(r._id)}>
                  <DetailRow label="Website" value={r.orgWebsite} />
                  <DetailRow label="Problem" value={r.problem} />
                  <DetailRow label="Who it helps" value={r.whoItHelps} />
                  <DetailRow label="Current solution" value={r.currentSolution} />
                  <DetailRow label="Ideal outcome" value={r.idealOutcome} />
                  <DetailRow label="Timeline" value={r.timeline} />
                  <DetailRow label="Budget" value={r.budget} />
                  <DetailRow label="Materials link" value={r.materialsLink} />
                  <DetailRow label="Instagram" value={r.instagram} />
                  <DetailRow label="Referral source" value={r.referralSource} />

                  {/* Notes */}
                  <NotesEditor
                    initialValue={r.notes}
                    onSave={(notes) =>
                      setNotes({ id: r._id as Id<"projectRequests">, notes }).then(() => {})
                    }
                  />

                  {/* Delete / restore */}
                  <div className="flex gap-3 text-sm pt-1">
                    <span className="w-36 shrink-0" />
                    <DeleteButton
                      label={r.hidden ? "Restore" : "Hide request"}
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
