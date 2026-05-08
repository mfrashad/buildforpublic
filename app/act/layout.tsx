import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Take Action — Build for Public Malaysia",
  description:
    "Find exactly what you can do for public-interest AI, given your time and skills.",
};

export default function ActLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
