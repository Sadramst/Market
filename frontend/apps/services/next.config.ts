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
};

export default nextConfig;
