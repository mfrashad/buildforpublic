import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BrandKit from "./BrandKit";

export const metadata: Metadata = {
  title: "Brand & Media Kit",
  description:
    "Logo, colors, typography, voice, and ready-to-use copy for press, partners, and content creators covering Build for Public.",
  openGraph: {
    title: "Brand & Media Kit — Build for Public",
    description:
      "Logo, colors, type, voice, and boilerplate to represent Build for Public accurately.",
    url: "https://buildforpublic.com/brand",
    images: [{ url: "https://buildforpublic.com/og/buildforpublic.png", width: 1600, height: 827 }],
  },
  alternates: { canonical: "https://buildforpublic.com/brand" },
};

export default function BrandPage() {
  return (
    <main>
      <Navbar />
      <BrandKit />
      <Footer />
    </main>
  );
}
