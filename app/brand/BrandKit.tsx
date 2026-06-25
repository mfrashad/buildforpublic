"use client";

import { useState } from "react";
import Image from "next/image";
import { SITE, STATS } from "@/lib/constants";
import { Star1, Star4, Star6 } from "@/app/components/decorations/Stars";

// ── Brand data ────────────────────────────────────────────────────────────────

const PALETTE = [
  { name: "Yellow", hex: "#fff200", role: "Primary / signature", dark: false },
  { name: "Blue", hex: "#94e8ff", role: "Accent", dark: false },
  { name: "Mint", hex: "#6ff5b6", role: "Accent", dark: false },
  { name: "Peach", hex: "#ffc0a1", role: "Accent", dark: false },
  { name: "Purple", hex: "#cb6de7", role: "Accent", dark: false },
  { name: "Orange", hex: "#fa941b", role: "Accent", dark: false },
  { name: "Black", hex: "#000000", role: "Ink / borders / shadows", dark: true },
  { name: "Gray", hex: "#666666", role: "Secondary text", dark: true },
  { name: "Light", hex: "#f5f5f5", role: "Surface", dark: false },
  { name: "White", hex: "#ffffff", role: "Background", dark: false },
];

const TAGLINES = [
  "Build in public for the public.",
  "We turn changemakers into builders, and builders into changemakers.",
  "Building public-interest tech together.",
  "Ship technology that serves everyone.",
];

const KEY_MESSAGES = [
  {
    title: "Build for communities, not customers",
    text: "We build and fund the public-interest projects no company will ship — tools for NGOs, public services, and communities that don't generate revenue.",
  },
  {
    title: "Put open AI in the hands of the public",
    text: "AI lets one volunteer build what used to take a team. We show public-interest orgs what's possible and ship the tool together.",
  },
  {
    title: "Keep everything open",
    text: "Every project is open source. The next builder starts where we left off, not from scratch.",
  },
];

const BOILERPLATE = {
  oneLiner:
    "Build for Public is a digital-volunteering movement shipping open-source tech for non-profits and the public good.",
  short:
    "Build for Public is a movement of volunteer builders, designers, and changemakers who ship open-source software for NGOs, nonprofits, and communities that private capital won't serve — and publish every line of it openly.",
  long:
    "Build for Public is a community of volunteer builders shipping open code for the public interest. The systems shaping public life — the infrastructure behind loans, jobs, health, and governance — are privately owned and built to maximize private return, not public benefit. Communities that don't generate revenue get left behind. Build for Public exists to close that gap: we match NGOs and public-interest organisations with volunteer builders, use modern AI to ship real tools fast, and release everything as open source so the next builder can pick up where we left off. We run regular meetups and co-building sessions across Malaysia and Southeast Asia.",
};

const USE_WORDS = ["movement", "builders", "ship", "open / open-source", "public interest", "volunteer", "communities", "co-build"];
const AVOID_WORDS = ["users (say “people” / “communities”)", "charity / handout", "disrupt", "synergy / leverage", "customers", "growth-hacking"];

const ASSETS = [
  { label: "Color palette — SVG", href: "/brand/palette.svg", note: "Swatch sheet, all 10 hex" },
];

const BRICKS = ["yellow-cube", "blue-plate", "green-cube", "red-slope", "purple-cube", "cobalt-cube"];

// ── Wordmark download (canvas-rendered with the live font → crisp PNG + SVG) ───

const LOGO_VARIANTS = [
  { id: "light", label: "On white / light", bg: "#ffffff", textColor: "#000000", onDark: false },
  { id: "dark", label: "On dark", bg: "#111111", textColor: "#ffffff", onDark: true },
  { id: "transparent", label: "Transparent", bg: "transparent", textColor: "#000000", onDark: false },
] as const;
type LogoVariant = (typeof LOGO_VARIANTS)[number];

