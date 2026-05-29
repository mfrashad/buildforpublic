"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// ── DATA ─────────────────────────────────────────────────────────────────────

const FONTS = [
  { id: "plus-jakarta", name: "Plus Jakarta Sans", family: "'Plus Jakarta Sans', sans-serif", tag: "Current" },
  { id: "space-grotesk", name: "Space Grotesk", family: "'Space Grotesk', sans-serif", tag: null },
  { id: "syne", name: "Syne", family: "'Syne', sans-serif", tag: null },
  { id: "bricolage", name: "Bricolage Grotesque", family: "'Bricolage Grotesque', sans-serif", tag: null },
  { id: "dm-sans", name: "DM Sans", family: "'DM Sans', sans-serif", tag: null },
  { id: "raleway", name: "Raleway", family: "'Raleway', sans-serif", tag: null },
  { id: "outfit", name: "Outfit", family: "'Outfit', sans-serif", tag: null },
  { id: "montserrat", name: "Montserrat", family: "'Montserrat', sans-serif", tag: null },
  { id: "bebas", name: "Bebas Neue", family: "'Bebas Neue', cursive", tag: null },
  { id: "nunito", name: "Nunito", family: "'Nunito', sans-serif", tag: null },
  { id: "lexend", name: "Lexend", family: "'Lexend', sans-serif", tag: null },
  { id: "inter", name: "Inter", family: "'Inter', sans-serif", tag: null },
];

const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800" +
  "&family=Space+Grotesk:wght@400;600;700" +
  "&family=Syne:wght@400;600;700;800" +
  "&family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800" +
  "&family=DM+Sans:wght@400;600;700;800" +
  "&family=Raleway:wght@400;600;700;800;900" +
  "&family=Outfit:wght@400;600;700;800" +
  "&family=Montserrat:wght@400;600;700;800;900" +
  "&family=Bebas+Neue" +
  "&family=Nunito:wght@400;600;700;800;900" +
  "&family=Lexend:wght@400;600;700;800" +
  "&family=Inter:wght@400;600;700;800" +
  "&display=swap";

const FORMATS = [
  { id: "spaced-title",     prefix: "Build for ",  accent: "Public",  multiline: false, label: "Build for Public" },
  { id: "spaced-lower",     prefix: "build for ",  accent: "public",  multiline: false, label: "build for public" },
  { id: "nospace-title",    prefix: "Buildfor",    accent: "Public",  multiline: false, label: "BuildforPublic" },
  { id: "nospace-lower",    prefix: "buildfor",    accent: "public",  multiline: false, label: "buildforpublic" },
  { id: "multiline-title",  prefix: "Build for",   accent: "Public",  multiline: true,  label: "Build for\nPublic" },
  { id: "multiline-lower",  prefix: "build for",   accent: "public",  multiline: true,  label: "build for\npublic" },
];

const EFFECTS = [
  { id: "background",      label: "Background",  desc: "Filled block" },
  { id: "underline",       label: "Underline",   desc: "Thin rule" },
  { id: "underline-thick", label: "Marker",      desc: "Thick marker" },
  { id: "underline-wavy",  label: "Wavy",        desc: "Wavy line" },
  { id: "circle",          label: "Circle",      desc: "Oval around" },
  { id: "box",             label: "Box",         desc: "Rect border" },
  { id: "none",            label: "None",        desc: "No effect" },
];

const PALETTE = [
  { id: "yellow",  name: "Yellow",        value: "#fff200", tag: "Current" },
  { id: "blue",    name: "Electric Blue", value: "#94e8ff", tag: null },
  { id: "mint",    name: "Mint",          value: "#6ff5b6", tag: null },
  { id: "peach",   name: "Peach",         value: "#ffc0a1", tag: null },
  { id: "purple",  name: "Purple",        value: "#cb6de7", tag: null },
  { id: "orange",  name: "Orange",        value: "#fa941b", tag: null },
  { id: "lime",    name: "Lime",          value: "#a3e635", tag: null },
  { id: "coral",   name: "Coral",         value: "#ff6b6b", tag: null },
  { id: "sky",     name: "Sky",           value: "#38bdf8", tag: null },
  { id: "rose",    name: "Rose",          value: "#fb7185", tag: null },
  { id: "amber",   name: "Amber",         value: "#fbbf24", tag: null },
  { id: "teal",    name: "Teal",          value: "#5eead4", tag: null },
];

