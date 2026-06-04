"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import AttentionArt from "@/app/components/illustrations/publicstack/AttentionArt";
import StackTechArt from "@/app/components/illustrations/publicstack/StackTechArt";

const STEPS = [
  {
    key: "attention",
    label: "Technology isn't built for you",
    body: "Your phone helps you call home, find food, and get places. But you're not who it's built for. The people who design the devices, write the algorithms, and own the infrastructure build them around their own goals. Most consumer tech, and social media especially, is engineered to capture your attention and keep you consuming.",
    art: <AttentionArt />,
  },
  {
    key: "three-types",
    label: "Three kinds of tech",
    body: "Not all technology is built the same way. Depending on who builds it and why, it takes one of three forms: Private tech, State tech, or Public tech. Each comes with different incentives, trade-offs, and a different relationship with the people who use it.",
    art: null,
  },
  {
    key: "private",
    label: "Private tech",
    body: "A phone is sold by a company with a commercial interest, and selling you the device isn't enough. They want to know how, where, and with whom you use it, because that knowledge makes them money. Free apps often trade a long terms-and-conditions list for the right to harvest your data. The whole stack serves the maker's bottom line, at the cost of your privacy.",
    art: <StackTechArt variant="private" />,
  },
  {
    key: "state",
    label: "State tech",
    body: "Some technology is built by governments to serve citizens (filing taxes online, for instance), which is fine when the security is solid. But the same data infrastructure can be used to analyze, influence, and even police behavior, at the expense of privacy and democratic values. It's worth asking what happens in the layers beneath the surface, and whether we agree.",
    art: <StackTechArt variant="state" />,
  },
  {
    key: "public",
    label: "Public tech",
    body: "So we need an alternative: technology built around public values from the ground up, asking the hard questions and producing tools that don't spy on us or sell our data. Getting it fully right may never be possible, but it's worth trying, and it's the whole point of Build for Public.",
    art: <StackTechArt variant="public" />,
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function StackExplainerModal({ open, onClose }: Props) {
  const [step, setStep] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Reset to step 0 when modal opens
  useEffect(() => {
    if (open) {
      setStep(0);
      setTimeout(() => cardRef.current?.focus(), 50);
    }
  }, [open]);

  // Close on Esc; lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];

  const variants = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
      };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={reduced ? {} : { opacity: 0 }}
            animate={reduced ? {} : { opacity: 1 }}
            exit={reduced ? {} : { opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/60"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Card */}
          <motion.div
            key="card"
            initial={reduced ? {} : { opacity: 0, scale: 0.96, y: 16 }}
            animate={reduced ? {} : { opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? {} : { opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-6 pointer-events-none"
          >
            <div
              ref={cardRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="explainer-heading"
              tabIndex={-1}
              className="pointer-events-auto w-full max-w-lg bg-white border-2 border-black outline-none"
              style={{ boxShadow: "var(--shadow-hard-lg)" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-5 pb-0">
                {/* Progress dots */}
                <div className="flex gap-2" role="progressbar" aria-valuenow={step + 1} aria-valuemax={STEPS.length}>
                  {STEPS.map((s, i) => (
                    <button
                      key={s.key}
                      onClick={() => setStep(i)}
                      className="w-2.5 h-2.5 rounded-full border-2 border-black transition-colors duration-150"
                      style={{ background: i === step ? "#000" : "transparent" }}
                      aria-label={`Go to step ${i + 1}: ${s.label}`}
                    />
                  ))}
                </div>
                {/* Close button */}
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="text-lg leading-none w-8 h-8 flex items-center justify-center border-2 border-black hover:bg-black hover:text-white transition-colors duration-150"
                >
                  ✕
                </button>
              </div>

              {/* Scrollable content */}
              <div className="overflow-y-auto max-h-[70vh]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.key}
                    {...variants}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="px-6 pt-5 pb-6"
                  >
                    {/* Illustration */}
                    {current.art && (
                      <div className="w-full mb-5 flex items-center justify-center [&_svg]:max-h-[380px] [&_svg]:w-auto [&_svg]:max-w-full">
                        {current.art}
                      </div>
                    )}

                    {/* Step label eyebrow */}
                    <p className="eyebrow mb-2" style={{ fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, color: "#666" }}>
                      {String(step + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
                    </p>

                    {/* Heading */}
                    <h2 id="explainer-heading" className="font-bold text-xl mb-3" style={{ fontFamily: "var(--font-display)", lineHeight: 1.2 }}>
                      {current.label}
                    </h2>

                    {/* Body */}
                    <p className="text-base leading-relaxed text-gray-700" style={{ fontFamily: "var(--font-sans)" }}>
                      {current.body}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Attribution */}
              <p className="px-6 pb-2 text-center text-[11px] text-gray-400" style={{ fontFamily: "var(--font-sans)" }}>
                Source:{" "}
                <a
                  href="https://publicstack.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-black transition-colors duration-150"
                >
                  publicstack.net
                </a>
              </p>

              {/* Footer nav */}
              <div className="flex gap-3 px-6 pb-5 pt-0 border-t-0">
                {step > 0 && (
                  <button
                    onClick={() => setStep(s => s - 1)}
                    className="flex-1 py-2.5 border-2 border-black font-semibold text-sm hover:bg-black hover:text-white transition-colors duration-150"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    ← Back
                  </button>
                )}
                <button
                  onClick={() => isLast ? onClose() : setStep(s => s + 1)}
                  className="flex-1 py-2.5 border-2 border-black bg-black text-white font-semibold text-sm hover:bg-white hover:text-black transition-colors duration-150"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {isLast ? "Done" : "Next →"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
