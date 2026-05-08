import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Why This Matters Now — AI for Good Malaysia",
  description:
    "Five companies control 71% of global AI compute. 93% of the world's languages are invisible to AI training data. The window to build public-interest AI infrastructure is closing.",
};

const NOW_CARDS = [
  {
    accent: "accent-clay",
    label: "AI compute is owned by five companies",
    body: "Amazon, Google, Meta, Microsoft, and Oracle control 71% of the world's cumulative AI compute, up from 63% eighteen months earlier. Their combined capital expenditure for 2026 exceeds $660 billion. Any community, NGO, or government that needs AI pays rent to this oligopoly.",
    source: "Epoch AI, 2025",
  },
  {
    accent: "accent-sky",
    label: "The US gets 23 times more AI investment than China",
    body: "US private AI investment reached $285.9 billion in 2025. China received $13.3 billion. Southeast Asia received a rounding error. The AI frontier is not a global phenomenon. It is concentrated in a handful of zip codes in San Francisco and Seattle. Everywhere else is structurally excluded.",
    source: "Stanford HAI 2026 AI Index",
  },
  {
    accent: "accent-olive",
    label: "93% of the world's languages are invisible to AI",
    body: "Only 7% of the world's 7,000 languages appear in published online material. English dominates AI training data at 30%. Malay, Bahasa Indonesia, Tamil, and the languages of Malaysia's indigenous communities are statistical noise. AI systems built on this data will fail anyone who does not speak English. Not as a bug. As an architectural consequence.",
    source: "Nature, 2025",
  },
  {
    accent: "accent-fig",
    label: "The most powerful AI systems are getting less transparent",
    body: "Stanford HAI's Foundation Model Transparency Index dropped from 58 to 40 in a single year. The most capable AI systems are becoming less auditable as they become more powerful. Power is concentrating. The public's ability to scrutinize it is shrinking.",
    source: "Stanford HAI 2026 AI Index",
  },
];

const NEXT_CARDS = [
  {
    label: "Southeast Asia's infrastructure gap becomes permanent",
    body: "Rural areas across Southeast Asia average 55% internet penetration versus 90% in major cities. Only 30% of rural schools have reliable high-speed internet versus 85% of urban schools. AI tools designed for the connected and English-literate will deepen these gaps unless communities actively counter them. The projected $1 trillion AI GDP boost to the region by 2030 will go to those already connected.",
    source: "Tech Collective SEA, 2025",
  },
  {
    label: "AI is used on communities, not by them",
    body: "The AI Now Institute's 2025 report is direct: today's AI is not just being used by us. It is being used on us. Facial recognition systems misidentify Black and Asian faces 10 to 100 times more often than white faces. Automated hiring filters out applicants whose resumes do not match patterns from existing employees. The communities with the least power have the least recourse.",
    source: "AI Now Institute 2025; MIT Sloan",
  },
  {
    label: "NGOs are locked out of tools they cannot afford",
    body: "Governments and NGOs that want AI will buy from vendors with a sales team. Those vendors will not build for a Malaysian food bank or a Philippine refugee legal aid clinic. They will sell a generic product at enterprise pricing. The organizations serving the most vulnerable people will be the last to benefit.",
    source: "",
  },
];

const BUILD_CARDS = [
  {
    accent: "accent-olive",
    label: "Open infrastructure anyone can use",
    body: "The OECD and the UN both concluded in 2024 that core AI components should be governed as public commons: open, interoperable, auditable. The policy consensus exists. Open-source communities building MIT-licensed tools for NGOs are not ahead of their time. They are ahead of most governments in actually doing it.",
    source: "OECD.AI 2025; UN 2024",
  },
  {
    accent: "accent-olive",
    label: "A public record of the AI divide",
    body: "Data that does not exist cannot drive policy. We built the AI Adoption by Country API because no single source tracked this across 16 countries in a usable format. That data is now free. Any researcher, journalist, or NGO can use it. This is what public-interest AI infrastructure looks like in practice.",
    source: "",
  },
  {
    accent: "accent-olive",
    label: "AI literacy in the languages that need it most",
    body: "Hugging Face grew from 160,000 to 1.57 million generative AI model repositories in two years. 46% of Fortune 500 leaders prefer open models. The technology is there. What is missing is content explaining it in the languages of the people most affected by it. That content is what this community builds.",
    source: "Mozilla Foundation, 2024",
  },
];

