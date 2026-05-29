import Image from "next/image";

interface ProjectCardProps {
  name: string;
  tagline: string;
  description: string;
  builtBy: string;
  builtWith: string;
  whoFor: string;
  primaryLink: { label: string; href: string };
  codeLink: { label: string; href: string } | null;
  image: string;
  status: string | null;
  accentBg: string;
}

export default function ProjectCard({
  name, tagline, description, builtBy, builtWith, whoFor,
  primaryLink, codeLink, image, status, accentBg,
}: ProjectCardProps) {
  return (
    <article className="card flex flex-col overflow-hidden">
      {/* Image with accent top border */}
      <div className="relative aspect-video overflow-hidden border-b-2 border-black" style={{ background: accentBg }}>
        <Image
          src={image}
          alt={`${name} screenshot`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 50vw"
        />
        {status && (
          <span className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 border-2 border-black bg-white">
            {status}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 bg-white">
        <h3 className="heading-display text-lg mb-1">{name}</h3>
        <p className="text-sm font-semibold mb-3" style={{ fontFamily: "var(--font-sans)" }}>{tagline}</p>
        <p className="text-sm leading-relaxed mb-4 flex-1 text-gray-600" style={{ fontFamily: "var(--font-sans)" }}>
          {description}
        </p>

        <dl className="space-y-1 mb-5 border-t-2 border-black pt-4">
          {[
            { label: "Built by", value: builtBy },
            { label: "Built with", value: builtWith },
            { label: "Who it's for", value: whoFor },
          ].map(({ label, value }) => (
            <div key={label} className="flex gap-2 text-xs text-gray-600" style={{ fontFamily: "var(--font-sans)" }}>
              <dt className="font-bold flex-shrink-0">{label}:</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        <div className="flex gap-3 mt-auto">
          <a
            href={primaryLink.href}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary btn-primary-yellow text-sm px-4 py-2"
            style={{ fontSize: "0.875rem", padding: "8px 16px" }}
          >
            {primaryLink.label} →
          </a>
          {codeLink && (
            <a
              href={codeLink.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill btn-pill-outline text-sm"
              style={{ fontSize: "0.875rem", padding: "8px 16px" }}
            >
              {codeLink.label}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
