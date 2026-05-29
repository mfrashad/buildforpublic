import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Projects",
  description: "Open-source public-interest tech shipped by Build for Public.",
};

export default function ProjectsPage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "var(--v2-bg)", color: "var(--v2-text)" }}
    >
      <div className="text-center max-w-md">
        <p
          className="text-sm font-semibold tracking-widest uppercase mb-4"
          style={{ color: "var(--v2-coral)" }}
        >
          Build for Public
        </p>
        <h1
          className="text-3xl font-bold mb-4"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
        >
          Project case studies coming soon.
        </h1>
        <p className="mb-8 leading-relaxed" style={{ color: "var(--v2-muted)" }}>
          Full write-ups for each project are in the works. In the meantime, explore the projects on the home page.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-white"
          style={{ background: "var(--v2-coral)" }}
        >
          Back home
        </Link>
      </div>
    </main>
  );
}
