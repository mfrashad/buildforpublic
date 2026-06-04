"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  content: ReactNode;
  href?: string;
  onAction?: () => void;
  triggerClassName?: string;
  width?: string;
}

export default function HoverTooltip({
  children,
  content,
  href,
  onAction,
  triggerClassName = "",
  width = "w-60",
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [open]);

  const isTouch = () =>
    typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

  const handleTriggerClick = (e: React.MouseEvent) => {
    if (isTouch()) {
      e.preventDefault();
      setOpen((o) => !o);
      return;
    }
    // desktop: span triggers need to call onAction (links navigate naturally via <a>)
    if (onAction) onAction();
  };

  const handleTooltipClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (href) window.open(href, "_blank", "noopener,noreferrer");
    else if (onAction) onAction();
    setOpen(false);
  };

  const Trigger = href ? "a" : "span";
  const triggerProps = href
    ? { href, target: "_blank" as const, rel: "noopener noreferrer" }
    : { role: "button" as const, tabIndex: 0 };

  return (
    <span ref={ref} className="group relative inline">
      <Trigger
        {...(triggerProps as object)}
        className={triggerClassName}
        onClick={handleTriggerClick}
      >
        {children}
      </Trigger>
      <span
        onClick={handleTooltipClick}
        className={[
          `absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 ${width} bg-black text-white text-xs leading-relaxed px-3 py-2 z-50 transition-opacity duration-150`,
          open ? "opacity-100 cursor-pointer" : "opacity-0 pointer-events-none",
          "md:pointer-events-none md:opacity-0 md:group-hover:opacity-100",
        ].join(" ")}
      >
        {content}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black" />
      </span>
    </span>
  );
}
