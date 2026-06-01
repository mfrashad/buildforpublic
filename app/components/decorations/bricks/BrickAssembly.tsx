"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion, useAnimationControls } from "framer-motion";

// ── Constants ──────────────────────────────────────────────────────────────────
const SPRITE_W = 60;
const SPRITE_H = Math.round(SPRITE_W * 144 / 128); // 68
const DX = 30;   // half sprite width — side faces touch
const DZ = 15;   // DX/2 — 2:1 iso recede
const UP = 33;   // px per stacked level
const PAD = 6;

// Projection: +x → screen (+DX, +DZ),  +z → screen (−DX, +DZ),  +level → (0, −UP)
// Large x+z = foreground (wide base faces viewer); small x+z = background.

const PALETTE = ["yellow", "green", "blue", "cobalt", "purple", "red"] as const;
type Color = (typeof PALETTE)[number];

function randomColors(n: number): Color[] {
  return Array.from({ length: n }, () => PALETTE[Math.floor(Math.random() * PALETTE.length)]);
}

// ── Shape definitions: [x, z, level] — sorted by (x+z) ascending (painter's order) ──

// 0 · Pyramid 4-level (20 bricks)
const PYRAMID = [
  [3,0,0],[2,1,0],[1,2,0],[0,3,0],   // front row (x+z=3), level 0
  [2,0,0],[1,1,0],[0,2,0],            // x+z=2, level 0
  [1,0,0],[0,1,0],[0,0,0],            // x+z=1..0, level 0
  [2,0,1],[1,1,1],[0,2,1],            // level 1 x+z=2
  [1,0,1],[0,1,1],[0,0,1],            // level 1 x+z=1..0
  [1,0,2],[0,1,2],[0,0,2],            // level 2
  [0,0,3],                            // apex
] as const;

// 1 · Solid cube 3×3×3 (27 bricks)
const CUBE = [
  // x+z=0
  [0,0,0],[0,0,1],[0,0,2],
  // x+z=1
  [1,0,0],[0,1,0],[1,0,1],[0,1,1],[1,0,2],[0,1,2],
  // x+z=2
  [2,0,0],[1,1,0],[0,2,0],[2,0,1],[1,1,1],[0,2,1],[2,0,2],[1,1,2],[0,2,2],
  // x+z=3
  [2,1,0],[1,2,0],[2,1,1],[1,2,1],[2,1,2],[1,2,2],
  // x+z=4
  [2,2,0],[2,2,1],[2,2,2],
] as const;

// 2 · Staircase 2-wide, 4 steps (20 bricks) — z=3 front (1 level high), z=0 back (4 levels)
const STAIRS = [
  // back column (z=0), levels 0-3
  [0,0,0],[0,0,1],[0,0,2],[0,0,3],
  // x=1,z=0 and x=0,z=1 — levels 0-2 (3 levels)
  [1,0,0],[0,1,0],[1,0,1],[0,1,1],[1,0,2],[0,1,2],[1,0,3],
  // x=1,z=1 and x=0,z=2 — levels 0-1 (2 levels)
  [1,1,0],[0,2,0],[1,1,1],[0,2,1],[1,1,2],
  // x=1,z=2 and x=0,z=3 — level 0 (1 level)
  [1,2,0],[0,3,0],[1,2,1],
  // front (z=3), level 0
  [1,3,0],
] as const;

