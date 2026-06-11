"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import RecruitmentTab from "./tabs/RecruitmentTab";
import ProjectRequestsTab from "./tabs/ProjectRequestsTab";
import OpportunitiesTab from "./tabs/OpportunitiesTab";
import EventsTab from "./tabs/EventsTab";
import MembersTab from "./tabs/MembersTab";

type Tab = "overview" | "volunteers" | "project-requests" | "opportunities" | "events" | "members";

const NAV: { id: Tab; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "◈" },
  { id: "volunteers", label: "Recruitment", icon: "✦" },
  { id: "project-requests", label: "Project Requests", icon: "⊞" },
  { id: "opportunities", label: "Opportunities", icon: "◎" },
  { id: "events", label: "Event RSVPs", icon: "⊛" },
  { id: "members", label: "Members", icon: "⊙" },
];

// ── Overview ──────────────────────────────────────────────────────────────────

function Stat({ label, value, sub, accent }: { label: string; value: number; sub?: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${accent ? "border-black bg-black text-white" : "border-black/10 bg-white"}`}>
      <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${accent ? "text-white/50" : "text-black/40"}`}>{label}</p>
      <p className={`text-3xl font-bold leading-none ${accent ? "text-white" : "text-black"}`} style={{ fontFamily: "var(--font-display)" }}>
        {value}
      </p>
      {sub && <p className={`text-xs mt-1.5 ${accent ? "text-white/50" : "text-black/40"}`}>{sub}</p>}
    </div>
  );
}

function OverviewTab() {
  const stats = useQuery(api.admin.getStats);

  if (!stats) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 animate-pulse">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="h-24 bg-black/5 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold text-black/30 uppercase tracking-widest mb-3">Needs review</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Stat accent label="New volunteers" value={stats.volunteers.new} />
          <Stat accent label="New project requests" value={stats.projectRequests.new} />
          <Stat accent label="Draft opportunities" value={stats.opportunities.draft} sub="awaiting publish" />
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-black/30 uppercase tracking-widest mb-3">People</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Stat label="Total members" value={stats.members.total} sub={`${stats.members.public} public · ${stats.members.countries} countries`} />
          <Stat label="Total volunteers" value={stats.volunteers.total} sub={`${stats.volunteers.accepted} accepted · ${stats.volunteers.hidden} hidden`} />
          <Stat label="Event RSVPs" value={stats.events.totalRsvps} sub={`across ${stats.events.uniqueEvents} event${stats.events.uniqueEvents !== 1 ? "s" : ""}`} />
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-black/30 uppercase tracking-widest mb-3">Volunteer pipeline</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat label="New" value={stats.volunteers.new} />
          <Stat label="Contacted" value={stats.volunteers.contacted} />
          <Stat label="Accepted" value={stats.volunteers.accepted} />
          <Stat label="Declined" value={stats.volunteers.declined} />
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-black/30 uppercase tracking-widest mb-3">Opportunities</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Stat label="Published" value={stats.opportunities.published} />
          <Stat label="Draft" value={stats.opportunities.draft} />
          <Stat label="Archived" value={stats.opportunities.archived} />
        </div>
      </div>
    </div>
  );
}

// ── Main layout ───────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-black/30 text-sm animate-pulse">Loading…</p>
      </div>
    );
  }

  // Client-side gate (UX only — real security is in Convex requireAdmin)
  const isAdmin = user?.publicMetadata?.role === "admin";

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="border border-black rounded-2xl p-10 text-center max-w-sm shadow-[4px_4px_0_#000]">
          <p className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
            Access denied
          </p>
          <p className="text-sm text-black/50 mb-6">
            {user ? "Your account doesn't have admin access." : "Sign in to continue."}
          </p>
          <a href="/" className="btn-pill btn-pill-filled text-sm px-6 py-2">
            Go home
          </a>
        </div>
      </div>
    );
  }

  const activeNav = NAV.find((n) => n.id === activeTab)!;

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Mobile top bar ── */}
      <header className="lg:hidden flex items-center justify-between border-b border-black px-4 py-3 bg-white sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm">BFP Admin</span>
          <span className="text-black/30">/</span>
          <span className="text-sm text-black/60">{activeNav.label}</span>
        </div>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="text-sm px-3 py-1.5 border border-black/20 rounded-lg"
        >
          {mobileOpen ? "✕" : "☰ Menu"}
        </button>
      </header>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-white pt-14">
          <nav className="p-4 space-y-1">
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setMobileOpen(false); }}
                className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? "bg-black text-white"
                    : "text-black/60 hover:bg-black/5 hover:text-black"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}

      <div className="flex flex-1">
        {/* ── Sidebar ── */}
        <aside className="hidden lg:flex flex-col w-52 shrink-0 border-r border-black/10 bg-white sticky top-0 h-screen overflow-y-auto">
          {/* Logo / brand */}
          <div className="px-5 py-5 border-b border-black/10">
            <a href="/" className="font-bold text-sm text-black tracking-tight">BFP</a>
            <span className="ml-2 text-xs font-medium text-black/30 uppercase tracking-wider">Admin</span>
          </div>

          {/* Nav items */}
          <nav className="flex-1 p-3 space-y-0.5">
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? "bg-black text-white"
                    : "text-black/50 hover:bg-black/5 hover:text-black"
                }`}
              >
                <span className="text-base leading-none">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          {/* User footer */}
          <div className="px-4 py-4 border-t border-black/10">
            <p className="text-xs text-black/40 truncate">{user.primaryEmailAddress?.emailAddress}</p>
          </div>
        </aside>

        {/* ── Content ── */}
        <main className="flex-1 min-w-0 p-6 lg:p-8">
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "volunteers" && <RecruitmentTab />}
          {activeTab === "project-requests" && <ProjectRequestsTab />}
          {activeTab === "opportunities" && <OpportunitiesTab />}
          {activeTab === "events" && <EventsTab />}
          {activeTab === "members" && <MembersTab />}
        </main>
      </div>
    </div>
  );
}
