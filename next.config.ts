import type { NextConfig } from "next";

const r2Hostname = process.env.R2_PUBLIC_URL
  ? new URL(process.env.R2_PUBLIC_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75],
    remotePatterns: r2Hostname ? [{ protocol: "https", hostname: r2Hostname }] : [],
  },
  experimental: {
    globalNotFound: true,
  },
};

export default nextConfig;
