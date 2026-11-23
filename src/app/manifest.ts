import type { MetadataRoute } from "next";

// Exportación estática: la ruta se genera una vez en build; el inicio apunta directo al idioma por defecto.
export const dynamic = "force-static";
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Casa Escencia",
    short_name: "Casa Escencia",
    description:
      "Cepillos y peines para el cuidado del cabello. Venta al por mayor para salones y tiendas, con envío a todo El Salvador.",
    lang: "es",
    start_url: "/es/",
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
        url: "/es/wholesale",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
