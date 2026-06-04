"use client";

import { useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";

// ── Grid constants ───────────────────────────────────────────────────────────
const W = 26;   // weeks (columns)
const D = 7;    // days per week (rows)
const S = 12;   // isometric cube half-width  (obelisk.js "sideLength" scale)

const CW = 460; // canvas CSS width
const CH = 280; // canvas CSS height
const OX = 100; // isometric origin x (CSS px) — accounts for leftmost day offset
const OY = 64;  // isometric origin y (CSS px) — accounts for tallest bar (48px) + padding

// Bar heights per activity level (CSS pixels)
const BAR_H = [0, 6, 16, 30, 48] as const;

// GitHub-style contribution colors (top / horizontal face)
const TOP_HEX = [
  "#ebedf0", // 0 — inactive
  "#9be9a8", // 1
  "#40c463", // 2
  "#30a14e", // 3
  "#216e39", // 4
] as const;

function brighten(hex: string, delta: number): string {
  const p = (i: number) => parseInt(hex.slice(i, i + 2), 16);
  const c = (v: number) => Math.max(0, Math.min(255, v + delta));
  return `rgb(${c(p(1))},${c(p(3))},${c(p(5))})`;
}

// Three-face cube colors matching obelisk.js getByHorizontalColor()
const COLORS = TOP_HEX.map((h) => ({
  top:    h,
  right:  brighten(h, -20),
  left:   brighten(h, -40),
  border: brighten(h, -80),
}));

// ── Activity data (deterministic) ────────────────────────────────────────────
const DATA: number[][] = (() => {
  const rows: number[][] = [];
  for (let w = 0; w < W; w++) {
    const week: number[] = [];
    const sprint  = [3, 7, 12, 18, 22, 25].includes(w);
    const ramp    = w > 14;
    for (let d = 0; d < D; d++) {
      const weekend = d >= 5;
      let base = weekend ? 0 : ramp ? 2 : 1;
      if (sprint && !weekend) base = ramp ? 4 : 3;
      const seed   = (w * 7 + d) * 2654435761;
      const jitter = ((seed >>> 16) % 3) - 1;
      week.push(Math.max(0, Math.min(4, base + jitter)));
    }
    rows.push(week);
  }
  return rows;
})();

// ── Cube rendering (obelisk.js-inspired) ─────────────────────────────────────
// Each cube has 3 visible faces: top (lightest), right (mid), left (darkest).
// Faces are outlined with a thin border for clean separation, matching the
// extension's pixel-art aesthetic.
function drawCube(
  ctx: CanvasRenderingContext2D,
  w: number,
  d: number,
  level: number,
  h: number, // bar height in CSS pixels
) {
  const col = COLORS[level];

  // Reference point: the "back" corner of this cell's floor rhombus
  const rx = OX + (w - d) * S;
  const ry = OY + (w + d) * (S / 2);

  // Floor rhombus corners  (T=back, R=right, F=front/bottom, L=left)
  const fTx = rx,       fTy = ry;
  const fRx = rx + S,   fRy = ry + S / 2;
  const fFx = rx,       fFy = ry + S;
  const fLx = rx - S,   fLy = ry + S / 2;

  ctx.lineWidth = 0.5;

  if (level === 0 || h <= 0) {
    ctx.beginPath();
    ctx.moveTo(fTx, fTy); ctx.lineTo(fRx, fRy);
    ctx.lineTo(fFx, fFy); ctx.lineTo(fLx, fLy);
    ctx.closePath();
    ctx.fillStyle = col.top;
    ctx.fill();
    ctx.strokeStyle = col.border;
    ctx.stroke();
    return;
  }

  // Top face corners (shifted up by h)
  const tTx = rx,       tTy = ry - h;
  const tRx = rx + S,   tRy = ry + S / 2 - h;
  const tFx = rx,       tFy = ry + S - h;
  const tLx = rx - S,   tLy = ry + S / 2 - h;

  // Right face: tR → tF → fF → fR
  ctx.beginPath();
  ctx.moveTo(tRx, tRy); ctx.lineTo(tFx, tFy);
  ctx.lineTo(fFx, fFy); ctx.lineTo(fRx, fRy);
  ctx.closePath();
  ctx.fillStyle = col.right;
  ctx.fill();
  ctx.strokeStyle = col.border;
  ctx.stroke();

  // Left face: tL → tF → fF → fL
  ctx.beginPath();
  ctx.moveTo(tLx, tLy); ctx.lineTo(tFx, tFy);
  ctx.lineTo(fFx, fFy); ctx.lineTo(fLx, fLy);
  ctx.closePath();
  ctx.fillStyle = col.left;
  ctx.fill();
  ctx.strokeStyle = col.border;
  ctx.stroke();

  // Top face: tT → tR → tF → tL  (drawn last so it sits on top)
  ctx.beginPath();
  ctx.moveTo(tTx, tTy); ctx.lineTo(tRx, tRy);
  ctx.lineTo(tFx, tFy); ctx.lineTo(tLx, tLy);
  ctx.closePath();
  ctx.fillStyle = col.top;
  ctx.fill();
  ctx.strokeStyle = col.border;
  ctx.stroke();
}

// Painter's algorithm: draw back (small w+d) to front (large w+d) so taller
// bars in the back don't clip over shorter bars in the front.
function renderFrame(ctx: CanvasRenderingContext2D, elapsed: number) {
  ctx.clearRect(0, 0, CW, CH);
  for (let diag = 0; diag < W + D - 1; diag++) {
    const wMin = Math.max(0, diag - D + 1);
    const wMax = Math.min(diag, W - 1);
    for (let w = wMin; w <= wMax; w++) {
      const d = diag - w;
      if (d < 0 || d >= D) continue;
      const level = DATA[w][d];
      const delay = w * 35 + d * 4;
      const t     = Math.max(0, Math.min(1, (elapsed - delay) / 450));
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      drawCube(ctx, w, d, level, BAR_H[level] * eased);
    }
  }
}

const GROW_MS  = (W - 1) * 35 + (D - 1) * 4 + 450; // ~1.35 s to fully grow
const PAUSE_MS = 1200;                                // hold at full height before loop

// ── Component ─────────────────────────────────────────────────────────────────
export default function ContributionGraph({ className = "" }: { className?: string }) {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inView   = useInView(wrapRef, { once: false, amount: 0.25 });
  const reduced  = useReducedMotion() ?? false;
  const rafRef   = useRef<number>(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width  = CW * dpr;
    canvas.height = CH * dpr;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    if (!inView) {
      // Draw flat floor tiles while off-screen
      for (let diag = 0; diag < W + D - 1; diag++) {
        for (let w = Math.max(0, diag - D + 1); w <= Math.min(diag, W - 1); w++) {
          const d = diag - w;
          if (d >= 0 && d < D) drawCube(ctx, w, d, DATA[w][d], 0);
        }
      }
      return;
    }

    if (reduced) {
      renderFrame(ctx, Infinity);
      return;
    }

    startRef.current = null; // reset so each in-view entry starts fresh

    const CYCLE = GROW_MS + PAUSE_MS + GROW_MS; // grow → hold → shrink

    const loop = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const cycleElapsed = (ts - startRef.current) % CYCLE;

      let frameTime: number;
      if (cycleElapsed < GROW_MS) {
        frameTime = cycleElapsed;                            // growing
      } else if (cycleElapsed < GROW_MS + PAUSE_MS) {
        frameTime = GROW_MS;                                 // held at full height
      } else {
        frameTime = GROW_MS - (cycleElapsed - GROW_MS - PAUSE_MS); // shrinking
      }

      renderFrame(ctx, frameTime);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [inView, reduced]);

  return (
    <div ref={wrapRef} className={className}>
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          aspectRatio: `${CW} / ${CH}`,
        }}
        aria-label="Build for Public community contributions — isometric graph"
      />

      {/* Descriptor strip */}
      <div className="mt-4 flex flex-wrap gap-2">
        {[
          { val: "47", label: "builders" },
          { val: "4",  label: "live projects" },
        ].map(({ val, label }) => (
          <div
            key={label}
            className="flex items-baseline gap-1 px-3 py-1 text-xs font-semibold rounded-full border border-black"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {val && (
              <span className="font-black" style={{ color: "#216e39" }}>{val}</span>
            )}
            <span className="text-gray-700">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
