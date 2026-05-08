import Image from "next/image";

const INITIATIVES = [
  {
    id: "community",
    title: "Community",
    badge: "COMING SOON",
    accent: "accent-mint",
    image: "/sprites/initiative-community.png",
    description:
      "Biweekly sessions where builders meet NGOs, scope real problems, and form teams. We show up, pair with a real org, and ship.",
    cta: { label: "Join as Volunteer Committee", href: "/volunteer" },
  },
  {
    id: "advocacy",
    title: "Advocacy",
    badge: "ACTIVE",
    accent: "accent-yellow",
    image: "/sprites/initiative-advocacy.png",
    description:
      "Short-form videos, talks, blogs, and infographics on AI safety and public-interest AI. In English and Bahasa Malaysia. 5M+ views.",
    cta: { label: "View Content", href: "#advocacy" },
  },
  {
    id: "projects",
    title: "Open Source Projects",
    badge: "ACTIVE",
    accent: "accent-blue",
    image: "/sprites/initiative-projects.png",
    description:
      "Open-source projects built for real NGO problems. Each one ships a dataset, API, or template so the next builder starts where we left off.",
    cta: { label: "Browse Projects", href: "#projects" },
  },
];

export default function InitiativesSection() {
  return (
    <section className="section-padding">
      <div className="max-w-5xl mx-auto">
        <h2 className="heading-section text-black text-center mb-3">
          What we build
        </h2>
        <p className="text-lg text-black/60 text-center mb-14 max-w-2xl mx-auto">
          Three things: community sessions, AI literacy content, and open-source projects.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {INITIATIVES.map((item) => (
            <div
              key={item.id}
              className={`card ${item.accent} overflow-hidden flex flex-col`}
            >
              <div className="relative w-full aspect-[16/9]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
              <span className={`text-xs font-bold px-3 py-1 rounded-full self-start mb-5 border ${item.badge === "ACTIVE" ? "text-olive border-black/30 bg-bp-mint/30" : "text-black/50 border-black/20 bg-surface"}`}>
                {item.badge}
              </span>

              <h3
                className="text-xl text-black mb-3"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                {item.title}
              </h3>

              <p className="text-[15px] text-black/60 leading-relaxed flex-1 mb-6">
                {item.description}
              </p>

              <a
                href={item.cta.href}
                className="text-sm font-medium text-clay hover:underline transition-colors"
              >
                {item.cta.label} &rarr;
              </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
