"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

// ── Canvas ──────────────────────────────────────────────────────────────────
const SVG_W = 640;
const SVG_H = 920;
const CX    = 210;   // horizontal centre of the illustration
const H_SL  = 32;    // slab thickness (px)

// ── Isometric projection ────────────────────────────────────────────────────
// Square layers: (u,v) are face-space coords, both 0..S.
// Screen: x = CX + u - v,  y = baseY - H + (u+v)*0.5
function fp(baseY: number, H: number, u: number, v: number): [number, number] {
  return [CX + u - v, baseY - H + (u + v) * 0.5];
}
function p(arr: [number, number][]): string {
  return arr.map(([x, y]) => `${x},${y}`).join(" ");
}

// ── Layer data — GAP=52 gives ~20px visible air between each layer ──────────
// Visual gap = GAP − H_SL = 52 − 32 = 20 px of clear space between slabs
type LC = { top: string; right: string; left: string };
type Layer = { id: string; label: string; tooltip: string; S: number; baseY: number; color: LC };

const LAYERS: Layer[] = [
  { id: "applications", label: "Applications",       tooltip: "Apps and tools that people actually use.",         S: 70,  baseY: 24,  color: { top: "#F4826A", right: "#9E3E2A", left: "#C86050" } },
  { id: "tools",        label: "Open models & tools", tooltip: "The shared building blocks of AI and software.", S: 95,  baseY: 146, color: { top: "#5ECECE", right: "#208484", left: "#3AACAC" } },
  { id: "data",         label: "Open data",           tooltip: "The commons. Public data, public knowledge.",    S: 120, baseY: 293, color: { top: "#EFC050", right: "#9E7810", left: "#C89A2A" } },
  { id: "builders",     label: "Builders",            tooltip: "The people who ship the work.",                  S: 145, baseY: 465, color: { top: "#9E78D8", right: "#5A388E", left: "#7A56B6" } },
  { id: "community",    label: "Communities",         tooltip: "The people the work is for.",                    S: 170, baseY: 662, color: { top: "#C05050", right: "#6E1010", left: "#962C2C" } },
];

// ── Small floating isometric box on the top face ────────────────────────────
function FloatBox({
  baseY, H, u, v, wu, dv, fh, topC, sideC,
}: {
  baseY: number; H: number;
  u: number; v: number; wu: number; dv: number; fh: number;
  topC: string; sideC: string;
}) {
  const base = H + fh;
  const TL = fp(baseY, base + 0,  u,      v);
  const TR = fp(baseY, base + 0,  u + wu, v);
  const BR = fp(baseY, base + 0,  u + wu, v + dv);
  const BL = fp(baseY, base + 0,  u,      v + dv);
  const TL_b = fp(baseY, H + 0,   u,      v);
  const TR_b = fp(baseY, H + 0,   u + wu, v);
  const BR_b = fp(baseY, H + 0,   u + wu, v + dv);
  const BL_b = fp(baseY, H + 0,   u,      v + dv);
  return (
    <g>
      {/* right face */}
      <polygon points={p([TR, BR, BR_b, TR_b])} fill={sideC} opacity={0.85} />
      {/* front-left face */}
      <polygon points={p([BL, BR, BR_b, BL_b])} fill={sideC} opacity={0.7} />
      {/* top face */}
      <polygon points={p([TL, TR, BR, BL])} fill={topC} />
    </g>
  );
}

// ── Person figure (isometric, floating above top face) ──────────────────────
function Person({
  baseY, H, u, v, scale = 1, tint,
}: {
  baseY: number; H: number; u: number; v: number; scale?: number; tint: string;
}) {
  const [px, py] = fp(baseY, H, u, v);
  const hr = 6 * scale;  // head radius
  const bh = 14 * scale; // body height
  const bw = 5 * scale;  // half body width
  return (
    <g>
      {/* body */}
      <rect x={px - bw} y={py - bh} width={bw * 2} height={bh * 0.75} rx={bw * 0.5} fill={tint} opacity={0.9} />
      {/* head */}
      <circle cx={px} cy={py - bh - hr * 0.6} r={hr} fill={tint} />
    </g>
  );
}

// ── Grid lines on the top face ──────────────────────────────────────────────
function GridLines({ baseY, S, N = 4, stroke }: { baseY: number; S: number; N?: number; stroke: string }) {
  const lines: React.ReactElement[] = [];
  for (let k = 1; k < N; k++) {
    const t = (k / N) * S;
    // v-constant lines (go in u direction)
    const [ax, ay] = fp(baseY, H_SL, 0, t);
    const [bx, by] = fp(baseY, H_SL, S, t);
    lines.push(<line key={`v${k}`} x1={ax} y1={ay} x2={bx} y2={by} stroke={stroke} strokeWidth={0.8} opacity={0.22} />);
    // u-constant lines (go in v direction)
    const [cx2, cy2] = fp(baseY, H_SL, t, 0);
    const [dx, dy] = fp(baseY, H_SL, t, S);
    lines.push(<line key={`u${k}`} x1={cx2} y1={cy2} x2={dx} y2={dy} stroke={stroke} strokeWidth={0.8} opacity={0.22} />);
  }
  return <g>{lines}</g>;
}

