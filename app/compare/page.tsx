import type { Metadata } from "next";
import { VARIANTS } from "@/lib/landing-variants";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Compare Variants — Build for Public",
  robots: { index: false },
};

const BAND_COLORS: Record<string, string> = {
  v1: "var(--color-bp-yellow)",
  v2: "var(--color-bp-blue)",
  v3: "var(--color-bp-mint)",
  v4: "var(--color-bp-peach)",
};

const VARIANT_ROUTES: Record<string, string> = {
  v1: "/",
  v2: "/v2",
  v3: "/v3",
  v4: "/v4",
};

export default function Compare() {
  return (
    <main>
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div
          className="px-6 py-12 text-center"
          style={{ borderBottom: "3px solid #000" }}
        >
          <p className="eyebrow mb-3">VARIANT COMPARISON</p>
          <h1
            className="text-4xl md:text-5xl mb-4"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              lineHeight: 1.05,
            }}
          >
            Four ways to open the same argument.
          </h1>
          <p
            className="text-lg text-black/60 max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Same initiative, same room sequence — four different rhetorical entries.
            Pick the one that lands.
          </p>
        </div>

        {/* Variant blocks */}
        {VARIANTS.map((v) => (
          <div
            key={v.key}
            className="px-6 py-20"
            style={{
              background: BAND_COLORS[v.key],
              borderBottom: "3px solid #000",
            }}
          >
            <div className="max-w-4xl mx-auto">
              <p className="eyebrow mb-4">{v.voice}</p>
              <h2
                className="text-4xl md:text-5xl lg:text-6xl mb-6 max-w-3xl"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  lineHeight: 1.0,
                  letterSpacing: "-0.02em",
                }}
              >
                {v.hero}
              </h2>
              <p
                className="text-xl md:text-2xl mb-10 max-w-2xl"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  lineHeight: 1.3,
                }}
              >
                {v.slogan}
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href={VARIANT_ROUTES[v.key]}
                  className="btn-primary text-base"
                >
                  See full page →
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </main>
  );
}
