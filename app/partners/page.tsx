import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SITE, HELPED_NGOS, FEATURED_PROJECT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Partner with Us — AI for Good Malaysia",
  description:
    "We build for organizations that markets ignore. Bring us a real operational problem and we will scope, build, and ship a solution — for free, openly, and in 4–8 weeks.",
};

const PRIORITY_CRITERIA = [
  "Serve communities the private market does not — B40 households, refugees, undocumented workers, smallholder farmers, people with disabilities, linguistic minorities.",
  "Have a real operational bottleneck — not a “we want a chatbot” hunch.",
  "Are willing to work in the open: the tool we build for you will be MIT-licensed, so the next NGO with a similar problem can fork it.",
  "Can commit one staff member to scope and test the build with us. We do not do drive-by software charity. The tool only works if your team co-owns it.",
];

const GOOD_PROBLEMS = [
  "Our team spends 12 hours a week manually translating intake forms.",
  "Our intake forms are English-only but our beneficiaries speak five languages.",
  "We have ten years of case files in PDFs and we cannot search them.",
  "We need to track every food bank in the country and there is no central registry.",
];

const BAD_PROBLEMS = [
  { problem: "Build us a full CRM", why: "Too broad, already exists — buy don't build." },
  { problem: "We want to fundraise using AI", why: "Not our remit; talk to a fundraising consultant." },
  { problem: "We need a one-off marketing video", why: "Not what builders are for." },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "You tell us about the problem.",
    body: "A 20-minute scoping call, no commitment. We will tell you honestly if a build is the right fix or if you should buy something instead.",
  },
  {
    step: "02",
    title: "We co-scope a v1.",
    body: "Together, in writing. We define what shipping looks like, what the smallest useful version is, and who from your team will work with us.",
  },
  {
    step: "03",
    title: "A team forms.",
    body: "From our volunteer community. Typically 2–4 builders, with a named lead engineer responsible for delivery.",
  },
  {
    step: "04",
    title: "We ship in 4–8 weeks.",
    body: "With your team testing and giving feedback throughout. The codebase is yours; we co-own the README.",
  },
  {
    step: "05",
    title: "We hand it over.",
    body: "Documentation, deployment, a training session for your team. Open source on GitHub under our org. Maintenance falls to you, but we stay reachable for fixes and v2 conversations.",
  },
];