// ── Per-layer unique surface decoration ─────────────────────────────────────
function Decoration({ layer }: { layer: Layer }) {
  const { S, baseY, color } = layer;
  const mid = S / 2;

  if (layer.id === "applications") {
    // 3 small floating app-window boxes, spread across the face
    return (
      <g>
        <FloatBox baseY={baseY} H={H_SL} u={6}  v={6}  wu={22} dv={18} fh={16} topC={color.top} sideC={color.right} />
        <FloatBox baseY={baseY} H={H_SL} u={34} v={10} wu={22} dv={18} fh={24} topC="#fff8f6" sideC={color.left} />
        <FloatBox baseY={baseY} H={H_SL} u={18} v={36} wu={20} dv={16} fh={12} topC={color.top} sideC={color.right} />
      </g>
    );
  }

  if (layer.id === "tools") {
    // Connected node network — floating 12px above the surface
    const fh = 12;
    const nodes: [number, number][] = [
      [mid, mid],
      [mid - 26, mid - 18],
      [mid + 26, mid - 18],
      [mid - 14, mid + 26],
      [mid + 18, mid + 22],
    ];
    const edges: [number, number][] = [[0,1],[0,2],[0,3],[0,4],[1,2],[3,4]];
    const sn = nodes.map(([u,v]) => fp(baseY, H_SL + fh, u, v));
    return (
      <g>
        {edges.map(([a,b], i) => (
          <line key={i}
            x1={sn[a][0]} y1={sn[a][1]}
            x2={sn[b][0]} y2={sn[b][1]}
            stroke="#fff" strokeWidth={2} opacity={0.55}
          />
        ))}
        {sn.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === 0 ? 8 : 5.5}
            fill={i === 0 ? "#fff" : color.left}
            stroke="#fff" strokeWidth={1} opacity={0.95} />
        ))}
      </g>
    );
  }

  if (layer.id === "data") {
    // 4×3 dot grid
    const cols = 4, rows = 3;
    const spacing = S / (cols + 1);
    const dots: React.ReactElement[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const u = spacing * (c + 1);
        const v = (S / (rows + 1)) * (r + 1);
        const [sx, sy] = fp(baseY, H_SL + 8, u, v);
        const isHighlight = (r === 1 && c === 1) || (r === 0 && c === 3);
        dots.push(
          <circle key={`${r}-${c}`} cx={sx} cy={sy} r={isHighlight ? 5.5 : 4}
            fill={isHighlight ? "#fff" : color.top} opacity={0.85} />
        );
      }
    }
    return <g>{dots}</g>;
  }

  if (layer.id === "builders") {
    // 2 person figures side by side with a small tool box between them
    return (
      <g>
        <Person baseY={baseY} H={H_SL} u={mid - 18} v={mid - 8}  scale={1.1} tint="#fff" />
        <Person baseY={baseY} H={H_SL} u={mid + 10} v={mid + 8}  scale={0.9} tint={color.top} />
        <FloatBox baseY={baseY} H={H_SL} u={mid - 6} v={mid + 2} wu={14} dv={11} fh={8} topC={color.top} sideC={color.right} />
      </g>
    );
  }

  if (layer.id === "community") {
    // 5 person figures spread across the large diamond face
    const positions: [number, number, number, string][] = [
      [mid - 44, mid - 28, 1.1, "#fff"],
      [mid + 20, mid - 36, 1.0, color.top],
      [mid - 14, mid + 10, 1.15, "#fff"],
      [mid + 44, mid + 14, 0.9, color.top],
      [mid - 46, mid + 22, 0.9, color.left],
    ];
    return (
      <g>
        {positions.map(([u, v, scale, tint], i) => (
          <Person key={i} baseY={baseY} H={H_SL} u={u} v={v} scale={scale} tint={tint} />
        ))}
      </g>
    );
  }

  return null;
}

// ── Main slab ────────────────────────────────────────────────────────────────
interface SlabProps {
  layer: Layer;
  index: number;
  isHovered: boolean;
  anyHovered: boolean;
  reduced: boolean | null;
  onHover: (id: string | null) => void;
}

