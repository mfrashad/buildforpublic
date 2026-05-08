import type { Metadata } from "next";
import LandingPage from "@/components/LandingPage";
import { VARIANTS } from "@/lib/landing-variants";

export const metadata: Metadata = {
  title: "Build for Public — Broad-Tech / Future",
  robots: { index: false },
};

export default function V3() {
  return <LandingPage variant={VARIANTS[2]} />;
}
