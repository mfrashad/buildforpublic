import type { Metadata } from "next";
import LandingPage from "@/components/LandingPage";
import { VARIANTS } from "@/lib/landing-variants";

export const metadata: Metadata = {
  title: "Build for Public — AI-Sharp Wedge",
  robots: { index: false },
};

export default function V4() {
  return <LandingPage variant={VARIANTS[3]} />;
}
