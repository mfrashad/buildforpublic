"use client";

interface FooterLink {
  label: string;
  href: string;
  target?: string;
}

const PAGE_LINKS: FooterLink[] = [
  { label: "Manifesto", href: "/manifesto" },
  { label: "Projects", href: "/projects" },
  { label: "GitHub", href: "https://github.com/buildforpublic", target: "_blank" },
  { label: "LinkedIn", href: "https://linkedin.com/company/buildforpublic", target: "_blank" },
];

const SOCIAL_LINKS: FooterLink[] = [
  { label: "Instagram", href: "https://instagram.com/build4public", target: "_blank" },
  { label: "X", href: "https://x.com/build4public", target: "_blank" },
  { label: "TikTok", href: "https://tiktok.com/@buildforpublic", target: "_blank" },
];

export default function LandingFooter() {
  return (
    <footer className="band band-black py-16 px-6" aria-label="Footer">
      <div className="max-w-5xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-2">
            <p className="heading-display text-xl text-white mb-2">
              Build for <span className="highlight text-black">Public</span>
            </p>
            <p className="text-sm leading-relaxed text-gray-400 mb-4" style={{ fontFamily: "var(--font-sans)" }}>
              Building in public, for the public.
            </p>
            <p className="text-xs text-gray-500" style={{ fontFamily: "var(--font-sans)" }}>
              Open-source · Southeast Asia
            </p>
          </div>

          <div>
            <p className="eyebrow text-gray-400 mb-4">Pages</p>
            <ul className="space-y-2">
              {PAGE_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target={l.target}
                    rel={l.target ? "noopener noreferrer" : undefined}
                    className="text-sm text-gray-300 hover:text-white font-medium transition-colors"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow text-gray-400 mb-4">Community</p>
            <ul className="space-y-2">
              {SOCIAL_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-300 hover:text-white font-medium transition-colors"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col sm:flex-row justify-between gap-4">
          <p className="text-xs text-gray-500" style={{ fontFamily: "var(--font-sans)" }}>
            © 2025 Build for Public. Open-source under MIT.
          </p>
          <p className="text-xs text-gray-500" style={{ fontFamily: "var(--font-sans)" }}>
            Built in public. For the public.
          </p>
        </div>
      </div>
    </footer>
  );
}
