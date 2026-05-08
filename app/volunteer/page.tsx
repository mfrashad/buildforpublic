import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ROLE_DETAILS, VOLUNTEER_EXPECTATIONS, SITE } from "@/lib/constants";
import VolunteerForm from "./VolunteerForm";

export const metadata: Metadata = {
  title: "Volunteer with AI for Good",
  description:
    "Join AI for Good as a Builder, Advocate, or Organizer. Ship open-source AI tools, create content, or run community events — for social good in Southeast Asia.",
};

const ACCENT_COLORS: Record<string, string> = {
  "accent-sky": "text-sky",
  "accent-clay": "text-clay",
  "accent-olive": "text-olive",
  "accent-fig": "text-fig",
};

export default function VolunteerPage() {
  return (
    <main>
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-40 pb-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-8 text-sm font-medium text-text-secondary bg-surface px-5 py-2 rounded-full border border-border">
            OPEN APPLICATIONS
          </div>
          <h1
            className="heading-display text-5xl sm:text-6xl text-text-primary mb-6"
          >
            Volunteer with AI for Good
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            We build open-source AI tools for NGOs, create AI literacy content,
            and run builder events across Southeast Asia. Everyone here is a volunteer.
          </p>
          <a
            href="#apply"
            className="btn-pill btn-pill-clay text-base px-8 py-3 inline-block"
          >
            Apply now →
          </a>
        </div>
      </section>

      {/* ── About callout ── */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="card-flat p-8">
            <h2
              className="text-xl text-text-primary mb-4"
              style={{ fontFamily: "var(--font-serif)", fontWeight: 600 }}
            >
              About AI for Good
            </h2>
            <p className="text-text-secondary leading-relaxed">
              AI is being built to maximize returns for shareholders. The organizations
              that could most use it — food banks, refugee legal aid clinics, rural
              schools — are the ones no company will build for.
            </p>
            <p className="text-text-secondary leading-relaxed mt-3">
              AI for Good is a volunteer community. We build open-source tools for
              NGOs, make AI accessible in multiple languages, and run community events.
              No one gets paid.
            </p>
          </div>
        </div>
      </section>

      {/* ── Open roles ── */}
      <section className="section-padding pt-0">
        <div className="max-w-4xl mx-auto">
          <h2 className="heading-section text-text-primary mb-6">Open positions</h2>

          {/* Sub-headline */}
          <div className="mb-12 pl-6 border-l-4 border-clay">
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
              The skill the market pays you to use elsewhere is the scarcest
              resource in this community. A few hours a week compounds.
              A sabbatical sets the direction.
            </p>
          </div>

          <div className="space-y-6">
            {ROLE_DETAILS.map((role) => (
              <div
                key={role.id}
                className={`card p-8 ${role.accentClass}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h3
                      className="text-2xl text-text-primary mb-1"
                      style={{ fontFamily: "var(--font-serif)", fontWeight: 600 }}
                    >
                      {role.title}
                    </h3>
                    <p className={`text-sm font-medium ${ACCENT_COLORS[role.accentClass] ?? "text-clay"}`}>
                      {role.tagline}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-text-secondary bg-surface-raised px-3 py-1.5 rounded-full flex-shrink-0">
                    {role.commitment}
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 mt-6">
                  <div>
                    <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
                      What you&apos;ll do
                    </p>
                    <ul className="space-y-2">
                      {role.responsibilities.map((r, i) => (
                        <li
                          key={i}
                          className="text-sm text-text-secondary leading-relaxed flex gap-2"
                        >
                          <span className="text-text-secondary/40 flex-shrink-0 mt-0.5">+</span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
                      Who fits
                    </p>
                    <ul className="space-y-2">
                      {role.whoFits.map((w, i) => (
                        <li
                          key={i}
                          className="text-sm text-text-secondary leading-relaxed flex gap-2"
                        >
                          <span className="text-text-secondary/40 flex-shrink-0 mt-0.5">+</span>
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who we're looking for ── */}
      <section className="section-padding pt-0">
        <div className="max-w-4xl mx-auto">
          <h2 className="heading-section text-text-primary mb-3">
            Who we&apos;re looking for
          </h2>
          <p className="text-lg text-text-secondary mb-12">
            Beyond role-specific skills, we expect this from every volunteer.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VOLUNTEER_EXPECTATIONS.map((exp) => (
              <div key={exp.title} className="card p-6">
                <div className="text-2xl mb-3">{exp.icon}</div>
                <h4
                  className="text-base text-text-primary mb-2"
                  style={{ fontFamily: "var(--font-serif)", fontWeight: 600 }}
                >
                  {exp.title}
                </h4>
                <p className="text-sm text-text-secondary leading-relaxed">{exp.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Application form ── */}
      <section id="apply" className="section-padding pt-0">
        <div className="max-w-2xl mx-auto">
          <h2 className="heading-section text-text-primary mb-3">Apply</h2>
          <p className="text-lg text-text-secondary mb-12">
            Applications are reviewed on a rolling basis. We aim to reply within
            1–2 weeks.
          </p>
          <VolunteerForm />
          <p className="text-sm text-text-secondary mt-8 text-center">
            Questions?{" "}
            <a
              href={`mailto:${SITE.email}`}
              className="text-clay hover:text-clay-hover transition-colors"
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
