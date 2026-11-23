import type { NextConfig } from "next";

// Exportación estática: el resultado de `pnpm build` es la carpeta out/ (HTML, CSS y JS)
// que se sube a public_html. Sin servidor de imágenes, por eso las imágenes van sin optimizar
// (ya están en AVIF/WebP en public/).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    globalNotFound: true,
  },
};

export default nextConfig;
