"use client";

import type { ComponentType } from "react";
import type { AnimatedIconProps } from "@/components/ui/icons/types";

interface PersonaTileProps {
  Icon: ComponentType<AnimatedIconProps>;
  title: string;
  description: string;
  accent: string;
  bg: string;
}

export default function PersonaTile({ Icon, title, description, accent, bg }: PersonaTileProps) {
  return (
    <div className="card p-8 flex flex-col gap-6">
      <div
        className="w-14 h-14 border-2 border-black flex items-center justify-center flex-shrink-0"
        style={{ background: bg }}
      >
        <Icon size={28} color={accent} strokeWidth={2} />
      </div>
      <div>
        <h3 className="heading-display text-lg mb-3">{title}</h3>
        <p className="text-sm leading-relaxed text-gray-600" style={{ fontFamily: "var(--font-sans)" }}>
          {description}
        </p>
      </div>
    </div>
  );
}
