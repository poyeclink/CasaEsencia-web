import type { MetadataRoute } from "next";

// start_url "/" pasa por el proxy, que redirige al idioma del navegador.
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Casa Escencia",
    short_name: "Casa Escencia",
    description:
      "Cepillos y peines para el cuidado del cabello. Venta por docena con envío a todo El Salvador.",
    lang: "es",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fbf8ee",
    theme_color: "#153247",
    categories: ["shopping", "lifestyle"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      {
        name: "Tienda",
        url: "/es/store",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Mis pedidos",
        url: "/es/my-account",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
