import Image from "next/image";

const WE_LOVE = [
  {
    name: "data.gov.my",
    tagline: "Malaysia's open data, one front door.",
    description:
      "The country's public data platform. Dashboards, downloadable datasets, public APIs. No key required.",
    href: "https://data.gov.my",
    image: "/og/datagov.png",
    accentBg: "#fff200",
  },
  {
    name: "MyMP",
    tagline: "Tracking all 222 Members of Parliament.",
    description:
      "A volunteer-built site that tracks Malaysia's MPs across attendance, motions, and service centres. Parliamentary data, made legible.",
    href: "https://mymp.org.my",
    image: "/og/mymp.png",
    accentBg: "#94e8ff",
  },
  {
    name: "sedekah.je",
    tagline: "A QR directory for donating to mosques and suraus.",
    description:
      "Crowdsourced and open-source. One developer saw the friction in giving to local institutions and shipped the directory the community needed.",
    href: "https://sedekah.je",
    image: "/og/sedekah.png",
    accentBg: "#ffc0a1",
  },
  {
    name: "pasarmalam.app",
    tagline: "Find a pasar malam, any night.",
    description:
      "A directory of night markets across Malaysia. Days, hours, locations, directions. The kind of small civic tool the market won't build but a community will.",
    href: "https://pasarmalam.app",
    image: "/og/pasarmalam.png",
    accentBg: "#6ff5b6",
  },
];

export default function WeLove() {
  return (
    <section className="band band-white grid-bg section-padding px-6" aria-labelledby="welove-heading">
      <div className="max-w-5xl mx-auto">
        <h2 id="welove-heading" className="heading-section mb-4">
          The kind of work we want to multiply.
        </h2>
        <p className="text-lg mb-12 max-w-2xl leading-relaxed text-gray-600" style={{ fontFamily: "var(--font-sans)" }}>
          Built right here. Malaysian public-interest tech, made by people who saw what was missing and shipped it themselves.
        </p>
        <div className="grid sm:grid-cols-2 gap-5">
          {WE_LOVE.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="card overflow-hidden group flex flex-col"
              aria-label={`${item.name} — ${item.tagline} (opens in new tab)`}
            >
              {/* OG image */}
              <div className="relative aspect-video border-b-2 border-black overflow-hidden" style={{ background: item.accentBg }}>
                <Image
                  src={item.image}
                  alt={`${item.name} preview`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1 bg-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="heading-display text-base">{item.name}</span>
                  <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
                <p className="text-sm font-semibold mb-1.5" style={{ fontFamily: "var(--font-sans)" }}>{item.tagline}</p>
                <p className="text-sm leading-relaxed text-gray-600" style={{ fontFamily: "var(--font-sans)" }}>{item.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
