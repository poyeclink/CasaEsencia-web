import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Truck } from "lucide-react";
import { hasLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getProduct, products, UNITS_PER_DOZEN, unitPrice } from "@/content/products";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { formatCurrency } from "@/lib/utils";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { ProductCard } from "@/components/shop/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function generateStaticParams() {
  return locales.flatMap((lang) => products.map((product) => ({ lang, slug: product.slug })));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/[lang]/store/[slug]">) {
  const { lang, slug } = await params;
  const product = getProduct(slug);
  if (!hasLocale(lang) || !product) return {};
  const content = product.content[lang];
  return pageMetadata(lang, `/store/${slug}`, {
    title: content.name,
    description: content.summary,
    image: product.gallery[0],
  });
}

export default async function ProductPage({ params }: PageProps<"/[lang]/store/[slug]">) {
  const { lang, slug } = await params;
  const product = getProduct(slug);
  if (!hasLocale(lang) || !product) notFound();
  const dict = await getDictionary(lang);
  const t = dict.product;
  const content = product.content[lang];
  const related = products.filter((p) => p.slug !== slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: content.name,
    description: content.summary,
    sku: product.sku,
    brand: { "@type": "Brand", name: site.name },
    image: product.gallery.map((src) => `${site.url}${src}`),
    offers: {
      "@type": "Offer",
      price: product.dozenPrice,
      priceCurrency: "USD",
      eligibleQuantity: { "@type": "QuantitativeValue", value: UNITS_PER_DOZEN, unitCode: "C62" },
      availability: "https://schema.org/InStock",
      url: `${site.url}/${lang}/store/${slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="container-page py-10 sm:py-14">
        <nav aria-label="Breadcrumb" className="mb-10 text-xs text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href={`/${lang}`} className="hover:text-foreground">
                {t.breadcrumbHome}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={`/${lang}/store`} className="hover:text-foreground">
                {t.breadcrumbStore}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-foreground">
              {content.name}
            </li>
          </ol>
        </nav>

        <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          <div className="grid grid-cols-2 gap-4">
            {product.gallery.map((src, i) => (
              <div
                key={src}
                className={
                  i === 0
                    ? "relative col-span-2 aspect-square overflow-hidden rounded-xl bg-secondary"
                    : "relative aspect-square overflow-hidden rounded-xl bg-secondary"
                }
              >
                <Image
                  src={src}
                  alt={i === 0 ? content.name : ""}
                  fill
                  preload={i === 0}
                  sizes={
                    i === 0 ? "(min-width: 1024px) 55vw, 100vw" : "(min-width: 1024px) 27vw, 50vw"
                  }
                  className={i === 0 ? "object-contain p-8" : "object-cover"}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-8 lg:sticky lg:top-28 lg:self-start">
            <div className="flex flex-col gap-4">
              <p className="eyebrow">{content.tagline}</p>
              <h1 className="display text-5xl sm:text-6xl">{content.name}</h1>
              <div className="flex flex-wrap items-center gap-4">
                <p className="text-2xl tabular-nums">
                  {formatCurrency(product.dozenPrice)}{" "}
                  <span className="text-base text-muted-foreground">{t.perDozen}</span>
                </p>
                <span className="rounded-full bg-forest/10 px-3 py-1 text-xs font-semibold text-forest">
                  {t.inStock}
                </span>
              </div>
              <p className="text-sm text-muted-foreground tabular-nums">
                {t.unitReference.replace("{price}", formatCurrency(unitPrice(product)))}
              </p>
            </div>
            <p className="leading-relaxed text-muted-foreground">{content.summary}</p>

            <AddToCartButton
              slug={product.slug}
              label={dict.cart.add}
              addedLabel={dict.cart.added}
              withQuantity={{
                label: t.quantity,
                increase: dict.cart.increase,
                decrease: dict.cart.decrease,
                summary: t.lineTotal,
              }}
            />

            <p className="flex gap-3 rounded-lg bg-secondary px-4 py-3 text-sm text-secondary-foreground">
              <Truck className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={1.5} />
              {t.shippingNote}
            </p>

            <div className="flex flex-col gap-6 border-t border-border pt-8">
              <div>
                <h2 className="mb-3 font-serif text-xl">{t.description}</h2>
                <div className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
                  {content.description.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="mb-3 font-serif text-xl">{t.details}</h2>
                <ul className="grid gap-2 text-sm sm:grid-cols-2">
                  {content.details.map((detail) => (
                    <li key={detail} className="flex items-center gap-2">
                      <Check className="size-4 text-accent" strokeWidth={1.5} /> {detail}
                    </li>
                  ))}
                </ul>
              </div>
              {content.care && (
                <div>
                  <h2 className="mb-3 font-serif text-xl">{t.care}</h2>
                  {content.care.map((line) => (
                    <p key={line} className="text-sm text-muted-foreground">
                      {line}
                    </p>
                  ))}
                </div>
              )}
              <dl className="flex gap-8 text-xs text-muted-foreground">
                <div>
                  <dt className="inline font-semibold">{t.sku}: </dt>
                  <dd className="inline">{product.sku}</dd>
                </div>
                <div>
                  <dt className="inline font-semibold">{t.category}: </dt>
                  <dd className="inline">{t.categoryName}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-secondary/60 py-24">
        <div className="container-page flex flex-col gap-14">
          <SectionHeading align="center" title={t.relatedTitle} text={t.relatedText} />
          <div className="mx-auto w-full max-w-md">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} locale={lang} dict={dict} sizes="28rem" />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
