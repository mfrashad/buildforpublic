const BELIEFS = [
  {
    title: "Open by default.",
    body: "Every project is open-source and built in public. The point isn't just sharing code. It's so the next person can pick it up, fork it, and ship something better. Public knowledge compounds when it's shared.",
    accent: "#fff200",
  },
  {
    title: "For the public good.",
    body: "Not everything worth building gets funded. We build it anyway. Tools for NGOs, communities, and the people who serve them. Not the next startup. Not a side hustle. Tech as public infrastructure.",
    accent: "#94e8ff",
  },
  {
    title: "Anyone can build.",
    body: "Changemakers become builders. Builders become changemakers. You don't need to be a developer to ship something useful. You need to be close to the problem and willing to figure the rest out.",
    accent: "#6ff5b6",
  },
];

export default function WhatWeBelieve() {
  return (
    <section
      className="band band-white grid-bg section-padding px-6"
      aria-labelledby="believe-heading"
    >
      <div className="max-w-5xl mx-auto">
        <h2 id="believe-heading" className="heading-section mb-4">
          What we believe in.
        </h2>
        <p
          className="text-lg mb-12 lg:mb-16 max-w-2xl leading-relaxed text-gray-700"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Three beliefs we keep coming back to. They shape what we build and who we build it with.
        </p>
        <div className="grid sm:grid-cols-3 gap-8 lg:gap-10">
          {BELIEFS.map((b) => (
            <div key={b.title} className="flex flex-col gap-4">
              <div
                className="w-12 h-3 border-2 border-black"
                style={{ background: b.accent }}
                aria-hidden="true"
              />
              <h3 className="heading-display text-xl">{b.title}</h3>
              <p
                className="text-base leading-relaxed text-gray-700"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {b.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
