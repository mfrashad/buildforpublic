"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Star1, Star6, Star3 } from "@/app/components/decorations/Stars";
import dynamic from "next/dynamic";
import BrickPhysics, { BrickDef } from "@/app/components/decorations/bricks/BrickPhysics";

const BrickAssembly = dynamic(
  () => import("@/app/components/decorations/bricks/BrickAssembly"),
  { ssr: false },
);

// Floating bricks scattered around the edges of the hero — draggable on desktop
const HERO_BRICKS: BrickDef[] = [
  { type: "cube",  color: "yellow", size: 88, xPct:  7,  yPct: 22, visualTilt: -12 },
  { type: "plate", color: "blue",   size: 75, xPct: 91,  yPct: 35, visualTilt:  10 },
  { type: "cube",  color: "green",  size: 65, xPct: 14,  yPct: 75, visualTilt:  18 },
  { type: "slope", color: "red",    size: 72, xPct: 85,  yPct: 72, visualTilt:  -8 },
  { type: "cube",  color: "cobalt", size: 55, xPct: 48,  yPct: 88, visualTilt:  25 },
  { type: "cube",  color: "purple", size: 60, xPct: 62,  yPct:  6, visualTilt: -20 },
  { type: "plate", color: "yellow", size: 68, xPct:  3,  yPct: 48, visualTilt:  15 },
  { type: "slope", color: "cobalt", size: 58, xPct: 78,  yPct:  8, visualTilt:  -5 },
];

const TAGLINES = [
  "Build in public for the public.",
  "We turn changemakers into builders, and builders into changemakers.",
  "Building public-interest tech together.",
  "Ship technology that serves everyone.",
];

export default function Hero() {
  const reduced = useReducedMotion();
  const [taglineIndex, setTaglineIndex] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setTaglineIndex((i) => (i + 1) % TAGLINES.length), 3800);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <section
      className="band band-white grid-bg min-h-screen flex items-center overflow-hidden relative"
      aria-label="Hero"
    >
      {/* Floating + draggable LEGO bricks — desktop: grab and fling; mobile: ambient float */}
      <BrickPhysics
        bricks={HERO_BRICKS}
        gravity={0}
        drag
        className="absolute inset-0 z-0"
      />

      {/* Decorative stars */}
      <div className="absolute top-20 right-[6%] pointer-events-none select-none" aria-hidden>
        <Star1 size={72} color="#fff200" stroke="#000" strokeWidth={6} />
      </div>
      <div className="absolute bottom-20 right-[18%] pointer-events-none select-none" aria-hidden>
        <Star6 size={44} color="#000" />
      </div>
      <div className="absolute top-36 left-[3%] pointer-events-none select-none opacity-70" aria-hidden>
        <Star3 size={56} color="#fff200" stroke="#000" strokeWidth={5} />
      </div>
      <div className="absolute bottom-32 left-[10%] pointer-events-none select-none opacity-50" aria-hidden>
        <Star6 size={28} color="#000" />
      </div>

      {/* Grid: animation left, text right */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full py-24 lg:py-0">
        <div className="grid lg:grid-cols-[1.3fr_1fr] items-center">

          {/* Brick assembly column — desktop only, loops continuously */}
          <div className="hidden lg:flex items-center justify-center lg:-translate-x-[75px] lg:-translate-y-[30px]">
            <BrickAssembly loop autoPlay size={240} />
          </div>

          {/* Text column — pull left into animation's whitespace */}
          <div className="lg:-ml-44">

            <div
              className="relative mb-6"
              aria-live="polite"
            >
              <AnimatePresence mode="wait">
                <motion.h1
                  key={taglineIndex}
                  initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -16, filter: "blur(8px)" }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="heading-display text-4xl sm:text-5xl lg:text-6xl"
                >
                  {TAGLINES[taglineIndex]}
                </motion.h1>
              </AnimatePresence>
            </div>

            <p className="text-xl sm:text-2xl leading-relaxed text-gray-600 mb-10">
              An open-source movement shipping tech for the{" "}
              <span className="highlight">public good.</span>
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="/join"
                className="btn-primary btn-primary-yellow"
              >
                Join the community
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
