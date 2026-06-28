"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import OpportunityCard, { type OpportunityCardProps } from "./OpportunityCard";
import NGOCard from "@/app/components/ui/NGOCard";

type KindFilter = "all" | "ngo_request" | "project_idea" | "oss_project" | "community_project" | "ngo_helped";

// NGO requests are collected privately for now and only revealed to people who
// show up to the meetup. A couple of NGOs are named as a teaser; the rest stay
// locked. Bump the count + names as more come in.
const HIDDEN_NGO_REQUESTS = 5;
const NAMED_NGO_REQUESTS = ["HumAIne", "100 Women Who Care"];
const LUMA_CALENDAR_URL = "https://luma.com/buildforpublic";

const TABS: { id: KindFilter; label: string; description: string }[] = [
  {
    id: "all",
    label: "All",
    description: "Everything open right now",
  },
  {
    id: "ngo_request",
    label: "NGO Requests",
    description: "Problems NGOs need builders to solve",
  },
  {
    id: "ngo_helped",
    label: "NGOs Helped",
    description: "NGOs we've built with — showcasing our international impact",
  },
  {
    id: "project_idea",
    label: "Project Ideas",
    description: "Open problems you can pick up and build",
  },
  {
    id: "oss_project",
    label: "Open Source",
    description: "Existing projects you can contribute to",
  },
  {
    id: "community_project",
    label: "Community Builds",
    description: "Projects built and shared by community members",
  },
];

function SkeletonCard() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="h-2 bg-black/10" />
      <div className="p-6 space-y-3">
        <div className="h-4 bg-black/10 rounded w-24" />
        <div className="h-5 bg-black/10 rounded w-3/4" />
        <div className="h-4 bg-black/10 rounded w-1/2" />
        <div className="space-y-2 pt-2">
          <div className="h-3 bg-black/10 rounded" />
          <div className="h-3 bg-black/10 rounded w-5/6" />
          <div className="h-3 bg-black/10 rounded w-4/6" />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ kind }: { kind: KindFilter }) {
  const messages: Record<KindFilter, { heading: string; body: string; cta: string; href: string }> = {
    all: {
      heading: "No open opportunities right now",
      body: "Check back soon — new NGO requests and project ideas are added regularly.",
      cta: "Submit an NGO request →",
      href: "/request",
    },
    ngo_request: {
      heading: "No NGO requests open right now",
      body: "Are you an NGO with a problem to solve? Submit a request and we'll find the right builders for you.",
      cta: "Submit an NGO request →",
      href: "/request",
    },
    project_idea: {
      heading: "No project ideas open right now",
      body: "Have an idea for a public-interest tool? Propose it and a builder will pick it up.",
      cta: "Propose a project idea →",
      href: "/submit",
    },
    oss_project: {
      heading: "No open-source projects listed yet",
      body: "Have an open-source project? List it here so the community can discover it and contribute.",
      cta: "List your open source project →",
      href: "/submit",
    },
    community_project: {
      heading: "No community builds posted yet",
      body: "Built something? Post your project here and share it with the community.",
      cta: "Post your project →",
      href: "/submit",
    },
    ngo_helped: {
      heading: "No NGOs helped yet",
      body: "When Build for Public ships something with an NGO, it'll show up here.",
      cta: "Submit an NGO request →",
      href: "/request",
    },
  };

  const { heading, body, cta, href } = messages[kind];

  return (
    <div className="col-span-full text-center py-16 px-6">
      <p
        className="text-xl text-black mb-3"
        style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
      >
        {heading}
      </p>
      <p className="text-black/60 text-sm mb-6 max-w-md mx-auto leading-relaxed">
        {body}
      </p>
      <a href={href} className="btn-pill btn-pill-outline">
        {cta}
      </a>
    </div>
  );
}

// A single blurred, redacted teaser card. Looks like a real request sits
// behind the frosted glass — but nothing legible leaks through.
function MysteryCard() {
  return (
    <div className="card overflow-hidden select-none" aria-hidden="true">
      <div className="h-2" style={{ background: "#fff200" }} />
      <div className="p-6 space-y-3" style={{ filter: "blur(6px)", opacity: 0.55 }}>
        <div className="h-4 bg-black/20 rounded w-28" />
        <div className="h-5 bg-black/25 rounded w-3/4" />
        <div className="h-4 bg-black/15 rounded w-1/2" />
        <div className="space-y-2 pt-2">
          <div className="h-3 bg-black/15 rounded" />
          <div className="h-3 bg-black/15 rounded w-5/6" />
          <div className="h-3 bg-black/15 rounded w-2/3" />
        </div>
        <div className="flex gap-2 pt-2">
          <div className="h-6 bg-black/10 rounded-full w-16" />
          <div className="h-6 bg-black/10 rounded-full w-20" />
        </div>
      </div>
    </div>
  );
}

