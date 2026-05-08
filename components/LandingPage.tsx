import type { Variant } from "@/lib/landing-variants";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsBar from "@/components/StatsBar";
import VisionSection from "@/components/rooms/VisionRoom";
import WhyNowRoom from "@/components/rooms/WhyNowRoom";
import InitiativesSection from "@/components/InitiativesSection";
import CommunitySection from "@/components/rooms/CommunityRoom";
import AdvocacySection from "@/components/rooms/AdvocacyRoom";
import ProjectsSection from "@/components/rooms/ProjectsRoom";
import JoinSection from "@/components/rooms/JoinRoom";
import Footer from "@/components/Footer";

interface LandingPageProps {
  variant: Variant;
}

export default function LandingPage({ variant }: LandingPageProps) {
  return (
    <main>
      <Navbar />
      <HeroSection hero={variant.hero} slogan={variant.slogan} />
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
