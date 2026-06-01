import type { MetadataRoute } from "next";

const BASE = "https://buildforpublic.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/manifesto`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/volunteer`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];
}