const FONT_SIZE = 52;
const CANVAS_W = 600;
const CANVAS_H = 120;
const BASELINE_Y = 80;
const HIGHLIGHT_PAD = 6;

async function downloadLogo(variant: LogoVariant, format: "svg" | "png") {
  await document.fonts.ready;

  const canvas = document.createElement("canvas");
  const SCALE = 3;
  canvas.width = CANVAS_W * SCALE;
  canvas.height = CANVAS_H * SCALE;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(SCALE, SCALE);
  ctx.font = `800 ${FONT_SIZE}px "Plus Jakarta Sans", Arial Black, sans-serif`;

  const prefix = "Build for ";
  const suffix = "Public";
  const pW = ctx.measureText(prefix).width;
  const sW = ctx.measureText(suffix).width;
  const startX = (CANVAS_W - pW - sW) / 2;
  const rectX = startX + pW - HIGHLIGHT_PAD;
  const rectY = BASELINE_Y - FONT_SIZE + 4;
  const rectW = sW + HIGHLIGHT_PAD * 2;
  const rectH = FONT_SIZE + 10;

  if (variant.bg !== "transparent") {
    ctx.fillStyle = variant.bg;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  }
  ctx.fillStyle = "#fff200";
  ctx.fillRect(rectX, rectY, rectW, rectH);
  ctx.fillStyle = variant.textColor;
  ctx.fillText(prefix, startX, BASELINE_Y);
  ctx.fillStyle = "#000000";
  ctx.fillText(suffix, startX + pW, BASELINE_Y);

  if (format === "png") {
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `buildforpublic-logo-${variant.id}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  } else {
    const svg = [
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CANVAS_W} ${CANVAS_H}" width="${CANVAS_W}" height="${CANVAS_H}">`,
      `  <defs><style>@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@800&amp;display=swap');</style></defs>`,
      variant.bg === "transparent" ? "" : `  <rect width="${CANVAS_W}" height="${CANVAS_H}" fill="${variant.bg}"/>`,
      `  <rect x="${rectX.toFixed(1)}" y="${rectY}" width="${rectW.toFixed(1)}" height="${rectH}" fill="#fff200"/>`,
      `  <text font-family="'Plus Jakarta Sans', Arial Black, sans-serif" font-weight="800" font-size="${FONT_SIZE}" y="${BASELINE_Y}">`,
      `    <tspan x="${startX.toFixed(1)}" fill="${variant.textColor}">${prefix}</tspan><tspan fill="#000000">${suffix}</tspan>`,
      `  </text>`,
      `</svg>`,
    ].join("\n");
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `buildforpublic-logo-${variant.id}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// ── Small building blocks ─────────────────────────────────────────────────────

function CopyButton({ text, label = "Copy", className = "" }: { text: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        });
      }}
      className={`text-xs font-bold px-3 py-1.5 border-2 border-black rounded-full transition-colors ${
        copied ? "bg-black text-white" : "bg-white text-black hover:bg-bp-yellow"
      } ${className}`}
      style={{ fontFamily: "var(--font-display)" }}
    >
      {copied ? "Copied!" : label}
    </button>
  );
}

function Swatch({ name, hex, role, dark }: { name: string; hex: string; role: string; dark: boolean }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(hex.toUpperCase()).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        });
      }}
      className="card text-left group"
      title={`Copy ${hex.toUpperCase()}`}
    >
      <div
        className="h-24 border-b-2 border-black flex items-end justify-end p-2"
        style={{ background: hex }}
      >
        <span
          className={`text-[11px] font-bold px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
            dark ? "bg-white text-black" : "bg-black text-white"
          }`}
        >
          {copied ? "Copied!" : "Click to copy"}
        </span>
      </div>
      <div className="p-3 bg-white">
        <p className="font-bold text-black text-sm" style={{ fontFamily: "var(--font-display)" }}>
          {name}
        </p>
        <p className="text-xs text-black/50 tabular-nums">{hex.toUpperCase()}</p>
        <p className="text-[11px] text-black/40 mt-1">{role}</p>
      </div>
    </button>
  );
}

function Section({
  eyebrow,
  title,
  intro,
  id,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="max-w-5xl mx-auto px-6 py-16 border-t-[3px] border-black">
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h2 className="heading-section mb-3">{title}</h2>
      {intro && <p className="text-black/60 max-w-2xl mb-10 leading-relaxed">{intro}</p>}
      {children}
    </section>
  );
}

function CopyCard({ label, text }: { label: string; text: string }) {
  return (
    <div className="card bg-white p-5">
      <div className="flex items-center justify-between gap-3 mb-2">
        <p className="eyebrow">{label}</p>
        <CopyButton text={text} />
      </div>
      <p className="text-black/80 leading-relaxed text-sm">{text}</p>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function BrandKit() {
  return (
    <div>
      {/* Hero */}
      <section className="band-white grid-bg pt-40 pb-20 px-6 relative overflow-hidden border-b-[3px] border-black">
        <div className="absolute top-28 right-[8%] pointer-events-none select-none" aria-hidden>
          <Star1 size={64} color="#fff200" stroke="#000" strokeWidth={6} />
        </div>
        <div className="absolute bottom-16 left-[6%] pointer-events-none select-none opacity-70" aria-hidden>
          <Star4 size={48} color="#94e8ff" stroke="#000" strokeWidth={5} />
        </div>
        <div className="max-w-5xl mx-auto relative z-10">
          <p className="eyebrow mb-4">Brand &amp; Media Kit</p>
          <h1 className="heading-display text-5xl sm:text-6xl lg:text-7xl mb-6 max-w-3xl">
            Make something with our brand.
          </h1>
          <p className="text-xl text-black/60 max-w-2xl mb-10 leading-relaxed">
            Everything press, partners, and content creators need to represent{" "}
            <span className="highlight">Build for Public</span> — logo, colors, type, and
            ready-to-use copy. Every asset downloads or copies in one click, ready to drop
            straight into Canva, a deck, or a post.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#logo" className="btn-primary btn-primary-yellow">
              Download the logo
            </a>
            <a href="#color" className="btn-pill btn-pill-outline text-base px-7 py-3">
              Copy brand colors
            </a>
          </div>
        </div>
      </section>

      {/* Logo / wordmark */}
      <Section
        eyebrow="Logo"
        title="Wordmark"
        id="logo"
        intro="The wordmark is the logo: “Build for” in Plus Jakarta Sans ExtraBold, with “Public” set in a solid yellow box. The yellow chip is the signature — keep it. Use PNG for Canva, SVG for design tools; the transparent version drops onto any background."
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {LOGO_VARIANTS.map((v) => (
            <div key={v.id} className="card overflow-hidden">
              <div
                className={`h-44 flex items-center justify-center ${v.onDark ? "" : "grid-bg"}`}
                style={{ background: v.bg }}
              >
                <Wordmark onDark={v.onDark} />
              </div>
              <div className="bg-white border-t-2 border-black px-4 py-3 flex items-center justify-between gap-3">
                <span className="text-xs text-black/50">{v.label}</span>
                <div className="flex gap-2">
                  <button onClick={() => downloadLogo(v, "svg")} className="btn-pill btn-pill-outline text-xs py-1.5 px-4">
                    SVG ↓
                  </button>
                  <button onClick={() => downloadLogo(v, "png")} className="btn-pill btn-pill-filled text-xs py-1.5 px-4">
                    PNG ↓
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="card bg-white p-5">
            <p className="eyebrow mb-3" style={{ color: "#2d8a56" }}>✓ Do</p>
            <ul className="space-y-2 text-sm text-black/70">
              <li>Keep the yellow box on “Public”.</li>
              <li>Give it clear space — at least the height of the “P” on every side.</li>
              <li>Use on white, light gray, or a single brand color.</li>
              <li>Use the on-dark version (white text) over photos or dark panels.</li>
            </ul>
          </div>
          <div className="card bg-white p-5">
            <p className="eyebrow mb-3" style={{ color: "#c0392b" }}>✕ Don&apos;t</p>
            <ul className="space-y-2 text-sm text-black/70">
              <li>Recolor the chip or the text, add gradients, shadows, or outlines.</li>
              <li>Stretch, rotate, or rearrange the words.</li>
              <li>Set it in a different font, or drop the yellow box.</li>
              <li>Place black text on a dark background without the chip.</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Color */}
      <Section
        eyebrow="Color"
        title="Palette"
        id="color"
        intro="The “WBD pop” palette. Yellow #FFF200 is the signature — used for highlights and primary calls to action. Black does the heavy lifting for ink, 2px borders, and hard shadows. Click any swatch to copy its hex."
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {PALETTE.map((c) => (
            <Swatch key={c.hex} {...c} />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <CopyButton
            text={PALETTE.map((c) => `${c.name} ${c.hex.toUpperCase()}`).join("\n")}
            label="Copy all hex"
          />
          <a href="/brand/palette.svg" download className="btn-pill btn-pill-outline text-sm">
            Download palette sheet (SVG)
          </a>
          <span className="text-xs text-black/40">In Canva, paste a hex into the color picker.</span>
        </div>
      </Section>

      {/* Typography */}
      <Section
        eyebrow="Type"
        title="Typography"
        id="type"
        intro="Two typefaces, both free on Google Fonts. Plus Jakarta Sans for display and headings; Geist for body and UI. Search the name in Canva's font picker, or upload the file from Google Fonts."
      >
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="eyebrow">Display / Headings</p>
              <CopyButton text="Plus Jakarta Sans" label="Copy name" />
            </div>
            <p className="heading-display text-5xl mb-2">Plus Jakarta Sans</p>
            <p className="text-black/50 text-sm mb-4">ExtraBold 800 · Bold 700 · SemiBold 600 · Regular 400</p>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 800 }} className="text-2xl mb-4">
              Build in public for the public.
            </p>
            <a
              href="https://fonts.google.com/specimen/Plus+Jakarta+Sans"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold underline underline-offset-2 hover:text-black/60"
            >
              Get the font on Google Fonts ↗
            </a>
          </div>
          <div className="card bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="eyebrow">Body / UI</p>
              <CopyButton text="Geist" label="Copy name" />
            </div>
            <p style={{ fontFamily: "var(--font-sans)" }} className="text-5xl font-semibold mb-2">
              Geist
            </p>
            <p className="text-black/50 text-sm mb-4">Regular · Medium · SemiBold</p>
            <p style={{ fontFamily: "var(--font-sans)" }} className="text-base text-black/70 leading-relaxed mb-4">
              The quick brown fox jumps over the lazy dog. We match NGOs with volunteer
              builders and ship open-source tools together.
            </p>
            <a
              href="https://fonts.google.com/specimen/Geist"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold underline underline-offset-2 hover:text-black/60"
            >
              Get the font on Google Fonts ↗
            </a>
          </div>
        </div>
      </Section>

      {/* Visual motifs */}
      <Section
        eyebrow="Look & feel"
        title="Visual motifs"
        id="motifs"
        intro="A bold, neobrutalist style: 2px black outlines, hard offset shadows, sharp corners, a faint grid, and playful LEGO-style bricks and stars."
      >
        <div className="mb-8">
          <p className="eyebrow mb-3">Bricks &amp; stars — click any to download</p>
          <div className="flex flex-wrap items-center gap-3">
            {BRICKS.map((b) => (
              <a
                key={b}
                href={`/bricks/${b}.png`}
                download
                title={`Download ${b.replace("-", " ")} (PNG)`}
                className="card bg-white p-2 hover:bg-bp-yellow transition-colors"
              >
                <Image
                  src={`/bricks/${b}.png`}
                  alt={`${b.replace("-", " ")} brick`}
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </a>
            ))}
            <a
              href="/brand/star-spark.svg"
              download
              title="Download spark star (SVG)"
              className="card bg-white p-3 flex items-center justify-center hover:bg-bp-yellow transition-colors"
            >
              <Star1 size={48} color="#fff200" stroke="#000" strokeWidth={6} />
            </a>
            <a
              href="/brand/star-burst.svg"
              download
              title="Download burst star (SVG)"
              className="card bg-white p-3 flex items-center justify-center hover:bg-bp-yellow transition-colors"
            >
              <Star4 size={48} color="#fff200" stroke="#000" strokeWidth={6} />
            </a>
            <a
              href="/brand/star-sparkle.svg"
              download
              title="Download sparkle star (SVG)"
              className="card bg-white p-3 flex items-center justify-center hover:bg-bp-yellow transition-colors"
            >
              <Star6 size={44} color="#000" />
            </a>
          </div>
          <p className="text-xs text-black/40 mt-3">
            PNG bricks (cubes, plates &amp; slopes, 6 colors) and SVG stars — drop them into Canva as elements.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            ["Hard shadow", "5px 5px 0 black offset on cards and buttons."],
            ["2px borders", "Solid black outlines, sharp 0px corners."],
            ["Bricks", "LEGO-style cubes, plates, and slopes — building, literally."],
            ["Grid + stars", "Faint 40px grid background; pop stars as accents."],
          ].map(([t, d]) => (
            <div key={t} className="card bg-white p-5">
              <p className="font-bold text-black mb-1" style={{ fontFamily: "var(--font-display)" }}>
                {t}
              </p>
              <p className="text-sm text-black/55 leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Downloads */}
      <Section
        eyebrow="Grab the files"
        title="Downloads"
        id="assets"
        intro="Palette sheet and social card here; the logo (PNG/SVG, all three variants) is up top. Need a format that isn't here? Email us."
      >
        {/* Social card — visual preview + download */}
        <div className="card overflow-hidden mb-4">
          <a href="/og/buildforpublic.png" download className="block" title="Download social card (PNG)">
            <div className="relative aspect-[1600/827] border-b-2 border-black bg-bp-light">
              <Image
                src="/og/buildforpublic.png"
                alt="Build for Public social card preview"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          </a>
          <div className="bg-white px-5 py-3 flex items-center justify-between gap-3">
            <div>
              <p className="font-bold text-black" style={{ fontFamily: "var(--font-display)" }}>
                Social card
              </p>
              <p className="text-xs text-black/50 mt-0.5">PNG · 1600 × 827 — share image / link preview</p>
            </div>
            <a href="/og/buildforpublic.png" download className="btn-pill btn-pill-filled text-sm shrink-0">
              Download PNG ↓
            </a>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {ASSETS.map((a) => (
            <a
              key={a.href}
              href={a.href}
              download
              className="card bg-white p-5 flex items-center justify-between gap-4 hover:bg-bp-yellow transition-colors"
            >
              <div>
                <p className="font-bold text-black" style={{ fontFamily: "var(--font-display)" }}>
                  {a.label}
                </p>
                <p className="text-xs text-black/50 mt-0.5">{a.note}</p>
              </div>
              <span className="text-xl shrink-0" aria-hidden>
                ↓
              </span>
            </a>
          ))}
        </div>

        <div className="card bg-black text-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="font-bold text-lg mb-1" style={{ fontFamily: "var(--font-display)" }}>
              Press or partnership question?
            </p>
            <p className="text-white/60 text-sm">
              We&apos;re happy to help with assets, quotes, or interviews.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <a href={`mailto:${SITE.email}`} className="btn-pill btn-pill-filled bg-bp-yellow text-black border-black text-sm">
              Email us
            </a>
            <CopyButton text={SITE.email} label={SITE.email} />
          </div>
        </div>
      </Section>

      {/* Boilerplate */}
      <Section
        eyebrow="Copy & paste"
        title="Boilerplate"
        id="boilerplate"
        intro="Approved descriptions at three lengths. Hit copy and paste straight into a caption, deck, or Canva text box."
      >
        <div className="space-y-4">
          <CopyCard label="One-liner" text={BOILERPLATE.oneLiner} />
          <CopyCard label="Short — ~35 words" text={BOILERPLATE.short} />
          <CopyCard label="Long — ~100 words" text={BOILERPLATE.long} />
        </div>
      </Section>

      {/* Voice */}
      <Section
        eyebrow="Voice"
        title="Taglines &amp; messaging"
        id="voice"
        intro="Plain-spoken, optimistic, a little punchy. We talk about building, shipping, and the public — not corporate impact-speak."
      >
        <div className="grid sm:grid-cols-2 gap-3 mb-10">
          {TAGLINES.map((t) => (
            <div key={t} className="card bg-white p-4 flex items-center justify-between gap-3">
              <p className="font-semibold text-black" style={{ fontFamily: "var(--font-display)" }}>
                {t}
              </p>
              <CopyButton text={t} />
            </div>
          ))}
        </div>

        <p className="eyebrow mb-4">Key messages</p>
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {KEY_MESSAGES.map((m, i) => (
            <div key={m.title} className="card bg-white p-5">
              <span
                className="inline-flex items-center justify-center w-8 h-8 border-2 border-black rounded-full font-bold mb-3"
                style={{ background: PALETTE[i].hex, fontFamily: "var(--font-display)" }}
              >
                {i + 1}
              </span>
              <p className="font-bold text-black mb-1.5" style={{ fontFamily: "var(--font-display)" }}>
                {m.title}
              </p>
              <p className="text-sm text-black/60 leading-relaxed">{m.text}</p>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="card bg-white p-5">
            <p className="eyebrow mb-3" style={{ color: "#2d8a56" }}>Words we use</p>
            <div className="flex flex-wrap gap-2">
              {USE_WORDS.map((w) => (
                <span key={w} className="text-xs px-3 py-1 border-2 border-black rounded-full font-medium">
                  {w}
                </span>
              ))}
            </div>
          </div>
          <div className="card bg-white p-5">
            <p className="eyebrow mb-3" style={{ color: "#c0392b" }}>Words we avoid</p>
            <div className="flex flex-wrap gap-2">
              {AVOID_WORDS.map((w) => (
                <span key={w} className="text-xs px-3 py-1 border-2 border-black/20 rounded-full text-black/40 line-through">
                  {w}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Fast facts */}
      <Section eyebrow="For journalists" title="Fast facts" id="facts">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map((s) => (
            <div key={s.label} className="card bg-white p-5">
              <p className="heading-display text-3xl mb-1">{s.value}</p>
              <p className="text-sm text-black/50">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="card bg-white divide-y-2 divide-black/10">
          {[
            ["Name", "Build for Public (capital B and P; “for” stays lowercase)"],
            ["What it is", "Volunteer movement building open-source tech for the public interest"],
            ["Founded", "2025"],
            ["Based in", "Kuala Lumpur, Malaysia · Southeast Asia"],
            ["Website", SITE.domain],
            ["License", "Open source"],
            ["Press contact", SITE.email],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 px-5 py-3">
              <span className="eyebrow w-40 shrink-0">{k}</span>
              <span className="text-black/80 text-sm">{v}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

// On-page wordmark — matches the navbar exactly: one line, single-space gap,
// px-1 yellow chip. Kept on one line (whitespace-nowrap) so it never stacks.
function Wordmark({ onDark = false }: { onDark?: boolean }) {
  return (
    <div
      className="flex items-center whitespace-nowrap text-3xl"
      style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
    >
      <span style={{ color: onDark ? "#ffffff" : "#000000" }}>Build for{" "}</span>
      <span className="px-1" style={{ background: "#fff200", color: "#000000" }}>
        Public
      </span>
    </div>
  );
}
