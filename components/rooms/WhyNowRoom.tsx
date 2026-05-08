"use client";

import { useState } from "react";

const NOW_CARDS = [
  {
    accent: "accent-clay",
    label: "AI compute is owned by five companies",
    body: "Amazon, Google, Meta, Microsoft, and Oracle control 71% of the world's cumulative AI compute, up from 63% eighteen months earlier. Any NGO or government that needs AI pays rent to this oligopoly.",
    source: "Epoch AI, 2025",
  },
  {
    accent: "accent-sky",
    label: "US gets 23× more AI investment than China",
    body: "US private AI investment reached $285.9 billion in 2025. Southeast Asia received a rounding error. The AI frontier is concentrated in a handful of zip codes in San Francisco and Seattle. Everywhere else is structurally excluded.",
    source: "Stanford HAI 2026 AI Index",
  },
  {
    accent: "accent-olive",
    label: "Premium AI is widening the opportunity gap",
    body: "Free-tier AI is not the same product as paid. Workers, students, and founders with access to Claude Max or GPT-4 get near-expert tutoring, legal drafting, code review, and business strategy on demand. Those on the free tier get a weaker model with tighter limits. The gap compounds: better AI means better grades, stronger job applications, faster businesses. High-income workers are already 21 percentage points more likely to use AI than low-income workers.",
    source: "OECD 2026; Pew Research 2025",
  },
  {
    accent: "accent-fig",
    label: "The most powerful AI systems are getting less transparent",
    body: "The most capable AI systems are becoming less auditable as they become more powerful. Stanford HAI's Foundation Model Transparency Index dropped from 58 to 40 in a single year. Power is concentrating. The public's ability to scrutinize it is shrinking.",
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
    label: "Open infrastructure anyone can use",
    body: "The OECD and the UN both concluded in 2024 that core AI components should be governed as public commons: open, interoperable, auditable. The policy consensus exists. Open-source communities building MIT-licensed tools for NGOs are not ahead of their time. They are ahead of most governments in actually doing it.",
    source: "OECD.AI 2025; UN 2024",
  },
  {
    label: "A public record of the AI divide",
    body: "Data that does not exist cannot drive policy. We built the AI Adoption by Country API because no single source tracked this across 16 countries in a usable format. That data is now free. Any researcher, journalist, or NGO can use it. This is what public-interest AI infrastructure looks like in practice.",
    source: "",
  },
  {
    label: "AI literacy in the languages that need it most",
    body: "Hugging Face grew from 160,000 to 1.57 million generative AI model repositories in two years. 46% of Fortune 500 leaders prefer open models. The technology is there. What is missing is content explaining it in the languages of the people most affected by it. That content is what this community builds.",
    source: "Mozilla Foundation, 2024",
  },
];

export default function WhyNowRoom() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="section-padding border-t-2 border-b-2 border-border bg-surface">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <p className="font-mono text-xs text-text-tertiary tracking-wider mb-3">
              THE CASE FOR PUBLIC-INTEREST AI
            </p>
            <h2 className="heading-section text-text-primary">
              AI is concentrating power.
            </h2>
            <p className="text-lg text-text-secondary mt-2 max-w-xl leading-relaxed">
              All of this is already happening. The data is from 2024 and 2025.
            </p>
          </div>
          <a
            href="/why-now"
            className="text-sm font-medium text-clay hover:text-clay-hover transition-colors flex-shrink-0"
          >
            Read the full case →
          </a>
        </div>

        {/* What is happening right now — fully visible */}
        <h3 className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-5">
          What is happening right now
        </h3>
        <div className="grid sm:grid-cols-2 gap-5 mb-14">
          {NOW_CARDS.map((card) => (
            <div key={card.label} className={`card-flat ${card.accent} p-6`}>
              <h4
                className="text-base font-semibold text-text-primary mb-3"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {card.label}
              </h4>
              <p className="text-sm text-text-secondary leading-relaxed mb-4">{card.body}</p>
              {card.source && (
                <p className="text-xs text-text-tertiary font-medium">{card.source}</p>
              )}
            </div>
          ))}
        </div>

        {/* What comes next + What we can still build — single blur expand */}
        <div className="relative">
          <div
            className="overflow-hidden transition-[max-height] duration-500"
            style={{ maxHeight: expanded ? "4000px" : "240px" }}
          >
            <h3 className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-5">
              What comes next
            </h3>
            <div className="space-y-5 mb-14">
              {NEXT_CARDS.map((card) => (
                <div key={card.label} className="card accent-clay p-6 sm:p-8">
                  <h4
                    className="text-base font-semibold text-text-primary mb-3"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {card.label}
                  </h4>
                  <p className="text-sm text-text-secondary leading-relaxed mb-3">{card.body}</p>
                  {card.source && (
                    <p className="text-xs text-text-tertiary font-medium">{card.source}</p>
                  )}
                </div>
              ))}
            </div>

            <h3 className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-5">
              What we can still build
            </h3>
            <div className="grid sm:grid-cols-3 gap-5">
              {BUILD_CARDS.map((card) => (
                <div key={card.label} className="card accent-olive p-6">
                  <h4
                    className="text-base font-semibold text-text-primary mb-3"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {card.label}
                  </h4>
                  <p className="text-sm text-text-secondary leading-relaxed mb-3">{card.body}</p>
                  {card.source && (
                    <p className="text-xs text-text-tertiary font-medium">{card.source}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {!expanded && (
            <div
              className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end pt-32 pb-2"
              style={{ background: "linear-gradient(to bottom, transparent, var(--color-surface, #f5f3ee) 70%)" }}
            >
              <button
                onClick={() => setExpanded(true)}
                className="btn-pill btn-pill-outline text-sm px-6 py-2"
              >
                Read more ↓
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
