import Image from "next/image";
import { notFound } from "next/navigation";
import { Check, MapPin } from "lucide-react";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/lib/seo";
import { buttonVariants } from "@/components/ui/Button";
import { Ornament } from "@/components/ui/SectionHeading";
import { LeadForm } from "@/components/leads/LeadForm";
import { BlogSection } from "@/components/sections/BlogSection";
import { ReelTile } from "@/components/sections/ReelTile";

export async function generateMetadata({ params }: PageProps<"/[lang]/professional-line">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata(lang, "/professional-line", {
    title: dict.professional.title,
    description: dict.professional.subtitle,
    image: "/images/siena-features.webp",
  });
}

export default async function ProfessionalPage({ params }: PageProps<"/[lang]/professional-line">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.professional;

  return (
    <>
      <section className="bg-primary text-primary-foreground">
        <div className="container-page grid items-center gap-14 py-16 sm:py-24 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col gap-6">
            <p className="eyebrow text-gold">{t.eyebrow}</p>
            <h1 className="display text-5xl leading-[1.05] sm:text-7xl">{t.title}</h1>
            <p className="font-serif text-2xl text-gold italic">{t.subtitle}</p>
            <p className="max-w-lg leading-relaxed text-primary-foreground/75">{t.text}</p>
            <a
              href="#cotizar"
              className={`${buttonVariants({ variant: "light", size: "lg" })} mt-2 w-fit`}
            >
              {dict.common.requestQuote}
            </a>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-lg overflow-hidden rounded-xl">
            <Image
              src="/images/siena-features.webp"
              alt={t.title}
              fill
              preload
              sizes="(min-width: 1024px) 32rem, 90vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="container-page grid gap-10 py-24 sm:py-28 md:grid-cols-2">
        {[
          { title: t.idealTitle, items: t.ideal },
          { title: t.featuresTitle, items: t.features },
        ].map((group) => (
          <div key={group.title} className="rounded-xl border border-border bg-card p-8 sm:p-10">
            <h2 className="display text-3xl">{group.title}</h2>
            <Ornament className="mt-4 mb-8 justify-start" />
            <ul className="flex flex-col gap-4">
              {group.items.map((item) => (
                <li key={item} className="flex items-center gap-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-accent">
                    <Check className="size-4" strokeWidth={1.5} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="overflow-hidden bg-forest text-forest-foreground">
        <div className="container-page grid items-center gap-16 py-24 sm:py-32 lg:grid-cols-2 lg:gap-24">
          <div className="relative mx-auto w-full max-w-md pr-10 pb-20 sm:pr-16">
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
              <Image
                src="/images/instagram/matices-by-ruth.webp"
                alt="Casa Escencia en Matices by Ruth"
                fill
                sizes="(min-width: 1024px) 26rem, 85vw"
                className="object-cover"
              />
            </div>
            <ReelTile
              code="DdKSCYYhNIa"
              label={t.watchReel}
              closeLabel={dict.nav.close}
              className="group absolute right-0 bottom-0 block aspect-[9/16] w-2/5 overflow-hidden rounded-xl border-4 border-forest shadow-2xl"
            >
              <Image
                src="/images/instagram/reel-matices.webp"
                alt=""
                fill
                sizes="12rem"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </ReelTile>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-5">
              <p className="eyebrow text-gold">{t.partnersEyebrow}</p>
              <h2 className="display text-4xl leading-[1.1] sm:text-5xl">{t.partnersTitle}</h2>
              <Ornament className="justify-start" />
              <p className="max-w-lg leading-relaxed text-forest-foreground/75">{t.partnersText}</p>
              <ul className="flex flex-wrap gap-3">
                {t.partnersLocations.map((location) => (
                  <li
                    key={location}
                    className="flex items-center gap-2 rounded-full border border-forest-foreground/25 px-4 py-2 text-sm"
                  >
                    <MapPin className="size-4 text-gold" strokeWidth={1.5} /> {location}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-forest-foreground/15 pt-8">
              <p className="mb-6 text-xs font-semibold tracking-[0.3em] text-gold uppercase">
                {t.partnersBenefitsTitle}
              </p>
              <ul className="flex flex-col gap-6">
                {t.partnersBenefits.map((benefit, i) => (
                  <li key={benefit.title} className="grid grid-cols-[2.5rem_1fr] gap-3">
                    <span className="font-serif text-2xl text-gold italic">{i + 1}</span>
                    <div>
                      <p className="font-serif text-xl">{benefit.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-forest-foreground/70">
                        {benefit.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href="#cotizar"
              className={`${buttonVariants({ variant: "light", size: "lg" })} w-fit`}
            >
              {t.partnersCta}
            </a>
          </div>
        </div>
      </section>

      <section id="cotizar" className="scroll-mt-24 bg-secondary/60">
        <div className="container-page grid items-center gap-14 py-24 sm:py-28 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div className="relative mx-auto aspect-[1104/1920] w-full max-w-xs overflow-hidden rounded-t-full lg:max-w-sm">
            <Image
              src="/images/siena-hands.webp"
              alt=""
              fill
              sizes="24rem"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h2 className="display text-4xl sm:text-5xl">{t.formTitle}</h2>
              <p className="leading-relaxed text-muted-foreground">{t.formText}</p>
            </div>
            <div className="rounded-xl bg-card p-6 shadow-[0_30px_60px_-40px_rgb(21_50_71/0.5)] sm:p-8">
              <LeadForm source="profesional" locale={lang} t={dict.leadForm} />
            </div>
          </div>
        </div>
      </section>

      <BlogSection locale={lang} dict={dict} />
    </>
  );
}
