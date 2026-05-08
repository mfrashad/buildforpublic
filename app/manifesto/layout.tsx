import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "The Manifesto — Build for Public Malaysia",
  description:
    "Five numbered claims on what Build for Public Malaysia believes and why. Version 1.0, published May 2026.",
};

export default function ManifestoLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
