"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type AccentColor = "yellow" | "blue" | "mint" | "peach" | "purple" | "orange";

const ACCENT_BG: Record<AccentColor, string> = {
  yellow: "#fff200",
  blue:   "#94e8ff",
  mint:   "#6ff5b6",
  peach:  "#ffc0a1",
  purple: "#e8d5ff",
  orange: "#ffd9a0",
};

const KIND_LABEL: Record<string, string> = {
  ngo_request:       "NGO Request",
  project_idea:      "Project Idea",
  oss_project:       "Open Source",
  community_project: "Community Build",
};

const DIFFICULTY_LABEL: Record<string, string> = {
  beginner:     "Beginner-friendly",
  intermediate: "Intermediate",
  advanced:     "Advanced",
};

export interface OpportunityCardProps {
  _id: string;
  kind: "ngo_request" | "project_idea" | "oss_project" | "community_project";
  title: string;
  summary: string;
  description: string;
  tags?: string[];
  link?: string;
  repoLink?: string;
  accent?: AccentColor;
  orgName?: string;
  skillsNeeded?: string[];
  difficulty?: "beginner" | "intermediate" | "advanced";
  featured?: boolean;
  image?: string;
  creator?: string;
  stars?: number;
}

// ── Rich text: turn URLs into links, keep paragraph breaks, bold "Label:" leads ──

const stop = (e: React.MouseEvent) => e.stopPropagation();

