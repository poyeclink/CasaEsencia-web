import type { Dictionary } from "@/i18n/dictionaries/es";

export function navItems(nav: Dictionary["nav"]) {
  return [
    { href: "/wholesale", label: nav.store },
    { href: "/professional-line", label: nav.professional },
    { href: "/about", label: nav.about },
    { href: "/blog", label: nav.blog },
    { href: "/contact-us", label: nav.contact },
  ];
}
