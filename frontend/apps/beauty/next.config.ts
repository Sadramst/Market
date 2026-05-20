import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.appilico.com.au",
      },
    ],
  },
  // TODO: Add rewrites for SEO-friendly URLs
  // TODO: Add redirects for legacy URLs
};

export default nextConfig;
