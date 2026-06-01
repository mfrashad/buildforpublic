import ContributionGraph from "@/app/components/illustrations/ContributionGraph";

export default function TheSolution() {
  return (
    <section className="band band-white section-padding px-6" aria-labelledby="solution-heading">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-[3fr_2fr] gap-12 lg:gap-16 items-center">
          {/* Text column */}
          <div>
            <h2
              id="solution-heading"
              className="heading-section mb-10"
            >
              To build tech that serves the public, we need the public to build it.
            </h2>
            <div className="space-y-6 text-lg leading-relaxed text-gray-700" style={{ fontFamily: "var(--font-sans)" }}>
              <p>
                Our approach is simple but radical: we use open-source collaboration to turn changemakers into builders, and builders into changemakers. By bringing together developers who want to do good and domain experts who deeply understand the problems, we are removing the friction of building public-interest tech — and championing a culture that encourages keeping the tools we build public, free, and open.
              </p>
              <p>
                Right now, AI is dissolving the traditional barriers to entry. The cost of software creation is collapsing, and the gap between knowing a problem deeply and shipping a solution has never been smaller. We are harnessing this shift to ship digital infrastructure that actually matters.
              </p>
            </div>
          </div>

          {/* Isometric contribution graph */}
          <div className="flex items-center justify-end">
            <ContributionGraph />
          </div>
        </div>
      </div>
    </section>
  );
}
