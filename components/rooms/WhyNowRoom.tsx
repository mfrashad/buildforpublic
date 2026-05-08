"use client";

import { useState } from "react";

const NOW_CARDS = [
  {
    bg: "var(--color-bp-yellow)",
    label: "AI compute is owned by five companies",
    body: "Amazon, Google, Meta, Microsoft, and Oracle control 71% of the world's cumulative AI compute, up from 63% eighteen months earlier. Any NGO or government that needs AI pays rent to this oligopoly.",
    source: "Epoch AI, 2025",
  },
  {
    bg: "var(--color-bp-blue)",
    label: "US gets 23× more AI investment than China",
    body: "US private AI investment reached $285.9 billion in 2025. Southeast Asia received a rounding error. The AI frontier is concentrated in a handful of zip codes. Everywhere else is structurally excluded.",
    source: "Stanford HAI 2026 AI Index",
  },
  {
    bg: "var(--color-bp-mint)",
    label: "Premium AI is widening the opportunity gap",
    body: "Workers, students, and founders with access to paid AI get near-expert tutoring, legal drafting, and code review on demand. Those on the free tier get a weaker product. High-income workers are already 21 percentage points more likely to use AI than low-income workers. The gap compounds.",
    source: "OECD 2026; Pew Research 2025",
  },
  {
    bg: "var(--color-bp-peach)",
    label: "The most powerful AI systems are getting less transparent",
    body: "The most capable AI systems are becoming less auditable as they become more powerful. Stanford HAI's Foundation Model Transparency Index dropped from 58 to 40 in a single year. Power is concentrating. The public's ability to scrutinize it is shrinking.",
    source: "Stanford HAI 2026 AI Index",
  },
];

const NEXT_CARDS = [
  {
    label: "The AI divide is becoming structural",
    body: "Communities with the lowest connectivity and fewest resources are being excluded from AI tools designed for the connected and English-literate. The projected $1 trillion AI GDP boost by 2030 will go to those already connected. Without deliberate counter-investment, exclusion becomes permanent.",
    source: "Tech Collective SEA, 2025",
  },
  {
    label: "AI is used on communities, not by them",
    body: "The AI Now Institute's 2025 report is direct: today's AI is not just being used by us. It is being used on us. Facial recognition systems misidentify Black and Asian faces 10 to 100 times more often than white faces. Automated hiring filters out applicants whose resumes don't match existing employees. The communities with the least power have the least recourse.",
    source: "AI Now Institute 2025; MIT Sloan",
  },
  {
    label: "NGOs are locked out of tools they cannot afford",
    body: "Governments and NGOs that want AI will buy from vendors with a sales team. Those vendors will not build for a food bank or a refugee legal aid clinic. They will sell a generic product at enterprise pricing. The organizations serving the most vulnerable people will be the last to benefit.",
    source: "",
  },
];

const BUILD_CARDS = [
  {
    label: "Open infrastructure anyone can use",
    body: "The OECD and the UN both concluded in 2024 that core AI components should be governed as public commons: open, interoperable, auditable. Open-source communities building MIT-licensed tools for NGOs are not ahead of their time — they are ahead of most governments in actually doing it.",
    source: "OECD.AI 2025; UN 2024",
  },
  {
    label: "A public record of the AI divide",
    body: "Data that does not exist cannot drive policy. We built the AI Adoption by Country API because no single source tracked this across 16 countries in a usable format. That data is now free. Any researcher, journalist, or NGO can use it. This is what public-interest AI infrastructure looks like in practice.",
    source: "",
  },
  {
    label: "AI literacy in the languages that need it most",
    body: "Hugging Face grew from 160,000 to 1.57 million generative AI model repositories in two years. 46% of Fortune 500 leaders prefer open models. The technology is there. What is missing is content explaining it in the languages of the people most affected. That content is what this community builds.",
    source: "Mozilla Foundation, 2024",
  },
];

