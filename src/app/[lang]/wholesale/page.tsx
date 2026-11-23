import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { products } from "@/content/products";
import { pageMetadata } from "@/lib/seo";
import { buttonVariants } from "@/components/ui/Button";
import { Ornament, SectionHeading } from "@/components/ui/SectionHeading";
import { CollectionCard, ProductCard } from "@/components/shop/ProductCard";
import { ProSection } from "@/components/sections/ProSection";
import { DeliverySection } from "@/components/sections/DeliverySection";

export async function generateMetadata({ params }: PageProps<"/[lang]/wholesale">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { store } = await getDictionary(lang);
  return pageMetadata(lang, "/wholesale", {
    title: { absolute: store.metaTitle },
    description: store.metaDescription,
    image: "/images/wholesale-displays.webp",
  });
}

export default async function WholesalePage({ params }: PageProps<"/[lang]/wholesale">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.store;

  return (
    <>
      <section className="border-b border-border bg-secondary/60">
        <div className="container-page flex flex-col items-center gap-6 py-20 text-center sm:py-28">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="display max-w-4xl text-5xl leading-[1.05] sm:text-6xl">{t.title}</h1>
          <Ornament />
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">{t.text}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 pt-2">
            <a href="#cotizar" className={buttonVariants({ size: "lg" })}>
              {t.cta}
            </a>
            <a
              href="#como-funciona"
              className="text-xs font-semibold tracking-[0.18em] text-accent uppercase underline-offset-8 hover:underline"
            >
              {t.howLink} ↓
            </a>
          </div>
          <p className="text-sm text-muted-foreground">{t.note}</p>
        </div>
      </section>

      <section className="container-page flex flex-col gap-16 py-24 sm:py-28">
        <SectionHeading align="center" title={t.collectionTitle} text={t.collectionText} />
        <div className="mx-auto grid w-full max-w-6xl gap-16 md:grid-cols-3 md:gap-10">
          {products.map((product) => (
            <ProductCard
              key={product.slug}
              product={product}
              locale={lang}
              dict={dict}
              sizes="(min-width: 768px) 30vw, 100vw"
              wholesale
            />
          ))}
          <CollectionCard
            href={`/${lang}/professional-line`}
            name={t.siena.name}
            tagline={t.siena.tagline}
            image="/images/siena-features.webp"
            sizes="(min-width: 768px) 30vw, 100vw"
            ideal={{ label: t.idealFor, items: t.siena.ideal }}
            note={t.tierLine}
            cta={{ label: dict.common.requestQuote, href: "#cotizar" }}
            details={{ label: t.details, href: `/${lang}/professional-line` }}
          />
        </div>
      </section>

      <section id="como-funciona" className="scroll-mt-24 border-y border-border bg-background">
        <div className="container-page flex flex-col gap-12 py-20">
          <SectionHeading
            align="center"
            eyebrow={t.howEyebrow}
            title={t.howTitle}
            text={t.howText}
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

      <section className="container-page flex flex-col gap-12 py-20 sm:py-24">
        <SectionHeading align="center" eyebrow={t.tiersEyebrow} title={t.tiersTitle} />
        <ol className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
          {t.tiers.map((tier) => (
            <li key={tier.units} className="flex flex-col gap-3 bg-card p-8">
              <span className="font-serif text-4xl text-accent">{tier.units}</span>
              <span className="eyebrow">{t.tiersUnits}</span>
              <p className="font-serif text-xl">{tier.title}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{tier.text}</p>
            </li>
          ))}
        </ol>
        <p className="text-center text-sm text-muted-foreground">{t.tiersNote}</p>
      </section>

      <section className="bg-secondary/60">
        <div className="container-page grid items-center gap-14 py-24 sm:py-28 lg:grid-cols-2 lg:gap-24">
          <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-xl">
            <Image
              src="/images/wholesale-displays.webp"
              alt=""
              fill
              sizes="(min-width: 1024px) 28rem, 90vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-8">
            <SectionHeading eyebrow={t.whyEyebrow} title={t.whyTitle} text={t.whyText} />
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

      <DeliverySection
        t={{
          ...dict.home,
          deliveryItems: dict.home.deliveryItems.map((item, i) =>
            i === 2 ? { ...item, text: t.deliveryItem } : item,
          ),
        }}
        cta={t.cta}
      />
      <ProSection
        locale={lang}
        dict={dict}
        copy={{
          eyebrow: t.formEyebrow,
          title: t.formTitle,
          text: t.formText,
          success: t.formSuccess,
        }}
      />

      <section id="faq" className="container-page flex scroll-mt-24 flex-col gap-10 py-24 sm:py-28">
        <SectionHeading align="center" title={t.faqTitle} />
        <div className="mx-auto flex w-full max-w-3xl flex-col divide-y divide-border border-y border-border">
          {t.faq.map((item) => (
            <details key={item.q} className="py-5">
              <summary className="cursor-pointer list-none font-serif text-xl marker:hidden">
                {item.q}
              </summary>
              <p className="mt-3 leading-relaxed text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
