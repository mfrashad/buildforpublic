"use client";

import { useEffect } from "react";
import Image from "next/image";
import { CONTENT_TYPES, TALKS_DESCRIPTION, SITE } from "@/lib/constants";

const INSTAGRAM_VIDEO = {
  id: "DVQVxBvkqPo",
  title: "AI Water Usage",
  url: "https://www.instagram.com/reel/DVQVxBvkqPo/",
};

const TIKTOK_VIDEO = {
  id: "7611830161847110933",
  title: "The AI Divide",
  url: "https://www.tiktok.com/@rashadventure/video/7611830161847110933",
};

const COMING_SOON_TOPICS = ["AI Deepfakes", "AI Arms Race", "AI Alignment"];

export default function AdvocacySection() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !document.getElementById("instagram-embed-script")
    ) {
      const script = document.createElement("script");
      script.id = "instagram-embed-script";
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    } else if (typeof window !== "undefined" && window.instgrm) {
      window.instgrm.Embeds.process();
    }

    if (
      typeof window !== "undefined" &&
      !document.getElementById("tiktok-embed-script")
    ) {
      const script = document.createElement("script");
      script.id = "tiktok-embed-script";
      script.src = "https://www.tiktok.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <section id="advocacy" className="section-padding bg-surface">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <span className="text-xs font-medium text-olive bg-olive/15 px-3 py-1 rounded-full inline-block mb-4">
            ACTIVE
          </span>
          <h2 className="heading-section text-text-primary mb-3">
            Advocacy
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl">
            Educational content making AI accessible to everyone.
          </p>
        </div>

        {/* Content types — 3 column cards */}
        <div className="grid sm:grid-cols-3 gap-5 mb-16">
          {CONTENT_TYPES.map((ct) => (
            <div
              key={ct.id}
              className="card-flat overflow-hidden"
            >
              <div className="relative w-full aspect-[16/9]">
                <Image
                  src={ct.image}
                  alt={ct.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <span className="text-xs text-text-tertiary mb-3 block">
                  {ct.badge}
                </span>
                <h4
                  className="text-lg text-text-primary mb-2"
                  style={{ fontFamily: "var(--font-serif)", fontWeight: 600 }}
                >
                  {ct.title}
                </h4>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {ct.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Videos */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h3
              className="text-xl text-text-primary"
              style={{ fontFamily: "var(--font-serif)", fontWeight: 600 }}
            >
              Featured Videos
            </h3>
            <a
              href="https://instagram.com/aiforgood.my"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-clay hover:text-clay-hover transition-colors"
            >
              @aiforgood.my &rarr;
            </a>
          </div>

          {/* Video Embeds */}
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            {/* Instagram */}
            <div>
              <span className="text-xs font-medium text-clay bg-clay/10 px-3 py-1 rounded-full inline-block mb-3">
                {INSTAGRAM_VIDEO.title}
              </span>
              <div className="card-flat overflow-hidden max-h-[420px]">
                <blockquote
                  className="instagram-media"
                  data-instgrm-permalink={`${INSTAGRAM_VIDEO.url}?utm_source=ig_embed&utm_campaign=loading`}
                  data-instgrm-version="14"
                  style={{
                    background: "#ffffff",
                    border: 0,
                    margin: 0,
                    maxWidth: "100%",
                    minWidth: "280px",
                    padding: 0,
                    width: "100%",
                  }}
                >
                  <div style={{ padding: "16px" }}>
                    <a
                      href={INSTAGRAM_VIDEO.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-clay hover:text-clay-hover"
                    >
                      View on Instagram &mdash; {INSTAGRAM_VIDEO.title}
                    </a>
                  </div>
                </blockquote>
              </div>
            </div>

            {/* TikTok */}
            <div>
              <span className="text-xs font-medium text-clay bg-clay/10 px-3 py-1 rounded-full inline-block mb-3">
                {TIKTOK_VIDEO.title}
              </span>
              <div className="card-flat overflow-hidden max-h-[420px]">
                <blockquote
                  className="tiktok-embed"
                  cite={TIKTOK_VIDEO.url}
                  data-video-id={TIKTOK_VIDEO.id}
                  style={{
                    maxWidth: "100%",
                    minWidth: "280px",
                  }}
                >
                  <section>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://www.tiktok.com/@rashadventure?refer=embed"
                      className="text-sm text-clay hover:text-clay-hover"
                    >
                      @rashadventure
                    </a>
                  </section>
                </blockquote>
              </div>
            </div>
          </div>

          {/* Coming Soon */}
          <div>
            <h4 className="text-sm font-medium text-text-tertiary mb-3">
              Coming Soon
            </h4>
            <div className="flex flex-wrap gap-2">
              {COMING_SOON_TOPICS.map((topic) => (
                <span
                  key={topic}
                  className="text-sm bg-surface-raised text-text-tertiary px-4 py-1.5 rounded-full border border-border border-dashed"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Talks */}
        <div className="card-flat p-8 text-center">
          <h3
            className="text-xl text-text-primary mb-4"
            style={{ fontFamily: "var(--font-serif)", fontWeight: 600 }}
          >
            Talks &amp; Speaking
          </h3>
          <p className="text-base text-text-secondary leading-relaxed mb-4 max-w-2xl mx-auto">
            {TALKS_DESCRIPTION}
          </p>
          <p className="text-sm text-text-tertiary">
            Invite us to speak &mdash;{" "}
            <a
              href={`mailto:${SITE.email}`}
              className="text-clay hover:text-clay-hover transition-colors"
            >
              Contact us
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