export default function WhyNowRoom() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section
      className="section-padding band band-white"
    >
      <div className="max-w-5xl mx-auto">

        {/* Header — pauseai urgency pattern */}
        <div className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <p className="eyebrow mb-3">THE NUMBERS DON&apos;T LIE</p>
            <h2
              className="heading-section text-black"
              style={{ fontFamily: "var(--font-display)" }}
            >
              AI is concentrating faster than any technology in history.
            </h2>
            <p className="text-lg text-black/60 mt-2 max-w-xl leading-relaxed">
              The window to build the public alternative is closing. All of this data is from 2024–2025.
            </p>
          </div>
          <a
            href="/why-now"
            className="text-sm font-bold text-black hover:underline underline-offset-4 flex-shrink-0"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Read the full case →
          </a>
        </div>

        {/* What is happening right now */}
        <p className="eyebrow mb-5">WHAT IS HAPPENING RIGHT NOW</p>
        <div className="grid sm:grid-cols-2 gap-5 mb-14">
          {NOW_CARDS.map((card) => (
            <div
              key={card.label}
              className="p-6"
              style={{
                background: card.bg,
                border: "2px solid #000",
                boxShadow: "var(--shadow-hard-sm)",
              }}
            >
              <h4
                className="text-base text-black mb-3"
                style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
              >
                {card.label}
              </h4>
              <p className="text-sm text-black/70 leading-relaxed mb-4">{card.body}</p>
              {card.source && (
                <p className="text-xs text-black/50 font-medium">{card.source}</p>
              )}
            </div>
          ))}
        </div>

        {/* What comes next + What we can still build — blur expand */}
        <div className="relative">
          <div
            className="overflow-hidden transition-[max-height] duration-500"
            style={{ maxHeight: expanded ? "4000px" : "240px" }}
          >
            <p className="eyebrow mb-5">WHAT COMES NEXT</p>
            <div className="space-y-5 mb-14">
              {NEXT_CARDS.map((card) => (
                <div
                  key={card.label}
                  className="p-6 sm:p-8"
                  style={{ border: "2px solid #000", boxShadow: "var(--shadow-hard)" }}
                >
                  <h4
                    className="text-base text-black mb-3"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
                  >
                    {card.label}
                  </h4>
                  <p className="text-sm text-black/70 leading-relaxed mb-3">{card.body}</p>
                  {card.source && (
                    <p className="text-xs text-black/50 font-medium">{card.source}</p>
                  )}
                </div>
              ))}
            </div>

            <p className="eyebrow mb-5">WHAT WE CAN STILL BUILD</p>
            <div className="grid sm:grid-cols-3 gap-5">
              {BUILD_CARDS.map((card) => (
                <div
                  key={card.label}
                  className="p-6"
                  style={{
                    background: "var(--color-bp-mint)",
                    border: "2px solid #000",
                    boxShadow: "var(--shadow-hard-sm)",
                  }}
                >
                  <h4
                    className="text-base text-black mb-3"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
                  >
                    {card.label}
                  </h4>
                  <p className="text-sm text-black/70 leading-relaxed mb-3">{card.body}</p>
                  {card.source && (
                    <p className="text-xs text-black/50 font-medium">{card.source}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {!expanded && (
            <div
              className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end pt-32 pb-2"
              style={{ background: "linear-gradient(to bottom, transparent, #fff 70%)" }}
            >
              <button
                onClick={() => setExpanded(true)}
                className="btn-pill btn-pill-filled text-sm px-6 py-2"
              >
                Read more ↓
              </button>
            </div>
          )}
        </div>

        {/* Urgency closer — pauseai one-liner */}
        <p
          className="text-center text-xl font-bold mt-16 pt-8"
          style={{
            borderTop: "3px solid #000",
            fontFamily: "var(--font-display)",
          }}
        >
          We need a public stack. We need it now. The window is closing.
        </p>

      </div>
    </section>
  );
}
