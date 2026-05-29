export default function TheMoment() {
  return (
    <section className="band band-yellow section-padding px-6" aria-labelledby="moment-heading">
      <div className="max-w-2xl mx-auto">
        <h2
          id="moment-heading"
          className="heading-section mb-10"
        >
          We are at a tipping point.
        </h2>
        <div className="space-y-6 text-lg leading-relaxed text-gray-700" style={{ fontFamily: "var(--font-sans)" }}>
          <p>
            AI is handing humanity almost unimaginable power, but the speed and breadth of this shift are accelerating the wealth gap and concentrating power in the hands of a few.
          </p>
          <p>
            Right now, most of the technology that dictates our lives is driven by private interest, designed to capture attention and maximize profit rather than serve the public. We cannot rely on a few corporations to build everything our society needs from AI, and we cannot afford the risk that they won't.
          </p>
          <p className="font-bold text-black">
            If left entirely to commercial incentives, AI will widen social divides and leave the most critical societal problems under-resourced. We desperately need a parallel ecosystem — Public AI — that runs on non-commercial incentives, where technology is accessible, transparent, and built for everyone.
          </p>
        </div>
      </div>
    </section>
  );
}
