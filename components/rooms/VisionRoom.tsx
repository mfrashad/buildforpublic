import { VISION } from "@/lib/constants";

const CARD_COLORS = ["var(--color-bp-blue)", "var(--color-bp-mint)", "var(--color-bp-peach)"];

export default function VisionSection() {
  return (
    <section
      id="vision"
      className="section-padding band band-white"
    >
      <div className="max-w-4xl mx-auto">
        <p className="eyebrow mb-4">WHY THIS EXISTS</p>
        <h2 className="heading-section text-black mb-12">
          The stack beneath the surface
        </h2>

        {/* Pull-quote problem block — publicstack.net teaching pattern */}
        <div
          className="p-8 sm:p-12 mb-5"
          style={{
            background: "var(--color-bp-yellow)",
            border: "2px solid #000",
            boxShadow: "var(--shadow-hard)",
          }}
        >
          <p className="eyebrow mb-6">THE PROBLEM</p>
          <p
            className="text-2xl sm:text-3xl text-black leading-tight mb-8"
            style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
          >
            When you use technology, you see only the surface. Beneath it is a
            stack of decisions about who owns the data, who controls the model,
            who{" "}
            <span className="highlight">profits</span> from your use.
          </p>
          <p className="text-lg text-black/70 leading-relaxed">
            {VISION.problem[1]}
          </p>
        </div>

        <div
          className="p-6 mb-16"
          style={{ border: "2px solid #000" }}
        >
          <p className="text-base text-black/70 leading-relaxed">
            {VISION.problem[0]}
          </p>
        </div>

        {/* Our response */}
        <h3
          className="text-xl text-black mb-8"
          style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
        >
          Our response
        </h3>
        <div className="grid sm:grid-cols-3 gap-5">
          {VISION.vision.map((item, i) => (
            <div
              key={i}
              className="p-6 sm:p-7"
              style={{
                background: CARD_COLORS[i],
                border: "2px solid #000",
                boxShadow: "var(--shadow-hard)",
              }}
            >
              <span
                className="text-5xl font-bold block mb-5 leading-none"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "rgba(0,0,0,0.2)",
                }}
              >
                0{i + 1}
              </span>
              <h4
                className="text-base text-black mb-3"
                style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
              >
                {item.title}
              </h4>
              <p className="text-sm text-black/70 leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
