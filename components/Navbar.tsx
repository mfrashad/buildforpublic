"use client";

import { useState, useRef, useEffect } from "react";
import { NAV_LINKS, SITE } from "@/lib/constants";

const GET_INVOLVED = [
  { href: "/volunteer", audience: "For Builders", label: "Volunteer →" },
  { href: "/partners", audience: "For NGOs", label: "Partner with Us →" },
  { href: "/funders", audience: "For Funders", label: "Support the Work →" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-bg/90 backdrop-blur-md border-b-2 border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <span
            className="text-xl tracking-tight text-text-primary"
            style={{ fontFamily: "var(--font-serif)", fontWeight: 700 }}
          >
            AI for Good
          </span>
          <span className="text-xs font-bold text-clay bg-clay/10 px-2 py-0.5 rounded-full border border-clay/30">
            .MY
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[15px] font-medium text-text-secondary hover:text-text-primary transition-colors"
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

          {/* Get Involved dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="btn-pill btn-pill-clay text-sm py-2 px-5 flex items-center gap-2"
            >
              Get Involved
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute top-full right-0 mt-3 w-60 card-flat z-50">
                <div className="p-2">
                  {GET_INVOLVED.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-3 rounded-xl hover:bg-bg transition-colors group"
                    >
                      <span className="block text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-0.5 group-hover:text-clay transition-colors">
                        {item.audience}
                      </span>
                      <span className="text-sm font-medium text-text-primary">
                        {item.label}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-text-primary transition-transform duration-200 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-0.5 bg-text-primary transition-opacity duration-200 ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-text-primary transition-transform duration-200 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-surface border-t-2 border-border px-6 py-6 space-y-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 text-base text-text-secondary hover:text-text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}

          <div className="pt-2 border-t border-border-subtle mt-4">
            <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-2 pt-2">
              Get Involved
            </p>
            {GET_INVOLVED.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block py-2 pl-3 text-sm text-text-secondary hover:text-text-primary transition-colors border-l-2 border-border-subtle hover:border-clay mb-1"
              >
                <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest block">
                  {item.audience}
                </span>
                {item.label}
              </a>
            ))}
          </div>

          <div className="pt-4 flex flex-col gap-3">
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
