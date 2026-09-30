import type { Localized } from "@/i18n/config";

// Catálogo estático mientras no exista tabla de productos: son dos piezas y el
// contenido cambia poco. Cuando se migre a DB, esta forma sirve de guía.
// Los pedidos congelan nombre y precio (OrderItem), así que editar aquí no
// altera pedidos ya hechos.
type ProductContent = {
  name: string;
  tagline: string;
  summary: string;
  description: string[];
  details: string[];
  care?: string[];
};

// Casa Escencia vende solo por docena: el precio del catálogo es el de la
// docena completa y el unitario se deriva para mostrarlo como referencia.
export const UNITS_PER_DOZEN = 12;

export type Product = {
  slug: string;
  sku: string;
  dozenPrice: number;
  image: string;
  hoverImage: string;
  gallery: string[];
  content: Localized<ProductContent>;
};

export const products: Product[] = [
  {
    slug: "aura-hair-brush",
    sku: "AHB01",
    dozenPrice: 347.88,
    image: "/images/aura-box.webp",
    hoverImage: "/images/aura-hair.webp",
    gallery: ["/images/aura-box.webp", "/images/aura-hair.webp", "/images/aura-campaign.webp"],
    content: {
      es: {
        name: "Aura Hair Brush",
        tagline: "Aporta volumen y brillo",
        summary:
          "Cepillo de madera hecho a mano con cerdas naturales que aporta volumen, brillo y suavidad al cabello. Ideal para todo tipo de cabello, desenreda con suavidad y convierte tu rutina diaria en un momento de mimo y elegancia.",
        description: [
          "Aura Hair Brush es un cepillo de madera hecho a mano, diseñado para aportar cuidado, belleza e intención a tu ritual diario.",
          "Elaborado con madera de calidad y cerdas naturales, realza el brillo, protege cada hebra y aporta un volumen suave y luminosidad a tu cabello.",
          "Cada pieza refleja la esencia de la elegancia atemporal y la vida consciente, transformando el cuidado cotidiano en un momento de calma y equilibrio.",
        ],
        details: [
          "Apto para todo tipo de cabello",
          "Desenreda con suavidad",
          "Realza el brillo natural",
          "Aporta volumen suave",
        ],
        care: ["Evita el contacto prolongado con agua o la luz directa del sol."],
      },
      en: {
        name: "Aura Hair Brush",
        tagline: "Brings volume and shine",
        summary:
          "A handcrafted wooden brush with natural bristles that adds volume, shine and softness to hair. Ideal for all hair types, it gently detangles and transforms your daily routine into a moment of pampering and elegance.",
        description: [
          "Aura Hair Brush is a handcrafted wooden hair brush designed to bring care, beauty and intention to your daily ritual.",
          "Made with fine-quality wood and natural bristles, it enhances shine, protects each strand and adds gentle volume and luminosity to your hair.",
          "Each piece reflects the essence of timeless elegance and mindful living — transforming everyday grooming into a moment of calm and balance.",
        ],
        details: [
          "Suitable for all hair types",
          "Gently detangles",
          "Enhances natural shine",
          "Adds soft volume",
        ],
        care: ["Avoid prolonged contact with water or direct sunlight."],
      },
    },
  },
  {
    slug: "ease-hair-comb",
    sku: "AHB02",
    dozenPrice: 227.88,
    image: "/images/ease-box.webp",
    hoverImage: "/images/ease-closeup.webp",
    gallery: ["/images/ease-box.webp", "/images/ease-closeup.webp", "/images/ease-studio.webp"],
    content: {
      es: {
        name: "Ease Hair Comb",
        tagline: "Desenredado sin esfuerzo y acabado suave",
        summary:
          "Peine ligero con cerdas flexibles que desenreda sin jalar, reduce la rotura y aporta brillo natural. Ideal para todo tipo de cabello, transforma tu rutina diaria en un cuidado suave y cómodo.",
        description: [
          "Ease Hair Comb es un peine desenredante ligero, diseñado para un cuidado sin esfuerzo.",
          "Fabricado en PP resistente con cerdas flexibles de TPE, desenreda suavemente sin jalar, minimizando la rotura y realzando el brillo natural de tu cabello.",
          "Ideal para cabello húmedo o seco, se desliza con suavidad y convierte el cuidado diario en un gentil ritual de belleza.",
        ],
        details: [
          "Apto para todo tipo de cabello",
          "Desenreda sin jalar",
          "Ayuda a reducir la rotura",
          "Realza el brillo natural",
          "Ligero y cómodo de usar",
        ],
      },
      en: {
        name: "Ease Hair Comb",
        tagline: "Effortless detangling & smooth finish",
        summary:
          "A lightweight comb with flexible bristles that detangles without pulling, reduces breakage and adds natural shine. Ideal for all hair types, it turns your daily routine into gentle, comfortable care.",
        description: [
          "Ease Hair Comb is a lightweight detangling comb designed for effortless care.",
          "Crafted from durable PP and flexible TPE bristles, it gently detangles without pulling, minimizing breakage while enhancing your hair's natural shine.",
          "Ideal for wet or dry hair, it glides smoothly and turns everyday care into a gentle ritual of beauty.",
        ],
        details: [
          "Suitable for all hair types",
          "Gently detangles without pulling",
          "Helps reduce breakage",
          "Enhances natural shine",
          "Lightweight and comfortable to use",
        ],
      },
    },
  },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function unitPrice(product: Product) {
  return product.dozenPrice / UNITS_PER_DOZEN;
}
