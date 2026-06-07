import Image from "next/image";

interface NGOCardProps {
  name: string;
  country: string;
  flag: string;
  cause: string;
  tagline: string;
  description: string;
  helpedWith: string;
  whoFor: string;
  primaryLink: { label: string; href: string };
  codeLink: { label: string; href: string } | null;
  accentBg: string;
  image?: string;
}

export default function NGOCard({
  name, country, flag, cause, tagline, description,
  helpedWith, whoFor, primaryLink, codeLink, accentBg, image,
}: NGOCardProps) {
  return (
    <article className="card flex flex-col overflow-hidden">
      {/* Image / header */}
      <div
        className="relative aspect-video overflow-hidden border-b-2 border-black"
        style={{ background: accentBg }}
      >
        {image && (
          <Image
            src={image}
            alt={`${name} website screenshot`}
            fill
            className="object-cover object-top"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        )}
        {/* Flag + country badge — bottom left */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white border-2 border-black px-2.5 py-1">
          <span className="text-base leading-none">{flag}</span>
          <span className="text-xs font-bold uppercase tracking-wide" style={{ fontFamily: "var(--font-sans)" }}>
            {country}
          </span>
        </div>
        {/* Cause badge — bottom right */}
        <span className="absolute bottom-3 right-3 text-xs font-bold px-2.5 py-1 border-2 border-black bg-white">
          {cause}
        </span>
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
            { label: "We helped with", value: helpedWith },
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
