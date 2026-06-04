import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DirectoryBoard from "./DirectoryBoard";

export const metadata: Metadata = {
  title: "Projects Board — Build for Public",
  description:
    "Browse NGO requests, open project ideas to pick up, open-source projects to contribute to, and community builds. Build public-interest tech with Build for Public.",
};

export default function DirectoryPage() {
  return (
    <main>
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-40 pb-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-8 text-sm font-medium text-black/60 bg-surface px-5 py-2 rounded-full border border-black">
            OPEN PROJECTS
          </div>
          <h1 className="heading-display text-5xl sm:text-6xl text-black mb-6">
            Find something worth building.
          </h1>
          <p className="text-lg text-black/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            NGO requests that need builders. Project ideas you can pick up.
            Open-source work you can contribute to today.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="#board" className="btn-pill btn-pill-filled text-base px-8 py-3">
              Browse opportunities →
            </a>
            <a href="/request" className="btn-pill btn-pill-outline text-base px-8 py-3">
              Submit an NGO request
            </a>
          </div>
        </div>
      </section>

      {/* ── Board ── */}
      <section id="board" className="section-padding pt-0 px-6">
        <div className="max-w-5xl mx-auto">
          <DirectoryBoard />
        </div>
      </section>

      <Footer />
    </main>
  );
}
