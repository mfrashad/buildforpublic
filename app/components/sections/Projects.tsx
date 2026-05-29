import ProjectCard from "@/app/components/ui/ProjectCard";

const PROJECTS = [
  {
    name: "Pocket of Pink",
    tagline: "A website for an NGO doing real work.",
    description:
      "Pocket of Pink is a Malaysian NGO. They needed a website that matched the seriousness of their mission. We built it with them, in the open.",
    builtBy: "Build for Public + Pocket of Pink team",
    builtWith: "Pocket of Pink",
    whoFor: "Anyone supporting or seeking support from Pocket of Pink",
    primaryLink: { label: "Visit", href: "https://pocketofpink.com" },
    codeLink: { label: "Code", href: "#" },
    image: "/projects/pocketofpink.png",
    status: null,
    accentBg: "#ffc0a1",
  },
  {
    name: "AI Adoption by Country",
    tagline: "Open data tracking AI adoption across 16 countries.",
    description:
      "Interactive visualization and open data API tracking AI adoption from UAE at 64% to Nigeria at 7%. Data sourced from Microsoft, Stanford HAI, OECD, and 11 other authoritative sources.",
    builtBy: "Build for Public",
    builtWith: "Open data sources",
    whoFor: "Researchers, journalists, policymakers",
    primaryLink: { label: "Visit", href: "https://aiadoption-gray.vercel.app" },
    codeLink: { label: "Code", href: "https://github.com/mfrashad/aiadoption" },
    image: "/projects/aiadoption.png",
    status: null,
    accentBg: "#94e8ff",
  },
  {
    name: "Bookshelf",
    tagline: "Turn your reading library into a shareable poster.",
    description:
      "Import from Goodreads or Hardcover, pick a visualization style, and download. Built on World Book Day to raise awareness for global literacy — 773 million adults cannot read.",
    builtBy: "Build for Public",
    builtWith: "Open library and literacy data",
    whoFor: "Readers, educators, librarians",
    primaryLink: { label: "Visit", href: "https://bookshelf.aiforgood.my" },
    codeLink: { label: "Code", href: "https://github.com/mfrashad/bookshelf" },
    image: "/projects/bookshelf.png",
    status: null,
    accentBg: "#fff200",
  },
  {
    name: "OpenNGO",
    tagline: "A directory of Malaysia's NGOs, with an API anyone can build on.",
    description:
      "Civil society shouldn't be hard to find. OpenNGO is a public directory of Malaysian NGOs with structured data, search, and an open API. Built for journalists, funders, and researchers.",
    builtBy: "Build for Public",
    builtWith: "Partner NGOs across Malaysia",
    whoFor: "NGOs, funders, journalists, researchers",
    primaryLink: { label: "Visit", href: "https://open-ngo.vercel.app" },
    codeLink: null,
    image: "/og/openngo.png",
    status: null,
    accentBg: "#6ff5b6",
  },
];

export default function Projects() {
  return (
    <section
      className="band band-yellow section-padding px-6"
      aria-labelledby="projects-heading"
    >
      <div className="max-w-5xl mx-auto">
        <h2 id="projects-heading" className="heading-section mb-4">
          What the community&apos;s shipped.
        </h2>
        <p className="text-lg mb-12 lg:mb-16 max-w-2xl leading-relaxed text-gray-700" style={{ fontFamily: "var(--font-sans)" }}>
          Four projects shipped, more in active development. Every project here is open-source. Every project here was built with the community that needed it. Use them. Fork them. Bring them to your city.
        </p>
        <div className="grid sm:grid-cols-2 gap-8">
          {PROJECTS.map((p) => (
            <ProjectCard key={p.name} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}
