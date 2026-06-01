import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff200",
          border: "2px solid #000000",
          fontFamily: "sans-serif",
        }}
      >
        <span
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: "#000000",
            letterSpacing: "-1px",
          }}
        >
          B
        </span>
      </div>
    ),
    { ...size }
  );
}
