import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { LeadForm } from "@/components/leads/LeadForm";
import { Ornament } from "@/components/ui/SectionHeading";

export function ProSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.home;

  return (
    <section id="cotizar" className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="container-page grid items-center gap-14 py-24 sm:py-32 lg:grid-cols-2 lg:gap-20">
        <div className="flex flex-col gap-8">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-t-full lg:mx-0">
            <Image
              src="/images/siena-hands.webp"
              alt="Siena Professional Brush"
              fill
              sizes="(min-width: 1024px) 28rem, 90vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-5">
            <p className="eyebrow text-gold">{t.proEyebrow}</p>
            <h2 className="display text-4xl leading-[1.1] sm:text-5xl">{t.proTitle}</h2>
            <Ornament className="justify-start" />
            <p className="max-w-lg leading-relaxed text-primary-foreground/75">{t.proText}</p>
            <Link
              href={`/${locale}/professional-line`}
              className="w-fit text-xs font-semibold tracking-[0.18em] text-gold uppercase underline-offset-8 hover:underline"
            >
              {dict.common.learnMore} →
            </Link>
          </div>
          <div className="rounded-xl bg-background p-6 text-foreground shadow-2xl sm:p-8">
            <LeadForm source="profesional" locale={locale} t={dict.leadForm} withMessage={false} />
          </div>
        </div>
      </div>
    </section>
  );
}
