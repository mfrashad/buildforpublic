import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import LandingFooter from "@/app/components/sections/LandingFooter";

export const metadata: Metadata = {
  title: "AI for Good Malaysia",
  description:
    "Build for Public brings together volunteer builders and NGOs in Malaysia to ship open-source tech for the public good — free, transparent, and community-owned.",
  keywords: [
    "AI for good Malaysia",
    "tech for good Malaysia",
    "NGO tech Malaysia",
    "digital volunteerism Malaysia",
    "open source public good Southeast Asia",
    "volunteer tech nonprofit Malaysia",
    "aiforgood.my",
  ],
  alternates: { canonical: "https://buildforpublic.com/aiforgood" },
  openGraph: {
    type: "website",
    siteName: "Build for Public",
    locale: "en_US",
    title: "AI for Good Malaysia — Build for Public",
    description:
      "Build for Public brings together volunteer builders and NGOs to ship open-source tech for the public good in Malaysia and Southeast Asia.",
    url: "https://buildforpublic.com/aiforgood",
    images: [{ url: "/og/buildforpublic.png", width: 1600, height: 827, alt: "Build for Public — AI for Good Malaysia." }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@build4public",
    creator: "@build4public",
    title: "AI for Good Malaysia — Build for Public",
    description:
      "Build for Public brings together volunteer builders and NGOs to ship open-source tech for the public good in Malaysia and Southeast Asia.",
    images: ["/og/buildforpublic.png"],
  },
};

const PATHS = [
  {
    href: "/aiforgood/my",
    eyebrow: "I want to volunteer",
    heading: "I'm a builder.",
    body: "Developer, designer, writer, or curious beginner — join a community of volunteers using their skills to ship tech for public good in Malaysia.",
    cta: "Start volunteering →",
    bg: "#fff200",
  },
  {
    href: "/aiforgood/ngo",
    eyebrow: "My organisation needs help",
    heading: "I run an NGO.",
    body: "Tell us the problem you're facing. Volunteer builders will design, build, and ship the website or tool you need — open-source and free.",
    cta: "Request a project →",
    bg: "#94e8ff",
  },
];

export default function AIForGoodPage() {
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
        className="band band-white grid-bg px-6 pt-40 pb-16 sm:pt-48 sm:pb-20"
        aria-label="Hero"
      >
        <div className="max-w-3xl mx-auto text-center">
          <p className="eyebrow mb-6">aiforgood.my</p>
          <h1 className="heading-display text-4xl sm:text-5xl lg:text-6xl mb-6">
            Tech for good.<br />Built in Malaysia.
          </h1>
          <p className="text-xl sm:text-2xl leading-relaxed text-gray-600 max-w-2xl mx-auto">
            We connect volunteer builders with NGOs to ship{" "}
            <span className="highlight">open-source tech for the public good</span>{" "}
            — starting in Southeast Asia.
          </p>
        </div>
      </section>

      {/* ── Two paths ── */}
      <section
        className="band band-white section-padding px-6"
        aria-labelledby="paths-heading"
      >
        <div className="max-w-4xl mx-auto">
          <h2 id="paths-heading" className="heading-section mb-12 text-center">
            Who are you?
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {PATHS.map(({ href, eyebrow, heading, body, cta, bg }) => (
              <a
                key={href}
                href={href}
                className="card flex flex-col gap-5 p-8 group transition-transform hover:-translate-y-1"
                style={{ background: bg }}
              >
                <p className="eyebrow text-xs">{eyebrow}</p>
                <h3 className="heading-display text-2xl sm:text-3xl">{heading}</h3>
                <p
                  className="text-sm leading-relaxed text-gray-700 flex-1"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {body}
                </p>
                <span className="btn-primary self-start">{cta}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section
        className="band band-yellow section-padding px-6"
        aria-labelledby="about-heading"
      >
        <div className="max-w-4xl mx-auto">
          <h2 id="about-heading" className="heading-section mb-8">
            What is Build for Public?
          </h2>
          <div
            className="max-w-2xl space-y-5 text-lg leading-relaxed text-gray-800"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            <p>
              Build for Public is an open-source community in Malaysia. We believe the best way to build technology that serves the public is to get the public to build it.
            </p>
            <p>
              Every month, volunteers — developers, designers, writers, changemakers — meet up in KL to work on real problems faced by real communities and NGOs. The tools we ship are free, open-source, and owned by the organisations we build them for.
            </p>
            <p>
              AI has collapsed the cost of building software. A small team of motivated people can now ship what once required a six-figure budget. We think that belongs in the hands of everyone — not just those who can pay for it.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="/manifesto" className="btn-primary">
              Read the manifesto →
            </a>
            <a href="/community" className="btn-primary">
              Meet the community →
            </a>
          </div>
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}
