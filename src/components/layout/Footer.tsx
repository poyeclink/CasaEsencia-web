import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { products } from "@/content/products";
import { site } from "@/content/site";
import { Logo } from "./Logo";
import { InstagramIcon } from "./InstagramIcon";
import { navItems } from "./nav";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.footer;
  const headingClass = "mb-5 text-[0.7rem] font-semibold tracking-[0.3em] text-gold uppercase";
  const linkClass = "text-primary-foreground/75 transition-colors hover:text-primary-foreground";

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr] lg:py-20">
        <div className="flex flex-col gap-6">
          <Logo light className="w-36" />
          <p className="max-w-xs text-sm leading-relaxed text-primary-foreground/70">{t.tagline}</p>
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground"
          >
            <InstagramIcon className="size-5" /> @casa.escencia
          </a>
        </div>

        <div>
          <p className={headingClass}>{t.pages}</p>
          <ul className="flex flex-col gap-3 text-sm">
            <li>
              <Link href={`/${locale}`} className={linkClass}>
                {dict.nav.home}
              </Link>
            </li>
            {navItems(dict.nav).map((item) => (
              <li key={item.href}>
                <Link href={`/${locale}${item.href}`} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href={`/${locale}/my-account`} className={linkClass}>
                {dict.nav.account}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className={headingClass}>{t.products}</p>
          <ul className="flex flex-col gap-3 text-sm">
            {products.map((product) => (
              <li key={product.slug}>
                <Link href={`/${locale}/store/${product.slug}`} className={linkClass}>
                  {product.content[locale].name}
                </Link>
              </li>
            ))}
            <li>
              <Link href={`/${locale}/professional-line`} className={linkClass}>
                {t.professionalLine}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className={headingClass}>{t.contactInfo}</p>
          <ul className="flex flex-col gap-4 text-sm">
            <li>
              <a
                href={`tel:${site.phone.replace(/\s/g, "")}`}
                className={`flex gap-3 ${linkClass}`}
              >
                <Phone className="size-4 shrink-0 text-gold" strokeWidth={1.5} /> {site.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className={`flex gap-3 ${linkClass}`}>
                <Mail className="size-4 shrink-0 text-gold" strokeWidth={1.5} /> {site.email}
              </a>
            </li>
            <li className="flex gap-3 text-primary-foreground/75">
              <MapPin className="size-4 shrink-0 text-gold" strokeWidth={1.5} /> {site.address}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-primary-foreground/55 sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. {t.rights}
          </p>
          <p>El Salvador</p>
        </div>
      </div>
    </footer>
  );
}
