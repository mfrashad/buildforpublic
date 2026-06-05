import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MemberDirectory from "./MemberDirectory";
import Events from "@/app/components/sections/Events";

export const metadata: Metadata = {
  title: "Community — Build for Public",
  description:
    "Meet the builders, advocates, researchers, and organizers of Build for Public — open-source tech for the public good, built by volunteers across Southeast Asia.",
};

export default function CommunityPage() {
  return (
    <main>
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-40 pb-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-8 text-sm font-medium text-black/60 bg-surface px-5 py-2 rounded-full border border-black">
            COMMUNITY DIRECTORY
          </div>
          <h1 className="heading-display text-5xl sm:text-6xl text-black mb-6">
            The builders.
          </h1>
          <p className="text-lg text-black/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Developers, designers, researchers, and advocates from across Southeast Asia
            building tech for the public good. Everyone here is a volunteer.
          </p>
          <a href="/join" className="btn-primary btn-primary-yellow inline-block">
            Join the community →
          </a>
        </div>
      </section>

      {/* ── Next event ── */}
      <Events noBand />

      {/* ── Directory ── */}
      <section className="section-padding px-6">
        <div className="max-w-6xl mx-auto">
          <MemberDirectory />
        </div>
      </section>

      <Footer />
    </main>
  );
}