// ── HIGHLIGHT COMPONENT ───────────────────────────────────────────────────────

function Highlighted({
  children,
  effectId,
  color,
  padLeft = true,
  padRight = true,
}: {
  children: React.ReactNode;
  effectId: string;
  color: string;
  padLeft?: boolean;
  padRight?: boolean;
}) {
  switch (effectId) {
    case "background": {
      const pl = padLeft ? "6px" : "0";
      const pr = padRight ? "6px" : "0";
      return (
        <span style={{ background: color, padding: `0 ${pr} 0 ${pl}`, display: "inline" }}>
          {children}
        </span>
      );
    }
    case "underline":
      return (
        <span
          style={{
            textDecoration: "underline",
            textDecorationColor: color,
            textDecorationThickness: "3px",
            textUnderlineOffset: "6px",
          }}
        >
          {children}
        </span>
      );
    case "underline-thick":
      return (
        <span
          style={{
            textDecoration: "underline",
            textDecorationColor: color,
            textDecorationThickness: "0.22em",
            textUnderlineOffset: "-0.05em",
            textDecorationSkipInk: "none",
          }}
        >
          {children}
        </span>
      );
    case "underline-wavy":
      return (
        <span
          style={{
            textDecoration: "underline wavy",
            textDecorationColor: color,
            textDecorationThickness: "2px",
            textUnderlineOffset: "6px",
          }}
        >
          {children}
        </span>
      );
    case "circle":
      return (
        <span style={{ position: "relative", display: "inline-block", padding: "0.12em 0.35em" }}>
          <svg
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              overflow: "visible",
            }}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <ellipse
              cx="50"
              cy="50"
              rx="48"
              ry="47"
              fill="none"
              stroke={color}
              strokeWidth="4"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          {children}
        </span>
      );
    case "box":
      return (
        <span
          style={{
            border: `3px solid ${color}`,
            padding: "0.05em 0.25em",
            display: "inline-block",
            lineHeight: "inherit",
          }}
        >
          {children}
        </span>
      );
    case "none":
    default:
      return <>{children}</>;
  }
}

// ── LOGO MARK ─────────────────────────────────────────────────────────────────

