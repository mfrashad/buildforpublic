export default function HeroSection() {
  return (
    <section className="relative pt-36 pb-20 px-6 border-b-2 border-border overflow-hidden">
      {/* Decorative corner accent */}
      <div
        aria-hidden
        className="absolute top-0 right-0 w-64 h-64 md:w-[28rem] md:h-[28rem] rounded-bl-[6rem] pointer-events-none"
        style={{ background: "rgba(232,72,85,0.08)" }}
      />
      <div
        aria-hidden
        className="absolute top-0 right-0 w-32 h-32 md:w-56 md:h-56 rounded-bl-[4rem] pointer-events-none"
        style={{ background: "rgba(232,72,85,0.12)" }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 mb-8 text-sm font-semibold text-text-primary bg-surface-raised px-5 py-2 rounded-full border-2 border-border"
          style={{ boxShadow: "3px 3px 0px #1a1b1f" }}
        >
          OPEN SOURCE &middot; COMMUNITY &middot; MALAYSIA
        </div>

        {/* Headline */}
        <h1 className="heading-display text-6xl sm:text-7xl md:text-[5.5rem] lg:text-[6.5rem] text-text-primary mb-8 max-w-2xl">
          AI<br />
          for{" "}
          <span className="text-clay">Good.</span>
        </h1>

        {/* Subtext */}
        <p className="text-lg sm:text-xl text-text-secondary max-w-xl mb-3 leading-relaxed">
          A community of AI builders who ship tools for NGOs in Southeast Asia.
        </p>
        <p className="text-base sm:text-lg text-text-secondary max-w-xl mb-12 leading-relaxed">
          We build open-source software, create AI literacy content, and keep everything free.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4">
          <a href="/volunteer" className="btn-pill btn-pill-clay text-base px-8 py-3">
            Become a Volunteer
          </a>
          <a href="#projects" className="btn-pill btn-pill-outline text-base px-8 py-3">
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
          className="text-text-tertiary"
        >
          <path d="M7 10l5 5 5-5" />
        </svg>
      </div>
    </section>
  );
}