function linkify(text: string, keyBase: string): React.ReactNode[] {
  const re = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    let url = m[0];
    let tail = "";
    const trail = url.match(/[.,;:)\]]+$/);
    if (trail) {
      tail = trail[0];
      url = url.slice(0, -tail.length);
    }
    const href = url.startsWith("http") ? url : `https://${url}`;
    out.push(
      <a
        key={`${keyBase}-${k++}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={stop}
        className="font-medium underline decoration-black/30 hover:decoration-black break-words"
      >
        {url}
      </a>,
    );
    if (tail) out.push(tail);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function RichText({ text }: { text: string }) {
  const paras = text.split(/\n{2,}/);
  return (
    <>
      {paras.map((para, i) => {
        const label = para.match(/^([A-Za-z][\w &/'()-]{0,28}:)\s+([\s\S]+)$/);
        return (
          <p key={i} className="mb-3 last:mb-0">
            {label ? (
              <>
                <strong className="text-black font-semibold">{label[1]} </strong>
                {linkify(label[2], `p${i}`)}
              </>
            ) : (
              linkify(para, `p${i}`)
            )}
          </p>
        );
      })}
    </>
  );
}

export default function OpportunityCard({
  kind,
  title,
  summary,
  description,
  tags,
  link,
  repoLink,
  accent = "yellow",
  orgName,
  skillsNeeded,
  difficulty,
  image,
  creator,
  stars,
}: OpportunityCardProps) {
  const accentBg = ACCENT_BG[accent];
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const Actions = () => (
    <div className="flex flex-wrap gap-3">
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={stop}
          className="btn-primary btn-primary-yellow text-sm"
          style={{ fontSize: "0.875rem", padding: "8px 16px" }}
        >
          View →
        </a>
      )}
      {repoLink && (
        <a
          href={repoLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={stop}
          className="btn-pill btn-pill-outline text-sm"
          style={{ fontSize: "0.875rem", padding: "8px 16px" }}
        >
          Code
        </a>
      )}
      {!link && !repoLink && kind === "ngo_request" && (
        <a
          href="/volunteer"
          onClick={stop}
          className="btn-primary btn-primary-yellow text-sm"
          style={{ fontSize: "0.875rem", padding: "8px 16px" }}
        >
          Volunteer to build →
        </a>
      )}
      {!link && !repoLink && kind === "project_idea" && (
        <a
          href="/join"
          onClick={stop}
          className="btn-primary btn-primary-yellow text-sm"
          style={{ fontSize: "0.875rem", padding: "8px 16px" }}
        >
          Pick this up →
        </a>
      )}
    </div>
  );

  const Tags = ({ items }: { items: string[] }) => (
    <div className="flex flex-wrap gap-1.5">
      {items.map((tag) => (
        <span
          key={tag}
          className="text-xs px-2 py-0.5 bg-surface border border-black/20 rounded-full text-black/60"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {tag}
        </span>
      ))}
    </div>
  );

  return (
    <>
      <article
        onClick={() => setOpen(true)}
        className="card flex flex-col overflow-hidden cursor-pointer transition-transform hover:-translate-y-0.5"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        {image ? (
          <div className="relative aspect-video overflow-hidden border-b-2 border-black" style={{ background: accentBg }}>
            <Image src={image} alt={`${title} screenshot`} fill className="object-cover object-top" sizes="(max-width: 640px) 100vw, 50vw" />
          </div>
        ) : (
          <div className="h-2 w-full border-b-2 border-black" style={{ background: accentBg }} />
        )}

        <div className="p-6 flex flex-col flex-1 bg-white">
          <div className="flex items-start justify-between gap-3 mb-3">
            <span
              className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 border-2 border-black"
              style={{ background: accentBg }}
            >
              {KIND_LABEL[kind]}
            </span>
            <div className="flex items-center gap-2">
              {stars !== undefined && (
                <span className="text-xs font-semibold text-black/60" style={{ fontFamily: "var(--font-sans)" }}>
                  ★ {stars}
                </span>
              )}
              {difficulty && (
                <span className="text-xs text-black/60 font-medium whitespace-nowrap">
                  {DIFFICULTY_LABEL[difficulty]}
                </span>
              )}
            </div>
          </div>

          {orgName && (
            <p className="text-xs font-semibold text-black/60 uppercase tracking-wider mb-1">
              {orgName}
            </p>
          )}

          <h3 className="heading-display text-lg mb-1">{title}</h3>
          {creator && (
            <p className="text-xs text-black/50 mb-1" style={{ fontFamily: "var(--font-sans)" }}>
              by {creator}
            </p>
          )}
          <p className="text-sm font-semibold mb-2" style={{ fontFamily: "var(--font-sans)" }}>
            {summary}
          </p>

          {/* Clamped teaser — full text in the modal */}
          <p
            className="text-sm leading-relaxed text-gray-600"
            style={{
              fontFamily: "var(--font-sans)",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {description.replace(/\s*\n+\s*/g, " ")}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
            className="text-sm font-semibold underline self-start mt-1.5 mb-4"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Read more →
          </button>

          {tags && tags.length > 0 && (
            <div className="mb-4">
              <Tags items={tags} />
            </div>
          )}

          {skillsNeeded && skillsNeeded.length > 0 && (
            <div className="mb-4">
              <p
                className="text-xs font-semibold text-black/60 uppercase tracking-wider mb-1.5"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Skills needed
              </p>
              <div className="flex flex-wrap gap-1.5">
                {skillsNeeded.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-2 py-0.5 bg-surface border border-black rounded-full font-medium"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-auto pt-4 border-t-2 border-black">
            <Actions />
          </div>
        </div>
      </article>

      {/* ── Detail modal ── */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-4 sm:p-6 overflow-y-auto"
          style={{ background: "rgba(0,0,0,0.55)" }}
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            onClick={(e) => e.stopPropagation()}
            className="card bg-white w-full max-w-2xl my-auto relative"
          >
            <div className="h-2 w-full border-b-2 border-black" style={{ background: accentBg }} />

            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center border-2 border-black bg-white hover:bg-black hover:text-white transition-colors rounded-full z-10"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4 flex-wrap pr-10">
                <span
                  className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 border-2 border-black"
                  style={{ background: accentBg }}
                >
                  {KIND_LABEL[kind]}
                </span>
                {difficulty && (
                  <span className="text-xs text-black/60 font-medium">
                    {DIFFICULTY_LABEL[difficulty]}
                  </span>
                )}
                {stars !== undefined && (
                  <span className="text-xs font-semibold text-black/60" style={{ fontFamily: "var(--font-sans)" }}>
                    ★ {stars}
                  </span>
                )}
              </div>

              {orgName && (
                <p className="text-xs font-semibold text-black/60 uppercase tracking-wider mb-1">
                  {orgName}
                </p>
              )}
              <h2 className="heading-display text-2xl sm:text-3xl mb-1">{title}</h2>
              {creator && (
                <p className="text-xs text-black/50 mb-3" style={{ fontFamily: "var(--font-sans)" }}>
                  by {creator}
                </p>
              )}

              <p className="text-base font-semibold mb-5" style={{ fontFamily: "var(--font-sans)" }}>
                {summary}
              </p>

              <div
                className="text-[15px] leading-relaxed text-gray-700 mb-6"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                <RichText text={description} />
              </div>

              {tags && tags.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs font-semibold text-black/60 uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-sans)" }}>
                    Tags
                  </p>
                  <Tags items={tags} />
                </div>
              )}

              {skillsNeeded && skillsNeeded.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs font-semibold text-black/60 uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-sans)" }}>
                    Skills needed
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {skillsNeeded.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs px-2 py-0.5 bg-surface border border-black rounded-full font-medium"
                        style={{ fontFamily: "var(--font-sans)" }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-5 border-t-2 border-black">
                <Actions />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
