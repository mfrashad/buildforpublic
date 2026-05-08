import type { Metadata } from "next";
import LandingPage from "@/components/LandingPage";
import { VARIANTS } from "@/lib/landing-variants";

export const metadata: Metadata = {
  title: "Build for Public",
  description:
    "A movement of builders shipping open code for the public interest — open-source software for communities private capital won't serve.",
  alternates: { canonical: "https://buildforpublic.com" },
  openGraph: {
    title: "Build for Public",
    description:
      "A movement of builders shipping open code for the public interest — open-source software for communities private capital won't serve.",
    url: "https://buildforpublic.com",
  },
};

export default function Home() {
  return <LandingPage variant={VARIANTS[0]} />;
}
