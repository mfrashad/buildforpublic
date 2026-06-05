import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SubmitForm from "./SubmitForm";

export const metadata: Metadata = {
  title: "Submit a Project — Build for Public",
  description:
    "Share your project with the Build for Public community. Post your open-source build on the Projects Board so others can contribute, fork, and build on it.",
};

export default function SubmitPage() {
  return (
    <main>
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-40 pb-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-8 text-sm font-medium text-black/60 bg-surface px-5 py-2 rounded-full border border-black">
            OPEN TO ALL MEMBERS
          </div>
          <h1 className="heading-display text-5xl sm:text-6xl text-black mb-6">
            Post your project.
          </h1>
          <p className="text-lg text-black/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Built something? Share it with the community. Community Builds appear on
            the Projects Board — no vetting required. If a Fellow endorses it,
            it becomes an Official BFP project.
          </p>
        </div>
      </section>

      {/* ── Form ── */}
      <section className="section-padding pt-0 px-6">
        <div className="max-w-2xl mx-auto">
          <SubmitForm />
          <p className="text-sm text-black/40 mt-8 text-center">
            Community Builds are auto-published. No review needed.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
