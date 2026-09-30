import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { products } from "@/content/products";
import { posts } from "@/content/posts";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/store",
    "/about",
    "/professional-line",
    "/blog",
    "/contact-us",
    ...products.map((product) => `/store/${product.slug}`),
    ...posts.map((post) => `/blog/${post.slug}`),
  ];

  return paths.map((path) => ({
    url: `${site.url}/es${path}`,
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `${site.url}/${l}${path}`])),
    },
  }));
}
