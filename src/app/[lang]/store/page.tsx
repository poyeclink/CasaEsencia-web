import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { products } from "@/content/products";
import { pageMetadata } from "@/lib/seo";
import { buttonVariants } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "@/components/shop/ProductCard";
import { PageHero } from "@/components/sections/PageHero";
import { ProSection } from "@/components/sections/ProSection";
import { DeliverySection } from "@/components/sections/DeliverySection";

export async function generateMetadata({ params }: PageProps<"/[lang]/store">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata(lang, "/store", { title: dict.nav.store, description: dict.store.text });
}

export default async function StorePage({ params }: PageProps<"/[lang]/store">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.store;

  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} text={t.text} />

      <section className="container-page py-24 sm:py-28">
        <div className="mx-auto grid max-w-5xl gap-16 md:grid-cols-2 md:gap-12">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} locale={lang} dict={dict} />
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-background">
        <div className="container-page flex flex-col gap-12 py-20">
          <SectionHeading
            align="center"
            eyebrow={t.dozenEyebrow}
            title={t.dozenTitle}
            text={t.dozenText}
          />
          <ol className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {t.steps.map((step, i) => (
              <li key={step.title} className="flex flex-col gap-3 bg-card p-8">
                <span className="font-serif text-4xl text-accent">0{i + 1}</span>
                <p className="font-serif text-xl">{step.title}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-secondary/60">
        <div className="container-page grid items-center gap-14 py-24 sm:py-28 lg:grid-cols-2 lg:gap-24">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
            <Image
              src="/images/ease-studio.webp"
              alt=""
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-8">
            <SectionHeading eyebrow={dict.home.heroEyebrow} title={t.whyTitle} text={t.whyText} />
            <div className="rounded-xl border border-border bg-card p-8">
              <p className="font-serif text-2xl">{t.aboutTitle}</p>
              <p className="mt-2 text-sm text-muted-foreground">{t.aboutText}</p>
              <Link
                href={`/${lang}/about`}
                className={`${buttonVariants({ variant: "outline", size: "sm" })} mt-5`}
              >
                {t.aboutCta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <DeliverySection locale={lang} t={dict.home} />
      <ProSection locale={lang} dict={dict} />
    </>
  );
}
