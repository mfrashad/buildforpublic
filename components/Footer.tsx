import { SITE } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-white border-t-[3px] border-black">
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-10">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Logo + description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-0 mb-4">
              <span
                className="text-lg text-black"
                style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
              >
                Build for{" "}
              </span>
              <span
                className="text-lg px-1"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  background: "var(--color-bp-yellow)",
                }}
              >
                Public
              </span>
            </div>
            <p className="text-sm text-black/60 leading-relaxed max-w-sm">
              A movement of builders shipping open code for the public interest.
              Open-source software for communities private capital won&apos;t serve.
              Built by volunteers. Owned by everyone.
            </p>
          </div>

          {/* Pages */}
          <div>
            <h4 className="eyebrow mb-4">Pages</h4>
            <div className="flex flex-col gap-3">
              <a href="/manifesto" className="text-sm text-black/60 hover:text-black transition-colors">
                Manifesto
              </a>
              <a href="/volunteer" className="text-sm text-black/60 hover:text-black transition-colors">
                Volunteer
              </a>
              <a href="/#projects" className="text-sm text-black/60 hover:text-black transition-colors">
                Projects
              </a>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 className="eyebrow mb-4">Connect</h4>
            <div className="flex flex-col gap-3">
              <a
                href={SITE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-black/60 hover:text-black transition-colors"
              >
                GitHub
              </a>
              <a
                href={SITE.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-black/60 hover:text-black transition-colors"
              >
                X / Twitter
              </a>
              <a
                href={SITE.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-black/60 hover:text-black transition-colors"
              >
                TikTok
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="text-sm text-black/60 hover:text-black transition-colors"
              >
                Email
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t-2 border-black pt-6 flex flex-wrap justify-between items-center gap-4">
          <p className="text-xs text-black/50">
            &copy; 2026 Build for Public. Open source under AGPL v3.
          </p>
          <p className="text-xs text-black/50">
            Open code. Public good.
          </p>
        </div>
      </div>
    </footer>
  );
}
