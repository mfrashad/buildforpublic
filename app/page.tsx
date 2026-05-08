import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsBar from "@/components/StatsBar";
import InitiativesSection from "@/components/InitiativesSection";
import CommunitySection from "@/components/rooms/CommunityRoom";
import AdvocacySection from "@/components/rooms/AdvocacyRoom";
import ProjectsSection from "@/components/rooms/ProjectsRoom";
import VisionSection from "@/components/rooms/VisionRoom";
import WhyNowRoom from "@/components/rooms/WhyNowRoom";
import JoinSection from "@/components/rooms/JoinRoom";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "AI for Good Malaysia",
  description:
    "A volunteer community shipping open-source AI tools for NGOs, creating AI literacy content, and running builder events across Southeast Asia.",
  alternates: { canonical: "https://aiforgood.my" },
  openGraph: {
    title: "AI for Good Malaysia",
    description:
      "A volunteer community shipping open-source AI tools for NGOs, creating AI literacy content, and running builder events across Southeast Asia.",
    url: "https://aiforgood.my",
  },
};

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <StatsBar />
      <VisionSection />
      <WhyNowRoom />
      <InitiativesSection />
      <CommunitySection />
      <AdvocacySection />
      <ProjectsSection />
      <JoinSection />
      <Footer />
    </main>
  );
}
