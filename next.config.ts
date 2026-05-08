import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/join",
        destination: "/volunteer",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
