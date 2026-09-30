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
  async headers() {
    return [
      {
        // El service worker nunca debe quedar en caché del navegador/CDN: así cada
        // despliegue lo actualiza y no se queda una versión vieja instalada.
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
};

export default nextConfig;