export default function PartnersPage() {
  return (
    <main>
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-40 pb-16 px-6 border-b-2 border-border">
        <div className="max-w-3xl mx-auto">
          <div
            className="inline-flex items-center gap-2 mb-8 text-sm font-semibold text-text-primary bg-surface-raised px-5 py-2 rounded-full border-2 border-border"
            style={{ boxShadow: "3px 3px 0px #1a1b1f" }}
          >
            FOR NGOS &amp; PUBLIC-SECTOR ORGS
          </div>
          <h1 className="heading-display text-4xl sm:text-5xl text-text-primary mb-8 max-w-2xl">
            We build for organizations that markets ignore.
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl leading-relaxed mb-10">
            Your organization serves people no SaaS company will build for. You
            have a bottleneck AI could fix. Tell us. We scope, build, and ship
            for free.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href={`mailto:${SITE.email}`} className="btn-pill btn-pill-clay text-base px-8 py-3">
              Tell us about your problem
            </a>
            <a href="#shipped" className="btn-pill btn-pill-outline text-base px-8 py-3">
              See what we have built
            </a>
          </div>
        </div>
      </section>

      {/* ── Who we work with ── */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto">
          <h2 className="heading-section text-text-primary mb-3">Who we work with</h2>
          <p className="text-lg text-text-secondary mb-10 leading-relaxed">
            We work with NGOs, public-sector teams, and social enterprises in
            Malaysia and Southeast Asia. We have shipped for Pocket of Pink and
            are scoping work with food banks, refugee legal aid clinics, and
            government translation teams.
          </p>

          <div className="card-flat p-8 sm:p-10">
            <p className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-6">
              We prioritize partners who
            </p>
            <div className="space-y-4">
              {PRIORITY_CRITERIA.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <span className="text-clay font-bold flex-shrink-0 mt-0.5">+</span>
                  <p className="text-sm text-text-secondary leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── What good problems look like ── */}
      <section className="section-padding pt-0">
        <div className="max-w-4xl mx-auto">
          <h2 className="heading-section text-text-primary mb-3">
            What good problems look like
          </h2>
          <p className="text-lg text-text-secondary mb-10 leading-relaxed">
            The projects that work have a specific shape: a recurring cost, a
            clear scope, and a codebase another NGO can reuse.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            {/* Yes column */}
            <div className="card accent-olive p-6">
              <p className="text-xs font-semibold text-olive uppercase tracking-wider mb-5">
                Examples we would say yes to
              </p>
              <div className="space-y-4">
                {GOOD_PROBLEMS.map((p, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-olive font-bold flex-shrink-0 mt-0.5">✓</span>
                    <p className="text-sm text-text-secondary leading-relaxed italic">&ldquo;{p}&rdquo;</p>
                  </div>
                ))}
              </div>
            </div>

            {/* No column */}
            <div className="card accent-fig p-6">
              <p className="text-xs font-semibold text-fig uppercase tracking-wider mb-5">
                Examples we would say no to
              </p>
              <div className="space-y-4">
                {BAD_PROBLEMS.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-fig font-bold flex-shrink-0 mt-0.5">✕</span>
                    <div>
                      <p className="text-sm text-text-primary font-medium leading-snug mb-0.5">
                        &ldquo;{item.problem}&rdquo;
                      </p>
                      <p className="text-xs text-text-secondary leading-relaxed">{item.why}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="section-padding pt-0">
        <div className="max-w-4xl mx-auto">
          <h2 className="heading-section text-text-primary mb-3">How it works</h2>
          <p className="text-lg text-text-secondary mb-10">Five steps. No surprises.</p>

          <div className="space-y-4">
            {HOW_IT_WORKS.map((step) => (
              <div
                key={step.step}
                className="card-flat p-6 sm:p-8 grid sm:grid-cols-[64px_1fr] gap-6 items-start"
              >
                <div className="flex-shrink-0">
                  <span
                    className="text-3xl font-bold text-clay"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {step.step}
                  </span>
                </div>
                <div>
                  <h3
                    className="text-base font-semibold text-text-primary mb-2"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What we have shipped ── */}
      <section id="shipped" className="section-padding pt-0">
        <div className="max-w-4xl mx-auto">
          <h2 className="heading-section text-text-primary mb-3">What we have shipped</h2>
          <p className="text-lg text-text-secondary mb-10">Real partners, real outcomes.</p>

          <div className="space-y-5">
            {HELPED_NGOS.map((ngo) => (
              <div key={ngo.name} className="card accent-clay p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                  <div>
                    <span className="text-xs font-semibold text-clay uppercase tracking-wider block mb-2">
                      {ngo.badge}
                    </span>
                    <h3
                      className="text-xl text-text-primary"
                      style={{ fontFamily: "var(--font-serif)", fontWeight: 600 }}
                    >
                      {ngo.name}
                    </h3>
                  </div>
                  <a
                    href={ngo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-pill btn-pill-outline text-sm py-2 px-5 flex-shrink-0"
                  >
                    Visit Website →
                  </a>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">{ngo.description}</p>
              </div>
            ))}

            <div className="card accent-sky p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div>
                  <span className="text-xs font-semibold text-sky uppercase tracking-wider block mb-2">
                    OPEN DATA PROJECT
                  </span>
                  <h3
                    className="text-xl text-text-primary"
                    style={{ fontFamily: "var(--font-serif)", fontWeight: 600 }}
                  >
                    {FEATURED_PROJECT.title}
                  </h3>
                </div>
                <a
                  href={FEATURED_PROJECT.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill btn-pill-outline text-sm py-2 px-5 flex-shrink-0"
                >
                  Live API →
                </a>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                {FEATURED_PROJECT.description}
              </p>
            </div>

            <div className="card-flat p-6 sm:p-8 border-dashed text-center">
              <p className="text-text-secondary text-sm mb-2">
                More in active scoping.
              </p>
              <p className="text-text-tertiary text-sm">
                If you want to see in-progress work, ask.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Get in touch ── */}
      <section className="section-padding pt-0 pb-24">
        <div className="max-w-2xl mx-auto">
          <h2 className="heading-section text-text-primary mb-4">Get in touch</h2>
          <p className="text-lg text-text-secondary mb-8 leading-relaxed">
            Tell us briefly:
          </p>
          <div className="card-flat p-8 mb-10">
            <div className="space-y-3">
              {[
                "What your organization does and who you serve.",
                "The specific problem — one paragraph is enough.",
                "How much staff time it currently costs per week.",
                "Whether you have someone who could work with us for 4–8 weeks.",
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-clay font-bold flex-shrink-0 w-5 text-sm mt-0.5">
                    {i + 1}.
                  </span>
                  <p className="text-sm text-text-secondary leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={`mailto:${SITE.email}`} className="btn-pill btn-pill-clay text-base px-8 py-3">
              Email us
            </a>
          </div>
          <p className="text-sm text-text-secondary mt-6">
            We respond within a week. If we cannot take on the build ourselves,
            we will try to refer you to someone who can.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
