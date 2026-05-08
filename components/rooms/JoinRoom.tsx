import { ROLES } from "@/lib/constants";

const ROLE_ICONS: Record<string, React.ReactNode> = {
  builder: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-sky">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  advocate: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-clay">
      <path d="M12 6V2H8" />
      <path d="m8 18-4 4V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2Z" />
      <path d="M2 12h2" />
      <path d="M9 11v2" />
      <path d="M15 11v2" />
      <path d="M12 15v2" />
    </svg>
  ),
  organizer: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-olive">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  ),
  researcher: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-fig">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
};

export default function JoinSection() {
  return (
    <section id="join" className="section-padding">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="heading-section text-text-primary mb-4">
          Join the Movement
        </h2>
        <p className="text-lg text-text-secondary mb-14 max-w-lg mx-auto">
          We&apos;re looking for builders, advocates, organizers, and
          researchers who want to use their skills for social good.
        </p>

        {/* Role cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {ROLES.map((role) => (
            <div key={role.id} className="card p-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center mx-auto mb-4">
                {ROLE_ICONS[role.id]}
              </div>
              <h4
                className="text-lg text-text-primary mb-2"
                style={{ fontFamily: "var(--font-serif)", fontWeight: 600 }}
              >
                {role.title}
              </h4>
              <p className="text-sm text-text-secondary leading-relaxed">
                {role.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="card-flat p-8 max-w-md mx-auto">
          <a
            href="/volunteer"
            className="btn-pill btn-pill-clay text-base px-8 py-3 mb-5 inline-block"
          >
            See all roles &amp; apply &rarr;
          </a>
          <div className="flex items-center justify-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-tertiary">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            <a
              href="mailto:m.fathyrashad@gmail.com"
              className="text-sm text-clay hover:text-clay-hover transition-colors"
            >
              Contact us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
