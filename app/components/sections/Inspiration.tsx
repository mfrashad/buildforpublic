"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import imageManifest from "@/lib/resource-images.json";

type ManifestEntry = { og?: string; favicon?: string };
const manifest = imageManifest as Record<string, ManifestEntry>;

type Project = {
  name: string;
  tagline: string;
  url: string;
  imageKey?: string;
  localImage?: string;
  accentBg?: string;
};

const MALAYSIA: Project[] = [
  {
    name: "OpenNGO",
    tagline: "A directory of Malaysia's NGOs, with an open API.",
    url: "https://open-ngo.vercel.app",
    localImage: "/og/openngo.png",
    accentBg: "#6ff5b6",
  },
  {
    name: "Bookshelf",
    tagline: "Turn your reading library into a shareable poster.",
    url: "https://bookshelf.buildforpublic.com",
    localImage: "/projects/bookshelf.png",
    accentBg: "#fff200",
  },
  {
    name: "MyMP",
    tagline: "Track Malaysian Members of Parliament.",
    url: "https://mymp.org.my",
    imageKey: "mymp",
    accentBg: "#e8f5ff",
  },
  {
    name: "Sedekah.je",
    tagline: "Open-source donation directory for Malaysian causes.",
    url: "https://sedekah.je",
    imageKey: "sedekah",
    accentBg: "#f5f5f5",
  },
];

const GLOBAL: Project[] = [
  {
    name: "Signal",
    tagline: "Private, encrypted messaging — built by a nonprofit.",
    url: "https://signal.org",
    imageKey: "signal",
    accentBg: "#e8f5ff",
  },
  {
    name: "Wikipedia",
    tagline: "Free knowledge for every human on the planet.",
    url: "https://wikipedia.org",
    imageKey: "wikipedia",
    accentBg: "#f5f5f5",
  },
  {
    name: "OpenStreetMap",
    tagline: "A free, editable map of the world — built by volunteers.",
    url: "https://www.openstreetmap.org",
    imageKey: "openstreetmap",
    accentBg: "#e8f5e9",
  },
  {
    name: "Khan Academy",
    tagline: "World-class education, free, for anyone.",
    url: "https://khanacademy.org",
    imageKey: "khanacademy",
    accentBg: "#fff8e1",
  },
];

const TABS = [
  { id: "malaysia", label: "🇲🇾 Malaysia", projects: MALAYSIA },
  { id: "global",   label: "🌍 Global",    projects: GLOBAL },
] as const;

type TabId = (typeof TABS)[number]["id"];
const INTERVAL_MS = 5000;

function ProjectCard({ name, tagline, url, imageKey, localImage, accentBg }: Project) {
  const ogImage = localImage ?? (imageKey ? manifest[imageKey]?.og : undefined);
  const favicon = imageKey ? manifest[imageKey]?.favicon : undefined;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="card flex flex-col overflow-hidden group hover:shadow-lg transition-shadow"
    >
      <div
        className="relative aspect-[16/9] overflow-hidden border-b-2 border-black"
        style={{ background: accentBg ?? "#f5f5f5" }}
      >
        {ogImage && (
          <Image
            src={ogImage}
            alt={`${name} preview`}
            fill
            className="object-cover object-top"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        )}
      </div>
      <div className="p-4 flex items-center gap-3 bg-white">
        {favicon && (
          <div className="w-6 h-6 flex-shrink-0 overflow-hidden flex items-center justify-center">
            <Image src={favicon} alt="" width={24} height={24} className="object-contain" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-semibold text-black leading-snug group-hover:underline underline-offset-2 truncate"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {name}
          </p>
          <p
            className="text-xs text-black/50 leading-snug mt-0.5 truncate"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {tagline}
          </p>
        </div>
        <span className="text-black/30 group-hover:text-black transition-colors flex-shrink-0 text-sm">↗</span>
      </div>
    </a>
  );
}

export default function Inspiration() {
  const [activeTab, setActiveTab] = useState<TabId>("malaysia");
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function switchTab() {
    setActiveTab((t) => (t === "malaysia" ? "global" : "malaysia"));
    setProgress(0);
  }

  useEffect(() => {
    if (paused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
      return;
    }

    setProgress(0);
    intervalRef.current = setInterval(switchTab, INTERVAL_MS);
    progressRef.current = setInterval(() => {
      setProgress((p) => Math.min(p + (100 / (INTERVAL_MS / 50)), 100));
    }, 50);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [paused, activeTab]);

  const currentProjects = TABS.find((t) => t.id === activeTab)!.projects;

  return (
    <section className="section-padding px-6" aria-labelledby="inspiration-heading">
      <div className="max-w-5xl mx-auto">
        <h2 id="inspiration-heading" className="heading-section mb-4">
          Examples of projects we want to multiply.
        </h2>

        {/* Tabs */}
        <div
          className="flex gap-2 mb-8"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setProgress(0); }}
                className={`relative btn-pill text-sm py-2 px-5 transition-all overflow-hidden ${
                  isActive ? "btn-pill-filled" : "btn-pill-outline"
                }`}
              >
                {isActive && !paused && (
                  <span
                    className="absolute bottom-0 left-0 h-0.5 bg-white/40 transition-none"
                    style={{ width: `${progress}%` }}
                  />
                )}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Cards */}
        <div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
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
