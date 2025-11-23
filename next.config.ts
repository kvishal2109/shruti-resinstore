import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "**.firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "laxmisingla.catalog.to",
      },
      {
        protocol: "https",
        hostname: "laxmisingla.catalog.to",
      },
      {
        protocol: "http",
        hostname: "**.catalog.to",
      },
      {
        protocol: "https",
        hostname: "**.catalog.to",
      },
      {
        protocol: "https",
        hostname: "d19s00k70wfv0n.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "d1h96izmtdkx5o.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "**.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "cdn.quicksell.co",
      },
      {
        protocol: "https",
        hostname: "catalogue-cdn.quicksell.co",
      },
    ],
  },
};

export default nextConfig;
