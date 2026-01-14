import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "api.edulifeitschool.com",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
