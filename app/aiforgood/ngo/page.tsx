import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import LandingFooter from "@/app/components/sections/LandingFooter";
import PersonaTile from "@/app/components/ui/PersonaTile";
import PillarItem from "@/app/components/ui/PillarItem";
import NGOHelpedSection from "@/app/components/sections/NGOHelpedSection";
import TerminalIcon from "@/components/ui/icons/terminal-icon";
import SparklesIcon from "@/components/ui/icons/sparkles-icon";
import PenIcon from "@/components/ui/icons/pen-icon";
import RocketIcon from "@/components/ui/icons/rocket-icon";
import UsersIcon from "@/components/ui/icons/users-icon";
import CodeIcon from "@/components/ui/icons/code-icon";
import BookIcon from "@/components/ui/icons/book-icon";
import HandHeartIcon from "@/components/ui/icons/hand-heart-icon";

export const metadata: Metadata = {
  title: "Free Tech & Websites for NGOs",
  description:
    "Build for Public helps NGOs in Malaysia and Southeast Asia get free, open-source websites and digital tools — built by volunteer developers and designers, owned by you.",
  keywords: [
    "free website for NGO Malaysia",
    "free tech nonprofits Malaysia",
    "pro bono software Malaysia",
    "NGO digital tools",
    "free website NGO Southeast Asia",
    "volunteer built tech nonprofit",
    "open source NGO Malaysia",
    "AI for good NGO",
  ],
  alternates: { canonical: "https://buildforpublic.com/aiforgood/ngo" },
  openGraph: {
    type: "website",
    siteName: "Build for Public",
    locale: "en_US",
    title: "Free Tech & Websites for NGOs — Build for Public",
    description:
      "Free pro-bono software and websites for nonprofits in Malaysia. Volunteer builders design, build, and ship the digital tools your NGO needs — open-source and free.",
    url: "https://buildforpublic.com/aiforgood/ngo",
    images: [{ url: "/og/buildforpublic.png", width: 1600, height: 827, alt: "Build for Public — Free tech for NGOs in Malaysia." }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@build4public",
    creator: "@build4public",
    title: "Free Tech & Websites for NGOs — Build for Public",
    description:
      "Free pro-bono software and websites for nonprofits in Malaysia. Volunteer builders design, build, and ship the digital tools your NGO needs — open-source and free.",
    images: ["/og/buildforpublic.png"],
  },
};

const WHAT_WE_BUILD = [
  {
    Icon: TerminalIcon,
    title: "Websites.",
    description:
      "A proper website that represents your mission and works on every device — designed, built, and handed over to you with the source code.",
    accent: "#000",
    bg: "#fff200",
  },
  {
    Icon: CodeIcon,
    title: "Internal tools.",
    description:
      "Volunteer CRMs, case tracking, event sign-ups, intake forms, internal dashboards. Systems your team will actually use.",
    accent: "#000",
    bg: "#94e8ff",
  },
  {
    Icon: RocketIcon,
    title: "Data & reporting.",
    description:
      "Turn your impact data into something visible and shareable. Dashboards, visualisations, and reports that help communicate your work to funders and communities.",
    accent: "#000",
    bg: "#ffc0a1",
  },
  {
    Icon: SparklesIcon,
    title: "AI helpers.",
    description:
      "Automate the repetitive parts of your work — intake processing, summarisation, draft generation. Practical AI built around your specific workflows.",
    accent: "#000",
    bg: "#6ff5b6",
  },
];

const HOW_IT_WORKS = [
  {
    Icon: PenIcon,
    title: "1. Submit.",
    description:
      "Tell us the problem you're facing — not a polished brief, just what's broken or missing and who it affects. Use the project request form.",
    bg: "#fff200",
  },
  {
    Icon: UsersIcon,
    title: "2. Scope.",
    description:
      "We sit with you — online or in-person in KL — to understand the need, what's already been tried, and what a workable solution looks like.",
    bg: "#ffc0a1",
  },
  {
    Icon: CodeIcon,
    title: "3. Build.",
    description:
      "Volunteer developers and designers take on the project, checking in with you as they go. You are part of the process, not a passive client.",
    bg: "#94e8ff",
  },
  {
    Icon: BookIcon,
    title: "4. Own it.",
    description:
      "The finished product is yours. All code is open-source and handed over — no vendor lock-in, no ongoing licensing fees. Free. Forever.",
    bg: "#6ff5b6",
  },
];

export default function AIForGoodNGOPage() {
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
        className="band band-blue grid-bg px-6 pt-40 pb-24 sm:pt-48 sm:pb-28"
        aria-label="Hero"
      >
        <div className="max-w-4xl mx-auto">
          <p className="eyebrow mb-6">For NGOs &amp; Nonprofits · Malaysia</p>
          <h1 className="heading-display text-4xl sm:text-5xl lg:text-6xl mb-6">
            Free tech for<br />your NGO.
          </h1>
          <p className="text-xl sm:text-2xl leading-relaxed text-gray-700 mb-10 max-w-2xl">
            Tell us the problem you&apos;re facing. A community of volunteer builders will design, build, and ship the website or tool you need —{" "}
            <span className="highlight">open-source and free.</span>
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="/request" className="btn-primary btn-primary-yellow">
              Pitch your project
            </a>
            <a href="#proof" className="btn-primary">
              See what we&apos;ve built
            </a>
          </div>
        </div>
      </section>

      {/* ── What we can build ── */}
      <section
        className="band band-white section-padding px-6"
        aria-labelledby="build-heading"
      >
        <div className="max-w-5xl mx-auto">
          <h2 id="build-heading" className="heading-section mb-12 lg:mb-16">
            What we can build for you.
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {WHAT_WE_BUILD.map((p) => (
              <PersonaTile key={p.title} {...p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section
        className="band band-yellow section-padding px-6"
        aria-labelledby="how-heading"
      >
        <div className="max-w-5xl mx-auto">
          <h2 id="how-heading" className="heading-section mb-12 lg:mb-16">
            How it works.
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((p) => (
              <PillarItem key={p.title} {...p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Proof: live NGO data ── */}
      <section
        id="proof"
        className="band band-white section-padding px-6 scroll-mt-20"
        aria-label="NGOs we've helped ship"
      >
        <div className="max-w-5xl mx-auto">
          <p
            className="text-gray-600 max-w-xl mb-0"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Real organisations. Real tools. Built by volunteers, owned by the NGO, used by the communities they serve.
          </p>
          {/* NGOHelpedSection renders "NGOs we've helped ship." h2 + live Convex-backed cards */}
          <NGOHelpedSection />
        </div>
      </section>

      {/* ── What it's not ── */}
      <section
        className="band band-white section-padding px-6 border-t-0"
        aria-labelledby="not-heading"
      >
        <div className="max-w-4xl mx-auto">
          <h2 id="not-heading" className="heading-section mb-8">
            What this is not.
          </h2>
          <div className="grid sm:grid-cols-3 gap-6" style={{ fontFamily: "var(--font-sans)" }}>
            {[
              {
                label: "Not a vendor.",
                body: "We don't charge. There's no invoice, no contract, no ongoing retainer. The community volunteers its time because it believes in the mission.",
                bg: "#fff200",
              },
              {
                label: "Not a charity.",
                body: "We're a peer community. NGOs are partners, not beneficiaries. You'll be involved throughout — this only works if you are.",
                bg: "#94e8ff",
              },
              {
                label: "Not a one-off.",
                body: "We care about projects that last. After launch we help handover, document, and — where possible — maintain what we've built together.",
                bg: "#ffc0a1",
              },
            ].map(({ label, body, bg }) => (
              <div key={label} className="card p-6" style={{ background: bg }}>
                <h3 className="heading-display text-base mb-3">{label}</h3>
                <p className="text-sm leading-relaxed text-gray-700">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <section
        className="band band-peach section-padding px-6"
        aria-labelledby="cta-heading"
      >
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
          <div>
            <h2 id="cta-heading" className="heading-section mb-3">
              Have a problem worth solving?
            </h2>
            <p
              className="text-gray-700 max-w-lg"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              You don&apos;t need a polished brief or a budget. Just tell us what you&apos;re trying to do and who it&apos;s for.
            </p>
          </div>
          <a href="/request" className="btn-primary flex-shrink-0">
            Request a project →
          </a>
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}
