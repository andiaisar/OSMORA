import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove static export untuk mendukung API routes
  // output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
