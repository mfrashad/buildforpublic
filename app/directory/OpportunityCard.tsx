import Image from "next/image";

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

  return (
    <article className="card flex flex-col overflow-hidden">
      {image ? (
        <div className="relative aspect-video overflow-hidden border-b-2 border-black" style={{ background: accentBg }}>
          <Image src={image} alt={`${title} screenshot`} fill className="object-cover object-top" sizes="(max-width: 640px) 100vw, 50vw" />
        </div>
      ) : (
        <div className="h-2 w-full border-b-2 border-black" style={{ background: accentBg }} />
      )}

      {/* Kind badge + title area */}
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
        <p
          className="text-sm font-semibold mb-3"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {summary}
        </p>
        <p
          className="text-sm leading-relaxed mb-4 flex-1 text-gray-600"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {description}
        </p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 bg-surface border border-black/20 rounded-full text-black/60"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Skills needed */}
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

        {/* Actions */}
        <div className="flex gap-3 mt-auto pt-4 border-t-2 border-black">
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary btn-primary-yellow text-sm px-4 py-2"
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
              className="btn-pill btn-pill-outline text-sm"
              style={{ fontSize: "0.875rem", padding: "8px 16px" }}
            >
              Code
            </a>
          )}
          {!link && !repoLink && kind === "ngo_request" && (
            <a
              href="/volunteer"
              className="btn-primary btn-primary-yellow text-sm px-4 py-2"
              style={{ fontSize: "0.875rem", padding: "8px 16px" }}
            >
              Volunteer to build →
            </a>
          )}
          {!link && !repoLink && kind === "project_idea" && (
            <a
              href="/join"
              className="btn-primary btn-primary-yellow text-sm px-4 py-2"
              style={{ fontSize: "0.875rem", padding: "8px 16px" }}
            >
              Pick this up →
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
