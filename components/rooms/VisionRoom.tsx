import { VISION } from "@/lib/constants";

export default function VisionSection() {
  return (
    <section id="vision" className="section-padding border-b-2 border-border">
      <div className="max-w-4xl mx-auto">
        <h2 className="heading-section text-text-primary mb-12">
          Why this exists
        </h2>

        {/* Pull-quote problem block */}
        <div className="card accent-clay p-8 sm:p-12 mb-5">
          <p className="text-xs font-bold text-clay uppercase tracking-widest mb-6">
            The Problem
          </p>
          <p
            className="text-2xl sm:text-3xl text-text-primary leading-tight mb-8"
            style={{ fontFamily: "var(--font-serif)", fontWeight: 700 }}
          >
            AI is the most transformative technology in human history. The
            systems around it are built to reward{" "}
            <span className="text-clay">shareholders</span> — not society.
          </p>
          <p className="text-lg text-text-secondary leading-relaxed">
            {VISION.problem[1]}
          </p>
        </div>

        <div className="card-flat p-6 mb-16">
          <p className="text-base text-text-secondary leading-relaxed">
            {VISION.problem[0]}
          </p>
        </div>

        {/* Our response */}
        <h3
          className="text-xl text-text-primary mb-8"
          style={{ fontFamily: "var(--font-serif)", fontWeight: 700 }}
        >
          Our response
        </h3>
        <div className="grid sm:grid-cols-3 gap-5">
          {VISION.vision.map((item, i) => (
            <div key={i} className="card p-6 sm:p-7">
              <span
                className="text-5xl font-bold text-clay/15 block mb-5 leading-none"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                0{i + 1}
              </span>
              <h4
                className="text-base text-text-primary mb-3"
                style={{ fontFamily: "var(--font-serif)", fontWeight: 600 }}
              >
                {item.title}
              </h4>
              <p className="text-sm text-text-secondary leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
