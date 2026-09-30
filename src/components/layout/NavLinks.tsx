"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Props = {
  locale: string;
  items: { href: string; label: string }[];
  className?: string;
  linkClassName?: string;
  onNavigate?: () => void;
};

export function NavLinks({ locale, items, className, linkClassName, onNavigate }: Props) {
  const pathname = usePathname();

  return (
    <ul className={className}>
      {items.map((item) => {
        const href = `/${locale}${item.href}`;
        const active = pathname === href || (item.href !== "" && pathname.startsWith(`${href}/`));
        return (
          <li key={item.href}>
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:after:scale-x-100 aria-[current=page]:after:scale-x-100",
                linkClassName,
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
