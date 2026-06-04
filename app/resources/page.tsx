"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import imageManifest from "@/lib/resource-images.json";

type Origin = "all" | "malaysia" | "global";
type ManifestEntry = { og?: string; favicon?: string };
const manifest = imageManifest as Record<string, ManifestEntry>;

const RESOURCES = [
  // ── Global ──
  {
    imageKey: "openstreetmap",
    name: "OpenStreetMap",
    description:
      "A free, editable map of the world built by volunteers. The gold standard for community-owned infrastructure — open data, forever.",
    tags: ["Open Data", "Infrastructure", "Community"],
    origin: "global" as const,
    url: "https://www.openstreetmap.org",
  },
  {
    imageKey: "signal",
    name: "Signal",
    description:
      "Private messaging built by a nonprofit. Proved that a small team with the right values can out-ship Big Tech on privacy — and forced the industry to follow.",
    tags: ["Privacy", "Nonprofit", "Infrastructure"],
    origin: "global" as const,
    url: "https://signal.org",
  },
  {
    imageKey: "wikipedia",
    name: "Wikipedia",
    description:
      "Free knowledge for every human on the planet. The largest collaborative knowledge project ever built — run by a nonprofit, edited by volunteers.",
    tags: ["Open Knowledge", "Community", "Nonprofit"],
    origin: "global" as const,
    url: "https://wikipedia.org",
  },
  {
    imageKey: "khanacademy",
    name: "Khan Academy",
    description:
      "Free, world-class education for anyone, anywhere. Built as a nonprofit to serve the students that private capital ignores.",
    tags: ["Education", "Nonprofit"],
    origin: "global" as const,
    url: "https://khanacademy.org",
  },
  {
    imageKey: "hotosm",
    name: "Humanitarian OpenStreetMap Team",
    description:
      "Crisis mapping that saves lives. Volunteers map disaster zones in real time so aid workers know where to go.",
    tags: ["Humanitarian", "Open Data"],
    origin: "global" as const,
    url: "https://www.hotosm.org",
  },
  {
    imageKey: "letsencrypt",
    name: "Let's Encrypt",
    description:
      "Free TLS certificates for everyone. Turned HTTPS from a paid luxury into the default for the entire web by removing a structural barrier.",
    tags: ["Infrastructure", "Nonprofit"],
    origin: "global" as const,
    url: "https://letsencrypt.org",
  },
  {
    imageKey: "tor",
    name: "Tor Project",
    description:
      "Anonymous internet access for journalists, activists, and anyone who needs it. Privacy as a public good, not a premium feature.",
    tags: ["Privacy", "Infrastructure", "Nonprofit"],
    origin: "global" as const,
    url: "https://torproject.org",
  },
  {
    imageKey: "publiclab",
    name: "Public Lab",
    description:
      "Community science tools for environmental monitoring. Puts air and water quality research in the hands of residents — not just labs.",
    tags: ["Environment", "Community", "Open Source"],
    origin: "global" as const,
    url: "https://publiclab.org",
  },
  // ── Malaysia ──
  {
    imageKey: "mymp",
    name: "MyMP",
    description:
      "Track Malaysian Members of Parliament — voting records, attendance, and accountability data. Open-source civic transparency.",
    tags: ["Civic Tech", "Open Data"],
    origin: "malaysia" as const,
    url: "https://mymp.org.my",
  },
  {
    imageKey: "sedekah",
    name: "Sedekah.je",
    description:
      "Open-source donation directory connecting donors to verified causes across Malaysia. Community-maintained, no middlemen.",
    tags: ["Community", "Nonprofit"],
    origin: "malaysia" as const,
    url: "https://sedekah.je",
  },
  {
    imageKey: "lepakmasjid",
    name: "Lepak Masjid",
    description:
      "Find mosques, prayer times, and community events near you. Built for Malaysian Muslim communities.",
    tags: ["Community", "Open Source"],
    origin: "malaysia" as const,
    url: "https://lepakmasjid.app",
  },
  {
    imageKey: "pasarmalam",
    name: "Pasar Malam",
    description:
      "Crowdsourced night market directory mapping locations and schedules across Malaysia. Open data, volunteer-maintained.",
    tags: ["Open Data", "Community"],
    origin: "malaysia" as const,
    url: "https://pasarmalam.app",
  },
  {
    imageKey: "mesolitica",
    name: "Mesolitica / malaysia-ai",
    description:
      "Malaysian AI lab building open multimodal models, Bahasa Malaysia LLMs (MaLLaM), and local datasets. Making state-of-the-art AI accessible in Malaysian languages.",
    tags: ["AI", "Open Source", "Bahasa Malaysia"],
    origin: "malaysia" as const,
    url: "https://github.com/malaysia-ai",
  },
  {
    imageKey: "datagov",
    name: "data.gov.my",
    description:
      "Malaysia's official open data portal — government datasets on economy, health, education, demographics, and more. Public data as a public good.",
    tags: ["Open Data", "Government", "Civic Tech"],
    origin: "malaysia" as const,
    url: "https://data.gov.my",
  },
];

