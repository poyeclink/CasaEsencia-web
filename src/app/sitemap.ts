import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { products } from "@/content/products";
import { posts } from "@/content/posts";
import { legalPages } from "@/content/legal";
import { site } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/wholesale",
    "/about",
    "/professional-line",
    "/blog",
    "/contact-us",
    ...products.map((product) => `/wholesale/${product.slug}`),
    ...posts.map((post) => `/blog/${post.slug}`),
    ...legalPages.map((page) => `/${page.slug}`),
  ];

  return paths.map((path) => ({
    url: `${site.url}/es${path}/`,
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `${site.url}/${l}${path}/`])),
    },
  }));
}
