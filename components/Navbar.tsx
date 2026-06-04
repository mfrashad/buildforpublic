"use client";

import { useState } from "react";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { useUser, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { isSignedIn } = useUser();

  function copyEmail() {
    navigator.clipboard.writeText(SITE.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3500);
    });
  }

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
          <button
            onClick={copyEmail}
            className="btn-pill btn-pill-outline text-sm py-2 px-5"
          >
            Contact
          </button>
          <a href="/volunteer" className="btn-pill btn-pill-filled text-sm py-2 px-5">
            Volunteer
          </a>
          {isSignedIn && (
            <UserButton
              userProfileUrl="/profile"
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9 border-2 border-black",
                },
              }}
            />
          )}
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
            <button
              onClick={() => { setMobileOpen(false); copyEmail(); }}
              className="btn-pill btn-pill-outline text-center"
            >
              Contact
            </button>
          </div>
        </div>
      )}

      {/* Copy-email toast */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${
          copied ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3 bg-black text-white text-sm px-5 py-3 rounded-full shadow-lg border border-white/10">
          <span className="text-green-400 font-bold">✓</span>
          <span>
            Email copied! Send a note to{" "}
            <span className="font-semibold text-yellow-300">{SITE.email}</span>
          </span>
        </div>
      </div>
    </nav>
  );
}
