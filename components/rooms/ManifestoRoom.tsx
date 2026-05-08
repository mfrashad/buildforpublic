import { MANIFESTO_CLAIMS } from "@/lib/constants";

export default function ManifestoRoom() {
  return (
    <section className="section-padding border-t-2 border-b-2 border-border bg-surface">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <p className="font-mono text-xs text-text-tertiary tracking-wider mb-3">
              MANIFESTO
            </p>
            <h2 className="heading-section text-text-primary">
              Five things we believe.
            </h2>
          </div>
          <a
            href="/manifesto"
            className="text-sm font-medium text-clay hover:text-clay-hover transition-colors flex-shrink-0"
          >
            Read the full manifesto →
          </a>
        </div>

        {/* Claims grid: 1 col mobile, 2 col desktop */}
        <div className="grid md:grid-cols-2 gap-px bg-border border-2 border-border">
          {MANIFESTO_CLAIMS.map((item, i) => (
            <div
              key={item.n}
              className={`bg-background p-8 sm:p-10 flex flex-col${
                i === 4 ? " md:col-span-2" : ""
              }`}
            >
              <span
                className="text-6xl font-bold leading-none mb-6 select-none"
                style={{
                  fontFamily: "var(--font-serif)",
                  color: "var(--color-clay)",
                  opacity: 0.15,
                }}
              >
                {item.n}
              </span>
              <p
                className="text-lg sm:text-xl text-text-primary leading-snug flex-1"
                style={{ fontFamily: "var(--font-serif)", fontWeight: 600 }}
              >
                {item.claim}
              </p>
              {item.source && (
                <p className="text-xs text-text-tertiary font-medium mt-5 pt-5 border-t border-border-subtle">
                  {item.source}
                </p>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
