import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { products } from "@/content/products";
import { pageMetadata } from "@/lib/seo";
import { buttonVariants } from "@/components/ui/Button";
import { Ornament, SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProSection } from "@/components/sections/ProSection";
import { DeliverySection } from "@/components/sections/DeliverySection";
import { InstagramFeed } from "@/components/sections/InstagramFeed";
import { BlogSection } from "@/components/sections/BlogSection";
import { ClosingCta } from "@/components/sections/ClosingCta";

export async function generateMetadata({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata(lang, "", { description: dict.meta.description });
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.home;

  return (
    <>
      <section className="relative isolate flex min-h-[calc(100svh-7.25rem)] items-end overflow-hidden bg-primary text-primary-foreground lg:items-center">
        <Image
          src="/images/hero.webp"
          alt=""
          fill
          preload
          sizes="100vw"
          className="-z-10 object-cover object-[70%_center]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-primary via-primary/55 to-primary/10 lg:bg-gradient-to-r lg:from-primary/90 lg:via-primary/45 lg:to-transparent" />
        <div className="container-page flex flex-col gap-7 pt-40 pb-16 lg:py-24">
          <p className="eyebrow animate-fade-up text-gold">{t.heroEyebrow}</p>
          <h1 className="display max-w-2xl animate-fade-up text-5xl leading-[1.02] [animation-delay:120ms] sm:text-6xl lg:text-7xl">
            {t.heroTitle}
          </h1>
          <p className="max-w-lg animate-fade-up text-lg leading-relaxed text-primary-foreground/80 [animation-delay:240ms]">
            {t.heroText}
          </p>
          <div className="flex animate-fade-up flex-wrap gap-4 pt-2 [animation-delay:360ms]">
            <Link
              href={`/${lang}/store`}
              className={buttonVariants({ variant: "light", size: "lg" })}
            >
              {dict.common.shopNow}
            </Link>
            <Link
              href={`/${lang}/about`}
              className={buttonVariants({ variant: "outlineLight", size: "lg" })}
            >
              {t.heroSecondary}
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page flex flex-col items-center gap-16 py-24 text-center sm:py-32">
        <div className="flex flex-col items-center gap-6">
          <p className="eyebrow">{t.manifestoEyebrow}</p>
          <p className="display max-w-4xl text-4xl leading-tight sm:text-6xl">
            {t.manifesto.split(" ").slice(0, -1).join(" ")}{" "}
            <em className="text-accent">{t.manifesto.split(" ").at(-1)}</em>
          </p>
          <Ornament />
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {t.manifestoText}
          </p>
        </div>
        <ul className="grid w-full gap-10 border-t border-border pt-16 sm:grid-cols-2 lg:grid-cols-4">
          {t.pillars.map((pillar, i) => (
            <li key={pillar.title} className="flex flex-col items-center gap-3">
              <span className="font-serif text-sm text-accent italic">0{i + 1}</span>
              <p className="font-serif text-xl">{pillar.title}</p>
              <p className="max-w-60 text-sm leading-relaxed text-muted-foreground">
                {pillar.text}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-secondary/60 py-24 sm:py-32">
        <div className="container-page flex flex-col gap-16">
          <SectionHeading
            align="center"
            eyebrow={t.collectionEyebrow}
            title={t.collectionTitle}
            text={t.collectionText}
          />
          <div className="mx-auto grid w-full max-w-5xl gap-16 md:grid-cols-2 md:gap-12">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} locale={lang} dict={dict} />
            ))}
          </div>
        </div>
      </section>

      <section className="container-page grid items-center gap-14 py-24 sm:py-32 lg:grid-cols-2 lg:gap-24">
        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-full">
            <Image
              src="/images/aura-hair.webp"
              alt="Aura Hair Brush"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -right-4 -bottom-8 hidden w-44 overflow-hidden rounded-lg border-8 border-background shadow-xl sm:block lg:-right-10">
            <Image
              src="/images/aura-campaign.webp"
              alt=""
              width={800}
              height={800}
              sizes="176px"
              className="h-auto w-full"
            />
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <SectionHeading eyebrow={t.storyEyebrow} title={t.storyTitle} text={t.storyText} />
          <ul className="flex flex-col gap-4">
            {t.storyPoints.map((point) => (
              <li key={point} className="flex items-center gap-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-accent/40 text-accent">
                  <Check className="size-4" strokeWidth={1.5} />
                </span>
                {point}
              </li>
            ))}
          </ul>
          <Link
            href={`/${lang}/store/aura-hair-brush`}
            className={`${buttonVariants({ size: "lg" })} w-fit`}
          >
            {dict.common.getYours}
          </Link>
        </div>
      </section>

      <section className="bg-forest text-forest-foreground">
        <div className="container-page grid gap-16 py-24 sm:py-32 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
          <div className="flex flex-col gap-6 lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              tone="dark"
              eyebrow={t.ritualEyebrow}
              title={t.ritualTitle}
              text={t.ritualText}
            />
            <div className="relative mt-4 hidden aspect-square max-w-sm overflow-hidden rounded-full lg:block">
              <Image
                src="/images/lifestyle-vanity.webp"
                alt=""
                fill
                sizes="24rem"
                className="object-cover"
              />
            </div>
          </div>
          <ol className="flex flex-col">
            {t.ritualSteps.map((step, i) => (
              <li
                key={step.title}
                className="grid grid-cols-[4rem_1fr] items-baseline gap-4 border-t border-forest-foreground/15 py-8 last:border-b sm:grid-cols-[6rem_1fr]"
              >
                <span className="font-serif text-4xl text-gold italic sm:text-5xl">{i + 1}</span>
                <div className="flex flex-col gap-2">
                  <p className="font-serif text-2xl sm:text-3xl">{step.title}</p>
                  <p className="text-forest-foreground/70">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ProSection locale={lang} dict={dict} />
      <DeliverySection locale={lang} t={t} />
      <InstagramFeed dict={dict} />
      <BlogSection locale={lang} dict={dict} />
      <ClosingCta locale={lang} dict={dict} />
    </>
  );
}
