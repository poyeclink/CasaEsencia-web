import type { Metadata } from "next";
import { defaultLocale, locales, type Locale } from "@/i18n/config";

// Cada página declara su propio canonical: si se definiera en el layout, todas
// las subpáginas heredarían el canonical de la home.
export function pageMetadata(
  lang: Locale,
  path: string,
  { title, description, image }: { title?: string; description?: string; image?: string },
): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}${path}`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}${path}`])),
        "x-default": `/${defaultLocale}${path}`,
      },
    },
    openGraph: image ? { title, description, images: [image] } : undefined,
  };
}
