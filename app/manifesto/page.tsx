"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MANIFESTO_CLAIMS } from "@/lib/constants";

const TWITTER_TEXT = encodeURIComponent(
  "AI for Good Malaysia: a volunteer community of builders and content creators making AI work for the people markets ignore. Read the manifesto: https://aiforgood.my/manifesto"
);

export default function ManifestoPage() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <main>
      <Navbar />

      {/* Header */}
      <section className="pt-40 pb-16 px-6 border-b-2 border-border">
        <div className="max-w-3xl mx-auto">
          <p className="font-mono text-xs text-text-tertiary mb-6 tracking-wider">
            Version 1.0 — Published May 2026
          </p>
          <h1 className="heading-display text-4xl sm:text-5xl text-text-primary mb-6">
            What we believe. Why we exist.
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed max-w-2xl">
            This document states what AI for Good Malaysia believes and why. It will be updated as the evidence changes.
          </p>
        </div>
      </section>

      {/* Claims */}
      <section className="section-padding">
        <div className="max-w-3xl mx-auto space-y-6">
          {MANIFESTO_CLAIMS.map((item) => (
            <div key={item.n} className="card-flat p-6 sm:p-10">
              <span
                className="text-5xl font-bold text-clay/15 block mb-6 leading-none"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {item.n}
              </span>
              <p
                className="text-xl sm:text-2xl text-text-primary leading-snug mb-6"
                style={{ fontFamily: "var(--font-serif)", fontWeight: 600 }}
              >
                {item.claim}
              </p>
              <div className="border-l-2 border-border-subtle pl-5">
                <p className="text-sm text-text-secondary leading-relaxed mb-2">
                  {item.evidence}
                </p>
                {item.source && (
                  <p className="text-xs text-text-tertiary font-medium">{item.source}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Share */}
      <section className="section-padding pt-0 pb-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-section text-text-primary mb-4">Share this manifesto</h2>
          <p className="text-lg text-text-secondary mb-8 leading-relaxed">
            If it says something you believe, share it.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleCopy}
              className="btn-pill btn-pill-clay px-8 py-3 text-base"
            >
              {copied ? "Copied!" : "Copy link"}
            </button>
            <a
              href={`https://twitter.com/intent/tweet?text=${TWITTER_TEXT}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill btn-pill-outline px-8 py-3 text-base"
            >
              Share on X →
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