function LogoMark({
  format,
  effectId,
  color,
  fontFamily,
  fontSize = "4rem",
  showHighlight = true,
  invertHighlight = false,
}: {
  format: (typeof FORMATS)[0];
  effectId: string;
  color: string;
  fontFamily: string;
  fontSize?: string;
  showHighlight?: boolean;
  invertHighlight?: boolean;
}) {
  const baseStyle: React.CSSProperties = {
    fontFamily,
    fontWeight: 800,
    fontSize,
    lineHeight: 1.15,
  };

  const effectColor = invertHighlight ? "rgba(255,255,255,0.85)" : color;
  const padLeft = !format.multiline && (format.prefix.endsWith(" ") || format.prefix === "");
  const padRight = !format.multiline;

  const accentNode = showHighlight ? (
    <Highlighted effectId={effectId} color={effectColor} padLeft={padLeft} padRight={padRight}>
      {format.accent}
    </Highlighted>
  ) : (
    <>{format.accent}</>
  );

  if (format.multiline) {
    return (
      <div style={baseStyle}>
        <div>{format.prefix}</div>
        <div>{accentNode}</div>
      </div>
    );
  }

  return (
    <span style={baseStyle}>
      {format.prefix}
      {accentNode}
    </span>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────

export default function BrandPage() {
  const [font, setFont] = useState(FONTS[0]);
  const [color, setColor] = useState(PALETTE[0]);
  const [customColor, setCustomColor] = useState("");
  const [format, setFormat] = useState(FORMATS[0]);
  const [effect, setEffect] = useState(EFFECTS[0]);
  const [gridHighlight, setGridHighlight] = useState(false);

  const accentColor = customColor || color.value;

  useEffect(() => {
    const els: HTMLLinkElement[] = [];
    const add = (attrs: Record<string, string>) => {
      const el = document.createElement("link") as HTMLLinkElement;
      Object.assign(el, attrs);
      document.head.appendChild(el);
      els.push(el);
    };
    add({ rel: "preconnect", href: "https://fonts.googleapis.com" });
    add({ rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" });
    add({ rel: "stylesheet", href: GOOGLE_FONTS_URL });
    return () => els.forEach((el) => el.parentNode?.removeChild(el));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <div className="border-b-2 border-black px-6 py-3 flex items-center justify-between bg-white sticky top-0 z-10">
        <Link href="/" className="font-bold text-sm hover:underline">← Back</Link>
        <span className="eyebrow">Brand Playground</span>
        <span className="text-xs opacity-40 font-bold uppercase tracking-wide">Not public-facing</span>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-16">

        {/* ── LIVE PREVIEW ── */}
        <section>
          <div className="eyebrow mb-4">Live Preview</div>
          <div
            className="border-2 border-black p-8 sm:p-14 flex flex-col items-center justify-center gap-8 text-center"
            style={{ boxShadow: "5px 5px 0px #000" }}
          >
            <LogoMark
              format={format}
              effectId={effect.id}
              color={accentColor}
              fontFamily={font.family}
              fontSize="clamp(2.2rem, 7vw, 4.5rem)"
            />
            <p style={{ fontFamily: font.family, fontSize: "1.125rem", color: "#555", maxWidth: "40ch" }}>
              Builders shipping open code for the public interest — open-source software for communities private capital won&apos;t serve.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                className="btn-primary"
                style={{ background: accentColor, color: "#000", borderColor: "#000", fontFamily: font.family }}
              >
                Join the movement
              </button>
              <button className="btn-primary" style={{ fontFamily: font.family }}>
                Browse initiatives
              </button>
            </div>
          </div>
        </section>

        {/* ── FORMAT ── */}
        <section>
          <div className="eyebrow mb-4">Logo Format</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {FORMATS.map((f) => {
              const active = format.id === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setFormat(f)}
                  className="border-2 border-black p-4 text-left transition-all"
                  style={{
                    background: active ? "#000" : "#fff",
                    color: active ? "#fff" : "#000",
                    boxShadow: active ? "none" : "3px 3px 0px #000",
                    transform: active ? "translate(2px,2px)" : undefined,
                  }}
                >
                  <div
                    style={{
                      fontFamily: font.family,
                      fontWeight: 800,
                      fontSize: f.multiline ? "1rem" : "1.1rem",
                      lineHeight: 1.2,
                      marginBottom: "0.5rem",
                    }}
                  >
                    {f.multiline ? (
                      <>
                        <div>{f.prefix}</div>
                        <div>
                          <Highlighted effectId={effect.id} color={active ? "rgba(255,255,255,0.8)" : accentColor} padLeft={false} padRight={false}>
                            {f.accent}
                          </Highlighted>
                        </div>
                      </>
                    ) : (
                      <>
                        {f.prefix}
                        <Highlighted effectId={effect.id} color={active ? "rgba(255,255,255,0.8)" : accentColor} padLeft={f.prefix.endsWith(" ") || f.prefix === ""}>
                          {f.accent}
                        </Highlighted>
                      </>
                    )}
                  </div>
                  <div style={{ fontSize: "0.68rem", opacity: 0.5, fontFamily: "monospace" }}>{f.label}</div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── HIGHLIGHT EFFECT ── */}
        <section>
          <div className="eyebrow mb-4">Highlight Effect</div>
          <div className="flex flex-wrap gap-3">
            {EFFECTS.map((e) => {
              const active = effect.id === e.id;
              return (
                <button
                  key={e.id}
                  onClick={() => setEffect(e)}
                  className="border-2 border-black px-4 py-3 text-left transition-all"
                  style={{
                    background: active ? "#000" : "#fff",
                    color: active ? "#fff" : "#000",
                    boxShadow: active ? "none" : "3px 3px 0px #000",
                    transform: active ? "translate(2px,2px)" : undefined,
                  }}
                >
                  <div
                    style={{
                      fontFamily: font.family,
                      fontWeight: 800,
                      fontSize: "0.8rem",
                      lineHeight: 1.2,
                      marginBottom: "0.45rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Highlighted effectId={e.id} color={accentColor} padLeft={true}>
                      {format.multiline ? `${format.prefix} ${format.accent}` : `${format.prefix}${format.accent}`}
                    </Highlighted>
                  </div>
                  <div style={{ fontSize: "0.7rem", opacity: 0.55 }}>{e.label}</div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── FONT FAMILY ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="eyebrow">Font Family</div>
            <button
              onClick={() => setGridHighlight(!gridHighlight)}
              className="flex items-center gap-2 border-2 border-black px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-all"
              style={{
                background: gridHighlight ? accentColor : "#fff",
                boxShadow: gridHighlight ? "none" : "2px 2px 0px #000",
                transform: gridHighlight ? "translate(2px,2px)" : undefined,
              }}
            >
              {gridHighlight ? "✓" : "○"} Show highlight
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {FONTS.map((f) => {
              const active = font.id === f.id;
              const highlightColor = active ? "rgba(255,255,255,0.85)" : accentColor;
              return (
                <button
                  key={f.id}
                  onClick={() => setFont(f)}
                  className="relative border-2 border-black p-4 text-left transition-all"
                  style={{
                    background: active ? "#000" : "#fff",
                    color: active ? "#fff" : "#000",
                    boxShadow: active ? "none" : "3px 3px 0px #000",
                    transform: active ? "translate(2px,2px)" : undefined,
                  }}
                >
                  {f.tag && (
                    <span
                      className="absolute top-2 right-2 border font-bold uppercase"
                      style={{ fontSize: "0.52rem", letterSpacing: "0.06em", padding: "1px 5px", borderColor: active ? "#fff" : "#000" }}
                    >
                      {f.tag}
                    </span>
                  )}
                  <div
                    style={{
                      fontFamily: f.family,
                      fontWeight: 800,
                      fontSize: format.multiline ? "0.9rem" : "1.05rem",
                      lineHeight: 1.2,
                      marginBottom: "0.4rem",
                    }}
                  >
                    {format.multiline ? (
                      <>
                        <div>{format.prefix}</div>
                        <div>
                          {gridHighlight
                            ? <Highlighted effectId={effect.id} color={highlightColor}>{format.accent}</Highlighted>
                            : format.accent}
                        </div>
                      </>
                    ) : (
                      <>
                        {format.prefix}
                        {gridHighlight
                          ? <Highlighted effectId={effect.id} color={highlightColor}>{format.accent}</Highlighted>
                          : format.accent}
                      </>
                    )}
                  </div>
                  <div style={{ fontSize: "0.68rem", opacity: 0.5 }}>{f.name}</div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── ACCENT COLOR ── */}
        <section>
          <div className="eyebrow mb-4">Accent Color</div>
          <div className="flex flex-wrap gap-4 mb-6">
            {PALETTE.map((c) => {
              const active = !customColor && color.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => { setColor(c); setCustomColor(""); }}
                  className="flex flex-col items-center gap-1"
                  title={c.name}
                >
                  <div
                    className="relative w-12 h-12 border-2 border-black"
                    style={{
                      background: c.value,
                      boxShadow: active ? "3px 3px 0px #000" : "none",
                      transform: active ? undefined : "translate(2px,2px)",
                    }}
                  >
                    {c.tag && (
                      <span
                        className="absolute -top-2 -right-2 bg-black text-white font-bold"
                        style={{ fontSize: "0.5rem", padding: "1px 4px" }}
                      >
                        {c.tag}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: "0.65rem", fontWeight: 700 }}>{c.name}</span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="eyebrow" style={{ fontSize: "0.7rem" }}>Custom:</span>
            <input
              type="color"
              value={customColor || color.value}
              onChange={(e) => setCustomColor(e.target.value)}
              className="border-2 border-black cursor-pointer"
              style={{ width: "3rem", height: "3rem", padding: "2px" }}
            />
            <input
              type="text"
              value={customColor || color.value}
              onChange={(e) => { if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) setCustomColor(e.target.value); }}
              spellCheck={false}
              className="border-2 border-black px-3 py-2 font-mono text-sm"
              style={{ width: "100px", boxShadow: "3px 3px 0px #000" }}
            />
            {customColor && (
              <button onClick={() => setCustomColor("")} className="text-sm font-bold underline opacity-60 hover:opacity-100">
                Reset
              </button>
            )}
          </div>
        </section>

        {/* ── COMPONENT PREVIEWS ── */}
        <section>
          <div className="eyebrow mb-4">Component Previews</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-30 mb-2">Navbar</p>
              <div className="border-2 border-black px-5 py-3 flex items-center justify-between" style={{ boxShadow: "3px 3px 0px #000" }}>
                <LogoMark format={format} effectId={effect.id} color={accentColor} fontFamily={font.family} fontSize="1rem" />
                <div className="flex gap-4">
                  {["About", "Initiatives", "Join"].map((item) => (
                    <span key={item} style={{ fontFamily: font.family, fontSize: "0.8rem", fontWeight: 600 }}>{item}</span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-30 mb-2">Inline highlight</p>
              <div className="border-2 border-black p-5" style={{ boxShadow: "3px 3px 0px #000" }}>
                <p style={{ fontFamily: font.family, fontWeight: 700, fontSize: "1.05rem", lineHeight: 1.5 }}>
                  Open-source software for communities{" "}
                  <Highlighted effectId={effect.id} color={accentColor}>
                    private capital won&apos;t serve.
                  </Highlighted>
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-30 mb-2">Buttons</p>
              <div className="border-2 border-black p-5 flex flex-wrap gap-3" style={{ boxShadow: "3px 3px 0px #000" }}>
                <button className="btn-primary" style={{ background: accentColor, color: "#000", borderColor: "#000", fontFamily: font.family }}>Primary</button>
                <button className="btn-primary" style={{ fontFamily: font.family }}>Secondary</button>
                <button className="btn-pill btn-pill-filled" style={{ fontFamily: font.family }}>Pill</button>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-30 mb-2">Accent card</p>
              <div className="border-2 border-black p-5" style={{ background: accentColor, boxShadow: "3px 3px 0px #000" }}>
                <div className="eyebrow mb-2" style={{ fontFamily: font.family }}>Initiative</div>
                <div style={{ fontFamily: font.family, fontWeight: 800, fontSize: "1.15rem" }}>Civic Tech Builder</div>
                <p className="mt-1 text-sm" style={{ fontFamily: font.family }}>Building tools for city residents across 12 cities.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── SUMMARY ── */}
        <section className="border-2 border-black p-6" style={{ boxShadow: "5px 5px 0px #000" }}>
          <div className="eyebrow mb-5">Your Selection</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest opacity-40 mb-1">Font</div>
              <div style={{ fontFamily: font.family, fontWeight: 800, fontSize: "1rem" }}>{font.name}</div>
              {font.id === FONTS[0].id && <div className="text-xs opacity-40 mt-0.5">Active</div>}
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest opacity-40 mb-1">Color</div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-black" style={{ background: accentColor }} />
                <span className="font-mono font-bold text-sm">{accentColor.toUpperCase()}</span>
              </div>
              {!customColor && color.id === PALETTE[0].id && <div className="text-xs opacity-40 mt-0.5">Active</div>}
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest opacity-40 mb-1">Format</div>
              <div className="font-bold text-sm font-mono whitespace-pre">{format.label}</div>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest opacity-40 mb-1">Effect</div>
              <div className="font-bold text-sm">{effect.label}</div>
            </div>
          </div>

          <div className="border-t-2 border-black pt-5">
            <div className="text-xs font-bold uppercase tracking-widest opacity-40 mb-2">To apply</div>
            <pre className="bg-gray-50 border border-gray-200 p-4 text-xs overflow-x-auto" style={{ fontFamily: "monospace" }}>
{`/* app/globals.css */
--color-bp-yellow: ${accentColor};

/* app/layout.tsx */
import { ${font.name.replace(/ /g, "_")} } from "next/font/google";`}
            </pre>
          </div>
        </section>

      </div>
    </div>
  );
}