const TABS: { id: Origin; label: string }[] = [
  { id: "all", label: "All" },
  { id: "malaysia", label: "From Malaysia" },
  { id: "global", label: "From the world" },
];

function ResourceCard({ name, description, tags, url, origin, imageKey }: (typeof RESOURCES)[number]) {
  const images = manifest[imageKey] ?? {};

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="card flex flex-col overflow-hidden group hover:shadow-lg transition-shadow"
    >
      {/* Screenshot / OG image */}
      <div className="relative aspect-[16/9] overflow-hidden border-b-2 border-black bg-surface">
        {images.og ? (
          <Image
            src={images.og}
            alt={`${name} preview`}
            fill
            className="object-cover object-top"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-surface" />
        )}
        {/* Origin badge */}
        <span
          className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 border border-black/20 rounded-full"
          style={{
            background: origin === "malaysia" ? "#fff200" : "white",
            fontFamily: "var(--font-sans)",
          }}
        >
          {origin === "malaysia" ? "🇲🇾 Malaysia" : "🌍 Global"}
        </span>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col gap-3 flex-1 bg-white">
        <div className="flex items-center gap-3">
          {/* Favicon */}
          {images.favicon && (
            <div className="w-6 h-6 rounded flex-shrink-0 overflow-hidden flex items-center justify-center bg-white">
              <Image
                src={images.favicon}
                alt=""
                width={24}
                height={24}
                className="object-contain"
              />
            </div>
          )}
          <h3
            className="text-base text-black font-semibold group-hover:underline underline-offset-2 leading-snug"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {name}
          </h3>
          <span className="ml-auto text-black/30 group-hover:text-black transition-colors text-base flex-shrink-0">
            ↗
          </span>
        </div>

        <p
          className="text-sm text-black/60 leading-relaxed flex-1"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span
              key={t}
              className="text-xs font-medium px-2.5 py-1 bg-surface border border-black/15 rounded-full"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState<Origin>("all");

  const filtered =
    activeTab === "all" ? RESOURCES : RESOURCES.filter((r) => r.origin === activeTab);

  return (
    <main>
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-40 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-8 text-sm font-medium text-black/60 bg-surface px-5 py-2 rounded-full border border-black">
            RESOURCES
          </div>
          <h1 className="heading-display text-5xl sm:text-6xl text-black mb-6">
            Build for Public in practice.
          </h1>
          <p
            className="text-lg text-black/60 max-w-2xl leading-relaxed mb-4"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Building for the public starts with the many initiatives and
            technologies already out there — built with the same values we share
            here. Technologies, collectives, programmes, and initiatives: working
            on the public interest can take many forms.
          </p>
          <p
            className="text-base text-black/40 max-w-2xl leading-relaxed italic"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            A necessarily short, subjective, and totally incomplete list.
          </p>
        </div>
      </section>

      {/* ── List ── */}
      <section className="section-padding pt-0 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Filter tabs */}
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

          {/* Cards grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((r) => (
              <ResourceCard key={r.name} {...r} />
            ))}
          </div>

          {/* Footer nudge */}
          <p
            className="mt-12 text-sm text-black/40 text-center"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Know a project that belongs here?{" "}
            <a
              href="https://github.com/mfrashad/buildforpublic"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-black transition-colors"
            >
              Open a PR →
            </a>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