// 3 · City blocks 4×4 grid (36 bricks) — varying column heights
// Heights h[x][z]: (0,0)=2,(0,1)=1,(0,2)=3,(0,3)=1
//                  (1,0)=1,(1,1)=4,(1,2)=1,(1,3)=3
//                  (2,0)=3,(2,1)=1,(2,2)=4,(2,3)=2
//                  (3,0)=1,(3,1)=3,(3,2)=2,(3,3)=4
const CITY = [
  // x+z=0
  [0,0,0],[0,0,1],
  // x+z=1
  [1,0,0],[0,1,0],
  // x+z=2
  [2,0,0],[1,1,0],[0,2,0],[2,0,1],[1,1,1],[0,2,1],[2,0,2],[1,1,2],[0,2,2],[1,1,3],
  // x+z=3
  [3,0,0],[2,1,0],[1,2,0],[0,3,0],
  // x+z=4
  [3,1,0],[2,2,0],[1,3,0],[3,1,1],[2,2,1],[1,3,1],[3,1,2],[2,2,2],[1,3,2],[2,2,3],
  // x+z=5
  [3,2,0],[2,3,0],[3,2,1],[2,3,1],
  // x+z=6
  [3,3,0],[3,3,1],[3,3,2],[3,3,3],
] as const;

const SHAPES = [PYRAMID, CUBE, STAIRS, CITY] as const;
const SHAPE_LABELS = ["pyramid", "cube", "stairs", "city"];

// ── Layout computation ─────────────────────────────────────────────────────────

type Brick = {
  color: Color;
  ax: number; ay: number;
  sx: number; sy: number; sr: number;
  sort: number; ord: number;
};

function computeLayout(
  shape: readonly (readonly [number, number, number])[],
  colors: Color[],
): { bricks: Brick[]; baseW: number; baseH: number } {
  const raw: (Brick & { px: number; py: number })[] = [];

  shape.forEach(([x, z, level], ord) => {
    const px = (x - z) * DX;
    const py = (x + z) * DZ - level * UP;
    const sort = (x + z) * 20 + level * 3;
    raw.push({ color: colors[ord] ?? "yellow", px, py, ax: 0, ay: 0, sx: 0, sy: 0, sr: 0, sort, ord });
  });

  const minX = Math.min(...raw.map(b => b.px));
  const maxX = Math.max(...raw.map(b => b.px + SPRITE_W));
  const minY = Math.min(...raw.map(b => b.py));
  const maxY = Math.max(...raw.map(b => b.py + SPRITE_H));

  const baseW = maxX - minX + PAD * 2;
  const baseH = maxY - minY + PAD * 2;
  const cx = baseW / 2;
  const cy = baseH / 2;

  raw.forEach((b, i) => {
    b.ax = b.px - minX + PAD;
    b.ay = b.py - minY + PAD;
    const dx = b.ax + SPRITE_W / 2 - cx;
    const dy = b.ay + SPRITE_H / 2 - cy;
    const len = Math.hypot(dx, dy) || 1;
    const dist = 230 + (i % 3) * 45;
    b.sx = (dx / len) * dist;
    b.sy = (dy / len) * dist - 110;
    b.sr = ((i * 53) % 70) - 35;
  });

  raw.sort((a, b) => a.sort - b.sort);

  return {
    bricks: raw.map(({ px, py, ...rest }) => rest) as Brick[],
    baseW,
    baseH,
  };
}

// Precompute max dimensions across all shapes for stable container sizing
const SHAPE_DIMS = SHAPES.map(s =>
  computeLayout([...s], Array(s.length).fill("yellow") as Color[])
);
const CONTAINER_W = Math.max(...SHAPE_DIMS.map(d => d.baseW));
const CONTAINER_H = Math.max(...SHAPE_DIMS.map(d => d.baseH));

// ── Component ──────────────────────────────────────────────────────────────────

interface BrickAssemblyProps {
  /** Target rendered width in px. Default: CONTAINER_W (natural size). */
  size?: number;
  /** Cycle through shapes and loop continuously. */
  loop?: boolean;
  /** Trigger immediately on mount instead of waiting for scroll. */
  autoPlay?: boolean;
}

