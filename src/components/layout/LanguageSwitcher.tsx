"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales } from "@/i18n/config";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({
  locale,
  label,
  className,
}: {
  locale: string;
  label: string;
  className?: string;
}) {
  const pathname = usePathname();
  const rest = pathname.split("/").slice(2).join("/");

  return (
    <nav
      aria-label={label}
      className={cn("flex items-center gap-1 text-xs font-semibold tracking-[0.14em]", className)}
    >
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && (
            <span aria-hidden="true" className="text-accent/60">
              /
            </span>
          )}
          <Link
            href={`/${l}${rest ? `/${rest}` : ""}`}
            hrefLang={l}
            lang={l}
            aria-current={l === locale ? "true" : undefined}
            className={cn(
              "rounded px-1 py-0.5 uppercase transition-colors",
              l === locale ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {l}
          </Link>
        </span>
      ))}
    </nav>
  );
}
