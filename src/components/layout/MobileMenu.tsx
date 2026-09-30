"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, UserRound } from "lucide-react";
import { Sheet } from "@/components/ui/Sheet";
import { site } from "@/content/site";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { NavLinks } from "./NavLinks";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { InstagramIcon } from "./InstagramIcon";

type Props = {
  locale: string;
  items: { href: string; label: string }[];
  nav: Dictionary["nav"];
};

export function MobileMenu({ locale, items, nav }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={nav.menu}
        className="-mr-2 inline-flex size-10 items-center justify-center rounded-full hover:bg-secondary"
      >
        <Menu className="size-5" strokeWidth={1.5} />
      </button>
      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title={nav.menu}
        closeLabel={nav.close}
        footer={
          <div className="flex flex-col gap-4 text-sm">
            <Link
              href={`/${locale}/my-account`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2"
            >
              <UserRound className="size-4" strokeWidth={1.5} /> {nav.account}
            </Link>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <InstagramIcon className="size-4" /> casa.escencia
            </a>
            <LanguageSwitcher locale={locale} label={nav.language} />
          </div>
        }
      >
        <nav aria-label={nav.menu}>
          <NavLinks
            locale={locale}
            items={[{ href: "", label: nav.home }, ...items]}
            onNavigate={() => setOpen(false)}
            className="flex flex-col gap-5 font-serif text-3xl"
          />
        </nav>
      </Sheet>
    </div>
  );
}
