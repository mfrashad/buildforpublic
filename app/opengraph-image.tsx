import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Build for Public";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#ffffff",
          padding: "72px 80px",
          border: "6px solid #000000",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top: logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          <span style={{ fontSize: 28, fontWeight: 800, color: "#000000" }}>
            Build for{" "}
          </span>
          <span
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#000000",
              backgroundColor: "#fff200",
              padding: "2px 10px",
              marginLeft: 6,
            }}
          >
            Public
          </span>
        </div>

        {/* Center: headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "#000000",
              lineHeight: 1.1,
              letterSpacing: "-2px",
            }}
          >
            Build open-source
            <br />
            for the public good.
          </div>
          <div
            style={{
              fontSize: 26,
              color: "rgba(0,0,0,0.55)",
              lineHeight: 1.5,
              maxWidth: 780,
            }}
          >
            A movement of builders shipping open code for communities
            private capital won&apos;t serve.
          </div>
        </div>

        {/* Bottom: domain */}
        <div
          style={{
            fontSize: 22,
            fontWeight: 600,
            color: "rgba(0,0,0,0.4)",
            letterSpacing: "0.5px",
          }}
        >
          buildforpublic.com
        </div>
      </div>
    ),
    { ...size }
  );
}
