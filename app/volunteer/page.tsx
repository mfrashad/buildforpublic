import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SITE } from "@/lib/constants";
import VolunteerForm from "./VolunteerForm";
import MemberJoinButton from "./MemberJoinButton";

export const metadata: Metadata = {
  title: "Join Build for Public",
  description:
    "Two ways to join Build for Public: become a member instantly with Google, or apply as a volunteer to work on NGO projects and lead the community.",
};

const MEMBER_PERKS = [
  "Attend monthly build events in KL",
  "Contribute to open-source projects",
  "Suggest and vote on project ideas",
  "Build your own tools and post them on the board",
  "Connect with builders and changemakers across SEA",
];

const CORE_MEMBER_PERKS = [
  "Join a department: Events, Outreach, Content, Finance, or Tech",
  "Lead as a Director or contribute as an Officer",
  "Work directly with NGOs on commissioned builds",
  "Run events and onboard new members",
  "Shape how the community grows",
];


export default function JoinPage() {
  return (
    <main>
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-40 pb-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-8 text-sm font-medium text-black/60 bg-surface px-5 py-2 rounded-full border border-black">
            OPEN TO ALL
          </div>
          <h1 className="heading-display text-5xl sm:text-6xl text-black mb-6">
            Two ways to join.
          </h1>
          <p className="text-lg text-black/60 max-w-xl mx-auto leading-relaxed">
            Everyone is welcome. How deep you go is up to you.
          </p>
        </div>
      </section>

      {/* ── Two-path cards ── */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-6">

          {/* Path A — Member */}
          <div className="card overflow-hidden flex flex-col">
            <div className="h-2 w-full border-b-2 border-black" style={{ background: "#fff200" }} />
            <div className="p-8 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-2">
                <h2
                  className="text-2xl text-black"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
                >
                  Member
                </h2>
                <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 border-2 border-black rounded-full bg-white">
                  Instant
                </span>
              </div>
              <p className="text-sm text-black/60 mb-6 leading-relaxed">
                Anyone can join. No application, no review, no vetting.
                Just show up and build.
              </p>

              <ul className="space-y-2.5 mb-8 flex-1">
                {MEMBER_PERKS.map((perk) => (
                  <li key={perk} className="flex gap-2.5 text-sm text-black/70">
                    <span className="text-black font-bold flex-shrink-0 mt-0.5">+</span>
                    {perk}
                  </li>
                ))}
              </ul>

              <MemberJoinButton />
              <p className="text-xs text-black/40 text-center mt-3">
                Sign in with Google via Clerk. No password needed.
              </p>
            </div>
          </div>

          {/* Path B — Volunteer */}
          <div className="card overflow-hidden flex flex-col">
            <div className="h-2 w-full border-b-2 border-black bg-black" />
            <div className="p-8 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-2">
                <h2
                  className="text-2xl text-black"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
                >
                  Volunteer
                </h2>
                <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 border-2 border-black rounded-full">
                  Application
                </span>
              </div>
              <p className="text-sm text-black/60 mb-6 leading-relaxed">
                For those who want to go deeper — join the core team in a
                specific role across Events, Outreach, Content, Finance, or
                Tech. Vetted. 3–8 hrs/week.
              </p>

              <ul className="space-y-2.5 mb-8 flex-1">
                {CORE_MEMBER_PERKS.map((perk) => (
                  <li key={perk} className="flex gap-2.5 text-sm text-black/70">
                    <span className="text-black font-bold flex-shrink-0 mt-0.5">+</span>
                    {perk}
                  </li>
                ))}
              </ul>

              <a
                href="#apply"
                className="btn-pill btn-pill-filled w-full text-center block"
              >
                Apply as a volunteer →
              </a>
              <p className="text-xs text-black/40 text-center mt-3">
                We review applications within 1–2 weeks.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── Divider callout ── */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="card-flat p-6 sm:p-8 border-l-4 border-black">
            <p className="text-sm text-black/60 leading-relaxed">
              <span className="font-semibold text-black">Members</span> can attend events, contribute to open-source, and build their own tools.{" "}
              <span className="font-semibold text-black">Volunteers</span> are vetted and work directly with NGOs — they&apos;re the backbone of the community.
              A member can apply to become a volunteer at any time. Showing up consistently and shipping something is the strongest application signal.
            </p>
          </div>
        </div>
      </section>

      {/* ── Application form ── */}
      <section id="apply" className="section-padding pt-0 px-6 scroll-mt-20">
        <div className="max-w-2xl mx-auto">
          <h2 className="heading-section text-black mb-3">Volunteer application</h2>
          <p className="text-lg text-black/60 mb-12">
            Applications are reviewed on a rolling basis. We aim to reply within 1–2 weeks.
          </p>
          <VolunteerForm />
          <p className="text-sm text-black/60 mt-8 text-center">
            Questions?{" "}
            <a
              href={`mailto:${SITE.email}`}
              className="text-black/60 hover:underline transition-colors"
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