function Slab({ layer, index, isHovered, anyHovered, reduced, onHover }: SlabProps) {
  const { S, baseY, color } = layer;
  const H = H_SL;

  // 4 vertices of the TOP face (rhombus)
  const Bh = fp(baseY, H, 0, 0);   // back
  const Rh = fp(baseY, H, S, 0);   // right
  const Fh = fp(baseY, H, S, S);   // front
  const Lh = fp(baseY, H, 0, S);   // left

  // 3 base vertices needed for side faces
  const R  = fp(baseY, 0, S, 0);   // right base
  const F  = fp(baseY, 0, S, S);   // front base
  const L  = fp(baseY, 0, 0, S);   // left base

  // Label connector: from right vertex to label text
  const labelX = Rh[0] + 22;
  const labelY = Rh[1] - 2;

  const floatAmt = 9; // px of vertical travel

  return (
    // Outer: continuous idle float bob — each layer offset by 0.5s
    <motion.g
      animate={reduced ? {} : { y: [0, -floatAmt, 0] }}
      transition={{
        y: { duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 },
      }}
    >
      {/* Inner: hover lift + opacity */}
      <motion.g
        animate={{
          y: !reduced && isHovered ? -18 : 0,
          opacity: anyHovered && !isHovered ? 0.4 : 1,
        }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        onHoverStart={() => onHover(layer.id)}
        onHoverEnd={() => onHover(null)}
        style={{ cursor: "pointer" }}
        role="img"
        aria-label={`${layer.label}: ${layer.tooltip}`}
      >
        {/* Drop shadow — scales down while layer bobs up for realism */}
        <ellipse
          cx={Fh[0]}
          cy={F[1] + 8}
          rx={S * 0.72}
          ry={S * 0.18}
          fill="rgba(0,0,0,0.13)"
          style={{ filter: "blur(4px)" }}
        />
        {/* Right side face */}
        <polygon points={p([Rh, Fh, F, R])} fill={color.right} />
        {/* Left side face */}
        <polygon points={p([Lh, Fh, F, L])} fill={color.left} />
        {/* Top face */}
        <polygon points={p([Bh, Rh, Fh, Lh])} fill={color.top} />
        {/* Highlight strip near back edge */}
        <polygon
          points={p([Bh, Rh, [Rh[0] - 4, Rh[1] + 2], [Bh[0] - 4, Bh[1] + 2]])}
          fill="rgba(255,255,255,0.15)"
        />
        {/* Grid lines on top face */}
        <GridLines baseY={baseY} S={S} N={4} stroke="rgba(0,0,0,0.6)" />
        {/* Unique per-layer decoration */}
        <Decoration layer={layer} />
        {/* Label with color dot */}
        <circle cx={Rh[0] + 5} cy={Rh[1]} r={3} fill={color.top} />
        <line x1={Rh[0] + 9} y1={Rh[1]} x2={labelX - 4} y2={labelY}
          stroke={color.top} strokeWidth={1} opacity={0.5} />
        <text x={labelX} y={labelY + 4}
          style={{ fontSize: "11px", fontWeight: 600, fill: "var(--v2-text)", fontFamily: "var(--font-sans, system-ui)" }}>
          {layer.label}
        </text>
      </motion.g>
    </motion.g>
  );
}

// ── Root component ───────────────────────────────────────────────────────────
export default function StackIllustration() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const hoveredLayer = LAYERS.find(l => l.id === hoveredId);

  return (
    <div
      className="relative w-full max-w-lg mx-auto select-none"
      aria-label="Interactive technology stack illustration"
    >
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        width="100%"
        style={{ height: "auto" }}
        role="presentation"
      >
        {/* Bottom layers first so upper ones paint on top */}
        {[...LAYERS].reverse().map((layer, revIdx) => (
          <Slab
            key={layer.id}
            layer={layer}
            index={LAYERS.length - 1 - revIdx}
            isHovered={hoveredId === layer.id}
            anyHovered={hoveredId !== null}
            reduced={reduced}
            onHover={setHoveredId}
          />
        ))}
      </svg>

      {/* Hover tooltip */}
      {hoveredLayer && (
        <motion.div
          key={hoveredLayer.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="absolute left-1/2 -translate-x-1/2 bottom-4 pointer-events-none"
          style={{ zIndex: 10 }}
        >
          <div
            className="px-4 py-2.5 rounded-lg text-sm font-medium text-center max-w-xs"
            style={{ background: "var(--v2-text)", color: "var(--v2-bg)", boxShadow: "0 4px 16px oklch(0% 0 0 / 0.25)" }}
          >
            <span className="block font-bold mb-0.5">{hoveredLayer.label}</span>
            <span className="opacity-80 font-normal">{hoveredLayer.tooltip}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
