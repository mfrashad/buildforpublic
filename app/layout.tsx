import type { Metadata } from "next";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { PostHogProvider } from "./PostHogProvider";

const DESCRIPTION =
  "Open-source AI projects, community, and advocacy for social impact in Southeast Asia and beyond.";

export const metadata: Metadata = {
  metadataBase: new URL("https://aiforgood.my"),
  title: {
    default: "AI for Good Malaysia",
    template: "%s — AI for Good Malaysia",
  },
  description: DESCRIPTION,
  icons: { icon: "/favicon.ico" },
  openGraph: {
    type: "website",
    siteName: "AI for Good Malaysia",
    title: "AI for Good Malaysia",
    description: DESCRIPTION,
    url: "https://aiforgood.my",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "AI for Good Malaysia" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@maboroshiiii",
    title: "AI for Good Malaysia",
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://aiforgood.my",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <PostHogProvider>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
