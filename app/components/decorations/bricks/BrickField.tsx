"use client";

// BrickField — lightweight ambient floating bricks using framer-motion.
// No physics engine. Bricks bob gently and stay fixed in place (pointer-events-none).
// Used as background decoration in TheMoment and Projects sections.
// Respects useReducedMotion — reduced: no animation, bricks shown statically.

import { motion, useReducedMotion } from "framer-motion";

type AmbientBrick = {
  type: "cube" | "plate" | "slope";
  color: string;
  size: number;
  xPct: number;
  yPct: number;
  floatAmt: number;
  floatDur: number;
  delay: number;
  tilt: number;
};

const DEFAULT_BRICKS: AmbientBrick[] = [
  { type: "cube",  color: "yellow", size: 58, xPct:  4, yPct: 18, floatAmt: 12, floatDur: 3.2, delay: 0.0, tilt: -18 },
  { type: "plate", color: "blue",   size: 70, xPct: 90, yPct: 12, floatAmt:  8, floatDur: 2.9, delay: 0.7, tilt:  12 },
  { type: "cube",  color: "green",  size: 48, xPct:  9, yPct: 72, floatAmt: 10, floatDur: 3.6, delay: 0.4, tilt:   6 },
  { type: "slope", color: "red",    size: 72, xPct: 84, yPct: 68, floatAmt: 14, floatDur: 2.6, delay: 1.1, tilt:  -8 },
  { type: "cube",  color: "cobalt", size: 42, xPct: 52, yPct: 88, floatAmt:  6, floatDur: 4.1, delay: 0.5, tilt:  22 },
  { type: "cube",  color: "purple", size: 54, xPct: 47, yPct:  6, floatAmt:  9, floatDur: 3.0, delay: 1.4, tilt: -14 },
];

interface BrickFieldProps {
  bricks?: AmbientBrick[];
  opacity?: number;
  className?: string;
}

export default function BrickField({
  bricks = DEFAULT_BRICKS,
  opacity = 0.45,
  className = "",
}: BrickFieldProps) {
  const reduced = useReducedMotion();

  return (
    <div className={`${className} pointer-events-none`} aria-hidden="true">
      {bricks.map((b, i) => {
        const h = Math.round(b.size * 144 / 128);
        return (
          <motion.div
            key={i}
            className="absolute select-none"
            style={{
              left:      `${b.xPct}%`,
              top:       `${b.yPct}%`,
              width:     b.size,
              height:    h,
              opacity,
              transform: `translate(-50%, -50%) rotate(${b.tilt}deg)`,
              willChange: reduced ? undefined : "transform",
            }}
            animate={
              reduced
                ? {}
                : { y: [0, -b.floatAmt, 0] }
            }
            transition={
              reduced
                ? {}
                : {
                    y: {
                      duration: b.floatDur,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: b.delay,
                    },
                  }
            }
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/bricks/${b.color}-${b.type}.png`}
              width={b.size}
              height={h}
              alt=""
              draggable={false}
              style={{ display: "block" }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
