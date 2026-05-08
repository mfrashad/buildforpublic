import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Support the Work — Build for Public",
  description:
    "Fund the public-interest layer of AI in Southeast Asia. Every level of support has concrete outcomes.",
};

const SCENARIOS = [
  {
    amount: "$10K",
    headline: "Community infrastructure becomes sustainable.",
    detail: "Consistent builder sessions, a real NGO project pipeline, 2 to 3 NGO projects per quarter.",
  },
  {
    amount: "$25K",
    headline: "The first flagship project ships with real resources.",
    detail: "Design budget, paid NGO co-owner time, documentation so any city can fork it.",
  },
  {
    amount: "$50K",
    headline: "The community doubles.",
    detail: "Part-time community organizer, events in 2 to 3 cities, 5+ active projects.",
  },
  {
    amount: "$100K",
    headline: "This becomes infrastructure.",
    detail: "Full-time coordination, 3 flagship builds per year, AI Adoption API expands to 30+ countries, SEA AI literacy curriculum released.",
  },
];

const WHY_US = [
  {
    label: "Community already exists.",
    text: "20+ active builders. 2 NGO partnerships shipped. 5M+ content views on AI literacy. Live open data API tracking 16 countries, used by researchers.",
  },
  {
    label: "Founder credibility.",
    text: "Build for Public is led by Fathy Rashad — speaker at Malaysia's Foreign Affairs Ministry and the IDFR Distinguished Lecture Series, featured on Bernama TV, RTM TV1, Era.fm, and Kosmo, MIT-collaborated AI researcher.",
  },
  {
    label: "Regional position.",
    text: "Embedded in Southeast Asia's builder networks: Buildclub MY, AI Tinkerers KL, Cursor MY, AI SEA, 500 AI Residency. A grant here funds a node in a working regional ecosystem.",
  },
  {
    label: "Open by default.",
    text: "Every artifact we ship is MIT-licensed and reusable. Funding us is funding infrastructure that any city in the region inherits.",
  },
];

const WHAT_YOU_GET = [
  {
    title: "Quarterly impact reports",
    body: "Projects shipped, NGOs served, builders activated, content reach. Public, so we cannot hide a bad quarter.",
    accent: "accent-blue",
  },
  {
    title: "Recognition",
    body: "On the site, in the manifesto signatory block, and in every shipped project's README. Or full anonymity — your choice.",
    accent: "accent-yellow",
  },
  {
    title: "Direct access to the work",
    body: "Invitations to community sessions, early access to flagship projects, optional input on the project fund's allocation.",
    accent: "accent-mint",
  },
  {
    title: "Co-authored research",
    body: "If your foundation publishes on AI inequality, public-interest AI infrastructure, or AI adoption in the Global South, we will co-author. Our open data API is the seed of this.",
    accent: "accent-yellow",
  },
];

const NOT_FUNDED = [
  "AI safety research. We respect that work. It is not what we do.",
  "A Malaysian ChatGPT competitor. We do not believe one is needed.",
  "Think-tank policy papers. We ship code and run community.",
  "A scaling-to-10-countries-by-2027 plan. We start small, ship well, and design the work to fork rather than expand by hiring.",
];

