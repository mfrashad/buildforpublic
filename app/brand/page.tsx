"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const LOGO_VARIANTS = [
  {
    id: "light",
    label: "Default — Light",
    description: "Use on white or light backgrounds",
    bg: "#ffffff",
    textColor: "#000000",
    highlightBg: "#fff200",
    highlightText: "#000000",
    previewBorder: "border border-black/10",
  },
  {
    id: "dark",
    label: "Reversed — Dark",
    description: "Use on black or dark backgrounds",
    bg: "#000000",
    textColor: "#ffffff",
    highlightBg: "#fff200",
    highlightText: "#000000",
    previewBorder: "",
  },
] as const;

type LogoVariant = (typeof LOGO_VARIANTS)[number];

const BRAND_COLORS = [
  { name: "Yellow", hex: "#fff200" },
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#ffffff", border: true },
  { name: "Blue", hex: "#94e8ff" },
  { name: "Mint", hex: "#6ff5b6" },
  { name: "Peach", hex: "#ffc0a1" },
];

const FONT_SIZE = 52;
const CANVAS_W = 600;
const CANVAS_H = 120;
const BASELINE_Y = 80;
const HIGHLIGHT_PAD = 6;

async function downloadLogo(variant: LogoVariant, format: "svg" | "png") {
  await document.fonts.ready;

  const canvas = document.createElement("canvas");
  const SCALE = 2;
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

  // Draw background
  ctx.fillStyle = variant.bg;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Draw yellow highlight
  ctx.fillStyle = variant.highlightBg;
  ctx.fillRect(rectX, rectY, rectW, rectH);

  // Draw "Build for "
  ctx.fillStyle = variant.textColor;
  ctx.fillText(prefix, startX, BASELINE_Y);

  // Draw "Public"
  ctx.fillStyle = variant.highlightText;
  ctx.fillText(suffix, startX + pW, BASELINE_Y);

  if (format === "png") {
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob!);
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
      `  <rect width="${CANVAS_W}" height="${CANVAS_H}" fill="${variant.bg}"/>`,
      `  <rect x="${rectX.toFixed(1)}" y="${rectY}" width="${rectW.toFixed(1)}" height="${rectH}" fill="${variant.highlightBg}"/>`,
      `  <text font-family="'Plus Jakarta Sans', Arial Black, sans-serif" font-weight="800" font-size="${FONT_SIZE}" y="${BASELINE_Y}">`,
      `    <tspan x="${startX.toFixed(1)}" fill="${variant.textColor}">${prefix}</tspan><tspan fill="${variant.highlightText}">${suffix}</tspan>`,
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

function LogoPreview({ variant }: { variant: LogoVariant }) {
  return (
    <div
      className={`p-12 flex items-center justify-center min-h-44 ${variant.previewBorder}`}
      style={{ background: variant.bg }}
    >
      <div className="flex items-center">
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(2rem, 5vw, 3rem)",
            color: variant.textColor,
          }}
        >
          Build for&nbsp;
        </span>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(2rem, 5vw, 3rem)",
            background: variant.highlightBg,
            color: variant.highlightText,
            padding: "0 6px",
          }}
        >
          Public
        </span>
      </div>
    </div>
  );
}

export default function BrandPage() {
  return (
    <main>
      <Navbar />

      {/* Header */}
      <section className="pt-40 pb-16 px-6 border-b-2 border-black">
        <div className="max-w-3xl mx-auto">
          <p className="font-mono text-xs text-black/50 mb-6 tracking-wider">BRAND</p>
          <h1 className="heading-display text-4xl sm:text-5xl text-black mb-6">
            Brand Assets
          </h1>
          <p className="text-lg text-black/60 leading-relaxed max-w-2xl">
            Official logos, colors, and typography for Build for Public. Use these assets when referencing or featuring the project.
          </p>
        </div>
      </section>

      {/* Logo variants */}
      <section className="section-padding">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-section text-black mb-8">Logo</h2>
          <div className="space-y-4">
            {LOGO_VARIANTS.map((variant) => (
              <div key={variant.id} className="card-flat overflow-hidden">
                <LogoPreview variant={variant} />
                <div className="p-6 border-t-2 border-black bg-white flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-semibold text-black">{variant.label}</p>
                    <p className="text-sm text-black/50 mt-0.5">{variant.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadLogo(variant, "svg")}
                      className="btn-pill btn-pill-outline text-sm py-2 px-5"
                    >
                      SVG ↓
                    </button>
                    <button
                      onClick={() => downloadLogo(variant, "png")}
                      className="btn-pill btn-pill-filled text-sm py-2 px-5"
                    >
                      PNG ↓
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Colors */}
      <section className="section-padding pt-0">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-section text-black mb-8">Colors</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {BRAND_COLORS.map((color) => (
              <div key={color.name} className="card-flat overflow-hidden">
                <div
                  className="h-28"
                  style={{
                    background: color.hex,
                    outline: color.border ? "1px solid rgba(0,0,0,0.08)" : undefined,
                    outlineOffset: "-1px",
                  }}
                />
                <div className="p-4 border-t-2 border-black">
                  <p className="font-semibold text-black text-sm">{color.name}</p>
                  <p className="font-mono text-xs text-black/50 mt-1 uppercase">{color.hex}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="section-padding pt-0 pb-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="heading-section text-black mb-8">Typography</h2>
          <div className="card-flat divide-y-2 divide-black">
            <div className="p-8">
              <p className="font-mono text-xs text-black/50 mb-4 tracking-wider">
                DISPLAY — PLUS JAKARTA SANS 800
              </p>
              <p
                className="text-6xl leading-none text-black mb-4"
                style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
              >
                Aa
              </p>
              <p
                className="text-sm text-black/60 leading-relaxed"
                style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
              >
                ABCDEFGHIJKLMNOPQRSTUVWXYZ
                <br />
                abcdefghijklmnopqrstuvwxyz
                <br />
                0123456789
              </p>
            </div>
            <div className="p-8">
              <p className="font-mono text-xs text-black/50 mb-4 tracking-wider">
                BODY — GEIST
              </p>
              <p
                className="text-6xl leading-none text-black mb-4"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Aa
              </p>
              <p
                className="text-sm text-black/60 leading-relaxed"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                ABCDEFGHIJKLMNOPQRSTUVWXYZ
                <br />
                abcdefghijklmnopqrstuvwxyz
                <br />
                0123456789
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
