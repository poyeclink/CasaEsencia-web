import { notFound } from "next/navigation";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { site, whatsappLink } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { buttonVariants } from "@/components/ui/Button";
import { LeadForm } from "@/components/leads/LeadForm";
import { PageHero } from "@/components/sections/PageHero";
import { BlogSection } from "@/components/sections/BlogSection";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact-us">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata(lang, "/contact-us", {
    title: dict.nav.contact,
    description: dict.contact.text,
  });
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact-us">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.contact;

  const channels = [
    {
      icon: Phone,
      title: t.phoneTitle,
      text: t.phoneText,
      value: site.phone,
      href: `tel:${site.phone.replace(/\s/g, "")}`,
    },
    {
      icon: Mail,
      title: t.emailTitle,
      text: t.emailText,
      value: site.email,
      href: `mailto:${site.email}`,
    },
    { icon: MapPin, title: t.addressTitle, text: t.addressText, value: site.address },
  ];

  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} text={t.text} image="/images/wax-seals.webp" />

      <section className="container-page grid gap-14 py-24 sm:py-28 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <div className="flex flex-col gap-4">
          {channels.map(({ icon: Icon, title, text, value, href }) => (
            <div key={title} className="flex gap-5 rounded-xl border border-border bg-card p-6">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary text-accent">
                <Icon className="size-5" strokeWidth={1.5} />
              </span>
              <div className="flex flex-col gap-1">
                <h2 className="font-serif text-xl">{title}</h2>
                <p className="text-sm text-muted-foreground">{text}</p>
                {href ? (
                  <a href={href} className="mt-1 font-semibold hover:text-accent">
                    {value}
                  </a>
                ) : (
                  <p className="mt-1 font-semibold">{value}</p>
                )}
              </div>
            </div>
          ))}
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className={`${buttonVariants({ size: "lg" })} mt-2`}
          >
            <MessageCircle className="size-4" /> {t.whatsapp}
          </a>
        </div>

        <div className="rounded-xl bg-card p-6 shadow-[0_30px_60px_-40px_rgb(21_50_71/0.5)] sm:p-10">
          <h2 className="display mb-8 text-3xl sm:text-4xl">{t.formTitle}</h2>
          <LeadForm source="contacto" locale={lang} t={dict.leadForm} />
        </div>
      </section>

      <BlogSection locale={lang} dict={dict} />
    </>
  );
}
