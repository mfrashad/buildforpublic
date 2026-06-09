import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import LandingFooter from "@/app/components/sections/LandingFooter";
import PersonaTile from "@/app/components/ui/PersonaTile";
import PillarItem from "@/app/components/ui/PillarItem";
import NGOHelpedSection from "@/app/components/sections/NGOHelpedSection";
import TerminalIcon from "@/components/ui/icons/terminal-icon";
import HandHeartIcon from "@/components/ui/icons/hand-heart-icon";
import PenIcon from "@/components/ui/icons/pen-icon";
import SparklesIcon from "@/components/ui/icons/sparkles-icon";
import UsersIcon from "@/components/ui/icons/users-icon";
import CodeIcon from "@/components/ui/icons/code-icon";
import RocketIcon from "@/components/ui/icons/rocket-icon";
import BookIcon from "@/components/ui/icons/book-icon";

export const metadata: Metadata = {
  title: "Tech for Good & Digital Volunteering in Malaysia",
  description:
    "Join Build for Public — a community of volunteers shipping open-source tech for the public good in Malaysia and Southeast Asia. Volunteer your code, design, or writing skills for meaningful impact.",
  keywords: [
    "tech for good Malaysia",
    "digital volunteering Malaysia",
    "volunteer developer Malaysia",
    "open source Southeast Asia",
    "civic tech Malaysia",
    "social impact technology",
    "NGO tech volunteer",
    "AI for good Malaysia",
  ],
  alternates: { canonical: "https://buildforpublic.com/aiforgood/my" },
  openGraph: {
    type: "website",
    siteName: "Build for Public",
    locale: "en_US",
    title: "Tech for Good & Digital Volunteering in Malaysia",
    description:
      "Volunteer your tech skills for the public good. Join an open-source movement building digital tools for NGOs and communities across Southeast Asia.",
    url: "https://buildforpublic.com/aiforgood/my",
    images: [{ url: "/og/buildforpublic.png", width: 1600, height: 827, alt: "Build for Public — Tech for good in Malaysia." }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@build4public",
    creator: "@build4public",
    title: "Tech for Good & Digital Volunteering in Malaysia",
    description:
      "Volunteer your tech skills for the public good. Join an open-source movement building digital tools for NGOs and communities across Southeast Asia.",
    images: ["/og/buildforpublic.png"],
  },
};

const PILLARS = [
  {
    Icon: UsersIcon,
    title: "Show up.",
    description:
      "Weekly co-building sessions in Kuala Lumpur. Meet people working on real problems — and start working on them together.",
    bg: "#fff200",
  },
  {
    Icon: CodeIcon,
    title: "Build.",
    description:
      "Partner with NGOs and community groups. Design and ship the websites, tools, and systems they actually need but can't afford.",
    bg: "#ffc0a1",
  },
  {
    Icon: RocketIcon,
    title: "Ship.",
    description:
      "Put real work into the world — open-source, publicly documented, maintained, and actually used by the people it's for.",
    bg: "#94e8ff",
  },
  {
    Icon: BookIcon,
    title: "Grow.",
    description:
      "Learn by doing. Teach what you know. We help non-technical changemakers build, and help builders understand the problems that matter.",
    bg: "#6ff5b6",
  },
];

const PERSONAS = [
  {
    Icon: TerminalIcon,
    title: "Developers and engineers.",
    description:
      "Frontend, backend, full-stack — your code can power tools that serve thousands of people who can't afford to commission them.",
    accent: "#000",
    bg: "#fff200",
  },
  {
    Icon: PenIcon,
    title: "Designers and writers.",
    description:
      "UX designers, content creators, illustrators, translators. Great tools without great design and communication don't get used.",
    accent: "#000",
    bg: "#ffc0a1",
  },
  {
    Icon: HandHeartIcon,
    title: "NGO workers and changemakers.",
    description:
      "You know the problem better than anyone. Now you can also build the solution — or be part of the team that does.",
    accent: "#000",
    bg: "#94e8ff",
  },
  {
    Icon: SparklesIcon,
    title: "Curious beginners.",
    description:
      "You don't need a CS degree. You need a problem worth solving and a few hours a week. AI has collapsed the barrier to entry — we'll help with the rest.",
    accent: "#000",
    bg: "#6ff5b6",
  },
];

export default function AIForGoodMYPage() {
  return (
    <main>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded"
      >
        Skip to content
      </a>
      <Navbar />

      {/* ── Hero ── */}
      <section
        id="main-content"
        className="band band-white grid-bg px-6 pt-40 pb-24 sm:pt-48 sm:pb-28"
        aria-label="Hero"
      >
        <div className="max-w-4xl mx-auto">
          <p className="eyebrow mb-6">Digital Volunteerism · Malaysia</p>
          <h1 className="heading-display text-4xl sm:text-5xl lg:text-6xl mb-6">
            Build tech for good<br />in Malaysia.
          </h1>
          <p className="text-xl sm:text-2xl leading-relaxed text-gray-600 mb-10 max-w-2xl">
            Join a community of volunteers using their skills — code, design, writing — to ship{" "}
            <span className="highlight">open-source tech for the public good.</span>
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="/volunteer" className="btn-primary btn-primary-yellow">
              Start volunteering
            </a>
            <a href="/community" className="btn-primary">
              See the community
            </a>
          </div>
        </div>
      </section>

      {/* ── The Why ── */}
      <section
        className="band band-yellow section-padding px-6"
        aria-labelledby="why-heading"
      >
        <div className="max-w-4xl mx-auto">
          <p className="eyebrow mb-4">Why it matters</p>
          <h2 id="why-heading" className="heading-section mb-8">
            Your skills can change things.
          </h2>
          <div className="max-w-2xl space-y-5 text-lg leading-relaxed text-gray-800" style={{ fontFamily: "var(--font-sans)" }}>
            <p>
              Most nonprofit problems aren&apos;t political — they&apos;re infrastructure. A website that actually works. A database that doesn&apos;t lose records. A form that gets submitted and tracked.
            </p>
            <p>
              These are solvable problems. You can solve them. And right now, AI has collapsed the cost of building software so dramatically that a small team of motivated volunteers can ship what once required a six-figure budget.
            </p>
            <p>
              Build for Public is where that happens — in the open, together, in Malaysia.
            </p>
          </div>
        </div>
      </section>

      {/* ── What you'll do ── */}
      <section
        className="band band-white section-padding px-6"
        aria-labelledby="do-heading"
      >
        <div className="max-w-5xl mx-auto">
          <h2 id="do-heading" className="heading-section mb-12 lg:mb-16">
            What you&apos;ll do.
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PILLARS.map((p) => (
              <PillarItem key={p.title} {...p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Who shows up ── */}
      <section
        className="band band-white grid-bg section-padding px-6"
        aria-labelledby="who-heading"
      >
        <div className="max-w-5xl mx-auto">
          <h2 id="who-heading" className="heading-section mb-12 lg:mb-16">
            Who shows up.
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {PERSONAS.map((p) => (
              <PersonaTile key={p.title} {...p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Proof: shipped projects + live NGO data ── */}
      <section
        className="band band-white section-padding px-6"
        aria-labelledby="proof-heading"
      >
        <div className="max-w-5xl mx-auto">
          <h2 id="proof-heading" className="heading-section mb-4">
            What the community&apos;s shipped.
          </h2>
          <p
            className="text-gray-600 mb-0 max-w-xl"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Open-source projects built by volunteers in Malaysia and Southeast Asia — live and in use by real communities.
          </p>
          {/* NGOHelpedSection renders its own "NGOs we've helped ship." h2 + live Convex data */}
          <NGOHelpedSection />
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <section
        className="band band-yellow section-padding px-6"
        aria-labelledby="cta-heading"
      >
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
          <div>
            <h2 id="cta-heading" className="heading-section mb-3">
              Ready to build for good?
            </h2>
            <p
              className="text-gray-700 max-w-lg"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              No commitment required to start. Come to a session, see what we&apos;re working on, and decide from there.
            </p>
          </div>
          <a href="/volunteer" className="btn-primary flex-shrink-0">
            Start volunteering →
          </a>
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}
