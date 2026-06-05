import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SITE } from "@/lib/constants";
import RequestForm from "./RequestForm";

export const metadata: Metadata = {
  title: "Submit a Project Request — Build for Public",
  description:
    "Is your NGO, nonprofit, or community group facing a problem that technology could solve? Tell us about it. Build for Public matches your needs with volunteer builders who build free, open-source tools.",
};

export default function RequestPage() {
  return (
    <main>
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-40 pb-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-8 text-sm font-medium text-black/60 bg-surface px-5 py-2 rounded-full border border-black">
            FOR NGOS & COMMUNITY ORGANISATIONS
          </div>
          <h1 className="heading-display text-5xl sm:text-6xl text-black mb-6">
            Tell us your problem.
          </h1>
          <p className="text-lg text-black/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Describe a problem your community faces. We&apos;ll scope it with you
            and match it with a volunteer builder team. Free, open-source, built
            together.
          </p>
          <a
            href="#apply"
            className="btn-pill btn-pill-filled text-base px-8 py-3 inline-block"
          >
            Submit a request →
          </a>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="card-flat p-8">
            <h2
              className="text-xl text-black mb-6"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
            >
              How it works
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                {
                  step: "1",
                  title: "You describe the problem",
                  body: "No jargon, no tech specs needed. Just tell us what's hard, slow, or broken — and who it affects.",
                },
                {
                  step: "2",
                  title: "We scope it together",
                  body: "We schedule a 30-minute call to understand your needs and define the smallest useful first version.",
                },
                {
                  step: "3",
                  title: "We build it for free",
                  body: "Volunteer builders take on the project. You stay involved as a reviewer. We hand off the tool, code, and documentation.",
                },
              ].map(({ step, title, body }) => (
                <div key={step}>
                  <div
                    className="w-8 h-8 rounded-full bg-bp-yellow border-2 border-black flex items-center justify-center text-sm font-bold mb-3"
                    style={{ background: "#fff200" }}
                  >
                    {step}
                  </div>
                  <h3
                    className="text-base text-black mb-2"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
                  >
                    {title}
                  </h3>
                  <p className="text-sm text-black/60 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-black/10">
              <p className="text-sm text-black/60 leading-relaxed">
                <span className="text-black font-medium">Important to know:</span>{" "}
                Build for Public is volunteer-run. Timelines are best-effort, not guaranteed.
                We recommend building in the open (AGPL v3) — so the wider community can
                contribute to and improve your project — but keeping it private or closed is
                fine too. We&apos;ll need a point of contact for 1–2 short review calls during
                the build.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Form ── */}
      <section id="apply" className="section-padding pt-0 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="heading-section text-black mb-3">Submit a request</h2>
          <p className="text-lg text-black/60 mb-12">
            Takes about 10 minutes. We&apos;ll be in touch within 48 hours.
          </p>
          <RequestForm />
          <p className="text-sm text-black/60 mt-8 text-center">
            Questions?{" "}
            <a
              href={`mailto:${SITE.email}`}
              className="text-clay hover:underline transition-colors"
            >
              Email us
            </a>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
