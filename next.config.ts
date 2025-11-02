import type { NextConfig } from "next";

const nextConfig = {
  experimental: {
    turbotrace: true,
  },
} as Partial<NextConfig>;

export default nextConfig;