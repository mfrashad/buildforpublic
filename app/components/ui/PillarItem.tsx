"use client";

import type { ComponentType } from "react";
import type { AnimatedIconProps } from "@/components/ui/icons/types";

interface PillarItemProps {
  Icon: ComponentType<AnimatedIconProps>;
  title: string;
  description: string;
  bg: string;
}

export default function PillarItem({ Icon, title, description, bg }: PillarItemProps) {
  return (
    <div className="flex flex-col gap-5">
      <div
        className="w-12 h-12 border-2 border-black flex items-center justify-center flex-shrink-0"
        style={{ background: bg }}
      >
        <Icon size={22} color="#000" strokeWidth={2} />
      </div>
      <div>
        <h3 className="heading-display text-base mb-2">{title}</h3>
        <p className="text-sm leading-relaxed text-gray-600" style={{ fontFamily: "var(--font-sans)" }}>
          {description}
        </p>
      </div>
    </div>
  );
}
