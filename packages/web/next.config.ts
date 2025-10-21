import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize production builds
  reactStrictMode: true,

  // Enable SWC minification for faster builds
  swcMinify: true,

  // Optimize images
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ["@clerk/nextjs", "mapbox-gl", "react-map-gl"],
  },
};

export default nextConfig;
