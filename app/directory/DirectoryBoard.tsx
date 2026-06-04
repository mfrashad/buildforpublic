"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import OpportunityCard, { type OpportunityCardProps } from "./OpportunityCard";

type KindFilter = "all" | "ngo_request" | "project_idea" | "oss_project" | "community_project";


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

export default function DirectoryBoard() {
  const [activeTab, setActiveTab] = useState<KindFilter>("all");

  // useQuery returns undefined while loading AND when no Convex provider is mounted
  const items = useQuery(
    api.opportunities.listPublished,
    activeTab === "all" ? {} : { kind: activeTab },
  );

  const isLoading = items === undefined;
  const isEmpty = !isLoading && items.length === 0;

  // Sort featured to top
  const sorted = isLoading
    ? []
    : [...items].sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
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
        {isLoading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {isEmpty && <EmptyState kind={activeTab} />}

        {!isLoading &&
          sorted.map((item) => (
            <OpportunityCard key={item._id} {...(item as OpportunityCardProps)} />
          ))}
      </div>

    </div>
  );
}
