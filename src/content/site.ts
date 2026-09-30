export const site = {
  name: "Casa Escencia",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://casaescencia.com",
  phone: "+503 6960 1693",
  whatsapp: "50369601693",
  email: "casaescencia@gmail.com",
  address: "Santa Elena, San Salvador, El Salvador",
  instagram: "https://www.instagram.com/casa.escencia",
};

export const departments = [
  "Ahuachapán",
  "Cabañas",
  "Chalatenango",
  "Cuscatlán",
  "La Libertad",
  "La Paz",
  "La Unión",
  "Morazán",
  "San Miguel",
  "San Salvador",
  "San Vicente",
  "Santa Ana",
  "Sonsonate",
  "Usulután",
] as const;

export type InstagramPost = {
  type: "p" | "reel";
  code: string;
  image: string;
  alt: string;
};

// Publicaciones públicas de @casa.escencia. La imagen es una copia local
// (public/images/instagram) para no depender del CDN de Instagram, cuyas URLs
// caducan; los reels se reproducen con el embed oficial solo al abrirlos.
// Para agregar uno: guardar la imagen y añadir su shortcode (URL del post).
export const instagramPosts: InstagramPost[] = [
  {
    type: "reel",
    code: "DdWrWSlRX00",
    image: "reel-ritual",
    alt: "Ritual de cuidado con Casa Escencia",
  },
  {
    type: "p",
    code: "DdmUTrwxVb_",
    image: "jaque-mate",
    alt: "Aura Hair Brush · ¿Cuál es tu jaque mate?",
  },
  { type: "p", code: "Ddj2nYFJtKM", image: "rituales-de-hoy", alt: "Rituales de hoy" },
  {
    type: "p",
    code: "DdlwClQRwR6",
    image: "ritual-strategy",
    alt: "Cepillos Casa Escencia sobre un tablero de ajedrez",
  },
  {
    type: "reel",
    code: "DdKSCYYhNIa",
    image: "reel-matices",
    alt: "Casa Escencia en Matices by Ruth",
  },
  {
    type: "p",
    code: "Dc_K1KSRL0-",
    image: "aura-healthy-hair",
    alt: "Healthy hair looks good on you",
  },
  { type: "p", code: "Dc_Lt2ExatH", image: "aura-poster", alt: "Aura Hair Brush" },
  {
    type: "p",
    code: "DdjokG0kXsc",
    image: "sienna-molding",
    alt: "Sienna Molding Brush, cepillo térmico",
  },
  { type: "p", code: "DdlvR5Hx4cF", image: "opening-move", alt: "The opening move" },
];

export function instagramUrl(post: Pick<InstagramPost, "type" | "code">) {
  return `https://www.instagram.com/${post.type}/${post.code}/`;
}

export function whatsappLink(text?: string) {
  const query = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${site.whatsapp}${query}`;
}
