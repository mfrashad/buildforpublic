// Live event calendar embedded from Luma (light theme).
// Replaces the old in-house RSVP waitlist; RSVPs now happen on Luma.
const LUMA_EMBED_SRC =
  "https://luma.com/embed/calendar/cal-h3IwADCOFsn8yre/events?lt=light";
const LUMA_CALENDAR_URL = "https://luma.com/buildforpublic";

function EventsContent() {
  return (
    <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-start">
      {/* Left: copy + CTAs */}
      <div className="lg:w-2/5 lg:pt-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50 mb-4">
          Upcoming events
        </p>
        <h2 className="heading-display text-4xl sm:text-5xl text-black mb-5">
          See what&apos;s happening next.
        </h2>
        <p className="text-base text-black/60 leading-relaxed mb-8 max-w-md">
          Browse Build for Public meetups, co-building sessions, and workshops in
          KL — straight from Luma. Pick what fits your week and RSVP in a couple
          of clicks.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={LUMA_CALENDAR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ background: "#111", color: "#fff", borderColor: "#000" }}
          >
            Open full calendar →
          </a>
          <a
            href="/join"
            className="btn-primary"
            style={{ background: "#fff", color: "#000", borderColor: "#000" }}
          >
            Join the community →
          </a>
        </div>
      </div>

      {/* Right: live Luma calendar */}
      <div className="w-full lg:flex-1">
        <div className="card overflow-hidden">
          <div
            className="h-2 w-full border-b-2 border-black"
            style={{ background: "#fff200" }}
          />
          <iframe
            src={LUMA_EMBED_SRC}
            title="Build for Public events on Luma"
            className="block w-full bg-white"
            style={{ height: 640, border: "none" }}
            allowFullScreen
            aria-hidden="false"
            tabIndex={0}
          />
        </div>
      </div>
    </div>
  );
}

export default function Events({ noBand = false }: { noBand?: boolean }) {
  if (noBand) {
    return (
      <div className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <EventsContent />
        </div>
      </div>
    );
  }

  return (
    <section
      className="band band-yellow section-padding px-6"
      aria-labelledby="events-heading"
    >
      <div className="max-w-6xl mx-auto">
        <h2 id="events-heading" className="sr-only">
          Upcoming events
        </h2>
        <EventsContent />
      </div>
    </section>
  );
}