export default function FundersPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="pt-40 pb-16 px-6 border-b-2 border-black">
        <div className="max-w-3xl mx-auto">
          <div
            className="inline-flex items-center gap-2 mb-8 text-sm font-semibold text-black bg-white px-5 py-2 rounded-full border-2 border-black"
            style={{ boxShadow: "3px 3px 0px #1a1b1f" }}
          >
            OPEN TO FUNDERS
          </div>
          <h1 className="heading-display text-4xl sm:text-5xl text-black mb-8 max-w-2xl">
            Fund the public-interest layer of AI.
          </h1>
          <p className="text-lg text-black/60 max-w-2xl leading-relaxed mb-10">
            Five companies control 71% of the world&apos;s AI compute. The counterweight — open, public-interest, Southeast Asia-rooted — runs on volunteer time and a founder&apos;s savings. We are looking for funders who believe AI&apos;s benefits should not concentrate in five zip codes.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href={`mailto:${SITE.email}`} className="btn-pill btn-pill-filled text-base px-8 py-3">
              Email the founder
            </a>
            <a href="/manifesto" className="btn-pill btn-pill-outline text-base px-8 py-3">
              Read the manifesto
            </a>
          </div>
        </div>
      </section>

      {/* What funding enables */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto">
          <h2 className="heading-section text-black mb-3">What your support enables</h2>
          <p className="text-lg text-black/60 mb-10 leading-relaxed">
            Every level of funding has concrete outcomes. These are not aspirational. They follow directly from what the community is already doing.
          </p>

          <div className="space-y-4">
            {SCENARIOS.map((s) => (
              <div
                key={s.amount}
                className="card-flat p-6 sm:p-8 grid sm:grid-cols-[100px_1fr] gap-6 items-start"
              >
                <div className="flex-shrink-0">
                  <span
                    className="text-2xl font-bold text-clay"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {s.amount}
                  </span>
                </div>
                <div>
                  <h3
                    className="text-base font-semibold text-black mb-1"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {s.headline}
                  </h3>
                  <p className="text-sm text-black/60 leading-relaxed">{s.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm text-black/60 mt-6 pl-1">
            Scenarios are cumulative. Full breakdown and what each level enables in detail:{" "}
            <a href="/roadmap" className="text-clay hover:underline font-medium transition-colors">
              read the roadmap
            </a>.
          </p>
        </div>
      </section>

      {/* Why fund us */}
      <section className="section-padding pt-0">
        <div className="max-w-4xl mx-auto">
          <h2 className="heading-section text-black mb-3">
            Why fund us, not a bigger org
          </h2>
          <p className="text-lg text-black/60 mb-8 leading-relaxed">
            International AI-ethics organizations are well-funded and based in San Francisco, Brussels, or London. They produce good policy work. They do not have builders shipping code in Kuala Lumpur. We do.
          </p>
          <div className="card-flat p-8 sm:p-10">
            <div className="space-y-5">
              {WHY_US.map((item) => (
                <div key={item.label} className="flex gap-4">
                  <span className="text-clay flex-shrink-0 font-bold mt-0.5">+</span>
                  <p className="text-sm text-black/60 leading-relaxed">
                    <span className="text-black font-semibold">{item.label}</span>{" "}
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="section-padding pt-0">
        <div className="max-w-4xl mx-auto">
          <h2 className="heading-section text-black mb-3">What you get</h2>
          <p className="text-lg text-black/60 mb-10">Specific, not ceremonial.</p>
          <div className="grid sm:grid-cols-2 gap-5">
            {WHAT_YOU_GET.map((item) => (
              <div key={item.title} className={`card ${item.accent} p-6`}>
                <h4
                  className="text-base font-semibold text-black mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {item.title}
                </h4>
                <p className="text-sm text-black/60 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What this does NOT fund */}
      <section className="section-padding pt-0">
        <div className="max-w-4xl mx-auto">
          <h2 className="heading-section text-black mb-3">
            What this funding does not cover
          </h2>
          <p className="text-lg text-black/60 mb-8">
            Worth stating directly so you can decide if we are the right fit.
          </p>
          <div className="card-flat p-8 sm:p-10">
            <div className="space-y-4">
              {NOT_FUNDED.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <span className="text-black/50 font-bold flex-shrink-0 mt-0.5">✕</span>
                  <p className="text-sm text-black/60 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-black/60 mt-8 pt-6 border-t-2 border-black/20">
              If you are looking for any of the above, we will refer you to organizations doing those things well.
            </p>
          </div>
        </div>
      </section>

      {/* Get in touch */}
      <section className="section-padding pt-0 pb-24">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="heading-section text-black mb-4">Get in touch</h2>
          <p className="text-black/60 mb-1 leading-relaxed font-medium">
            Fathy Rashad
          </p>
          <p className="text-black/60 mb-8 leading-relaxed">
            <a href={`mailto:${SITE.email}`} className="text-clay hover:underline transition-colors">
              {SITE.email}
            </a>
          </p>
          <p className="text-sm text-black/60 mb-10 leading-relaxed max-w-lg mx-auto">
            For foundations or program officers: mention which area you are inquiring from. We respond within 48 hours and can send a grant proposal, references, financial documentation, and registration paperwork on request.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href={`mailto:${SITE.email}`} className="btn-pill btn-pill-filled text-base px-8 py-3">
              Email Rashad
            </a>
            <a
              href="https://cal.com/mfrashad"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill btn-pill-outline text-base px-8 py-3"
            >
              Schedule a 30-min call
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
