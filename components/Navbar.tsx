"use client";

import { useState } from "react";
import { NAV_LINKS, SITE } from "@/lib/constants";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b-[3px] border-black">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-0">
          <span
            className="text-xl text-black"
            style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
          >
            Build for{" "}
          </span>
          <span
            className="text-xl px-1"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              background: "var(--color-bp-yellow)",
            }}
          >
            Public
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[15px] font-medium text-black/70 hover:text-black transition-colors"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={`mailto:${SITE.email}`}
            className="btn-pill btn-pill-outline text-sm py-2 px-5"
          >
            Contact
          </a>
          <a href="/volunteer" className="btn-pill btn-pill-filled text-sm py-2 px-5">
            Volunteer
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-black transition-transform duration-200 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-0.5 bg-black transition-opacity duration-200 ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-black transition-transform duration-200 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t-[3px] border-black px-6 py-6 space-y-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 text-base text-black/70 hover:text-black transition-colors"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {link.label}
            </a>
          ))}

          <div className="pt-4 flex flex-col gap-3">
            <a
              href="/volunteer"
              onClick={() => setMobileOpen(false)}
              className="btn-pill btn-pill-filled text-center"
            >
              Volunteer
            </a>
            <a
              href={`mailto:${SITE.email}`}
              onClick={() => setMobileOpen(false)}
              className="btn-pill btn-pill-outline text-center"
            >
              Contact
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
