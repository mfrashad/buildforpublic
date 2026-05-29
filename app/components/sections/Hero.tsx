"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import LottieHero from "@/app/components/illustrations/LottieHero";
import { Star1, Star6, Star3 } from "@/app/components/decorations/Stars";

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

          {/* Lottie column */}
          <div>
            <LottieHero />
          </div>

          {/* Text column — pull left into animation's internal padding */}
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
                href="https://join.slack.com/t/buildforpublic/shared_invite/TODO"
                className="btn-primary btn-primary-yellow"
              >
                I&apos;m ready to build
              </a>
              <Link href="/manifesto" className="btn-pill btn-pill-outline">
                Read our manifesto
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
