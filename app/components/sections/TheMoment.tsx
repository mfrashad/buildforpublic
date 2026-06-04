"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import BrickPhysics, { BrickDef } from "@/app/components/decorations/bricks/BrickPhysics";
import StackExplainerModal from "@/app/components/sections/StackExplainerModal";
import HoverTooltip from "@/app/components/HoverTooltip";

const FALLING_BRICKS: BrickDef[] = [
  { type: "cube",  color: "yellow", size: 72, visualTilt: -14 },
  { type: "plate", color: "blue",   size: 58, visualTilt:  20 },
  { type: "cube",  color: "green",  size: 80, visualTilt:  -6 },
  { type: "slope", color: "red",    size: 62, visualTilt:  16 },
  { type: "cube",  color: "cobalt", size: 68, visualTilt: -22 },
  { type: "plate", color: "purple", size: 76, visualTilt:  10 },
  { type: "cube",  color: "yellow", size: 60, visualTilt: -18 },
  { type: "slope", color: "blue",   size: 84, visualTilt:  24 },
  { type: "cube",  color: "red",    size: 65, visualTilt:  -8 },
  { type: "plate", color: "green",  size: 70, visualTilt:  18 },
  { type: "cube",  color: "cobalt", size: 55, visualTilt: -12 },
  { type: "slope", color: "yellow", size: 78, visualTilt:  22 },
  { type: "cube",  color: "purple", size: 66, visualTilt:  -4 },
  { type: "plate", color: "red",    size: 60, visualTilt:  14 },
  { type: "cube",  color: "blue",   size: 74, visualTilt: -20 },
  { type: "slope", color: "green",  size: 56, visualTilt:   8 },
  { type: "cube",  color: "yellow", size: 82, visualTilt: -16 },
  { type: "plate", color: "cobalt", size: 64, visualTilt:  12 },
];

export default function TheMoment() {
  const tippingRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(tippingRef, { once: true, amount: 0.8 });
  const [fixed, setFixed] = useState(false);
  const [explainerOpen, setExplainerOpen] = useState(false);

  return (
    <section className="band band-yellow section-padding px-6 relative overflow-hidden" aria-labelledby="moment-heading">
      <div className="hidden md:block absolute inset-0 z-0">
        <BrickPhysics
          bricks={FALLING_BRICKS}
          gravity={0.8}
          drag
          respawn
          className="absolute inset-0"
        />
      </div>
      <div className="max-w-2xl mx-auto relative z-10">
        <h2
          id="moment-heading"
          className="heading-section mb-10 overflow-visible whitespace-nowrap"
        >
          {"We are at a "}
          <motion.span
            ref={tippingRef}
            className="inline-block relative z-20 cursor-pointer select-none"
            style={{ transformOrigin: "0% 0%", marginLeft: "0.05em" }}
            initial={{ rotate: 0, y: 0 }}
            animate={{ rotate: fixed ? 0 : inView ? 10 : 0, y: fixed ? 0 : inView ? 8 : 0 }}
            transition={{
              type: "spring",
              stiffness: fixed ? 200 : 35,
              damping: fixed ? 20 : 9,
              delay: fixed ? 0 : 1.5,
            }}
            onClick={() => setFixed(f => !f)}
          >
            tipping point.
          </motion.span>
        </h2>

        <div className="space-y-6 text-lg leading-relaxed text-gray-700" style={{ fontFamily: "var(--font-sans)" }}>
          <p>
            AI is handing humanity almost unimaginable power, but the speed and breadth of this shift are accelerating{" "}
            <HoverTooltip
              href="https://fortune.com/2026/01/27/anthropic-billionaire-cofounders-ceo-dario-amodei-giving-away-80-percent-of-wealth-fighting-inequality-ai-revolution/"
              content="Anthropic CEO Dario Amodei on AI widening inequality — pledging 80% of his wealth to fight it. Fortune, Jan 2026."
              triggerClassName="-mx-0.5 px-0.5 rounded-[3px] underline underline-offset-2 decoration-black/30 hover:bg-black hover:text-white hover:no-underline transition-all duration-150"
              width="w-60"
            >
              the wealth gap
            </HoverTooltip>
            {" "}and concentrating power in the hands of a few.
          </p>
          <p>
            Right now, most of the technology that dictates our lives is driven by{" "}
            <HoverTooltip
              onAction={() => setExplainerOpen(true)}
              content="How tech got captured by private interest, and what public tech looks like. Tap to explore."
              triggerClassName="-mx-0.5 px-0.5 rounded-[3px] underline underline-offset-2 decoration-black/30 hover:bg-black hover:text-white hover:no-underline transition-all duration-150 cursor-pointer"
              width="w-72"
            >
              private interest, designed to capture attention and maximize profit rather than serve the public
            </HoverTooltip>
            . We cannot rely on a few corporations to build everything our society needs from AI, and we cannot afford the risk that they won&apos;t.
          </p>
          <p className="font-bold text-black">
            If left entirely to commercial incentives, AI will widen social divides and leave the most critical societal problems under-resourced. We desperately need a parallel ecosystem —{" "}
            <HoverTooltip
              href="https://blog.mozilla.org/en/mozilla/ai/public-ai-counterpoint/"
              content="Mozilla's case for open, non-commercial AI as a counterweight to Big Tech — and why it matters."
              triggerClassName="-mx-0.5 px-0.5 rounded-[3px] underline underline-offset-2 decoration-black/40 hover:bg-black hover:text-white hover:no-underline transition-all duration-150"
              width="w-60"
            >
              Public AI
            </HoverTooltip>
            {" "}— that runs on non-commercial incentives, where technology is accessible, transparent, and built for everyone.
          </p>
        </div>
      </div>
      <StackExplainerModal open={explainerOpen} onClose={() => setExplainerOpen(false)} />
    </section>
  );
}
