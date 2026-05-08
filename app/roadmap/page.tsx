import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Roadmap — AI for Good Malaysia",
  description:
    "What AI for Good Malaysia is today and what becomes possible at each level of support. Scenario model from bootstrapped to infrastructure.",
};

const SCENARIOS = [
  {
    amount: "$10,000",
    headline: "Community infrastructure becomes sustainable.",
    enables: [
      "Consistent biweekly builder sessions with a structured NGO problem pipeline.",
      "The founder focuses on scoping real problems instead of also running logistics.",
      "2 to 3 NGO projects scoped and started per quarter.",
      "A proper onboarding process so new volunteers can contribute in week one.",
    ],
  },
  {
    amount: "$25,000",
    headline: "The first flagship project ships with real resources.",
    enables: [
      "A design budget for the NGO project — so it ships as something people will actually use.",
      "Paid staff time from the NGO partner, so they co-own the build instead of receiving it.",
      "Documentation and deployment guide so any city can fork and adapt the tool.",
      "One fully documented open-source flagship per year.",
    ],
  },
  {
    amount: "$50,000",
    headline: "The community doubles.",
    enables: [
      "A dedicated community organizer on a part-time contract.",
      "Regular in-person events in 2 to 3 cities: Kuala Lumpur, Singapore, and one more.",
      "5 or more active projects running simultaneously.",
      "Content program scales to 10M views.",
    ],
  },
  {
    amount: "$100,000",
    headline: "This becomes infrastructure.",
    enables: [
      "Full-time coordination — the founder stops doing four jobs at once.",
      "3 flagship open-source builds per year, each fully documented and reusable.",
      "The AI Adoption API expands to 30 or more countries.",
      "A Southeast Asia AI literacy curriculum, free and open, in English and Bahasa Malaysia.",
      "Other cities can fork the entire model — community structure, project templates, NGO playbook.",
    ],
  },
];

const TODAY_ITEMS = [
  "20+ active builders contributing code and content.",
  "2 NGO partnerships — one shipped (Pocket of Pink), one in active scoping.",
  "AI Adoption by Country API — 16 countries, MIT-licensed, used by researchers.",
  "5M+ views of AI literacy content in English and Bahasa Malaysia.",
  "Active communities in Kuala Lumpur, Singapore, and online.",
  "20+ speaking engagements including Malaysia's Foreign Affairs Ministry (IDFR) and Yayasan Peneraju.",
];

export default function RoadmapPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="pt-40 pb-16 px-6 border-b-2 border-border">
        <div className="max-w-3xl mx-auto">
          <div
            className="inline-flex items-center gap-2 mb-8 text-sm font-semibold text-text-primary bg-surface-raised px-5 py-2 rounded-full border-2 border-border"
            style={{ boxShadow: "3px 3px 0px #1a1b1f" }}
          >
            COMMUNITY ROADMAP
          </div>
          <h1 className="heading-display text-4xl sm:text-5xl text-text-primary mb-6 max-w-2xl">
            What this community is.<br />
            <span className="text-clay">What it can become.</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl leading-relaxed">
            This page is honest about where we are and direct about what different levels of support make possible. No projections without a basis. No inflated targets.
          </p>
        </div>
      </section>

      {/* Today */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold text-text-tertiary uppercase tracking-widest mb-4">
            Today — bootstrapped
          </p>
          <h2 className="heading-section text-text-primary mb-4">
            Everything you see was built in the gaps.
          </h2>
          <p className="text-lg text-text-secondary mb-10 leading-relaxed">
            AI for Good Malaysia is a volunteer community. The founder is doing ops, community management, and technical work simultaneously. That is the constraint. It is also the proof that the model works before it has resources.
          </p>
          <div className="card-flat p-8 sm:p-10">
            <div className="space-y-4">
              {TODAY_ITEMS.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <span className="text-clay font-bold flex-shrink-0 mt-0.5">+</span>
                  <p className="text-sm text-text-secondary leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Scenarios */}
      <section className="section-padding pt-0">
        <div className="max-w-4xl mx-auto">
          <h2 className="heading-section text-text-primary mb-3">What support enables</h2>
          <p className="text-lg text-text-secondary mb-10 leading-relaxed">
            Each level below describes what becomes possible with that level of funding. Read each as an outcome, not a budget line.
          </p>

          <div className="space-y-5">
            {SCENARIOS.map((s) => (
              <div key={s.amount} className="card accent-cactus p-6 sm:p-10">
                <div className="flex flex-wrap items-baseline gap-4 mb-4">
                  <span
                    className="text-4xl font-bold text-clay"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {s.amount}
                  </span>
                  <span
                    className="text-lg font-semibold text-text-primary"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {s.headline}
                  </span>
                </div>
                <div className="space-y-3">
                  {s.enables.map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <span className="text-cactus font-bold flex-shrink-0 mt-0.5 text-sm">→</span>
                      <p className="text-sm text-text-secondary leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Constraint note */}
      <section className="section-padding pt-0">
        <div className="max-w-4xl mx-auto">
          <div className="card-flat p-8 sm:p-10 border-l-4 border-clay">
            <p className="text-sm font-semibold text-text-tertiary uppercase tracking-widest mb-4">
              A note on constraints
            </p>
            <p className="text-base text-text-secondary leading-relaxed mb-4">
              These scenarios are cumulative. $25,000 includes everything $10,000 enables. $100,000 includes all of it.
            </p>
            <p className="text-base text-text-secondary leading-relaxed">
              The community is doing useful work now. Funding changes the rate and scale. The mission exists with or without it.
            </p>
          </div>
        </div>
      </section>

      {/* CTA to funders */}
      <section className="section-padding pt-0 pb-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="heading-section text-text-primary mb-4">Want to support this?</h2>
          <p className="text-lg text-text-secondary mb-8 leading-relaxed max-w-xl mx-auto">
            The funders page has the full context: what we are raising, why, and what you get in return.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="/funders" className="btn-pill btn-pill-clay px-8 py-3 text-base">
              Read the funders page
            </a>
            <a href="/act" className="btn-pill btn-pill-outline px-8 py-3 text-base">
              Volunteer instead →
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
