import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MANIFESTO_CLAIMS } from "@/lib/constants";

const COMMITMENTS = [
  {
    title: "Open by Default",
    body: "We encourage our work to be open-source. Public knowledge compounds when it's shared.",
  },
  {
    title: "Impact over Profit",
    body: "We optimize for public interest, transparency, and accessibility over private capture.",
  },
  {
    title: "Community-Driven",
    body: "We build with the people who need the tools, not just for them.",
  },
];

export default function ManifestoPage() {
  return (
    <main>
      <Navbar />

      {/* Header */}
      <section className="pt-40 pb-16 px-6 border-b-2 border-black">
        <div className="max-w-3xl mx-auto">
          <p className="font-mono text-xs text-black/50 mb-6 tracking-wider">
            Version 2.0 — Published May 2026
          </p>
          <h1 className="heading-display text-4xl sm:text-5xl text-black mb-6">
            What we believe. Why we exist.
          </h1>
          <p className="text-lg text-black/60 leading-relaxed max-w-2xl">
            This document states what Build for Public believes and why. It will be updated as the evidence changes.
          </p>
        </div>
      </section>

      {/* Claims */}
      <section className="section-padding">
        <div className="max-w-3xl mx-auto space-y-6">
          {MANIFESTO_CLAIMS.map((item) => (
            <div key={item.n} className="card-flat p-6 sm:p-10">
              <span
                className="text-5xl font-bold text-clay/15 block mb-4 leading-none"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {item.n}
              </span>
              <p
                className="text-xl sm:text-2xl text-black leading-snug mb-5"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                {item.title}
              </p>
              <p className="text-base text-black/70 leading-relaxed" style={{ fontFamily: "var(--font-sans)" }}>
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Commitment */}
      <section className="section-padding pt-0 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="card-flat p-6 sm:p-10">
            <h2
              className="text-xl sm:text-2xl text-black leading-snug mb-8"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
            >
              Our Commitment
            </h2>
            <div className="space-y-6">
              {COMMITMENTS.map((c) => (
                <div key={c.title} className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-black mt-2.5 flex-shrink-0" />
                  <p className="text-base text-black/70 leading-relaxed" style={{ fontFamily: "var(--font-sans)" }}>
                    <span className="font-semibold text-black">{c.title}:</span>{" "}
                    {c.body}
                  </p>
                </div>
              ))}
            </div>
            <p
              className="mt-10 text-xl sm:text-2xl text-black font-bold leading-snug"
              style={{ fontFamily: "var(--font-display)" }}
            >
              We are not waiting for the future to be handed to us. We are building it.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding pt-0 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-section text-black mb-4">Come build with us.</h2>
          <p className="text-lg text-black/60 mb-8 leading-relaxed max-w-xl">
            If this resonates, show up. We meet weekly, build in public, and keep everything open.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://join.slack.com/t/buildforpublic/shared_invite/TODO"
              className="btn-primary btn-primary-yellow"
            >
              Join the community
            </a>
            <a
              href="https://join.slack.com/t/buildforpublic/shared_invite/TODO"
              className="btn-pill btn-pill-outline px-8 py-3 text-base"
            >
              Volunteer →
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
