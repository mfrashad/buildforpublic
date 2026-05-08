import { SITE } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border">
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-10">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Logo + description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span
                className="text-lg text-text-primary"
                style={{ fontFamily: "var(--font-serif)", fontWeight: 700 }}
              >
                AI for Good
              </span>
              <span className="text-xs font-semibold text-clay bg-clay/15 px-2 py-0.5 rounded-full">
                .MY
              </span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed max-w-sm">
              Open-source AI projects, community, and advocacy for social impact
              in Southeast Asia and beyond. Built by the community, for the
              community.
            </p>
          </div>

          {/* Pages */}
          <div>
            <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-widest mb-4">
              Pages
            </h4>
            <div className="flex flex-col gap-3">
              <a href="/act" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                Take Action
              </a>
              <a href="/why-now" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                Why This Matters
              </a>
              <a href="/manifesto" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                Manifesto
              </a>
              <a href="/faq" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                FAQ
              </a>
              <a href="/roadmap" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                Roadmap
              </a>
              <a href="/volunteer" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                Volunteer
              </a>
              <a href="/partners" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                Partner with Us
              </a>
              <a href="/funders" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                Support the Work
              </a>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-widest mb-4">
              Connect
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href={SITE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                GitHub
              </a>
              <a
                href={SITE.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                X / Twitter
              </a>
              <a
                href={SITE.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                TikTok
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                Email
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6 flex flex-wrap justify-between items-center gap-4">
          <p className="text-xs text-text-tertiary">
            &copy; 2026 AI for Good Malaysia. Open source under MIT License.
          </p>
          <p className="text-xs text-text-tertiary">
            A community initiative from Southeast Asia.
          </p>
        </div>
      </div>
    </footer>
  );
}
