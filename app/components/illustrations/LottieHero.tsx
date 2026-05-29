"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import type { DotLottie } from "@lottiefiles/dotlottie-react";

const LOTTIES = [
  { key: "lego",      label: "Lego",             src: "/lottie/lego.lottie",             stopAt: 0.125 },
  { key: "lego-1",    label: "Lego Alt",         src: "/lottie/Lego-1.lottie",           stopAt: 0.5   },
  { key: "isometric", label: "Isometric Layers", src: "/lottie/Isometric-Layers.lottie", stopAt: 0.25  },
  { key: "ladder",    label: "Ladder",           src: "/lottie/02-Ladder.lottie",         stopAt: 0.5   },
];

export default function LottieHero() {
  const [active, setActive] = useState("lego-1");
  const dotLottieRef = useRef<DotLottie | null>(null);

  const handleRef = useCallback((dl: DotLottie | null) => {
    dotLottieRef.current = dl;
  }, []);

  // Poll each frame — pause at per-animation stopAt threshold
  useEffect(() => {
    const stopAt = LOTTIES.find((l) => l.key === active)?.stopAt ?? 0.5;
    let id: ReturnType<typeof setInterval>;

    const start = () => {
      id = setInterval(() => {
        const dl = dotLottieRef.current;
        if (!dl || !dl.totalFrames) return;
        if (dl.currentFrame >= dl.totalFrames * stopAt) {
          dl.pause();
          clearInterval(id);
        }
      }, 16);
    };

    // Give the player a moment to mount before polling
    const timeout = setTimeout(start, 100);
    return () => {
      clearTimeout(timeout);
      clearInterval(id);
    };
  }, [active]); // restart check whenever animation switches

  const current = LOTTIES.find((l) => l.key === active)!;

  return (
    <div className="relative w-full" style={{ aspectRatio: "1 / 1" }}>
      <DotLottieReact
        key={current.src}
        src={current.src}
        autoplay
        loop={false}
        dotLottieRefCallback={handleRef}
        style={{ width: "100%", height: "100%" }}
      />

      {/* Subtle dot switcher — bottom-right corner */}
      <div
        className="absolute bottom-2 right-2 flex flex-wrap gap-1.5 justify-end max-w-[120px]"
        role="group"
        aria-label="Switch animation"
      >
        {LOTTIES.map((l) => (
          <button
            key={l.key}
            onClick={() => setActive(l.key)}
            aria-pressed={active === l.key}
            title={l.label}
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              border: "none",
              background: active === l.key ? "#000" : "#ccc",
              opacity: active === l.key ? 1 : 0.4,
              cursor: "pointer",
              transition: "opacity 0.2s, background 0.2s",
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}
