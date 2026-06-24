// Live event calendar embedded from Luma.
// Replaces the old in-house RSVP waitlist; RSVPs now happen on Luma.
const LUMA_CALENDAR_SRC =
  "https://luma.com/embed/calendar/cal-h3IwADCOFsn8yre/events";

function CalendarEmbed() {
  return (
    <div className="card overflow-hidden">
      <div
        className="h-2 w-full border-b-2 border-black"
        style={{ background: "#fff200" }}
      />
      <iframe
        src={LUMA_CALENDAR_SRC}
        title="Build for Public events on Luma"
        className="block w-full"
        style={{ height: 560, border: "none" }}
        allowFullScreen
        aria-hidden="false"
        tabIndex={0}
      />
    </div>
  );
}

export default function Events({ noBand = false }: { noBand?: boolean }) {
  if (noBand) {
    return (
      <div className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
            <h2
              className="text-2xl font-bold text-black"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Upcoming events.
            </h2>
            <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1.5 border-2 border-black bg-white rounded-full">
              Monthly · KL
            </span>
          </div>
          <CalendarEmbed />
        </div>
      </div>
    );
  }

  return (
    <section
      className="band band-yellow section-padding px-6"
      aria-labelledby="events-heading"
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <h2 id="events-heading" className="heading-section">
            Upcoming events.
          </h2>
          <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1.5 border-2 border-black bg-white rounded-full">
            Monthly · KL
          </span>
        </div>

        <CalendarEmbed />
      </div>
    </section>
  );
}
