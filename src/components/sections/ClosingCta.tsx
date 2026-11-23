import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { buttonVariants } from "@/components/ui/Button";
import { whatsappLink } from "@/content/site";
import { Ornament } from "@/components/ui/SectionHeading";

export function ClosingCta({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="relative isolate overflow-hidden">
      <Image
        src="/images/wax-seals.webp"
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-forest/80" />
      <div className="container-page flex flex-col items-center gap-6 py-28 text-center text-forest-foreground sm:py-36">
        <Ornament />
        <h2 className="display text-5xl sm:text-6xl">{dict.home.closingTitle}</h2>
        <p className="max-w-xl text-lg text-forest-foreground/80">{dict.home.closingText}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <Link
            href={`/${locale}#cotizar`}
            className={buttonVariants({ variant: "light", size: "lg" })}
          >
            {dict.common.requestInfo}
          </Link>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "outlineLight", size: "lg" })}
          >
            {dict.common.whatsappChat}
          </a>
        </div>
      </div>
    </section>
  );
}
