interface HeroSectionProps {
  hero: string;
  slogan: string;
}

export default function HeroSection({ hero, slogan }: HeroSectionProps) {
  return (
    <section
      className="relative pt-36 pb-24 px-6 overflow-hidden"
      style={{ background: "var(--color-bp-yellow)", borderBottom: "3px solid #000" }}
    >
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 mb-10 text-xs font-bold uppercase tracking-widest bg-white px-5 py-2"
          style={{ border: "2px solid #000", boxShadow: "3px 3px 0px #000" }}
        >
          OPEN SOURCE &middot; PUBLIC INTEREST &middot; VOLUNTEER-BUILT
        </div>

        {/* Hero headline */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] mb-6 max-w-3xl"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            lineHeight: 1.0,
            letterSpacing: "-0.02em",
            color: "#000",
          }}
        >
          {hero}
        </h1>

        {/* Slogan */}
        <p
          className="text-xl sm:text-2xl mb-6 max-w-2xl"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            lineHeight: 1.3,
            color: "#000",
          }}
        >
          {slogan}
        </p>

        {/* Bridge to AI */}
        <p
          className="text-base sm:text-lg mb-12 max-w-xl leading-relaxed"
          style={{ color: "rgba(0,0,0,0.7)" }}
        >
          We build open-source AI tools for communities private capital won&apos;t serve — and keep everything free. Starting where private capital is concentrating fastest: AI.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4">
          <a
            href="/volunteer"
            className="btn-primary text-base"
          >
            Volunteer →
          </a>
          <a
            href="#projects"
            className="btn-pill btn-pill-outline text-base px-8 py-3 bg-white"
          >
            View Projects
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 scroll-indicator">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="text-black/40"
        >
          <path d="M7 10l5 5 5-5" />
        </svg>
      </div>
    </section>
  );
}
