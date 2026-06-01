import ProjectCard from "@/app/components/ui/ProjectCard";
import BrickField from "@/app/components/decorations/bricks/BrickField";

// Lighter, edge-only bricks for Projects — don't compete with the project cards
const PROJECTS_BRICKS = [
  { type: "cube"  as const, color: "cobalt",  size: 52, xPct:  2, yPct: 15, floatAmt:  8, floatDur: 3.4, delay: 0.0, tilt: -20 },
  { type: "slope" as const, color: "yellow",  size: 60, xPct: 97, yPct: 20, floatAmt: 10, floatDur: 2.8, delay: 0.9, tilt:  14 },
  { type: "plate" as const, color: "green",   size: 55, xPct:  3, yPct: 80, floatAmt:  7, floatDur: 3.8, delay: 0.5, tilt:  10 },
  { type: "cube"  as const, color: "purple",  size: 48, xPct: 96, yPct: 75, floatAmt: 11, floatDur: 3.1, delay: 1.2, tilt: -16 },
];

const PROJECTS = [
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
  {
    name: "Bookshelf",
    tagline: "Turn your reading library into a shareable poster.",
    description:
      "Import from Goodreads or Hardcover, pick a visualization style, and download. Built on World Book Day to raise awareness for global literacy — 773 million adults cannot read.",
    builtBy: "Build for Public",
    builtWith: "Open library and literacy data",
    whoFor: "Readers, educators, librarians",
    primaryLink: { label: "Visit", href: "https://bookshelf.buildforpublic.com" },
    codeLink: { label: "Code", href: "https://github.com/mfrashad/bookshelf" },
    image: "/projects/bookshelf.png",
    status: null,
    accentBg: "#fff200",
  },
  {
    name: "Pocket of Pink",
    tagline: "Gender empowerment for young people through art and education.",
    description:
      "Founded by Ain Husniza after her viral campaign against school rape culture, Pocket of Pink uses art, advocacy, and Comprehensive Sexuality Education to empower youth and challenge harmful gender norms. We helped them ship their site in a day using AI.",
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
];

export default function Projects() {
  return (
    <section
      className="band band-yellow section-padding px-6 relative overflow-hidden"
      id="projects"
      aria-labelledby="projects-heading"
    >
      {/* Edge-only ambient bricks — light enough not to compete with project cards */}
      <BrickField bricks={PROJECTS_BRICKS} opacity={0.4} className="absolute inset-0 z-0" />
      <div className="max-w-5xl mx-auto relative z-10">
        <h2 id="projects-heading" className="heading-section mb-8">
          What the community&apos;s shipped.
        </h2>
        <div className="grid sm:grid-cols-2 gap-8">
          {PROJECTS.map((p) => (
            <ProjectCard key={p.name} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}
