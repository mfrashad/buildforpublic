import type { Metadata } from "next";
import LandingPage from "@/components/LandingPage";
import { VARIANTS } from "@/lib/landing-variants";

export const metadata: Metadata = {
  title: "Build for Public — Alarm / Closed-Doors",
  robots: { index: false },
};

export default function V2() {
  return <LandingPage variant={VARIANTS[1]} />;
}