const CTA_CARDS = [
  { label: "Build something", sub: "Pick your first action", href: "/act" },
  { label: "Bring us a problem", sub: "For NGOs and public-sector orgs", href: "/partners" },
  { label: "Support this work", sub: "For funders and foundations", href: "/funders" },
];

export default function WhyNowPage() {
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
            THE CASE FOR PUBLIC-INTEREST AI
          </div>
          <h1 className="heading-display text-4xl sm:text-5xl text-text-primary mb-6 max-w-2xl">
            AI is concentrating power.{" "}
            <span className="text-clay">The window to counter this is now.</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl leading-relaxed">
            All of this is already happening. The data below is from 2024 and 2025.
          </p>
        </div>
      </section>

      {/* Section 1 — Now */}
      <section className="section-padding">
        <div className="max-w-5xl mx-auto">
          <h2 className="heading-section text-text-primary mb-3">What is happening right now</h2>
          <p className="text-lg text-text-secondary mb-10 leading-relaxed">
            Four sourced facts on who controls AI and who it serves.
          </p>
          <div className="grid sm:grid-cols-2 gap-5">
            {NOW_CARDS.map((card) => (
              <div key={card.label} className={`card-flat ${card.accent} p-6`}>
                <h3
                  className="text-base font-semibold text-text-primary mb-3"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {card.label}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">{card.body}</p>
                {card.source && (
                  <p className="text-xs text-text-tertiary font-medium">{card.source}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2 — What comes next */}
      <section className="section-padding pt-0">
        <div className="max-w-5xl mx-auto">
          <h2 className="heading-section text-text-primary mb-3">What comes next</h2>
          <p className="text-lg text-text-secondary mb-10 leading-relaxed">
            These follow directly from the trends above.
          </p>
          <div className="space-y-5">
            {NEXT_CARDS.map((card) => (
              <div key={card.label} className="card accent-clay p-6 sm:p-8">
                <h3
                  className="text-base font-semibold text-text-primary mb-3"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {card.label}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-3">{card.body}</p>
                {card.source && (
                  <p className="text-xs text-text-tertiary font-medium">{card.source}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 — What we can still build */}
      <section className="section-padding pt-0">
        <div className="max-w-5xl mx-auto">
          <h2 className="heading-section text-text-primary mb-3">What we can still build</h2>
          <p className="text-lg text-text-secondary mb-10 leading-relaxed">
            Each problem above has a direct counter: builders and content creators working in public, releasing everything as open-source code.
          </p>
          <div className="grid sm:grid-cols-3 gap-5">
            {BUILD_CARDS.map((card) => (
              <div key={card.label} className={`card ${card.accent} p-6`}>
                <h3
                  className="text-base font-semibold text-text-primary mb-3"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {card.label}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-3">{card.body}</p>
                {card.source && (
                  <p className="text-xs text-text-tertiary font-medium">{card.source}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA row */}
      <section className="section-padding pt-0 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="divider mb-14" />
          <div className="grid sm:grid-cols-3 gap-5">
            {CTA_CARDS.map((card) => (
              <a
                key={card.label}
                href={card.href}
                className="card-flat p-6 hover:bg-surface transition-colors group"
              >
                <h4
                  className="text-base font-semibold text-text-primary mb-1 group-hover:text-clay transition-colors"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {card.label} →
                </h4>
                <p className="text-sm text-text-secondary">{card.sub}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
