"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MANIFESTO_CLAIMS } from "@/lib/constants";

const TWITTER_TEXT = encodeURIComponent(
  "Build for Public: a volunteer community of builders and content creators making AI work for the communities private capital won't serve. Read the manifesto: https://buildforpublic.com/manifesto"
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
      <section className="pt-40 pb-16 px-6 border-b-2 border-black">
        <div className="max-w-3xl mx-auto">
          <p className="font-mono text-xs text-black/50 mb-6 tracking-wider">
            Version 1.0 — Published May 2026
          </p>
          <h1 className="heading-display text-4xl sm:text-5xl text-black mb-6">
            What we believe. Why we exist.
          </h1>
          <p className="text-lg text-black/60 leading-relaxed max-w-2xl">
            This document states what Build for Public believes and why. It will be updated as the evidence changes.
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
                style={{ fontFamily: "var(--font-display)" }}
              >
                {item.n}
              </span>
              <p
                className="text-xl sm:text-2xl text-black leading-snug mb-6"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                {item.claim}
              </p>
              <div className="border-l-2 border-black/20 pl-5">
                <p className="text-sm text-black/60 leading-relaxed mb-2">
                  {item.evidence}
                </p>
                {item.source && (
                  <p className="text-xs text-black/50 font-medium">{item.source}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Share */}
      <section className="section-padding pt-0 pb-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-section text-black mb-4">Share this manifesto</h2>
          <p className="text-lg text-black/60 mb-8 leading-relaxed">
            If it says something you believe, share it.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleCopy}
              className="btn-pill btn-pill-filled px-8 py-3 text-base"
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