// Locked view for the NGO Requests tab: we *have* collected requests, but they
// stay a mystery until you show up to the meetup.
function LockedNGORequests() {
  return (
    <div className="col-span-full">
      <div className="relative">
        {/* Blurred teaser cards sitting behind the lock panel */}
        <div className="grid sm:grid-cols-2 gap-8 pointer-events-none" aria-hidden="true">
          <MysteryCard />
          <MysteryCard />
          <MysteryCard />
          <MysteryCard />
        </div>

        {/* Lock overlay */}
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div
            className="card max-w-lg w-full text-center px-8 py-10"
            style={{ background: "#fff" }}
          >
            <div
              className="mx-auto mb-5 flex items-center justify-center"
              style={{
                width: 56,
                height: 56,
                borderRadius: 9999,
                background: "#fff200",
                border: "2px solid #000",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50 mb-3">
              {HIDDEN_NGO_REQUESTS} requests collected
            </p>
            <p
              className="text-2xl text-black mb-3"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
            >
              Hidden until the next meetup
            </p>
            <p className="text-black/60 text-sm mb-5 max-w-sm mx-auto leading-relaxed">
              NGOs have already sent in real problems to solve — including{" "}
              <span className="text-black font-semibold">HumAIne</span> and{" "}
              <span className="text-black font-semibold">100 Women Who Care</span>.
              The rest stay under wraps until the next Build for Public meetup,
              where we&apos;ll reveal the full board so you can pick one up in the
              room.
            </p>

            {/* Teaser chips: two named, the rest locked */}
            <div className="flex flex-wrap gap-2 justify-center mb-7">
              {NAMED_NGO_REQUESTS.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-full px-3 py-1.5"
                  style={{ background: "#fff200", border: "2px solid #000" }}
                >
                  {name}
                </span>
              ))}
              {HIDDEN_NGO_REQUESTS - NAMED_NGO_REQUESTS.length > 0 && (
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-full px-3 py-1.5 text-black/50"
                  style={{ border: "2px solid rgba(0,0,0,0.2)" }}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  +{HIDDEN_NGO_REQUESTS - NAMED_NGO_REQUESTS.length} locked
                </span>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={LUMA_CALENDAR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill btn-pill-filled"
              >
                Join the meetup to unlock →
              </a>
              <a href="/request" className="btn-pill btn-pill-outline">
                Submit an NGO request
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DirectoryBoard() {
  const [activeTab, setActiveTab] = useState<KindFilter>("all");

  const isNgoHelpedTab = activeTab === "ngo_helped";
  const isNgoRequestTab = activeTab === "ngo_request";

  const items = useQuery(
    api.opportunities.listPublished,
    isNgoHelpedTab ? "skip" : activeTab === "all" ? {} : { kind: activeTab },
  );

  const ngoHelped = useQuery(
    api.ngoHelped.list,
    isNgoHelpedTab ? {} : "skip",
  );

  const isLoading = isNgoHelpedTab ? ngoHelped === undefined : items === undefined;
  const isEmpty = !isLoading && (isNgoHelpedTab ? ngoHelped!.length === 0 : items!.length === 0);

  const sorted = isLoading || isNgoHelpedTab
    ? []
    : [...items!].sort((a, b) => {
        const aStars = (a as any).stars ?? 0;
        const bStars = (b as any).stars ?? 0;
        const aCommunity = a.kind === "community_project";
        const bCommunity = b.kind === "community_project";
        // Both community: sort by stars
        if (aCommunity && bCommunity) return bStars - aStars;
        // Mixed: featured non-community items first, then community by stars
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        // Both community or both non-community with same featured: stars desc
        return bStars - aStars;
      });

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-10">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`btn-pill text-sm py-2 px-5 transition-all ${
              activeTab === tab.id ? "btn-pill-filled" : "btn-pill-outline"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab description */}
      <p className="text-black/60 text-sm mb-8" style={{ fontFamily: "var(--font-sans)" }}>
        {TABS.find((t) => t.id === activeTab)?.description}
      </p>

      {/* Cards grid */}
      <div className="grid sm:grid-cols-2 gap-8">
        {/* Locked teaser only when no NGO requests are published yet */}
        {isNgoRequestTab && isEmpty && <LockedNGORequests />}

        {isLoading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {!isNgoRequestTab && isEmpty && <EmptyState kind={activeTab} />}

        {isNgoHelpedTab && !isLoading &&
          ngoHelped!.map((n) => (
            <NGOCard
              key={n._id}
              name={n.name}
              country={n.country}
              flag={n.flag}
              cause={n.cause}
              tagline={n.tagline}
              description={n.description}
              helpedWith={n.helpedWith}
              whoFor={n.whoFor}
              primaryLink={{ label: "Visit", href: n.website }}
              codeLink={n.codeLink ? { label: "Code", href: n.codeLink } : null}
              accentBg={n.accentBg}
              image={n.image}
            />
          ))}

        {!isNgoHelpedTab && !isLoading &&
          sorted.map((item) => (
            <OpportunityCard key={item._id} {...(item as OpportunityCardProps)} />
          ))}
      </div>
    </div>
  );
}
