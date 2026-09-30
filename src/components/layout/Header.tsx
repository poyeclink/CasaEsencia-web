import Link from "next/link";
import { UserRound } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { CartButton } from "@/components/cart/CartButton";
import { Logo } from "./Logo";
import { NavLinks } from "./NavLinks";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";
import { navItems } from "./nav";

// Server Component sin leer la sesión a propósito: así todas las páginas de
// marketing siguen siendo estáticas. El estado de la cuenta vive en /my-account.
export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const items = navItems(dict.nav);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="container-page flex h-20 items-center justify-between gap-6">
        <Link href={`/${locale}`} aria-label={dict.nav.home} className="shrink-0">
          <Logo className="w-28 sm:w-32" />
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <nav aria-label={dict.nav.menu} className="mr-4 hidden lg:block xl:mr-8">
            <NavLinks
              locale={locale}
              items={items}
              className="flex items-center gap-7 text-[0.78rem] font-semibold tracking-[0.12em] uppercase xl:gap-9"
            />
          </nav>
          <span aria-hidden="true" className="mr-3 hidden h-5 w-px bg-border lg:block" />
          <LanguageSwitcher
            locale={locale}
            label={dict.nav.language}
            className="mr-1 hidden sm:flex"
          />
          <Link
            href={`/${locale}/my-account`}
            aria-label={dict.nav.account}
            className="hidden size-10 items-center justify-center rounded-full transition-colors hover:bg-secondary sm:inline-flex"
          >
            <UserRound className="size-5" strokeWidth={1.5} />
          </Link>
          <CartButton label={dict.nav.cart} />
          <MobileMenu locale={locale} items={items} nav={dict.nav} />
        </div>
      </div>
    </header>
  );
}
