"use client";

import { useCallback, useEffect, useState } from "react";
import { RECRUITMENT_PERMISSION } from "@/lib/constants";
import { ConfirmModal, SectionHeader } from "../ui";

type Admin = {
  id: string;
  email: string | null;
  name: string | null;
  imageUrl: string;
  isOwner: boolean;
  permissions: string[];
};

export default function AdminsTab() {
  const [admins, setAdmins] = useState<Admin[] | null>(null);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingRemove, setPendingRemove] = useState<Admin | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/admins");
    if (!res.ok) {
      setError((await res.json().catch(() => ({})))?.error ?? "Failed to load admins.");
      setAdmins([]);
      return;
    }
    const data = (await res.json()) as { admins: Admin[] };
    setAdmins(data.admins);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function addAdmin(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!value || busy) return;
    setBusy(true);
    setError(null);
    const res = await fetch("/api/admin/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: value }),
    });
    setBusy(false);
    if (!res.ok) {
      setError((await res.json().catch(() => ({})))?.error ?? "Failed to add admin.");
      return;
    }
    setEmail("");
    await load();
  }

  async function removeAdmin(admin: Admin) {
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/admin/admins?id=${encodeURIComponent(admin.id)}`, {
      method: "DELETE",
    });
    setBusy(false);
    if (!res.ok) {
      setError((await res.json().catch(() => ({})))?.error ?? "Failed to remove admin.");
      return;
    }
    await load();
  }

  async function togglePermission(admin: Admin, permission: string, grant: boolean) {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/admin/admins", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: admin.id, permission, grant }),
    });
    setBusy(false);
    if (!res.ok) {
      setError((await res.json().catch(() => ({})))?.error ?? "Failed to update access.");
      return;
    }
    await load();
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <ConfirmModal
        open={!!pendingRemove}
        title="Remove admin?"
        description={`${pendingRemove?.email ?? "This account"} will lose admin access and the admin API. They can be re-added anytime.`}
        confirmLabel="Remove admin"
        danger
        onConfirm={async () => {
          const target = pendingRemove;
          setPendingRemove(null);
          if (target) await removeAdmin(target);
        }}
        onCancel={() => setPendingRemove(null)}
      />

      <div>
        <SectionHeader title="Add an admin" />
        <p className="text-sm text-black/50 mb-4 leading-relaxed">
          Grant admin access by email. The person must have signed in at least once
          first. Admin access takes effect the next time they sign in (or refresh
          their session).
        </p>
        <form onSubmit={addAdmin} className="flex items-center gap-2 flex-wrap">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="flex-1 min-w-[16rem] text-sm px-3 py-2.5 border border-black/15 rounded-lg focus:border-black focus:outline-none"
          />
          <button
            type="submit"
            disabled={busy || !email.trim()}
            className="text-sm px-5 py-2.5 bg-black text-white rounded-lg font-medium disabled:opacity-50"
          >
            {busy ? "Working…" : "Add admin"}
          </button>
        </form>
        {error && (
          <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-3">
            {error}
          </p>
        )}
      </div>

      <div>
        <SectionHeader title="Current admins" />
        <p className="text-sm text-black/50 mb-4 leading-relaxed">
          Toggle <span className="font-medium text-black/70">Recruitment</span> to let an
          admin see and manage the recruitment pipeline (volunteer applicants). The change
          takes effect the next time they refresh their session. Everything else stays
          owner-only.
        </p>
        {admins === null ? (
          <div className="h-16 bg-black/5 rounded-xl animate-pulse" />
        ) : admins.length === 0 ? (
          <p className="text-sm text-black/40">No admins yet.</p>
        ) : (
          <ul className="space-y-2">
            {admins.map((admin) => (
              <li
                key={admin.id}
                className="flex items-center gap-3 border border-black/10 rounded-xl px-4 py-3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={admin.imageUrl}
                  alt=""
                  className="w-8 h-8 rounded-full bg-black/5 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-black truncate">
                    {admin.email ?? admin.id}
                  </p>
                  {admin.name && (
                    <p className="text-xs text-black/40 truncate">{admin.name}</p>
                  )}
                </div>
                {admin.isOwner ? (
                  <span className="text-xs font-medium text-black/40 uppercase tracking-wider px-2.5 py-1 bg-black/5 rounded-md shrink-0">
                    Owner
                  </span>
                ) : (
                  <div className="flex items-center gap-3 shrink-0">
                    <label className="flex items-center gap-1.5 text-xs text-black/60 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={admin.permissions.includes(RECRUITMENT_PERMISSION)}
                        disabled={busy}
                        onChange={(e) =>
                          togglePermission(admin, RECRUITMENT_PERMISSION, e.target.checked)
                        }
                        className="accent-black w-3.5 h-3.5 disabled:opacity-50"
                      />
                      Recruitment
                    </label>
                    <button
                      onClick={() => setPendingRemove(admin)}
                      disabled={busy}
                      className="text-xs text-red-500/70 hover:text-red-600 underline underline-offset-2 disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
