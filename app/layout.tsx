import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { PostHogProvider } from "./PostHogProvider";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const DESCRIPTION =
  "A movement of builders shipping open code for the public interest — open-source software for communities private capital won't serve.";

export const metadata: Metadata = {
  metadataBase: new URL("https://buildforpublic.com"),
  title: {
    default: "Build for Public",
    template: "%s — Build for Public",
  },
  description: DESCRIPTION,
  keywords: [
    "open source",
    "civic tech",
    "public interest tech",
    "NGO software",
    "volunteer builders",
    "social impact",
    "community",
    "Malaysia",
    "Southeast Asia",
  ],
  authors: [{ name: "Build for Public", url: "https://buildforpublic.com" }],
  creator: "Build for Public",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    siteName: "Build for Public",
    title: "Build for Public",
    description: DESCRIPTION,
    url: "https://buildforpublic.com",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@build4public",
    creator: "@build4public",
    title: "Build for Public",
    description: DESCRIPTION,
  },
  alternates: {
    canonical: "https://buildforpublic.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${geist.variable}`}>
      <body className="antialiased">
        <ClerkProvider signUpForceRedirectUrl="/join/complete">
          <PostHogProvider>
            <ConvexClientProvider>{children}</ConvexClientProvider>
          </PostHogProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
