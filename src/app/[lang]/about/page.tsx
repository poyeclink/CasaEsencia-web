import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/lib/seo";
import { buttonVariants } from "@/components/ui/Button";
import { Ornament, SectionHeading } from "@/components/ui/SectionHeading";
import { InstagramFeed } from "@/components/sections/InstagramFeed";
import { ClosingCta } from "@/components/sections/ClosingCta";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata(lang, "/about", {
    title: dict.nav.about,
    description: dict.about.text,
    image: "/images/about-hero.webp",
  });
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.about;

  return (
    <>
      <section className="container-page grid items-center gap-14 py-16 sm:py-24 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
        <div className="flex flex-col gap-6">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="display text-5xl leading-[1.05] sm:text-7xl">{t.title}</h1>
          <Ornament className="justify-start" />
          <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">{t.text}</p>
          <Link href={`/${lang}/store`} className={`${buttonVariants({ size: "lg" })} mt-2 w-fit`}>
            {dict.common.viewProducts}
          </Link>
        </div>
        <div className="relative mx-auto aspect-[789/1024] w-full max-w-md">
          {/* La foto ya viene enmarcada en un arco: no se recorta. */}
          <Image
            src="/images/about-hero.webp"
            alt=""
            fill
            preload
            sizes="(min-width: 1024px) 28rem, 90vw"
            className="object-contain"
          />
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="container-page grid gap-px py-6 md:grid-cols-3">
          {t.blocks.map((block, i) => (
            <div key={block.title} className="flex flex-col gap-4 px-2 py-12 md:px-10">
              <span className="font-serif text-5xl text-gold italic">0{i + 1}</span>
              <h2 className="display text-3xl">{block.title}</h2>
              <p className="leading-relaxed text-primary-foreground/75">{block.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary/60">
        <div className="container-page grid items-center gap-16 py-24 sm:py-32 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
          <div className="flex flex-col gap-10">
            <SectionHeading eyebrow={t.designEyebrow} title={t.designTitle} text={t.designText} />
            <ol className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
              {t.designPoints.map((point, i) => (
                <li key={point.title} className="flex flex-col gap-2 bg-card p-6">
                  <span className="font-serif text-sm text-accent italic">0{i + 1}</span>
                  <p className="font-serif text-xl">{point.title}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{point.text}</p>
                </li>
              ))}
            </ol>
            <p className="display border-l-2 border-gold pl-5 text-2xl italic">{t.designQuote}</p>
          </div>
          <div className="relative mx-auto w-full max-w-md pb-16 lg:pb-24">
            <div className="relative aspect-[3/4] overflow-hidden rounded-t-full">
              <Image
                src="/images/instagram/rituales-de-hoy.webp"
                alt=""
                fill
                sizes="(min-width: 1024px) 28rem, 90vw"
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-0 -left-6 w-1/2 overflow-hidden rounded-lg border-8 border-background shadow-xl sm:-left-12">
              <Image
                src="/images/instagram/hair-clips.webp"
                alt=""
                width={736}
                height={736}
                sizes="14rem"
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container-page grid items-center gap-14 py-24 sm:py-32 lg:grid-cols-2 lg:gap-24">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
          <Image
            src="/images/display-stand.webp"
            alt=""
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-6">
          <p className="eyebrow">{t.purposeEyebrow}</p>
          <blockquote className="display text-3xl leading-snug sm:text-4xl">
            “{t.purpose}”
          </blockquote>
          <Ornament className="justify-start" />
        </div>
      </section>

      <InstagramFeed dict={dict} />
      <ClosingCta locale={lang} dict={dict} />
    </>
  );
}
