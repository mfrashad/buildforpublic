"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { VENUE_TEMPLATES } from "@/lib/outreachTemplates";
import {
  ConfirmModal,
  DeleteButton,
  DetailRow,
  EmptyState,
  ExpandPanel,
  ExportCsvButton,
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
import {
  AssignedToSelect,
  CollaboratorsBar,
  FieldInput,
  MessageEditor,
  fmt,
} from "./outreachShared";

const PLATFORMS = ["instagram", "threads", "whatsapp", "email", "phone", "facebook", "other"];

const AMENITIES = [
  { key: "wifi", label: "WiFi" },
  { key: "plugs", label: "Plugs" },
  { key: "projector", label: "Projector" },
  { key: "parking", label: "Great parking" },
  { key: "tables", label: "Tables" },
] as const;

type AmenityKey = (typeof AMENITIES)[number]["key"];

type VenueAmenities = {
  wifi?: boolean;
  plugs?: boolean;
  projector?: boolean;
  parking?: boolean;
  tables?: boolean;
  maxOccupant?: number;
};

function amenitySummary(v: VenueAmenities): string {
  const parts: string[] = AMENITIES.filter((a) => v[a.key]).map((a) => a.label);
  if (v.maxOccupant) parts.push(`${v.maxOccupant} pax`);
  return parts.join(" · ");
}
const STATUSES = [
  "to_contact",
  "dm_sent",
  "responded",
  "negotiating",
  "secured",
  "no_response",
  "declined",
];

function AddVenueForm({ onClose }: { onClose: () => void }) {
  const createVenue = useMutation(api.outreach.createVenue);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [contactHandle, setContactHandle] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [instagram, setInstagram] = useState("");
  const [threads, setThreads] = useState("");
  const [website, setWebsite] = useState("");
  const [googleMaps, setGoogleMaps] = useState("");
  const [platform, setPlatform] = useState("");
  const [eventName, setEventName] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [amenities, setAmenities] = useState<Record<AmenityKey, boolean>>({
    wifi: true,
    plugs: false,
    projector: false,
    parking: false,
    tables: false,
  });
  const [maxOccupant, setMaxOccupant] = useState("");

  return (
    <div className="border border-black/15 rounded-xl p-4 space-y-3 bg-black/[0.02]">
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Venue name *"
          className="text-sm border border-black/15 rounded-lg px-3 py-2 focus:outline-none focus:border-black/40"
        />
        <input
          value={contactHandle}
          onChange={(e) => setContactHandle(e.target.value)}
          placeholder="Contact name / DM handle"
          className="text-sm border border-black/15 rounded-lg px-3 py-2 focus:outline-none focus:border-black/40"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="text-sm border border-black/15 rounded-lg px-3 py-2 focus:outline-none focus:border-black/40"
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone"
          className="text-sm border border-black/15 rounded-lg px-3 py-2 focus:outline-none focus:border-black/40"
        />
        <input
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          placeholder="Instagram (@handle or URL)"
          className="text-sm border border-black/15 rounded-lg px-3 py-2 focus:outline-none focus:border-black/40"
        />
        <input
          value={threads}
          onChange={(e) => setThreads(e.target.value)}
          placeholder="Threads (@handle or URL)"
          className="text-sm border border-black/15 rounded-lg px-3 py-2 focus:outline-none focus:border-black/40"
        />
        <input
          value={googleMaps}
          onChange={(e) => setGoogleMaps(e.target.value)}
          placeholder="Google Maps link or place name"
          className="text-sm border border-black/15 rounded-lg px-3 py-2 focus:outline-none focus:border-black/40"
        />
        <input
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="Website (optional)"
          className="text-sm border border-black/15 rounded-lg px-3 py-2 focus:outline-none focus:border-black/40"
        />
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="text-sm border border-black/15 rounded-lg px-3 py-2 bg-white text-black/70 focus:outline-none focus:border-black/40"
        >
          <option value="">Platform…</option>
          {PLATFORMS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <input
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          placeholder="For event (optional)"
          className="text-sm border border-black/15 rounded-lg px-3 py-2 focus:outline-none focus:border-black/40"
        />
      </div>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (vibe, why it's a good fit, opening hours, etc.)"
        rows={2}
        className="w-full text-sm border border-black/15 rounded-lg px-3 py-2 focus:outline-none focus:border-black/40 resize-y"
      />

      <div>
        <button
          type="button"
          onClick={() => setShowDetails((v) => !v)}
          className="text-xs text-black/50 hover:text-black font-medium"
        >
          {showDetails ? "▾" : "▸"} Amenities & details (optional)
        </button>
        {showDetails && (
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 border border-black/10 rounded-lg p-3 bg-white">
            {AMENITIES.map((a) => (
              <label
                key={a.key}
                className="flex items-center gap-1.5 text-sm text-black/70 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={amenities[a.key]}
                  onChange={(e) =>
                    setAmenities((p) => ({ ...p, [a.key]: e.target.checked }))
                  }
                />
                {a.label}
              </label>
            ))}
            <label className="flex items-center gap-1.5 text-sm text-black/70">
              Max occupancy
              <input
                type="number"
                min="0"
                value={maxOccupant}
                onChange={(e) => setMaxOccupant(e.target.value)}
                placeholder="e.g. 30"
                className="w-20 text-sm border border-black/15 rounded-md px-2 py-1 focus:outline-none focus:border-black/40"
              />
            </label>
          </div>
        )}
      </div>

      <div className="flex gap-2 justify-end">
        <button
          onClick={onClose}
          className="text-sm px-4 py-2 border border-black/20 rounded-lg text-black/60 hover:border-black/50"
        >
          Cancel
        </button>
        <button
          disabled={!name.trim()}
          onClick={async () => {
            await createVenue({
              name: name.trim(),
              description: description.trim() || undefined,
              contactHandle: contactHandle.trim() || undefined,
              email: email.trim() || undefined,
              phone: phone.trim() || undefined,
              instagram: instagram.trim() || undefined,
              threads: threads.trim() || undefined,
              website: website.trim() || undefined,
              googleMaps: googleMaps.trim() || undefined,
              platform: (platform || undefined) as never,
              eventName: eventName.trim() || undefined,
              wifi: amenities.wifi || undefined,
              plugs: amenities.plugs || undefined,
              projector: amenities.projector || undefined,
              parking: amenities.parking || undefined,
              tables: amenities.tables || undefined,
              maxOccupant: maxOccupant ? Number(maxOccupant) : undefined,
            });
            onClose();
          }}
          className="text-sm px-4 py-2 bg-black text-white rounded-lg disabled:opacity-40"
        >
          Add venue
        </button>
      </div>
    </div>
  );
}

export default function VenuesTab() {
  const [showHidden, setShowHidden] = useState(false);
  const [adding, setAdding] = useState(false);
  const [confirmHide, setConfirmHide] = useState<string | null>(null);

  const venues = useQuery(api.outreach.listVenues, { showHidden });
  const update = useMutation(api.outreach.updateVenue);
  const setHidden = useMutation(api.outreach.setVenueHidden);
  const { toggle, isOpen } = useExpand();

  if (!venues) return <TableSkeleton rows={6} />;

  const csvRows = venues.map((venue) => ({
    venue: venue.name,
    description: venue.description ?? "",
    contact: venue.contactHandle ?? "",
    email: venue.email ?? "",
    phone: venue.phone ?? "",
    platform: venue.platform ?? "",
    event: venue.eventName ?? "",
    amenities: amenitySummary(venue),
    maxOccupant: venue.maxOccupant ?? "",
    status: venue.status,
    assignedTo: venue.assignedTo ?? "",
    added: fmt(venue._creationTime),
  }));

  const toHide = venues.find((v) => v._id === confirmHide);

  return (
    <div className="space-y-4">
      <ConfirmModal
        open={!!confirmHide}
        title={toHide?.hidden ? `Restore ${toHide?.name}?` : `Hide ${toHide?.name}?`}
        description={
          toHide?.hidden
            ? "This venue will reappear in the default list."
            : "Hides it from the default view. Toggle 'Show hidden' to see it again."
        }
        confirmLabel={toHide?.hidden ? "Restore" : "Hide"}
        onConfirm={() => {
          if (confirmHide)
            setHidden({ id: confirmHide as Id<"venueOutreach">, hidden: !toHide?.hidden });
          setConfirmHide(null);
        }}
        onCancel={() => setConfirmHide(null)}
      />

      <SectionHeader title="Venues" count={venues.length}>
        <CollaboratorsBar />
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
        <ExportCsvButton rows={csvRows} filename="venues.csv" />
        <button
          onClick={() => setAdding((v) => !v)}
          className="text-xs px-3 py-1.5 bg-black text-white rounded-lg font-medium"
        >
          + Add venue
        </button>
      </SectionHeader>

      {adding && <AddVenueForm onClose={() => setAdding(false)} />}

      {venues.length === 0 ? (
        <EmptyState message="No venues yet. Add one to start tracking outreach." />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Venue</Th>
              <Th>Platform</Th>
              <Th>For event</Th>
              <Th>Assigned to</Th>
              <Th>Status</Th>
              <Th>Set status</Th>
            </tr>
          </thead>
          <tbody>
            {venues.map((venue) => (
              <>
                <Tr key={venue._id} onClick={() => toggle(venue._id)} active={isOpen(venue._id)}>
                  <Td>
                    <div className={venue.hidden ? "opacity-40" : ""}>
                      <p className="font-medium text-black">{venue.name}</p>
                      {venue.contactHandle && (
                        <p className="text-xs text-black/40">{venue.contactHandle}</p>
                      )}
                      {venue.description && (
                        <p className="text-xs text-black/50 mt-0.5 line-clamp-2 max-w-md">
                          {venue.description}
                        </p>
                      )}
                      <SocialLinks
                        links={{
                          instagram: venue.instagram,
                          threads: venue.threads,
                          maps: venue.googleMaps,
                          website: venue.website,
                        }}
                      />
                      {amenitySummary(venue) && (
                        <p className="text-[11px] text-black/40 mt-0.5">
                          {amenitySummary(venue)}
                        </p>
                      )}
                    </div>
                  </Td>
                  <Td>
                    {venue.platform ? (
                      <Tag label={venue.platform} />
                    ) : (
                      <span className="text-black/25 text-xs">—</span>
                    )}
                  </Td>
                  <Td>
                    {venue.eventName ? (
                      <span className="text-black/60 text-sm">{venue.eventName}</span>
                    ) : (
                      <span className="text-black/25 text-xs">—</span>
                    )}
                  </Td>
                  <Td>
                    <AssignedToSelect
                      value={venue.assignedTo}
                      onChange={(assignedTo) =>
                        update({ id: venue._id as Id<"venueOutreach">, assignedTo: assignedTo ?? "" })
                      }
                    />
                  </Td>
                  <Td>
                    <StatusBadge status={venue.status} />
                    {venue.hidden && <span className="ml-1.5 text-xs text-black/30">(hidden)</span>}
                  </Td>
                  <Td>
                    <StatusSelect
                      value={venue.status}
                      options={STATUSES}
                      onChange={(s) =>
                        update({ id: venue._id as Id<"venueOutreach">, status: s as never })
                      }
                    />
                  </Td>
                </Tr>
                <ExpandPanel key={`${venue._id}-panel`} open={isOpen(venue._id)}>
                  <DetailRow label="Description" value={venue.description} />
                  <DetailRow label="Contact" value={venue.contactHandle} />
                  <FieldInput
                    label="Email"
                    value={venue.email}
                    placeholder="venue@example.com"
                    copyable
                    onSave={(email) =>
                      update({ id: venue._id as Id<"venueOutreach">, email }).then(() => {})
                    }
                  />
                  <FieldInput
                    label="Phone"
                    value={venue.phone}
                    placeholder="+60…"
                    copyable
                    onSave={(phone) =>
                      update({ id: venue._id as Id<"venueOutreach">, phone }).then(() => {})
                    }
                  />
                  <FieldInput
                    label="Instagram"
                    value={venue.instagram}
                    placeholder="@handle or full URL"
                    onSave={(instagram) =>
                      update({ id: venue._id as Id<"venueOutreach">, instagram }).then(() => {})
                    }
                  />
                  <FieldInput
                    label="Threads"
                    value={venue.threads}
                    placeholder="@handle or full URL"
                    onSave={(threads) =>
                      update({ id: venue._id as Id<"venueOutreach">, threads }).then(() => {})
                    }
                  />
                  <FieldInput
                    label="Google Maps"
                    value={venue.googleMaps}
                    placeholder="Maps link or place name"
                    onSave={(googleMaps) =>
                      update({ id: venue._id as Id<"venueOutreach">, googleMaps }).then(() => {})
                    }
                  />
                  <FieldInput
                    label="Website"
                    value={venue.website}
                    placeholder="https://…"
                    onSave={(website) =>
                      update({ id: venue._id as Id<"venueOutreach">, website }).then(() => {})
                    }
                  />
                  <div className="flex gap-3 text-sm items-start">
                    <span className="w-36 shrink-0 text-black/40 font-medium pt-0.5">Amenities</span>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                      {AMENITIES.map((a) => (
                        <label
                          key={a.key}
                          className="flex items-center gap-1.5 text-black/70 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={!!venue[a.key]}
                            onChange={(e) =>
                              update({
                                id: venue._id as Id<"venueOutreach">,
                                [a.key]: e.target.checked,
                              } as never)
                            }
                          />
                          {a.label}
                        </label>
                      ))}
                      <label className="flex items-center gap-1.5 text-black/70">
                        Max occupancy
                        <input
                          type="number"
                          min="0"
                          defaultValue={venue.maxOccupant ?? ""}
                          onBlur={(e) =>
                            update({
                              id: venue._id as Id<"venueOutreach">,
                              maxOccupant: e.target.value
                                ? Number(e.target.value)
                                : undefined,
                            })
                          }
                          className="w-20 text-sm border border-black/15 rounded-md px-2 py-1 focus:outline-none focus:border-black/40"
                        />
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-3 text-sm items-center">
                    <span className="w-36 shrink-0 text-black/40 font-medium">Platform</span>
                    <StatusSelect
                      value={venue.platform ?? ""}
                      options={["", ...PLATFORMS]}
                      onChange={(p) =>
                        update({ id: venue._id as Id<"venueOutreach">, platform: (p || undefined) as never })
                      }
                    />
                  </div>

                  <MessageEditor
                    initialValue={venue.message}
                    recipient={venue.name}
                    templates={VENUE_TEMPLATES}
                    onSave={(message) =>
                      update({ id: venue._id as Id<"venueOutreach">, message }).then(() => {})
                    }
                  />

                  <NotesEditor
                    initialValue={venue.notes}
                    onSave={(notes) =>
                      update({ id: venue._id as Id<"venueOutreach">, notes }).then(() => {})
                    }
                  />

                  <div className="flex gap-3 text-sm pt-1">
                    <span className="w-36 shrink-0" />
                    <DeleteButton
                      label={venue.hidden ? "Restore" : "Hide venue"}
                      onClick={() => setConfirmHide(venue._id)}
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