export default function BrickAssembly({ size, loop = false, autoPlay = false }: BrickAssemblyProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inViewFromScroll = useInView(ref, { once: !loop, amount: 0.35 });
  const reduced = useReducedMotion();
  const controls = useAnimationControls();

  const [config, setConfig] = useState(() => ({
    shapeIdx: 0,
    colors: randomColors(SHAPES[0].length),
  }));

  const { bricks, baseW, baseH } = useMemo(
    () => computeLayout([...SHAPES[config.shapeIdx]], config.colors),
    [config],
  );

  const scale = (size ?? CONTAINER_W) / CONTAINER_W;
  const brickW = Math.round(SPRITE_W * scale);
  const brickH = Math.round(SPRITE_H * scale);

  // Always-fresh refs so the while loop never captures stale closure values
  const bricksRef = useRef(bricks);
  bricksRef.current = bricks;
  const scaleRef = useRef(scale);
  scaleRef.current = scale;

  const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

  useEffect(() => {
    if (reduced) return;
    if (!autoPlay && !inViewFromScroll) return;

    let cancelled = false;
    let shapeIdx = 0;

    const runLoop = async () => {
      while (!cancelled) {
        const curBricks = bricksRef.current;
        const curScale = scaleRef.current;
        const lastOrd = curBricks.length - 1;

        // Instantly scatter to this shape's start positions
        controls.set((i: number) => {
          const b = curBricks[i];
          return b
            ? { x: b.sx * curScale, y: b.sy * curScale, rotate: b.sr, opacity: 0 }
            : { opacity: 0 };
        });

        // Assemble
        await controls.start((i: number) => ({
          x: 0, y: 0, rotate: 0, opacity: 1,
          transition: {
            type: "spring", stiffness: 120, damping: 15,
            delay: (curBricks[i]?.ord ?? 0) * 0.055,
          },
        }));
        if (cancelled) break;
        if (!loop) break;

        await sleep(1500);
        if (cancelled) break;

        // Disassemble
        await controls.start((i: number) => {
          const b = curBricks[i];
          return b
            ? {
                x: b.sx * curScale,
                y: b.sy * curScale,
                rotate: b.sr,
                opacity: 0,
                transition: {
                  type: "spring", stiffness: 90, damping: 13,
                  delay: (lastOrd - b.ord) * 0.04,
                },
              }
            : { opacity: 0, transition: { duration: 0 } };
        });
        if (cancelled) break;

        await sleep(300);
        if (cancelled) break;

        // Advance to next shape — update React state, then wait for re-render
        shapeIdx = (shapeIdx + 1) % SHAPES.length;
        setConfig({ shapeIdx, colors: randomColors(SHAPES[shapeIdx].length) });
        // Wait for React to re-render and bricksRef.current to update
        await sleep(50);
      }
    };

    runLoop();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inViewFromScroll, autoPlay, reduced, loop]);

  return (
    <div
      ref={ref}
      className="relative select-none"
      style={{
        width: Math.round(CONTAINER_W * scale),
        height: Math.round(CONTAINER_H * scale),
      }}
      role="img"
      aria-label={`Bricks assembling into a ${SHAPE_LABELS[config.shapeIdx]}`}
    >
      {/* Center each shape within the fixed container */}
      <div
        className="absolute"
        style={{
          left: Math.round(((CONTAINER_W - baseW) / 2) * scale),
          top: Math.round(((CONTAINER_H - baseH) / 2) * scale),
          width: Math.round(baseW * scale),
          height: Math.round(baseH * scale),
        }}
      >
        {bricks.map((b, i) => (
          <motion.div
            key={i}
            custom={i}
            className="absolute"
            style={{
              left: Math.round(b.ax * scale),
              top: Math.round(b.ay * scale),
              width: brickW,
              height: brickH,
              willChange: "transform, opacity",
            }}
            initial={
              reduced
                ? { x: 0, y: 0, rotate: 0, opacity: 1 }
                : { x: b.sx * scale, y: b.sy * scale, rotate: b.sr, opacity: 0 }
            }
            animate={reduced ? { x: 0, y: 0, rotate: 0, opacity: 1 } : controls}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/bricks/${b.color}-cube.png`}
              width={brickW}
              height={brickH}
              alt=""
              draggable={false}
              style={{ display: "block" }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
