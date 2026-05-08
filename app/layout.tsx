import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist } from "next/font/google";
import "./globals.css";
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
  icons: { icon: "/favicon.ico" },
  openGraph: {
    type: "website",
    siteName: "Build for Public",
    title: "Build for Public",
    description: DESCRIPTION,
    url: "https://buildforpublic.com",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Build for Public" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Build for Public",
    description: DESCRIPTION,
    images: ["/og-image.png"],
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
        <PostHogProvider>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
