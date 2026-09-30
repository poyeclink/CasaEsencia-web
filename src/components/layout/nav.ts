import type { Dictionary } from "@/i18n/dictionaries/es";

export function navItems(nav: Dictionary["nav"]) {
  return [
    { href: "/store", label: nav.store },
    { href: "/about", label: nav.about },
    { href: "/professional-line", label: nav.professional },
    { href: "/blog", label: nav.blog },
    { href: "/contact-us", label: nav.contact },
  ];
}
