import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CommitteeSection from "./CommitteeSection";

export const metadata: Metadata = {
  title: "About — Build for Public",
  description:
    "Meet the founding team and committee behind Build for Public — a volunteer-run movement shipping open-source tech for NGOs and the public good across Southeast Asia.",
};

export default function AboutPage() {
  return (
    <main>
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-40 pb-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-8 text-sm font-medium text-black/60 bg-surface px-5 py-2 rounded-full border border-black">
            OUR COMMITTEE
          </div>
          <h1 className="heading-display text-5xl sm:text-6xl text-black mb-6">
            The founding team.
          </h1>
          <p className="text-lg text-black/60 max-w-2xl mx-auto mb-8 leading-relaxed">
            Build for Public is volunteer-run. This is the founding crew turning
            &quot;tech for public good&quot; into real things shipped for real NGOs —
            and we&apos;re still growing. Some seats are open. One of them might be yours.
          </p>
          <a href="/volunteer" className="btn-primary btn-primary-yellow inline-block">
            Join the team →
          </a>
        </div>
      </section>

      {/* ── Committee (dynamic) ── */}
      <section className="pb-24">
        <CommitteeSection />
      </section>

      <Footer />
    </main>
  );
}
