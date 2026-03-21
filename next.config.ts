import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // SSR on Cloudflare Workers via @opennextjs/cloudflare
  // Do NOT use output: 'export' — we need SSR for R2 data fetching

  images: {
    // Allow R2 public bucket URL for next/image
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.r2.dev",
        pathname: "/**",
      },
      {
        // Cloudflare custom domain for R2 — update with your actual domain
        protocol: "https",
        hostname: "cdn.travelingbeku.com",
        pathname: "/**",
      },
    ],
  },

  // Required for Cloudflare Workers compatibility
  experimental: {
    // Edge runtime compatible for middleware
  },
};

export default nextConfig;
