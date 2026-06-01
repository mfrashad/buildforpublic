"use client";

import { useState } from "react";
import Image from "next/image";

type Project = {
  name: string;
  tagline: string;
  description: string;
  href: string;
  image: string | null;
  accentBg: string;
};

const MALAYSIA: Project[] = [
  {
    name: "data.gov.my",
    tagline: "Malaysia's open data, one front door.",
    description:
      "The country's public data platform. Dashboards, downloadable datasets, public APIs. No key required.",
    href: "https://data.gov.my",
    image: "/resource-images/og/datagov.png",
    accentBg: "#fff200",
  },
  {
    name: "MyMP",
    tagline: "Tracking all 222 Members of Parliament.",
    description:
      "A volunteer-built site that tracks Malaysia's MPs across attendance, motions, and service centres. Parliamentary data, made legible.",
    href: "https://mymp.org.my",
    image: "/resource-images/og/mymp.png",
    accentBg: "#94e8ff",
  },
  {
    name: "sedekah.je",
    tagline: "A QR directory for donating to mosques and suraus.",
    description:
      "Crowdsourced and open-source. One developer saw the friction in giving to local institutions and shipped the directory the community needed.",
    href: "https://sedekah.je",
    image: "/resource-images/og/sedekah.png",
    accentBg: "#ffc0a1",
  },
  {
    name: "pasarmalam.app",
    tagline: "Find a pasar malam, any night.",
    description:
      "A directory of night markets across Malaysia. Days, hours, locations, directions. The kind of small civic tool the market won't build but a community will.",
    href: "https://pasarmalam.app",
    image: "/resource-images/og/pasarmalam.png",
    accentBg: "#6ff5b6",
  },
];

const GLOBAL: Project[] = [
  {
    name: "Signal",
    tagline: "Private, encrypted messaging — built by a nonprofit.",
    description:
      "End-to-end encrypted calls and messages, no ads, no data harvesting. Signal Foundation is proof that private communication can be a public good.",
    href: "https://signal.org",
    image: "/resource-images/og/signal.png",
    accentBg: "#2090EA",
  },
  {
    name: "OpenStreetMap",
    tagline: "A free, editable map of the world — built by volunteers.",
    description:
      "More than two million contributors mapping the planet, block by block. The map that powers everything from humanitarian relief to public transit apps.",
    href: "https://www.openstreetmap.org",
    image: "/resource-images/og/openstreetmap.png",
    accentBg: "#8FD4A8",
  },
  {
    name: "Wikipedia",
    tagline: "Free knowledge for every human on the planet.",
    description:
      "The largest encyclopedia ever written, in 300+ languages, maintained entirely by volunteers. It works because people believe knowledge should be free.",
    href: "https://wikipedia.org",
    image: "/resource-images/og/wikipedia.png",
    accentBg: "#f5f5f5",
  },
  {
    name: "Khan Academy",
    tagline: "World-class education, free, for anyone.",
    description:
      "A nonprofit that set out to give every student access to the same quality of education. Used by 150 million learners in 190 countries.",
    href: "https://khanacademy.org",
    image: "/resource-images/og/khanacademy.png",
    accentBg: "#14BF96",
  },
];

const TABS = [
  { id: "malaysia", label: "🇲🇾 Malaysia", projects: MALAYSIA },
  { id: "global",   label: "🌍 Global",    projects: GLOBAL },
] as const;

type TabId = (typeof TABS)[number]["id"];

function ProjectCard({ name, tagline, description, href, image, accentBg }: Project) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="card overflow-hidden group flex flex-col"
      aria-label={`${name} — ${tagline} (opens in new tab)`}
    >
      <div
        className="relative aspect-video border-b-2 border-black overflow-hidden flex items-center justify-center"
        style={{ background: accentBg }}
      >
        {image ? (
          <Image
            src={image}
            alt={`${name} preview`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <span
            className="text-2xl font-bold text-black/40 select-none"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {name}
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1 bg-white">
        <div className="flex items-center gap-2 mb-1">
          <span className="heading-display text-base">{name}</span>
          <svg
            className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>
        <p className="text-sm font-semibold mb-1.5" style={{ fontFamily: "var(--font-sans)" }}>{tagline}</p>
        <p className="text-sm leading-relaxed text-gray-600" style={{ fontFamily: "var(--font-sans)" }}>{description}</p>
      </div>
    </a>
  );
}

export default function WeLove() {
  const [activeTab, setActiveTab] = useState<TabId>("malaysia");
  const currentProjects = TABS.find((t) => t.id === activeTab)!.projects;

  return (
    <section className="band band-white grid-bg section-padding px-6" aria-labelledby="welove-heading">
      <div className="max-w-5xl mx-auto">
        <h2 id="welove-heading" className="heading-section mb-4">
          Examples of projects we want to multiply.
        </h2>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
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

        <div className="grid sm:grid-cols-2 gap-5">
          {currentProjects.map((p) => (
            <ProjectCard key={p.name} {...p} />
          ))}
        </div>

        <p className="mt-6 text-sm text-black/50" style={{ fontFamily: "var(--font-sans)" }}>
          <a href="/resources" className="underline hover:text-black transition-colors">
            See more →
          </a>
        </p>
      </div>
    </section>
  );
}
